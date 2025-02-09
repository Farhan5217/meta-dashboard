
import { useState } from "react";
import { Activity, DollarSign, Users, TrendingUp, Signal, Radio } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { CampaignChart } from "@/components/CampaignChart";
import { BarChartVertical } from "@/components/BarChart";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { AdAccountSelector } from "@/components/AdAccountSelector";
import { CampaignSelector } from "@/components/CampaignSelector";
import { AdSetSelector } from "@/components/AdSetSelector";
import { useQuery } from "@tanstack/react-query";
import { getAdAccountInsights, getCampaignInsights, getAdSetInsights } from "@/services/api";
import { toast } from "sonner";
import type { DateRange } from "@/types/api";

const Index = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [selectedCampaign, setSelectedCampaign] = useState<string>();
  const [selectedAdSet, setSelectedAdSet] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>();

  // Get insights with time increment for time series
  const { data: timeSeriesInsights, isLoading: timeSeriesLoading } = useQuery({
    queryKey: ["insights", selectedAccount, selectedCampaign, selectedAdSet, dateRange, "timeSeries"],
    queryFn: async () => {
      if (dateRange?.from && dateRange?.to) {
        const params = {
          since: dateRange.from.toISOString().split('T')[0],
          until: dateRange.to.toISOString().split('T')[0],
          time_increment: 1,
        };
        
        if (selectedAdSet) {
          return getAdSetInsights(selectedAdSet, params);
        } else if (selectedCampaign) {
          return getCampaignInsights(selectedCampaign, params);
        } else if (selectedAccount) {
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

  // Get aggregated insights for metrics
  const { data: aggregatedInsights, isLoading: aggregatedLoading } = useQuery({
    queryKey: ["insights", selectedAccount, selectedCampaign, selectedAdSet, dateRange, "aggregated"],
    queryFn: async () => {
      if (dateRange?.from && dateRange?.to) {
        const params = {
          since: dateRange.from.toISOString().split('T')[0],
          until: dateRange.to.toISOString().split('T')[0],
        };
        
        if (selectedAdSet) {
          return getAdSetInsights(selectedAdSet, params);
        } else if (selectedCampaign) {
          return getCampaignInsights(selectedCampaign, params);
        } else if (selectedAccount) {
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
    impressions: 0,
    reach: 0,
    clicks: 0,
    spend: 0,
    ctr: 0,
  };

  // Calculate latest reach and frequency
  const latestReach = timeSeriesInsights?.length 
    ? parseInt(timeSeriesInsights[timeSeriesInsights.length - 1].reach)
    : 0;

  const latestFrequency = timeSeriesInsights?.length 
    ? (parseInt(timeSeriesInsights[timeSeriesInsights.length - 1].impressions) / 
       parseInt(timeSeriesInsights[timeSeriesInsights.length - 1].reach)).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-slate-950">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Meta Campaign Dashboard
              </h1>
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
              <DateRangeFilter date={dateRange} onRangeChange={setDateRange} />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total Spend"
            value={`$${parseFloat(aggregatedMetrics.spend || "0").toFixed(2)}`}
            icon={<DollarSign className="h-4 w-4" />}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200/50 dark:border-blue-700/50"
          />
          <MetricCard
            title="Impressions"
            value={parseInt(aggregatedMetrics.impressions || "0").toLocaleString()}
            icon={<Users className="h-4 w-4" />}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 border-purple-200/50 dark:border-purple-700/50"
          />
          <MetricCard
            title="Clicks"
            value={parseInt(aggregatedMetrics.clicks || "0").toLocaleString()}
            icon={<Activity className="h-4 w-4" />}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200/50 dark:border-green-700/50"
          />
          <MetricCard
            title="CTR"
            value={`${parseFloat(aggregatedMetrics.ctr || "0").toFixed(2)}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50 border-orange-200/50 dark:border-orange-700/50"
          />
          <MetricCard
            title="Reach"
            value={latestReach.toLocaleString()}
            description="Latest unique users reached"
            icon={<Signal className="h-4 w-4" />}
            className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/50 dark:to-pink-800/50 border-pink-200/50 dark:border-pink-700/50"
          />
          <MetricCard
            title="Frequency"
            value={latestFrequency}
            description="Average impressions per user"
            icon={<Radio className="h-4 w-4" />}
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/50 dark:to-indigo-800/50 border-indigo-200/50 dark:border-indigo-700/50"
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
