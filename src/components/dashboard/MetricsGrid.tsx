import { DollarSign, Eye, MousePointer, BarChart2, CircleDollarSign, PieChart, Users, Repeat } from "lucide-react"
import { MetricCard } from "../MetricCard"

interface MetricsGridProps {
  aggregatedMetrics: {
    impressions: string
    reach: string
    clicks: string
    spend: string
    ctr: string
    cpc: string
    cpm: string
    frequency: string
    // Add percentage change fields
    impressions_pct_change?: number
    clicks_pct_change?: number
    spend_pct_change?: number
    reach_pct_change?: number
    frequency_pct_change?: number
    ctr_pct_change?: number
    cpc_pct_change?: number
    cpm_pct_change?: number
  }
  className?: string
}

export function MetricsGrid({
  aggregatedMetrics,
  className = "bg-white dark:from-blue-900/50 dark:to-indigo-800/50 border-blue-200/50 dark:border-blue-700/50",
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Spend"
        value={`$${Number.parseFloat(aggregatedMetrics.spend || "0").toFixed(2)}`}
        description="Total amount spent on the campaign"
        icon={<DollarSign className="h-4 w-4" />}
        variant="spend"
        trend={
          aggregatedMetrics.spend_pct_change !== undefined
            ? {
                value: Math.abs(aggregatedMetrics.spend_pct_change),
                isPositive: aggregatedMetrics.spend_pct_change >= 0,
                
              }
            : undefined
        }
      />

      <MetricCard
        title="Impressions"
        value={Number.parseInt(aggregatedMetrics.impressions || "0").toLocaleString()}
        description="Total number of impressions"
        icon={<Eye className="h-4 w-4" />}
        variant="impressions"
        trend={
          aggregatedMetrics.impressions_pct_change !== undefined
            ? {
                value: Math.abs(aggregatedMetrics.impressions_pct_change),
                isPositive: aggregatedMetrics.impressions_pct_change >= 0,
                
              }
            : undefined
        }
      />

      <MetricCard
        title="Clicks"
        value={Number.parseInt(aggregatedMetrics.clicks || "0").toLocaleString()}
        description="Total number of clicks"
        icon={<MousePointer className="h-4 w-4" />}
        variant="clicks"
        trend={
          aggregatedMetrics.clicks_pct_change !== undefined
            ? {
                value: Math.abs(aggregatedMetrics.clicks_pct_change),
                isPositive: aggregatedMetrics.clicks_pct_change >= 0,
                
              }
            : undefined
        }
      />

      <MetricCard
        title="CTR"
        value={`${Number.parseFloat(aggregatedMetrics.ctr || "0").toFixed(2)}%`}
        description="Click-through rate"
        icon={<BarChart2 className="h-4 w-4" />}
        variant="ctr"
        trend={
          aggregatedMetrics.ctr_pct_change !== undefined
            ? {
                value: Math.abs(aggregatedMetrics.ctr_pct_change),
                isPositive: aggregatedMetrics.ctr_pct_change >= 0,
                
              }
            : undefined
        }
      />

      <MetricCard
        title="CPC"
        value={`$${Number.parseFloat(aggregatedMetrics.cpc || "0").toFixed(2)}`}
        description="Cost per click"
        icon={<CircleDollarSign className="h-4 w-4" />}
        variant="cpc"
        trend={
          aggregatedMetrics.cpc_pct_change !== undefined
            ? {
                value: Math.abs(aggregatedMetrics.cpc_pct_change),
                isPositive: aggregatedMetrics.cpc_pct_change < 0, // Lower CPC is positive
                
              }
            : undefined
        }
      />

      <MetricCard
        title="CPM"
        value={`$${Number.parseFloat(aggregatedMetrics.cpm || "0").toFixed(2)}`}
        description="Cost per thousand impressions"
        icon={<PieChart className="h-4 w-4" />}
        variant="cpm"
        trend={
          aggregatedMetrics.cpm_pct_change !== undefined
            ? {
                value: Math.abs(aggregatedMetrics.cpm_pct_change),
                isPositive: aggregatedMetrics.cpm_pct_change < 0, // Lower CPM is positive
                
              }
            : undefined
        }
      />

      <MetricCard
        title="Reach"
        value={Number.parseInt(aggregatedMetrics.reach || "0").toLocaleString()}
        description="Unique users reached"
        icon={<Users className="h-4 w-4" />}
        variant="reach"
        trend={
          aggregatedMetrics.reach_pct_change !== undefined
            ? {
                value: Math.abs(aggregatedMetrics.reach_pct_change),
                isPositive: aggregatedMetrics.reach_pct_change >= 0,
                
              }
            : undefined
        }
      />

      <MetricCard
        title="Frequency"
        value={`${Number.parseFloat(aggregatedMetrics.frequency || "0").toFixed(2)}`}
        description="Average impressions per user"
        icon={<Repeat className="h-4 w-4" />}
        variant="frequency"
        trend={
          aggregatedMetrics.frequency_pct_change !== undefined
            ? {
                value: Math.abs(aggregatedMetrics.frequency_pct_change),
                isPositive: aggregatedMetrics.frequency_pct_change >= 0,
                
              }
            : undefined
        }
      />
    </div>
  )
}



