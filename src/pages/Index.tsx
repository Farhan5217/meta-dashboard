import { useState, useEffect, useRef } from "react";

import { X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCampaignInsights, getCombinedAdAccountInsights } from "@/services/api";
import { toast } from "sonner";
import type { ActionValue, DateRange, InsightParams } from "@/types/api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { LeadMetric } from "../components/LeadMetric"; 
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import { useAdAccounts } from "@/hooks/useAdAccounts";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useCampaignCreatives } from "@/hooks/useCampaignCreatives";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Eye, MousePointerClick, DollarSign, ChevronDown, Film, Repeat, RefreshCw } from "lucide-react"
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { CreativeThumbnails } from "@/components/dashboard/CreativeThumbnails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AD_ACCOUNT_STATUS, CAMPAIGN_STATUS, CAMPAIGN_OBJECTIVES } from "@/config/constants";

const getLast30Days = () => {
  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);
  return { from: last30Days, to: today };
};

const Index = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<number>();
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>(CAMPAIGN_STATUS.ACTIVE);
  const [objectiveFilter, setObjectiveFilter] = useState<string>();
  const [showAllRows, setShowAllRows] = useState(false);
  const [leadCount, setLeadCount] = useState(0);
  const [showNoDataPopup, setShowNoDataPopup] = useState(false);

  
  // Track campaigns with missing creatives for refetching
  const campaignsWithoutCreativesRef = useRef(new Set());
  const [refetchingMissingCreatives, setRefetchingMissingCreatives] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return {
      from: thirtyDaysAgo,
      to: today
    };
  });

