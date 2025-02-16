
import { useState } from "react";
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

const Index = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<number>();
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>();
  const [objectiveFilter, setObjectiveFilter] = useState<string>();
  const [showDemographics, setShowDemographics] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>();

  const { accounts } = useAdAccounts(statusFilter);
  const { campaigns } = useCampaigns(selectedAccount, campaignStatusFilter, objectiveFilter);

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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Label htmlFor="account-filter">Account Status:</Label>
            <select
              id="account-filter"
              className="border rounded-md p-2"
              value={statusFilter?.toString() || ""}
              onChange={(e) => {
                const value = e.target.value;
                setStatusFilter(value ? Number(value) : undefined);
                setSelectedAccount(undefined); // Reset selected account when changing filter
              }}
            >
              <option value="">All</option>
              <option value={AD_ACCOUNT_STATUS.ACTIVE}>Active</option>
              <option value={AD_ACCOUNT_STATUS.INACTIVE}>Inactive</option>
            </select>
          </div>
          {selectedAccount && (
            <>
              <div className="flex items-center space-x-2">
                <Label htmlFor="campaign-status">Campaign Status:</Label>
                <select
                  id="campaign-status"
                  className="border rounded-md p-2"
                  value={campaignStatusFilter}
                  onChange={(e) => setCampaignStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value={CAMPAIGN_STATUS.ACTIVE}>Active</option>
                  <option value={CAMPAIGN_STATUS.PAUSED}>Paused</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="campaign-objective">Campaign Objective:</Label>
                <select
                  id="campaign-objective"
                  className="border rounded-md p-2"
                  value={objectiveFilter}
                  onChange={(e) => setObjectiveFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {CAMPAIGN_OBJECTIVES.map((objective) => (
                    <option key={objective} value={objective}>
                      {objective.replace('OUTCOME_', '')}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="flex items-center space-x-2">
            <Switch
              id="demographics"
              checked={showDemographics}
              onCheckedChange={setShowDemographics}
            />
            <Label htmlFor="demographics">Show Demographics</Label>
          </div>
        </div>

        {selectedAccount && (
          <>
            <MetricsGrid
              aggregatedMetrics={aggregatedMetrics}
              latestReach={latestReach}
              latestFrequency={latestFrequency}
            />

            <ChartsGrid 
              timeSeriesInsights={timeSeriesInsights || []} 
              showDemographics={showDemographics}
            />

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Campaigns</h2>
              <Table>
                <TableHeader>
                  <TableRow>
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
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => navigate(`/campaign/${campaign.id}`)}
                      >
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.status}</TableCell>
                        <TableCell>{campaign.objective.replace('OUTCOME_', '')}</TableCell>
                        <TableCell>${parseFloat(insights.spend || "0").toFixed(2)}</TableCell>
                        <TableCell>{parseInt(insights.impressions || "0").toLocaleString()}</TableCell>
                        <TableCell>{parseInt(insights.clicks || "0").toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {(timeSeriesLoading || aggregatedLoading) && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