// with charts

// import { DollarSign, Eye, MousePointer, BarChart2, CircleDollarSign, PieChart, Users, Repeat } from "lucide-react"
// import { MetricCard } from "../MetricCard"

// interface MetricsGridProps {
//   aggregatedMetrics: {
//     impressions: string
//     reach: string
//     clicks: string
//     spend: string
//     ctr: string
//     cpc: string
//     cpm: string
//     frequency: string
//     // Add percentage change fields
//     impressions_pct_change?: number
//     clicks_pct_change?: number
//     spend_pct_change?: number
//     reach_pct_change?: number
//     frequency_pct_change?: number
//     ctr_pct_change?: number
//     cpc_pct_change?: number
//     cpm_pct_change?: number
//   }
//   // Prop for time series data
//   timeSeriesInsights?: Array<{
//     date_start: string
//     impressions: string
//     clicks: string
//     spend: string
//     reach: string
//     frequency: string
//     ctr: string
//     cpc: string
//     cpm: string
//   }>
//   className?: string
//   // New prop to control chart visibility
//   showCharts?: boolean
// }

// export function MetricsGrid({
//   aggregatedMetrics,
//   timeSeriesInsights = [],
//   className = "bg-white dark:from-blue-900/50 dark:to-indigo-800/50 border-blue-200/50 dark:border-blue-700/50",
//   showCharts = true, // Default to showing charts
// }: MetricsGridProps) {
//   // Process time series data for charts
//   const processChartData = (metric: keyof typeof aggregatedMetrics) => {
//     if (!timeSeriesInsights || timeSeriesInsights.length === 0) return []
    
//     // Debug: Log first time series insight to check format
//     if (metric === 'spend' && timeSeriesInsights.length > 0) {
//       console.log("Sample timeSeriesInsight:", timeSeriesInsights[0]);
//     }
    
//     return timeSeriesInsights
//       .filter(item => item.date_start && item[metric])
//       .map(item => ({
//         date: item.date_start,
//         value: parseFloat(item[metric] || '0')
//       }))
//   }

//   // Prepare chart data for each metric
//   const spendChartData = processChartData('spend')
//   const impressionsChartData = processChartData('impressions')
//   const clicksChartData = processChartData('clicks')
//   const ctrChartData = processChartData('ctr')
//   const cpcChartData = processChartData('cpc')
//   const cpmChartData = processChartData('cpm')
//   const reachChartData = processChartData('reach')
//   const frequencyChartData = processChartData('frequency')
  
//   // Debug: Log processed chart data for spend
//   console.log("Processed spend chart data:", spendChartData);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
//       <MetricCard
//         title="Total Spend"
//         value={`$${Number.parseFloat(aggregatedMetrics.spend || "0").toFixed(2)}`}
//         description="Total amount spent on the campaign"
//         icon={<DollarSign className="h-4 w-4" />}
//         variant="spend"
//         chartData={spendChartData}
//         showChart={showCharts}
//         trend={
//           aggregatedMetrics.spend_pct_change !== undefined
//             ? {
//                 value: Math.abs(Number(aggregatedMetrics.spend_pct_change.toFixed(2))),
//                 isPositive: aggregatedMetrics.spend_pct_change >= 0,
//               }
//             : undefined
//         }
//       />

