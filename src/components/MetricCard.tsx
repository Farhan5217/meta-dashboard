// without charts

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from "lucide-react"

type MetricVariant = "default" | "spend" | "impressions" | "clicks" | "ctr" | "cpc" | "cpm" | "reach" | "frequency"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  className?: string
  icon?: React.ReactNode
  isLoading?: boolean
  trend?: {
    value: number
    isPositive: boolean
    timeFrame?: string
  }
  variant?: MetricVariant
}

export function MetricCard({
  title,
  value,
  description,
  className,
  icon,
  isLoading = false,
  trend,
  variant = "default",
}: MetricCardProps) {
  // Color configurations for different variants
  const variantStyles: Record<
    MetricVariant,
    {
      gradient: string
      iconBg: string
      iconColor: string
      darkGradient: string
      darkIconBg: string
      border: string
      darkBorder: string
    }
  > = {
    default: {
      gradient: "from-gray-50 to-gray-100/50",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      darkGradient: "dark:from-gray-900/20 dark:to-gray-800/10",
      darkIconBg: "dark:bg-gray-800/30",
      border: "border-gray-200/50",
      darkBorder: "dark:border-gray-800/50",
    },
    spend: {
      gradient: "from-emerald-50 to-emerald-100/50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      darkGradient: "dark:from-emerald-900/20 dark:to-emerald-800/10",
      darkIconBg: "dark:bg-emerald-800/30",
      border: "border-emerald-200/50",
      darkBorder: "dark:border-emerald-800/50",
    },
    impressions: {
      gradient: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      darkGradient: "dark:from-blue-900/20 dark:to-blue-800/10",
      darkIconBg: "dark:bg-blue-800/30",
      border: "border-blue-200/50",
      darkBorder: "dark:border-blue-800/50",
    },
    clicks: {
      gradient: "from-indigo-50 to-indigo-100/50",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      darkGradient: "dark:from-indigo-900/20 dark:to-indigo-800/10",
      darkIconBg: "dark:bg-indigo-800/30",
      border: "border-indigo-200/50",
      darkBorder: "dark:border-indigo-800/50",
    },
    ctr: {
      gradient: "from-purple-50 to-purple-100/50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      darkGradient: "dark:from-purple-900/20 dark:to-purple-800/10",
      darkIconBg: "dark:bg-purple-800/30",
      border: "border-purple-200/50",
      darkBorder: "dark:border-purple-800/50",
    },
    cpc: {
      gradient: "from-amber-50 to-amber-100/50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      darkGradient: "dark:from-amber-900/20 dark:to-amber-800/10",
      darkIconBg: "dark:bg-amber-800/30",
      border: "border-amber-200/50",
      darkBorder: "dark:border-amber-800/50",
    },
    cpm: {
      gradient: "from-rose-50 to-rose-100/50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      darkGradient: "dark:from-rose-900/20 dark:to-rose-800/10",
      darkIconBg: "dark:bg-rose-800/30",
      border: "border-rose-200/50",
      darkBorder: "dark:border-rose-800/50",
    },
    reach: {
      gradient: "from-teal-50 to-teal-100/50",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      darkGradient: "dark:from-teal-900/20 dark:to-teal-800/10",
      darkIconBg: "dark:bg-teal-800/30",
      border: "border-teal-200/50",
      darkBorder: "dark:border-teal-800/50",
    },
    frequency: {
      gradient: "from-cyan-50 to-cyan-100/50",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      darkGradient: "dark:from-cyan-900/20 dark:to-cyan-800/10",
      darkIconBg: "dark:bg-cyan-800/30",
      border: "border-cyan-200/50",
      darkBorder: "dark:border-cyan-800/50",
    },
  }

  const styles = variantStyles[variant]

  return (
    <Card
      className={cn(
        "group relative overflow-hidden font-sans",
        "bg-gradient-to-br",
        styles.gradient,
        styles.darkGradient,
        "border",
        styles.border,
        styles.darkBorder,
        "transition-all duration-300 ease-in-out",
        "hover:shadow-lg hover:scale-[1.02]",
        "backdrop-blur-lg",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div
              className={cn(
                "flex items-center justify-center",
                styles.iconBg,
                styles.iconColor,
                "w-8 h-8 rounded-lg",
                "transition-transform duration-300 group-hover:scale-110",
                "p-1.5",
                styles.darkIconBg,
              )}
            >
              {icon}
            </div>
          )}
          <CardTitle className={cn("text-sm font-display font-medium tracking-wide", "transition-colors duration-200")}>
            {title}
          </CardTitle>
        </div>

        {trend && !isLoading && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full",
              "text-xs font-body font-medium",
              trend.isPositive
                ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
              "transition-colors duration-200",
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
            )}
            <span className="font-display">{trend.value}%</span>
            {trend.timeFrame && (
              <span className="text-xs font-body opacity-75 ml-1 hidden sm:inline">vs {trend.timeFrame}</span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <>
              <div className={cn("text-3xl font-display font-bold tracking-tight", "transition-colors duration-200")}>
                {value}
              </div>

              {description && (
                <p className={cn("text-sm font-body text-muted-foreground", "leading-relaxed")}>{description}</p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}





// time series data charts
// import { useEffect, useRef } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { cn } from "@/lib/utils"
// import { Skeleton } from "@/components/ui/skeleton"
// import { TrendingUp, TrendingDown } from "lucide-react"
// import { 
//   Line, LineChart, ResponsiveContainer, Area, AreaChart, Tooltip, TooltipProps
// } from "recharts";

// type MetricVariant = "default" | "spend" | "impressions" | "clicks" | "ctr" | "cpc" | "cpm" | "reach" | "frequency"

// interface MetricCardProps {
//   title: string
//   value: string | number
//   description?: string
//   className?: string
//   icon?: React.ReactNode
//   isLoading?: boolean
//   trend?: {
//     value: number
//     isPositive: boolean
//     timeFrame?: string
//   }
//   variant?: MetricVariant
//   // Prop for chart data
//   chartData?: { date: string; value: number }[]
// }

// // Custom tooltip component that only shows the value
// const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
//   if (active && payload && payload.length) {
//     const value = payload[0].value;
//     return (
//       <div className="custom-tooltip bg-white px-2 py-1 rounded-md shadow-md text-xs border border-gray-200">
//         <p>{typeof value === 'number' ? value.toFixed(2) : value}</p>
//       </div>
//     );
//   }
//   return null;
// };

// export function MetricCard({
//   title,
//   value,
//   description,
//   className,
//   icon,
//   isLoading = false,
//   trend,
//   variant = "default",
//   chartData = [],
// }: MetricCardProps) {
//   // Get colors based on variant
//   const colors = getChartColors(variant, trend?.isPositive)
  
//   // Color configurations for different variants
//   const variantStyles: Record<
//     MetricVariant,
//     {
//       gradient: string
//       iconBg: string
//       iconColor: string
//       darkGradient: string
//       darkIconBg: string
//       border: string
//       darkBorder: string
//     }
//   > = {
//     default: {
//       gradient: "from-gray-50 to-gray-100/50",
//       iconBg: "bg-gray-100",
//       iconColor: "text-gray-600",
//       darkGradient: "dark:from-gray-900/20 dark:to-gray-800/10",
//       darkIconBg: "dark:bg-gray-800/30",
//       border: "border-gray-200/50",
//       darkBorder: "dark:border-gray-800/50",
//     },
//     spend: {
//       gradient: "from-emerald-50 to-emerald-100/50",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//       darkGradient: "dark:from-emerald-900/20 dark:to-emerald-800/10",
//       darkIconBg: "dark:bg-emerald-800/30",
//       border: "border-emerald-200/50",
//       darkBorder: "dark:border-emerald-800/50",
//     },
//     impressions: {
//       gradient: "from-blue-50 to-blue-100/50",
//       iconBg: "bg-blue-100",
//       iconColor: "text-blue-600",
//       darkGradient: "dark:from-blue-900/20 dark:to-blue-800/10",
//       darkIconBg: "dark:bg-blue-800/30",
//       border: "border-blue-200/50",
//       darkBorder: "dark:border-blue-800/50",
//     },
//     clicks: {
//       gradient: "from-indigo-50 to-indigo-100/50",
//       iconBg: "bg-indigo-100",
//       iconColor: "text-indigo-600",
//       darkGradient: "dark:from-indigo-900/20 dark:to-indigo-800/10",
//       darkIconBg: "dark:bg-indigo-800/30",
//       border: "border-indigo-200/50",
//       darkBorder: "dark:border-indigo-800/50",
//     },
//     ctr: {
//       gradient: "from-purple-50 to-purple-100/50",
//       iconBg: "bg-purple-100",
//       iconColor: "text-purple-600",
//       darkGradient: "dark:from-purple-900/20 dark:to-purple-800/10",
//       darkIconBg: "dark:bg-purple-800/30",
//       border: "border-purple-200/50",
//       darkBorder: "dark:border-purple-800/50",
//     },
//     cpc: {
//       gradient: "from-amber-50 to-amber-100/50",
//       iconBg: "bg-amber-100",
//       iconColor: "text-amber-600",
//       darkGradient: "dark:from-amber-900/20 dark:to-amber-800/10",
//       darkIconBg: "dark:bg-amber-800/30",
//       border: "border-amber-200/50",
//       darkBorder: "dark:border-amber-800/50",
//     },
//     cpm: {
//       gradient: "from-rose-50 to-rose-100/50",
//       iconBg: "bg-rose-100",
//       iconColor: "text-rose-600",
//       darkGradient: "dark:from-rose-900/20 dark:to-rose-800/10",
//       darkIconBg: "dark:bg-rose-800/30",
//       border: "border-rose-200/50",
//       darkBorder: "dark:border-rose-800/50",
//     },
//     reach: {
//       gradient: "from-teal-50 to-teal-100/50",
//       iconBg: "bg-teal-100",
//       iconColor: "text-teal-600",
//       darkGradient: "dark:from-teal-900/20 dark:to-teal-800/10",
//       darkIconBg: "dark:bg-teal-800/30",
//       border: "border-teal-200/50",
//       darkBorder: "dark:border-teal-800/50",
//     },
//     frequency: {
//       gradient: "from-cyan-50 to-cyan-100/50",
//       iconBg: "bg-cyan-100",
//       iconColor: "text-cyan-600",
//       darkGradient: "dark:from-cyan-900/20 dark:to-cyan-800/10",
//       darkIconBg: "dark:bg-cyan-800/30",
//       border: "border-cyan-200/50",
//       darkBorder: "dark:border-cyan-800/50",
//     },
//   }

//   const styles = variantStyles[variant]

//   // Format tooltip value based on metric type
//   const formatTooltipValue = (value: number) => {
//     switch(variant) {
//       case 'spend':
//       case 'cpc':
//       case 'cpm':
//         return `$${value.toFixed(2)}`;
//       case 'ctr':
//         return `${value.toFixed(2)}%`;
//       case 'frequency':
//         return value.toFixed(2);
//       default:
//         return value.toLocaleString();
//     }
//   };

//   return (
//     <Card
//       className={cn(
//         "group relative overflow-hidden font-sans",
//         "bg-gradient-to-br",
//         styles.gradient,
//         styles.darkGradient,
//         "border",
//         styles.border,
//         styles.darkBorder,
//         "transition-all duration-300 ease-in-out",
//         "hover:shadow-lg hover:scale-[1.02]",
//         "backdrop-blur-lg",
//         className,
//       )}
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <div className="flex items-center gap-2">
//           {icon && (
//             <div
//               className={cn(
//                 "flex items-center justify-center",
//                 styles.iconBg,
//                 styles.iconColor,
//                 "w-8 h-8 rounded-lg",
//                 "transition-transform duration-300 group-hover:scale-110",
//                 "p-1.5",
//                 styles.darkIconBg,
//               )}
//             >
//               {icon}
//             </div>
//           )}
//           <CardTitle className={cn("text-sm font-display font-medium tracking-wide", "transition-colors duration-200")}>
//             {title}
//           </CardTitle>
//         </div>

//         {trend && !isLoading && (
//           <div
//             className={cn(
//               "flex items-center gap-1 px-2 py-1 rounded-full",
//               "text-xs font-body font-medium",
//               trend.isPositive
//                 ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
//                 : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
//               "transition-colors duration-200",
//             )}
//           >
//             {trend.isPositive ? (
//               <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
//             ) : (
//               <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
//             )}
//             <span className="font-display">{trend.value}%</span>
//             {trend.timeFrame && (
//               <span className="text-xs font-body opacity-75 ml-1 hidden sm:inline">vs {trend.timeFrame}</span>
//             )}
//           </div>
//         )}
//       </CardHeader>

//       <CardContent>
//         <div className="flex flex-col gap-2">
//           {isLoading ? (
//             <div className="space-y-2">
//               <Skeleton className="h-8 w-24" />
//               <Skeleton className="h-4 w-32" />
//               <Skeleton className="h-10 w-full mt-2" />
//             </div>
//           ) : (
//             <>
//               <div className={cn("text-3xl font-display font-bold tracking-tight", "transition-colors duration-200")}>
//                 {value}
//               </div>

//               {description && (
//                 <p className={cn("text-sm font-body text-muted-foreground", "leading-relaxed")}>{description}</p>
//               )}
              
//               {/* Chart container with Recharts - only render if chartData has entries */}
//               {chartData.length > 0 && (
//                 <div className="mt-4 h-12 w-full">
//                   <ResponsiveContainer width="100%" height={50}>
//                     <AreaChart
//                       data={chartData}
//                       margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
//                     >
//                       {/* Custom tooltip that only shows value */}
//                       <Tooltip 
//                         content={({ active, payload }) => {
//                           if (active && payload && payload.length) {
//                             const value = payload[0].value as number;
//                             return (
//                               <div className={`custom-tooltip bg-${colors.tooltipBg} px-2 py-1 rounded-md shadow-md text-xs border border-${colors.tooltipBorder}`}>
//                                 <p className={`font-medium text-${colors.tooltipText}`}>{formatTooltipValue(value)}</p>
//                               </div>
//                             );
//                           }
//                           return null;
//                         }}
//                         cursor={{ stroke: colors.line, strokeWidth: 1, strokeDasharray: '3 3' }}
//                       />
                      
//                       <defs>
//                         <linearGradient id={`gradient-${variant}`} x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="0%" stopColor={colors.area} stopOpacity={0.5} />
//                           <stop offset="100%" stopColor={colors.area} stopOpacity={0.1} />
//                         </linearGradient>
//                       </defs>
//                       <Area
//                         type="monotone"
//                         dataKey="value"
//                         stroke={colors.line}
//                         strokeWidth={2}
//                         fill={`url(#gradient-${variant})`}
//                         dot={false}
//                         activeDot={{ r: 4, stroke: '#fff', strokeWidth: 1, fill: colors.dot }}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="value"
//                         stroke={colors.line}
//                         strokeWidth={2}
//                         dot={(props) => {
//                           // Only show dots for first and last points
//                           const { cx, cy, index } = props;
//                           const isFirstOrLast = index === 0 || index === chartData.length - 1;
                          
//                           if (!isFirstOrLast) return null;
                          
//                           const dotSize = index === chartData.length - 1 ? 4 : 3;
//                           const strokeWidth = index === chartData.length - 1 ? 1.5 : 1;
                          
//                           return (
//                             <circle
//                               cx={cx}
//                               cy={cy}
//                               r={dotSize}
//                               fill={colors.dot}
//                               stroke="#fff"
//                               strokeWidth={strokeWidth}
//                             />
//                           );
//                         }}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Helper function to get chart colors based on variant and trend
// function getChartColors(variant: MetricVariant, isPositive?: boolean) {
//   const colorMap = {
//     default: { 
//       area: "#9ca3af", 
//       line: "#6b7280", 
//       dot: "#4b5563",
//       tooltipBg: "white",
//       tooltipText: "gray-700",
//       tooltipBorder: "gray-200"
//     },
//     spend: { 
//       area: "#10b981", 
//       line: "#059669", 
//       dot: "#047857",
//       tooltipBg: "white",
//       tooltipText: "emerald-700",
//       tooltipBorder: "emerald-200"
//     },
//     impressions: { 
//       area: "#3b82f6", 
//       line: "#2563eb", 
//       dot: "#1d4ed8",
//       tooltipBg: "white",
//       tooltipText: "blue-700",
//       tooltipBorder: "blue-200"
//     },
//     clicks: { 
//       area: "#6366f1", 
//       line: "#4f46e5", 
//       dot: "#4338ca",
//       tooltipBg: "white",
//       tooltipText: "indigo-700",
//       tooltipBorder: "indigo-200"
//     },
//     ctr: { 
//       area: "#a855f7", 
//       line: "#9333ea", 
//       dot: "#7e22ce",
//       tooltipBg: "white",
//       tooltipText: "purple-700",
//       tooltipBorder: "purple-200"
//     },
//     cpc: { 
//       area: "#f59e0b", 
//       line: "#d97706", 
//       dot: "#b45309",
//       tooltipBg: "white",
//       tooltipText: "amber-700",
//       tooltipBorder: "amber-200"
//     },
//     cpm: { 
//       area: "#f43f5e", 
//       line: "#e11d48", 
//       dot: "#be123c",
//       tooltipBg: "white",
//       tooltipText: "rose-700",
//       tooltipBorder: "rose-200"
//     },
//     reach: { 
//       area: "#14b8a6", 
//       line: "#0d9488", 
//       dot: "#0f766e",
//       tooltipBg: "white",
//       tooltipText: "teal-700",
//       tooltipBorder: "teal-200"
//     },
//     frequency: { 
//       area: "#06b6d4", 
//       line: "#0891b2", 
//       dot: "#0e7490",
//       tooltipBg: "white",
//       tooltipText: "cyan-700",
//       tooltipBorder: "cyan-200"
//     },
//   }

//   // For cost metrics (CPC and CPM), we invert the colors when positive (lower is better)
//   if ((variant === 'cpc' || variant === 'cpm') && isPositive !== undefined) {
//     return colorMap[variant]
//   }

//   return colorMap[variant]
// }





// without campaign card chart :
// import { useEffect, useRef } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { cn } from "@/lib/utils"
// import { Skeleton } from "@/components/ui/skeleton"
// import { TrendingUp, TrendingDown } from "lucide-react"
// import { 
//   Line, LineChart, ResponsiveContainer, Area, AreaChart, Tooltip
// } from "recharts";

// type MetricVariant = "default" | "spend" | "impressions" | "clicks" | "ctr" | "cpc" | "cpm" | "reach" | "frequency"

// interface MetricCardProps {
//   title: string
//   value: string | number
//   description?: string
//   className?: string
//   icon?: React.ReactNode
//   isLoading?: boolean
//   trend?: {
//     value: number
//     isPositive: boolean
//     timeFrame?: string
//   }
//   variant?: MetricVariant
//   // Prop for chart data
//   chartData?: { date: string; value: number }[]
//   // New prop to control chart visibility
//   showChart?: boolean
// }

// export function MetricCard({
//   title,
//   value,
//   description,
//   className,
//   icon,
//   isLoading = false,
//   trend,
//   variant = "default",
//   chartData = [],
//   showChart = true, // Default to showing charts
// }: MetricCardProps) {
//   // Get colors based on variant
//   const colors = getChartColors(variant, trend?.isPositive)
  
//   // Color configurations for different variants
//   const variantStyles: Record<
//     MetricVariant,
//     {
//       gradient: string
//       iconBg: string
//       iconColor: string
//       darkGradient: string
//       darkIconBg: string
//       border: string
//       darkBorder: string
//     }
//   > = {
//     default: {
//       gradient: "from-gray-50 to-gray-100/50",
//       iconBg: "bg-gray-100",
//       iconColor: "text-gray-600",
//       darkGradient: "dark:from-gray-900/20 dark:to-gray-800/10",
//       darkIconBg: "dark:bg-gray-800/30",
//       border: "border-gray-200/50",
//       darkBorder: "dark:border-gray-800/50",
//     },
//     spend: {
//       gradient: "from-emerald-50 to-emerald-100/50",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//       darkGradient: "dark:from-emerald-900/20 dark:to-emerald-800/10",
//       darkIconBg: "dark:bg-emerald-800/30",
//       border: "border-emerald-200/50",
//       darkBorder: "dark:border-emerald-800/50",
//     },
//     impressions: {
//       gradient: "from-blue-50 to-blue-100/50",
//       iconBg: "bg-blue-100",
//       iconColor: "text-blue-600",
//       darkGradient: "dark:from-blue-900/20 dark:to-blue-800/10",
//       darkIconBg: "dark:bg-blue-800/30",
//       border: "border-blue-200/50",
//       darkBorder: "dark:border-blue-800/50",
//     },
//     clicks: {
//       gradient: "from-indigo-50 to-indigo-100/50",
//       iconBg: "bg-indigo-100",
//       iconColor: "text-indigo-600",
//       darkGradient: "dark:from-indigo-900/20 dark:to-indigo-800/10",
//       darkIconBg: "dark:bg-indigo-800/30",
//       border: "border-indigo-200/50",
//       darkBorder: "dark:border-indigo-800/50",
//     },
//     ctr: {
//       gradient: "from-purple-50 to-purple-100/50",
//       iconBg: "bg-purple-100",
//       iconColor: "text-purple-600",
//       darkGradient: "dark:from-purple-900/20 dark:to-purple-800/10",
//       darkIconBg: "dark:bg-purple-800/30",
//       border: "border-purple-200/50",
//       darkBorder: "dark:border-purple-800/50",
//     },
//     cpc: {
//       gradient: "from-amber-50 to-amber-100/50",
//       iconBg: "bg-amber-100",
//       iconColor: "text-amber-600",
//       darkGradient: "dark:from-amber-900/20 dark:to-amber-800/10",
//       darkIconBg: "dark:bg-amber-800/30",
//       border: "border-amber-200/50",
//       darkBorder: "dark:border-amber-800/50",
//     },
//     cpm: {
//       gradient: "from-rose-50 to-rose-100/50",
//       iconBg: "bg-rose-100",
//       iconColor: "text-rose-600",
//       darkGradient: "dark:from-rose-900/20 dark:to-rose-800/10",
//       darkIconBg: "dark:bg-rose-800/30",
//       border: "border-rose-200/50",
//       darkBorder: "dark:border-rose-800/50",
//     },
//     reach: {
//       gradient: "from-teal-50 to-teal-100/50",
//       iconBg: "bg-teal-100",
//       iconColor: "text-teal-600",
//       darkGradient: "dark:from-teal-900/20 dark:to-teal-800/10",
//       darkIconBg: "dark:bg-teal-800/30",
//       border: "border-teal-200/50",
//       darkBorder: "dark:border-teal-800/50",
//     },
//     frequency: {
//       gradient: "from-cyan-50 to-cyan-100/50",
//       iconBg: "bg-cyan-100",
//       iconColor: "text-cyan-600",
//       darkGradient: "dark:from-cyan-900/20 dark:to-cyan-800/10",
//       darkIconBg: "dark:bg-cyan-800/30",
//       border: "border-cyan-200/50",
//       darkBorder: "dark:border-cyan-800/50",
//     },
//   }

//   const styles = variantStyles[variant]

//   // Format tooltip value based on metric type
//   const formatTooltipValue = (value: number) => {
//     switch(variant) {
//       case 'spend':
//       case 'cpc':
//       case 'cpm':
//         return `$${value.toFixed(2)}`;
//       case 'ctr':
//         return `${value.toFixed(2)}%`;
//       case 'frequency':
//         return value.toFixed(2);
//       default:
//         return value.toLocaleString();
//     }
//   };

//   // DEBUG: Log chart data to verify it's coming from API
//   useEffect(() => {
//     if (chartData && chartData.length > 0) {
//       console.log(`Chart data for ${title}:`, chartData);
//     }
//   }, [chartData, title]);

//   return (
//     <Card
//       className={cn(
//         "group relative overflow-hidden font-sans",
//         "bg-gradient-to-br",
//         styles.gradient,
//         styles.darkGradient,
//         "border",
//         styles.border,
//         styles.darkBorder,
//         "transition-all duration-300 ease-in-out",
//         "hover:shadow-lg hover:scale-[1.02]",
//         "backdrop-blur-lg",
//         className,
//       )}
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <div className="flex items-center gap-2">
//           {icon && (
//             <div
//               className={cn(
//                 "flex items-center justify-center",
//                 styles.iconBg,
//                 styles.iconColor,
//                 "w-8 h-8 rounded-lg",
//                 "transition-transform duration-300 group-hover:scale-110",
//                 "p-1.5",
//                 styles.darkIconBg,
//               )}
//             >
//               {icon}
//             </div>
//           )}
//           <CardTitle className={cn("text-sm font-display font-medium tracking-wide", "transition-colors duration-200")}>
//             {title}
//           </CardTitle>
//         </div>

//         {trend && !isLoading && (
//           <div
//             className={cn(
//               "flex items-center gap-1 px-2 py-1 rounded-full",
//               "text-xs font-body font-medium",
//               trend.isPositive
//                 ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
//                 : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
//               "transition-colors duration-200",
//             )}
//           >
//             {trend.isPositive ? (
//               <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
//             ) : (
//               <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
//             )}
//             <span className="font-display">{trend.value}%</span>
//             {trend.timeFrame && (
//               <span className="text-xs font-body opacity-75 ml-1 hidden sm:inline">vs {trend.timeFrame}</span>
//             )}
//           </div>
//         )}
//       </CardHeader>

//       <CardContent>
//         <div className="flex flex-col gap-2">
//           {isLoading ? (
//             <div className="space-y-2">
//               <Skeleton className="h-8 w-24" />
//               <Skeleton className="h-4 w-32" />
//               <Skeleton className="h-10 w-full mt-2" />
//             </div>
//           ) : (
//             <>
//               <div className={cn("text-3xl font-display font-bold tracking-tight", "transition-colors duration-200")}>
//                 {value}
//               </div>

//               {description && (
//                 <p className={cn("text-sm font-body text-muted-foreground", "leading-relaxed")}>{description}</p>
//               )}
              
//               {/* Chart container with Recharts - only render if showChart is true and chartData has entries */}
//               {showChart && chartData.length > 0 && (
//                 <div className="mt-4 h-12 w-full">
//                   <ResponsiveContainer width="100%" height={50}>
//                     <AreaChart
//                       data={chartData}
//                       margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
//                     >
//                       {/* Custom tooltip that only shows value */}
//                       <Tooltip 
//                         content={({ active, payload }) => {
//                           if (active && payload && payload.length) {
//                             const value = payload[0].value as number;
//                             return (
//                               <div className="custom-tooltip bg-white px-2 py-1 rounded-md shadow-md text-xs border border-gray-200">
//                                 <p className="font-medium text-gray-700">{formatTooltipValue(value)}</p>
//                               </div>
//                             );
//                           }
//                           return null;
//                         }}
//                         cursor={{ stroke: colors.line, strokeWidth: 1, strokeDasharray: '3 3' }}
//                       />
                      
//                       <defs>
//                         <linearGradient id={`gradient-${variant}`} x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="0%" stopColor={colors.area} stopOpacity={0.5} />
//                           <stop offset="100%" stopColor={colors.area} stopOpacity={0.1} />
//                         </linearGradient>
//                       </defs>
//                       <Area
//                         type="monotone"
//                         dataKey="value"
//                         stroke={colors.line}
//                         strokeWidth={2}
//                         fill={`url(#gradient-${variant})`}
//                         dot={false}
//                         activeDot={{ r: 4, stroke: '#fff', strokeWidth: 1, fill: colors.dot }}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="value"
//                         stroke={colors.line}
//                         strokeWidth={2}
//                         dot={(props) => {
//                           // Only show dots for first and last points
//                           const { cx, cy, index } = props;
//                           const isFirstOrLast = index === 0 || index === chartData.length - 1;
                          
//                           if (!isFirstOrLast) return null;
                          
//                           const dotSize = index === chartData.length - 1 ? 4 : 3;
//                           const strokeWidth = index === chartData.length - 1 ? 1.5 : 1;
                          
//                           return (
//                             <circle
//                               cx={cx}
//                               cy={cy}
//                               r={dotSize}
//                               fill={colors.dot}
//                               stroke="#fff"
//                               strokeWidth={strokeWidth}
//                             />
//                           );
//                         }}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Helper function to get chart colors based on variant and trend
// function getChartColors(variant: MetricVariant, isPositive?: boolean) {
//   const colorMap = {
//     default: { 
//       area: "#9ca3af", 
//       line: "#6b7280", 
//       dot: "#4b5563",
//     },
//     spend: { 
//       area: "#10b981", 
//       line: "#059669", 
//       dot: "#047857",
//     },
//     impressions: { 
//       area: "#3b82f6", 
//       line: "#2563eb", 
//       dot: "#1d4ed8",
//     },
//     clicks: { 
//       area: "#6366f1", 
//       line: "#4f46e5", 
//       dot: "#4338ca",
//     },
//     ctr: { 
//       area: "#a855f7", 
//       line: "#9333ea", 
//       dot: "#7e22ce",
//     },
//     cpc: { 
//       area: "#f59e0b", 
//       line: "#d97706", 
//       dot: "#b45309",
//     },
//     cpm: { 
//       area: "#f43f5e", 
//       line: "#e11d48", 
//       dot: "#be123c",
//     },
//     reach: { 
//       area: "#14b8a6", 
//       line: "#0d9488", 
//       dot: "#0f766e",
//     },
//     frequency: { 
//       area: "#06b6d4", 
//       line: "#0891b2", 
//       dot: "#0e7490",
//     },
//   }

//   // For cost metrics (CPC and CPM), we invert the colors when positive (lower is better)
//   if ((variant === 'cpc' || variant === 'cpm') && isPositive !== undefined) {
//     return colorMap[variant]
//   }

//   return colorMap[variant]
// }