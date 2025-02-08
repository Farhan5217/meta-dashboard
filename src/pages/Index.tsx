
import { useState } from "react";
import { Activity, DollarSign, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { CampaignChart } from "@/components/CampaignChart";
import { BarChartVertical } from "@/components/BarChart";
import { AreaChart } from "@/components/AreaChart";
import { SpendDistributionChart } from "@/components/SpendDistributionChart";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { AdAccountSelector } from "@/components/AdAccountSelector";
import { CampaignSelector } from "@/components/CampaignSelector";
import { AdSetSelector } from "@/components/AdSetSelector";
import { useQuery } from "@tanstack/react-query";
import { getAdAccountInsights, getCampaignInsights, getAdSetInsights } from "@/services/api";
import { toast } from "sonner";

const Index = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [selectedCampaign, setSelectedCampaign] = useState<string>();
  const [selectedAdSet, setSelectedAdSet] = useState<string>();
  const [dateRange, setDateRange] = useState("7d");

  // Get insights with time increment for time series
  const { data: timeSeriesInsights, isLoading: timeSeriesLoading } = useQuery({
    queryKey: ["insights", selectedAccount, selectedCampaign, selectedAdSet, dateRange, "timeSeries"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - parseInt(dateRange));
      
      if (selectedAdSet) {
        return getAdSetInsights(selectedAdSet, {
          since: since.toISOString().split('T')[0],
          until: new Date().toISOString().split('T')[0],
          time_increment: 1,
        });
      } else if (selectedCampaign) {
        return getCampaignInsights(selectedCampaign, {
          since: since.toISOString().split('T')[0],
          until: new Date().toISOString().split('T')[0],
          time_increment: 1,
        });
      } else if (selectedAccount) {
        return getAdAccountInsights(selectedAccount, {
          since: since.toISOString().split('T')[0],
          until: new Date().toISOString().split('T')[0],
          time_increment: 1,
        });
      }
      return [];
    },
    meta: {
      onError: () => {
        toast.error("Failed to fetch time series insights");
      }
    }
  });

  // Get aggregated insights for metrics
  const { data: aggregatedInsights, isLoading: aggregatedLoading } = useQuery({
    queryKey: ["insights", selectedAccount, selectedCampaign, selectedAdSet, dateRange, "aggregated"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - parseInt(dateRange));
      
      if (selectedAdSet) {
        return getAdSetInsights(selectedAdSet, {
          since: since.toISOString().split('T')[0],
          until: new Date().toISOString().split('T')[0],
        });
      } else if (selectedCampaign) {
        return getCampaignInsights(selectedCampaign, {
          since: since.toISOString().split('T')[0],
          until: new Date().toISOString().split('T')[0],
        });
      } else if (selectedAccount) {
        return getAdAccountInsights(selectedAccount, {
          since: since.toISOString().split('T')[0],
          until: new Date().toISOString().split('T')[0],
        });
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
    impressions: 0,
    reach: 0,
    clicks: 0,
    spend: 0,
    ctr: 0,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meta Campaign Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track and analyze your campaign performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <AdAccountSelector
                onAccountSelect={(id) => {
                  setSelectedAccount(id);
                  setSelectedCampaign(undefined);
                  setSelectedAdSet(undefined);
                }}
                selectedAccount={selectedAccount}
              />
              <CampaignSelector
                onCampaignSelect={(id) => {
                  setSelectedCampaign(id);
                  setSelectedAdSet(undefined);
                }}
                selectedCampaign={selectedCampaign}
                adAccountId={selectedAccount}
              />
              <AdSetSelector
                onAdSetSelect={setSelectedAdSet}
                selectedAdSet={selectedAdSet}
                campaignId={selectedCampaign}
              />
              <DateRangeFilter onRangeChange={setDateRange} />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Spend"
            value={`$${parseFloat(aggregatedMetrics.spend || "0").toFixed(2)}`}
            icon={<DollarSign className="h-4 w-4" />}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50"
          />
          <MetricCard
            title="Impressions"
            value={parseInt(aggregatedMetrics.impressions || "0").toLocaleString()}
            icon={<Users className="h-4 w-4" />}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50"
          />
          <MetricCard
            title="Clicks"
            value={parseInt(aggregatedMetrics.clicks || "0").toLocaleString()}
            icon={<Activity className="h-4 w-4" />}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50"
          />
          <MetricCard
            title="CTR"
            value={`${parseFloat(aggregatedMetrics.ctr || "0").toFixed(2)}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {timeSeriesInsights?.length > 0 && (
            <>
              <CampaignChart
                data={timeSeriesInsights}
                title="Daily Ad Spend"
                metric="spend"
              />
              <BarChartVertical
                data={timeSeriesInsights}
                title="Daily Impressions"
                dataKey="impressions"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {timeSeriesInsights?.length > 0 && (
            <>
              <AreaChart
                data={timeSeriesInsights}
                title="Reach Trends"
                dataKey="reach"
              />
              <SpendDistributionChart
                data={timeSeriesInsights}
                title="Frequency Distribution"
              />
            </>
          )}
        </div>

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