const isEmptyMetrics = (metrics: any) => {
  if (!metrics) return true;
  
  // Check if all numeric values are zero or empty strings
  return [
    metrics.impressions,
    metrics.reach,
    metrics.clicks,
    metrics.spend,
    metrics.ctr,
    metrics.cpc,
    metrics.cpm,
    metrics.frequency
  ].every(val => !val || val === "0" || val === "0.00" || val === "");
};




  const { accounts } = useAdAccounts(statusFilter);
  const { campaigns } = useCampaigns(selectedAccount, campaignStatusFilter, objectiveFilter);
  
  // Add the modified hook to fetch campaign creatives with refetch capability
  const { 
    campaignsWithCreatives, 
    isLoading: creativesLoading,
    refetch: refetchCreatives 
  } = useCampaignCreatives(
    selectedAccount,
    campaignStatusFilter,
    objectiveFilter
  );

  // Auto-select first account when accounts are loaded
  useEffect(() => {
    if (!selectedAccount && accounts && accounts.length > 0) {
      const firstAccount = accounts[0];
      setSelectedAccount(firstAccount.id);
      sessionStorage.setItem("selectedAccount", firstAccount.id);
      toast.success(`Selected account: ${firstAccount.name}`, {
        icon: "🎯",
      });
    }
  }, [accounts, selectedAccount]);
  
  // Improved date range handling
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // Ensure dates are start and end of day
      const from = new Date(dateRange.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(dateRange.to);
      to.setHours(23, 59, 59, 999);
      setDateRange({ from, to });
    }
  }, []);

  // Load selected account from sessionStorage or auto-select first account
  useEffect(() => {
    const storedAccount = sessionStorage.getItem("selectedAccount");
    if (storedAccount) {
      setSelectedAccount(storedAccount);
    } else if (accounts && accounts.length > 0) {
      const firstAccount = accounts[0];
      setSelectedAccount(firstAccount.id);
      sessionStorage.setItem("selectedAccount", firstAccount.id);
    }
  }, []);

  // Auto-refetch for missing creatives
  useEffect(() => {
    if (creativesLoading) return;

    // Find campaigns with missing creatives
    const campaignsWithMissingCreatives = campaignsWithCreatives
      .filter(campaign => !campaign.creatives || campaign.creatives.length === 0)
      .map(campaign => campaign.id);

    // Update our tracking set
    const missingCreativesSet = new Set(campaignsWithMissingCreatives);
    campaignsWithoutCreativesRef.current = missingCreativesSet;

    // If we have missing creatives, set up a timer to refetch
    if (missingCreativesSet.size > 0) {
      console.log(`Found ${missingCreativesSet.size} campaigns with missing creatives`);
      
      // Refetch after a short delay if we have missing creatives
      const timer = setTimeout(() => {
        // Only refetch if we haven't mounted a new component
        // Invalidate just the campaignsWithCreatives query
        queryClient.invalidateQueries({ 
          queryKey: ["campaignsWithCreatives", selectedAccount, campaignStatusFilter, objectiveFilter] 
        });
      }, 8000); // 8 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, [campaignsWithCreatives, creativesLoading, queryClient, selectedAccount, campaignStatusFilter, objectiveFilter]);

  // Function to manually trigger refetch for campaigns with missing creatives
  const handleRefetchMissingCreatives = () => {
    if (campaignsWithoutCreativesRef.current.size > 0) {
      setRefetchingMissingCreatives(true);
      
      // Invalidate just the campaignsWithCreatives query
      queryClient.invalidateQueries({ 
        queryKey: ["campaignsWithCreatives", selectedAccount, campaignStatusFilter, objectiveFilter] 
      }).then(() => {
        setTimeout(() => setRefetchingMissingCreatives(false), 1000);
        toast.success("Refreshing creatives...");
      });
    }
  };

  // Get combined insights (time series and percentage changes)
  const { 
    data: combinedInsights, 
    isLoading: insightsLoading 
  } = useQuery({
    queryKey: ["combinedInsights", selectedAccount, dateRange],
    queryFn: async () => {
      if (!selectedAccount || !dateRange?.from || !dateRange?.to) {
        return { timeSeriesData: [], percentChangeData: {} };
      }
      
      return getCombinedAdAccountInsights(
        selectedAccount,
        { from: dateRange.from, to: dateRange.to }
      );
    },
    enabled: !!selectedAccount && !!dateRange?.from && !!dateRange?.to,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (combinedInsights?.percentChangeData?.actions) {
      const leadAction = combinedInsights.percentChangeData.actions.find(
        (action: ActionValue) => action.action_type === 'lead'
      );
      
      if (leadAction) {
        setLeadCount(parseInt(leadAction.value));
      } else {
        setLeadCount(0);
      }
    } else {
      setLeadCount(0);
    }
  }, [combinedInsights]);

  // Get campaign insights for the table
  const { data: campaignInsights = {}, isLoading: insightsTableLoading } = useQuery({
    queryKey: ["campaignInsights", campaigns, dateRange],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) return {};
      
      const insights = {};
      for (const campaign of campaigns) {
        const data = await getCampaignInsights(campaign.id, {
          since: dateRange.from.toISOString().split('T')[0],
          until: dateRange.to.toISOString().split('T')[0],
        });
        insights[campaign.id] = data[0] || null;
      }
      return insights;
    },
    enabled: !!campaigns.length && !!dateRange?.from && !!dateRange?.to
  });

  // Extract data from combined insights
  const timeSeriesInsights = combinedInsights?.timeSeriesData || [];
  const aggregatedMetrics = combinedInsights?.percentChangeData || {
    impressions: "0",
    reach: "0",
    clicks: "0",
    spend: "0",
    ctr: "0",
    cpm: "0",
    cpc: "0",
    frequency: "0"
  };

  // Calculate latest reach and frequency
  const latestReach = timeSeriesInsights?.length 
    ? parseInt(timeSeriesInsights[timeSeriesInsights.length - 1].reach)
    : 0;

  const latestFrequency = timeSeriesInsights?.length 
    ? (parseFloat(timeSeriesInsights[timeSeriesInsights.length - 1].frequency) || 0).toFixed(2)
    : "0";

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      default:
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
    }
  }


