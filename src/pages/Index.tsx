
import { useState , useEffect} from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdAccountInsights, getCampaignInsights } from "@/services/api";
import { toast } from "sonner";
import type { DateRange } from "@/types/api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import { useAdAccounts } from "@/hooks/useAdAccounts";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
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
  // const [selectedAccount, setSelectedAccount] = useState<string>();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<number>();
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>();
  const [objectiveFilter, setObjectiveFilter] = useState<string>();
  const [showDemographics, setShowDemographics] = useState(false);
  // const [dateRange, setDateRange] = useState<DateRange>();
  const [dateRange, setDateRange] = useState<DateRange>(getLast30Days());

  const { accounts } = useAdAccounts(statusFilter);
  const { campaigns } = useCampaigns(selectedAccount, campaignStatusFilter, objectiveFilter);

// Set default date range if account is selected
useEffect(() => {
  if (selectedAccount) {
    setDateRange(getLast30Days());
    // Store selected account in sessionStorage
    sessionStorage.setItem("selectedAccount", selectedAccount);
  }
}, [selectedAccount]);

// Load selected account and filters from sessionStorage on page load
useEffect(() => {
  const storedAccount = sessionStorage.getItem("selectedAccount");
  if (storedAccount) {
    setSelectedAccount(storedAccount);
  }
}, []);

  // Get insights with time increment for time series
  const { data: timeSeriesInsights, isLoading: timeSeriesLoading } = useQuery({
    queryKey: ["insights", selectedAccount, dateRange, "timeSeries", showDemographics],
    queryFn: async () => {
      if (dateRange?.from && dateRange?.to) {
        const params = {
          since: dateRange.from.toISOString().split('T')[0],
          until: dateRange.to.toISOString().split('T')[0],
          time_increment: 1,
          breakdown: showDemographics,
        };
        
        if (selectedAccount) {
          return getAdAccountInsights(selectedAccount, params);
        }
      }
      return [];
    },
    meta: {
      onError: () => {
        toast.error("Failed to fetch time series insights");
      }
    }
  });

  // Get campaign insights for the table
  const { data: campaignInsights = {} } = useQuery({
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

  // Get aggregated insights for metrics
  const { data: aggregatedInsights, isLoading: aggregatedLoading } = useQuery({
    queryKey: ["insights", selectedAccount, dateRange, "aggregated"],
    queryFn: async () => {
      if (dateRange?.from && dateRange?.to) {
        const params = {
          since: dateRange.from.toISOString().split('T')[0],
          until: dateRange.to.toISOString().split('T')[0],
          breakdown: false,
        };
        
        if (selectedAccount) {
          return getAdAccountInsights(selectedAccount, params);
        }
      }
      return [];
    },
    meta: {
      onError: () => {
        toast.error("Failed to fetch aggregated insights");
      }
    }
  });

  const aggregatedMetrics = aggregatedInsights?.[0] || {
    impressions: "0",
    reach: "0",
    clicks: "0",
    spend: "0",
    ctr: "0",
  };

  // Calculate latest reach and frequency
  const latestReach = timeSeriesInsights?.length 
    ? parseInt(timeSeriesInsights[timeSeriesInsights.length - 1].reach)
    : 0;

  const latestFrequency = timeSeriesInsights?.length 
    ? (parseInt(timeSeriesInsights[timeSeriesInsights.length - 1].frequency) || 0).toFixed(2)
    : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-slate-950">
  <DashboardHeader
    selectedAccount={selectedAccount}
    dateRange={dateRange}
    onAccountSelect={setSelectedAccount}
    onDateRangeChange={setDateRange}
    statusFilter={statusFilter}
  />

  <div className="container mx-auto px-6 py-10">
    {/* Filters Section */}
    <div className="flex flex-wrap items-center gap-6 mb-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
  <Label
    htmlFor="account-filter"
    className="text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    Account Status:
  </Label>
  <div className="relative w-full sm:w-auto">
    <select
      id="account-filter"
      className="w-full sm:w-[200px] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none pr-8"
      value={statusFilter?.toString() || ""}
      onChange={(e) => {
        setStatusFilter(e.target.value ? Number(e.target.value) : undefined);
        setSelectedAccount(undefined);
      }}
    >
      <option value="">All</option>
      <option value={AD_ACCOUNT_STATUS.ACTIVE}>Active</option>
      <option value={AD_ACCOUNT_STATUS.INACTIVE}>Inactive</option>
    </select>
    {/* Custom arrow styling */}
    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400 dark:text-gray-200" viewBox="0 0 16 16">
        <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"/>
      </svg>
    </div>
  </div>
</div>



      {/* <div className="flex items-center space-x-2 disabled">
        <Switch id="demographics" checked={showDemographics} onCheckedChange={setShowDemographics} />
        <Label htmlFor="demographics" className="text-gray-700 dark:text-gray-300 disabled">
          Show Demographics
        </Label>
      </div> */}
      <div
  className="flex items-center space-x-2 opacity-50 pointer-events-none"
  aria-disabled="true"
>
  <Switch
    id="demographics"
    checked={showDemographics}
    onCheckedChange={setShowDemographics}
    disabled
  />
  <Label
    htmlFor="demographics"
    className="text-gray-700 dark:text-gray-300"
  >
    Show Demographics
  </Label>
</div>

    </div>

    {selectedAccount && (
      <>
        <MetricsGrid aggregatedMetrics={aggregatedMetrics} latestReach={latestReach} latestFrequency={latestFrequency} />

        <ChartsGrid timeSeriesInsights={timeSeriesInsights || []} showDemographics={showDemographics} />

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
          onChange={(e) => setObjectiveFilter(e.target.value)}
        >
          <option value="">All</option>
          {CAMPAIGN_OBJECTIVES.map((objective) => (
            <option key={objective} value={objective}>
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

  </div>

  {/* Campaigns Table Section */}
  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-4">
    Campaigns
  </h2>
  
  <div className="overflow-x-auto rounded-lg shadow-lg border dark:border-gray-800">
    <Table>
      <TableHeader>
        <TableRow className="dark:bg-gray-900 text-gray-700 dark:text-gray-300">
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Objective</TableHead>
          <TableHead>Spend</TableHead>
          <TableHead>Impressions</TableHead>
          <TableHead>Clicks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => {
          const insights = campaignInsights[campaign.id] || {};
          return (
            <TableRow
              key={campaign.id}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
              onClick={() => navigate(`/campaign/${campaign.id}`)}
            >
              <TableCell>{campaign.name}</TableCell>
              <TableCell>{campaign.status}</TableCell>
              <TableCell>{campaign.objective.replace("OUTCOME_", "")}</TableCell>
              <TableCell>${parseFloat(insights.spend || "0").toFixed(2)}</TableCell>
              <TableCell>{parseInt(insights.impressions || "0").toLocaleString()}</TableCell>
              <TableCell>{parseInt(insights.clicks || "0").toLocaleString()}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
</div>

      </>
    )}

    {/* Loading State */}
    {(timeSeriesLoading || aggregatedLoading) && (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary"></div>
      </div>
    )}
  </div>
</div>

  );
};

export default Index;