//       <MetricCard
//         title="Impressions"
//         value={Number.parseInt(aggregatedMetrics.impressions || "0").toLocaleString()}
//         description="Total number of impressions"
//         icon={<Eye className="h-4 w-4" />}
//         variant="impressions"
//         chartData={impressionsChartData}
//         showChart={showCharts}
//         trend={
//           aggregatedMetrics.impressions_pct_change !== undefined
//             ? {
//                 value: Math.abs(Number(aggregatedMetrics.impressions_pct_change.toFixed(2))),
//                 isPositive: aggregatedMetrics.impressions_pct_change >= 0,
//               }
//             : undefined
//         }
//       />

//       <MetricCard
//         title="Clicks"
//         value={Number.parseInt(aggregatedMetrics.clicks || "0").toLocaleString()}
//         description="Total number of clicks"
//         icon={<MousePointer className="h-4 w-4" />}
//         variant="clicks"
//         chartData={clicksChartData}
//         showChart={showCharts}
//         trend={
//           aggregatedMetrics.clicks_pct_change !== undefined
//             ? {
//                 value: Math.abs(Number(aggregatedMetrics.clicks_pct_change.toFixed(2))),
//                 isPositive: aggregatedMetrics.clicks_pct_change >= 0,
//               }
//             : undefined
//         }
//       />

//       <MetricCard
//         title="CTR"
//         value={`${Number.parseFloat(aggregatedMetrics.ctr || "0").toFixed(2)}%`}
//         description="Click-through rate"
//         icon={<BarChart2 className="h-4 w-4" />}
//         variant="ctr"
//         chartData={ctrChartData}
//         showChart={showCharts}
//         trend={
//           aggregatedMetrics.ctr_pct_change !== undefined
//             ? {
//                 value: Math.abs(Number(aggregatedMetrics.ctr_pct_change.toFixed(2))),
//                 isPositive: aggregatedMetrics.ctr_pct_change >= 0,
//               }
//             : undefined
//         }
//       />

//       <MetricCard
//         title="CPC"
//         value={`$${Number.parseFloat(aggregatedMetrics.cpc || "0").toFixed(2)}`}
//         description="Cost per click"
//         icon={<CircleDollarSign className="h-4 w-4" />}
//         variant="cpc"
//         chartData={cpcChartData}
//         showChart={showCharts}
//         trend={
//           aggregatedMetrics.cpc_pct_change !== undefined
//             ? {
//                 value: Math.abs(Number(aggregatedMetrics.cpc_pct_change.toFixed(2))),
//                 isPositive: aggregatedMetrics.cpc_pct_change < 0, // Lower CPC is positive
//               }
//             : undefined
//         }
//       />

//       <MetricCard
//         title="CPM"
//         value={`$${Number.parseFloat(aggregatedMetrics.cpm || "0").toFixed(2)}`}
//         description="Cost per thousand impressions"
//         icon={<PieChart className="h-4 w-4" />}
//         variant="cpm"
//         chartData={cpmChartData}
//         showChart={showCharts}
//         trend={
//           aggregatedMetrics.cpm_pct_change !== undefined
//             ? {
//                 value: Math.abs(Number(aggregatedMetrics.cpm_pct_change.toFixed(2))),
//                 isPositive: aggregatedMetrics.cpm_pct_change < 0, // Lower CPM is positive
//               }
//             : undefined
//         }
//       />

//       <MetricCard
//         title="Reach"
//         value={Number.parseInt(aggregatedMetrics.reach || "0").toLocaleString()}
//         description="Unique users reached"
//         icon={<Users className="h-4 w-4" />}
//         variant="reach"
//         chartData={reachChartData}
//         showChart={showCharts}
//         trend={
//           aggregatedMetrics.reach_pct_change !== undefined
//             ? {
//                 value: Math.abs(Number(aggregatedMetrics.reach_pct_change.toFixed(2))),
//                 isPositive: aggregatedMetrics.reach_pct_change >= 0,
//               }
//             : undefined
//         }
//       />

//       <MetricCard
//         title="Frequency"
//         value={`${Number.parseFloat(aggregatedMetrics.frequency || "0").toFixed(2)}`}
//         description="Average impressions per user"
//         icon={<Repeat className="h-4 w-4" />}
//         variant="frequency"
//         chartData={frequencyChartData}
//         showChart={showCharts}
//         trend={
//           aggregatedMetrics.frequency_pct_change !== undefined
//             ? {
//                 value: Math.abs(Number(aggregatedMetrics.frequency_pct_change.toFixed(2))),
//                 isPositive: aggregatedMetrics.frequency_pct_change >= 0,
//               }
//             : undefined
//         }
//       />
//     </div>
//   )
// }