useEffect(() => {
  if (!insightsLoading && combinedInsights) {
    // Only check if data is empty when loading has finished
    const isEmpty = isEmptyMetrics(combinedInsights.percentChangeData);
    setShowNoDataPopup(isEmpty);
  }
}, [insightsLoading, combinedInsights]);


  // Create a map of campaignId -> creatives for quick lookup
  const campaignCreativesMap = campaignsWithCreatives.reduce((acc, campaign) => {
    acc[campaign.id] = campaign.creatives || [];
    return acc;
  }, {});

  // Count campaigns with missing creatives
  const missingCreativesCount = campaignsWithCreatives.filter(
    campaign => !campaign.creatives || campaign.creatives.length === 0
  ).length;

  const displayCampaigns = showAllRows ? campaigns : campaigns.slice(0, 10);

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader
        selectedAccount={selectedAccount}
        dateRange={dateRange}
        onAccountSelect={setSelectedAccount}
        onDateRangeChange={setDateRange}
        statusFilter={statusFilter}
      />

      <div className="container mx-auto px-6 py-10">
        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center">
            
            {/* Left Section: Dropdown + Lead Metric */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Lead Metric (next to dropdown) */}
              <LeadMetric 
                leadCount={leadCount}
                isLoading={insightsLoading}
              />
            </div>

            {/* Right Section: Enhanced Insights Button */}
            {selectedAccount && (
              <Button 
                variant="outline" 
                className="bg-teal-500 hover:bg-teal-600 text-white border-none flex items-center gap-2 shadow-sm mt-4 sm:mt-0"
                onClick={() => navigate(`/enhanced-insights/${selectedAccount}`)}
              >
                Placement/Actions
              </Button>
            )}
          </div>
        </div>

        {selectedAccount && (
          <>
            <MetricsGrid 
              aggregatedMetrics={aggregatedMetrics} 
              timeSeriesInsights={timeSeriesInsights}
            />
            
            {/* Campaign Filters */}
            <div className="mt-8 space-y-6">
              {/* Filter Section */}
              <div className="flex flex-wrap items-center gap-6">
                
                {/* Campaign Status */}
                <div className="flex items-center space-x-2 relative">
                  <Label htmlFor="campaign-status" className="text-gray-700 dark:text-gray-300 font-medium">
                    Campaign Status:
                  </Label>
                  <div className="relative w-full sm:w-[220px]">
                    <select
                      id="campaign-status"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm bg-white dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none pr-8 transition ease-in-out duration-200"
                      value={campaignStatusFilter}
                      onChange={(e) => setCampaignStatusFilter(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value={CAMPAIGN_STATUS.ACTIVE}>Active</option>
                      <option value={CAMPAIGN_STATUS.PAUSED}>Paused</option>
                    </select>
                    {/* Custom arrow styling */}
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400 dark:text-gray-200" viewBox="0 0 16 16">
                        <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Campaign Objective */}
                <div className="flex items-center space-x-2 relative">
                  <Label htmlFor="campaign-objective" className="text-gray-700 dark:text-gray-300 font-medium">
                    Campaign Objective:
                  </Label>
                  <div className="relative w-full sm:w-[220px]">
                    <select
                      id="campaign-objective"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm bg-white dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none pr-8 transition ease-in-out duration-200"
                      value={objectiveFilter}
                      onChange={(e) => {
                        setObjectiveFilter(e.target.value);
                      }}
                    >
                      <option value="">All</option>
                      {CAMPAIGN_OBJECTIVES.map((objective, index) => (
                        <option key={index} value={objective}>
                          {objective.replace("OUTCOME_", "")}
                        </option>
                      ))}
                    </select>
                    {/* Custom arrow styling */}
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400 dark:text-gray-200" viewBox="0 0 16 16">
                        <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Refresh Creatives Button - only show if there are missing creatives */}
                {missingCreativesCount > 0 && !creativesLoading && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-teal-600 border-teal-300 flex items-center gap-2"
                    onClick={handleRefetchMissingCreatives}
                    disabled={refetchingMissingCreatives}
                  >
                    <RefreshCw className={`h-4 w-4 ${refetchingMissingCreatives ? 'animate-spin' : ''}`} />
                    <span>Refresh creatives ({missingCreativesCount})</span>
                  </Button>
                )}
              </div>

              {/* Campaigns Table Section */}
              <Card className="overflow-hidden border-0 rounded-lg shadow-sm">
                <div className="bg-teal-500 py-3 px-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Sparkles className="h-5 w-5" />
                      Campaigns Overview
                    </div>
                    <Badge className="bg-teal-600 text-white border-0 text-xs px-2.5">
                      {campaigns.length} Campaigns
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-0">
                {insightsLoading ? (
    <div className="flex justify-center items-center py-20">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  ) : (
                  <div className="overflow-x-auto">
                    
                    <Table className="w-full border-collapse">
                      <TableHeader>
                        <TableRow className="bg-blue-50 border-b border-blue-200">
                          <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase sticky top-0">
                            Name
                          </TableHead>
                          <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase sticky top-0">
                            Status
                          </TableHead>
                          <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase sticky top-0">
                            Objective
                          </TableHead>
                          <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase sticky top-0">
                            Spend
                          </TableHead>
                          <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase sticky top-0">
                            Frequency
                          </TableHead>
                          <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase sticky top-0">
                            Impressions
                          </TableHead>
                          <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase sticky top-0">
                            Clicks
                          </TableHead>
                          <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase sticky top-0">
                            Creatives
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                     <TableBody>
  {displayCampaigns.length === 0 ? (
    <tr>
      <td colSpan={8} className="text-center py-10 text-gray-500 text-sm">
        No data available.
      </td>
    </tr>
  ) : (
    displayCampaigns.map((campaign, index) => {
      const insights = campaignInsights[campaign.id] || {};
      const creatives = campaignCreativesMap[campaign.id] || [];
      const hasMissingCreatives = !creatives || creatives.length === 0;

      return (
        <motion.tr
          key={campaign.id}
          className="group cursor-pointer border-b border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors duration-200"
          onClick={() => navigate && navigate(`/campaign/${campaign.id}`)}
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: index * 0.03 }}
        >
          <TableCell className="py-3 px-4 align-middle h-16">
            <div className="font-medium text-blue-900 dark:text-blue-100">
              {campaign.name}
            </div>
          </TableCell>
          <TableCell className="py-3 px-4 align-middle h-16">
            <Badge variant="outline" className={`text-xs ${getStatusBadgeClass(campaign.status)}`}>
              {campaign.status}
            </Badge>
          </TableCell>
          <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 align-middle h-16">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {campaign.objective.replace("OUTCOME_", "")}
            </div>
          </TableCell>
          <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 align-middle h-16">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">
                ${Number.parseFloat(insights.spend || "0").toFixed(2)}
              </span>
            </div>
          </TableCell>
          <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 align-middle h-16">
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              {Number.parseFloat(insights.frequency || "0").toFixed(2)}
            </div>
          </TableCell>
          <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 align-middle h-16">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {Number.parseInt(insights.impressions || "0").toLocaleString()}
            </div>
          </TableCell>
          <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 align-middle h-16">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4" />
              {Number.parseInt(insights.clicks || "0").toLocaleString()}
            </div>
          </TableCell>
          <TableCell
            className="py-3 px-4 text-blue-700 dark:text-blue-300 align-middle h-16"
            onClick={(e) => {
              e.stopPropagation();
              if (hasMissingCreatives && !creativesLoading && !refetchingMissingCreatives) {
                handleRefetchMissingCreatives();
              }
            }}
          >
            <div className="flex items-center justify-center h-16">
              {creativesLoading || (hasMissingCreatives && refetchingMissingCreatives) ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : creatives.length > 0 ? (
                <div className="flex justify-center">
                  <CreativeThumbnails creatives={creatives} />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors duration-200">
                  <Film className="w-4 h-4" />
                  <div>
                    <h5>Something went wrong</h5>
                    <h6>No Creatives Found!</h6>
                  </div>
                </div>
              )}
            </div>
          </TableCell>
        </motion.tr>
      );
    })
  )}
                        
                        {/* Totals row */}
                        {displayCampaigns.length > 0 && (
                          <tr className="bg-teal-50 border-t-2 border-teal-200 font-medium">
                            <td colSpan={3} className="py-3 px-4 text-teal-800 align-middle h-16">
                              <div className="flex items-center justify-end font-semibold text-sm">
                                Total:
                              </div>
                            </td>
                            <td className="py-3 px-4 text-teal-800 align-middle h-16">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-teal-700" />
                                <span className="font-semibold">
                                  ${displayCampaigns.reduce((sum, campaign) => {
                                    const insights = campaignInsights[campaign.id] || {};
                                    return sum + Number.parseFloat(insights.spend || "0");
                                  }, 0).toFixed(2)}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-teal-800 align-middle h-16">
                              <div className="flex items-center gap-2">
                                <Repeat className="w-4 h-4 text-teal-700" />
                                <span className="font-semibold">
                                  {(displayCampaigns.reduce((sum, campaign) => {
                                    const insights = campaignInsights[campaign.id] || {};
                                    return sum + Number.parseFloat(insights.frequency || "0");
                                  }, 0) / (displayCampaigns.length || 1)).toFixed(2)}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-teal-800 align-middle h-16">
                              <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-teal-700" />
                                <span className="font-semibold">
                                  {displayCampaigns.reduce((sum, campaign) => {
                                    const insights = campaignInsights[campaign.id] || {};
                                    return sum + Number.parseInt(insights.impressions || "0");
                                  }, 0).toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-teal-800 align-middle h-16">
                              <div className="flex items-center gap-2">
                                <MousePointerClick className="w-4 h-4 text-teal-700" />
                                <span className="font-semibold">
                                  {displayCampaigns.reduce((sum, campaign) => {
                                    const insights = campaignInsights[campaign.id] || {};
                                    return sum + Number.parseInt(insights.clicks || "0");
                                  }, 0).toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-teal-800 align-middle h-16"></td>
                          </tr>
                        )}
                      </TableBody>
                    </Table>
    
    {/* Show More Button - only display if there are more rows to show */}
    {!showAllRows && campaigns.length > 10 && (
      <motion.div 
        initial={{ opacity: 0.8 }} 
        animate={{ opacity: 1 }}
        className="bg-gradient-to-b from-blue-50/80 to-blue-100/80 border-t border-blue-100"
      >
        <div className="flex justify-center items-center py-3">
          <Button 
            onClick={() => setShowAllRows(true)}
            className="bg-white hover:bg-blue-50 text-teal-700 border border-teal-200 shadow-sm group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow"
          >
            <span className="font-medium">View All {campaigns.length} Campaigns</span>
            <div className="bg-teal-500 rounded-full p-1 group-hover:bg-teal-600 transition-colors duration-200">
              <ChevronDown className="h-3 w-3 text-white" />
            </div>
          </Button>
        </div>
      </motion.div>
    )}
    
    {/* Show Less Button - only display if showing all rows and there are more than 10 */}
    {showAllRows && campaigns.length > 10 && (
      <motion.div 
        initial={{ opacity: 0.8 }} 
        animate={{ opacity: 1 }}
        className="bg-gradient-to-t from-blue-50/80 to-blue-100/80 border-t border-blue-100"
      >
        <div className="flex justify-center items-center py-3">
          <Button 
            onClick={() => setShowAllRows(false)}
            className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 shadow-sm group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow"
          >
            <span className="font-medium">Show Less</span>
            <div className="bg-blue-500 rounded-full p-1 group-hover:bg-blue-600 transition-colors duration-200">
              <ChevronDown className="h-3 w-3 text-white rotate-180" />
            </div>
          </Button>
        </div>
      </motion.div>
    )}
    
  </div>
)}
</CardContent>
              </Card>
            </div>
            <div className="mt-16 gap-y-12">
              <ChartsGrid 
                timeSeriesInsights={timeSeriesInsights || []} 
                title="Ad Account Analytics" 
              />
            </div>
          </>
        )}

{showNoDataPopup && !insightsLoading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        No Data Available
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        There is no data available for the selected filters or time period. Try adjusting your selection.
      </p>
      <button
        onClick={() => setShowNoDataPopup(false)}
        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
      >
        Close
      </button>
    </div>
  </div>
)}

        {/* Loading State */}
        {/* {(insightsLoading || creativesLoading) && (
          <div className="flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary"></div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Index;
