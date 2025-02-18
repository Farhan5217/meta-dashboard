
import { Activity, DollarSign, Users, TrendingUp, Signal, Radio } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

interface MetricsGridProps {
  aggregatedMetrics: {
    impressions: string;
    reach: string;
    clicks: string;
    spend: string;
    ctr: string;
    cpc:string;
    cpm:string
  };
  latestReach: number;
  latestFrequency: string;
  className?: string;
}

export function MetricsGrid({ 
  aggregatedMetrics, 
  latestReach, 
  latestFrequency,
  className = "bg-white dark:from-blue-900/50 dark:to-indigo-800/50 border-blue-200/50 dark:border-blue-700/50"
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Spend"
        value={`$${parseFloat(aggregatedMetrics.spend || "0").toFixed(2)}`}
        description="Total amount spent on the campaign"
        icon={<DollarSign className="h-4 w-4" />}
        className={className}
      />
      <MetricCard
        title="Impressions"
        value={parseInt(aggregatedMetrics.impressions || "0").toLocaleString()}
        description="Total number of impressions"
        icon={<Users className="h-4 w-4" />}
        className={className}
      />
      <MetricCard
        title="Clicks"
        value={parseInt(aggregatedMetrics.clicks || "0").toLocaleString()}
        description="Total number of clicks"
        icon={<Activity className="h-4 w-4" />}
        className={className}
      />
      <MetricCard
        title="CTR"
        value={`${parseFloat(aggregatedMetrics.ctr || "0").toFixed(2)}%`}
        description="Click-through rate"
        icon={<TrendingUp className="h-4 w-4" />}
        className={className}
      />
      <MetricCard
        title="CPC"
        value={`${parseFloat(aggregatedMetrics.cpc || "0").toFixed(2)}%`}
        description="Click-through rate"
        icon={<TrendingUp className="h-4 w-4" />}
        className={className}
      />
      <MetricCard
        title="CPM"
        value={`${parseFloat(aggregatedMetrics.cpm || "0").toFixed(2)}%`}
        description="Click-through rate"
        icon={<TrendingUp className="h-4 w-4" />}
        className={className}
      />
      <MetricCard
        title="Reach"
        value={latestReach.toString().toLocaleString()}
        description="Latest unique users reached"
        icon={<Signal className="h-4 w-4" />}
        className={className}
      />
      <MetricCard
        title="Frequency"
        value={latestFrequency.toString()}
        description="Average impressions per user"
        icon={<Radio className="h-4 w-4" />}
        className={className}
      />
    </div>
  );
}
