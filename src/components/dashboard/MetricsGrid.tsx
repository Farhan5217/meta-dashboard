import {
  DollarSign,
  Eye,
  MousePointer,
  BarChart2,
  CircleDollarSign,
  PieChart,
  Users,
  Repeat
} from "lucide-react";
import { MetricCard } from "../MetricCard";

interface MetricsGridProps {
  aggregatedMetrics: {
    impressions: string;
    reach: string;
    clicks: string;
    spend: string;
    ctr: string;
    cpc: string;
    cpm: string;
    frequency: string;
    // Add percentage change fields
    impressions_pct_change?: number;
    clicks_pct_change?: number;
    spend_pct_change?: number;
    reach_pct_change?: number;
    frequency_pct_change?: number;
    ctr_pct_change?: number;
    cpc_pct_change?: number;
    cpm_pct_change?: number;
  };
  className?: string;
}

export function MetricsGrid({
  aggregatedMetrics,
  className = "bg-white dark:from-blue-900/50 dark:to-indigo-800/50 border-blue-200/50 dark:border-blue-700/50"
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Spend"
        value={`$${parseFloat(aggregatedMetrics.spend || "0").toFixed(2)}`}
        description="Total amount spent on the campaign"
        icon={<DollarSign className="h-4 w-4" />}
        variant="spend"
        trend={aggregatedMetrics.spend_pct_change !== undefined ? {
          value: Math.abs(aggregatedMetrics.spend_pct_change),
          isPositive: aggregatedMetrics.spend_pct_change >= 0,
          timeFrame: "prev period"
        } : undefined}
      />
      
      <MetricCard
        title="Impressions"
        value={parseInt(aggregatedMetrics.impressions || "0").toLocaleString()}
        description="Total number of impressions"
        icon={<Eye className="h-4 w-4" />}
        variant="impressions"
        trend={aggregatedMetrics.impressions_pct_change !== undefined ? {
          value: Math.abs(aggregatedMetrics.impressions_pct_change),
          isPositive: aggregatedMetrics.impressions_pct_change >= 0,
          timeFrame: "prev period"
        } : undefined}
      />
      
      <MetricCard
        title="Clicks"
        value={parseInt(aggregatedMetrics.clicks || "0").toLocaleString()}
        description="Total number of clicks"
        icon={<MousePointer className="h-4 w-4" />}
        variant="clicks"
        trend={aggregatedMetrics.clicks_pct_change !== undefined ? {
          value: Math.abs(aggregatedMetrics.clicks_pct_change),
          isPositive: aggregatedMetrics.clicks_pct_change >= 0,
          timeFrame: "prev period"
        } : undefined}
      />
      
      <MetricCard
        title="CTR"
        value={`${parseFloat(aggregatedMetrics.ctr || "0").toFixed(2)}%`}
        description="Click-through rate"
        icon={<BarChart2 className="h-4 w-4" />}
        variant="ctr"
        trend={aggregatedMetrics.ctr_pct_change !== undefined ? {
          value: Math.abs(aggregatedMetrics.ctr_pct_change),
          isPositive: aggregatedMetrics.ctr_pct_change >= 0,
          timeFrame: "prev period"
        } : undefined}
      />
      
      <MetricCard
        title="CPC"
        value={`$${parseFloat(aggregatedMetrics.cpc || "0").toFixed(2)}`}
        description="Cost per click"
        icon={<CircleDollarSign className="h-4 w-4" />}
        variant="cpc"
        trend={aggregatedMetrics.cpc_pct_change !== undefined ? {
          value: Math.abs(aggregatedMetrics.cpc_pct_change),
          isPositive: aggregatedMetrics.cpc_pct_change < 0, // Lower CPC is positive
          timeFrame: "prev period"
        } : undefined}
      />
      
      <MetricCard
        title="CPM"
        value={`$${parseFloat(aggregatedMetrics.cpm || "0").toFixed(2)}`}
        description="Cost per thousand impressions"
        icon={<CircleDollarSign className="h-4 w-4" />}
        variant="cpm"
        trend={aggregatedMetrics.cpm_pct_change !== undefined ? {
          value: Math.abs(aggregatedMetrics.cpm_pct_change),
          isPositive: aggregatedMetrics.cpm_pct_change < 0, // Lower CPM is positive
          timeFrame: "prev period"
        } : undefined}
      />
      
      <MetricCard
        title="Reach"
        value={parseInt(aggregatedMetrics.reach || "0").toLocaleString()}
        description="Unique users reached"
        icon={<Users className="h-4 w-4" />}
        variant="reach"
        trend={aggregatedMetrics.reach_pct_change !== undefined ? {
          value: Math.abs(aggregatedMetrics.reach_pct_change),
          isPositive: aggregatedMetrics.reach_pct_change >= 0,
          timeFrame: "prev period"
        } : undefined}
      />
      
      <MetricCard
        title="Frequency"
        value={`${parseFloat(aggregatedMetrics.frequency || "0").toFixed(2)}`}
        description="Average impressions per user"
        icon={<Repeat className="h-4 w-4" />}
        variant="frequency"
        trend={aggregatedMetrics.frequency_pct_change !== undefined ? {
          value: Math.abs(aggregatedMetrics.frequency_pct_change),
          isPositive: aggregatedMetrics.frequency_pct_change >= 0,
          timeFrame: "prev period"
        } : undefined}
      />
    </div>
  );
}