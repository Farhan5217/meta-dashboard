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


// import { useEffect, useRef } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { cn } from "@/lib/utils"
// import { Skeleton } from "@/components/ui/skeleton"
// import { TrendingUp, TrendingDown } from "lucide-react"
// import * as d3 from "d3"

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
//   // New prop for chart data
//   chartData?: { date: string; value: number }[]
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
//   chartData = generateDummyData(variant), // Default to dummy data if none provided
// }: MetricCardProps) {
//   const chartRef = useRef<HTMLDivElement>(null)

//   // Generate chart when component mounts or when data changes
//   useEffect(() => {
//     if (chartRef.current && !isLoading && chartData) {
//       // Slight delay to ensure DOM is ready
//       setTimeout(() => createChart(), 50)
//     }
    
//     // Cleanup function to remove chart when component unmounts
//     return () => {
//       if (chartRef.current) {
//         d3.select(chartRef.current).selectAll("*").remove()
//       }
//     }
//   }, [chartRef, chartData, isLoading, variant])

//   // Function to create the chart using D3
//   const createChart = () => {
//     if (!chartRef.current) return
    
//     try {
//       // Clear previous chart
//       d3.select(chartRef.current).selectAll("*").remove()

//       // Get dimensions
//       const width = chartRef.current.clientWidth
//       const height = 50 // Increase height for better visualization
//       const margin = { top: 5, right: 10, bottom: 5, left: 10 }
//       const chartWidth = width - margin.left - margin.right
//       const chartHeight = height - margin.top - margin.bottom

//       // Check if we have enough data
//       if (chartData.length < 2) {
//         console.warn("Not enough data points for chart")
//         return
//       }

//       // Create SVG
//       const svg = d3
//         .select(chartRef.current)
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height)
//         .attr("class", "overflow-visible")
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`)

//       // Set up scales
//       const xScale = d3
//         .scaleTime()
//         .domain(d3.extent(chartData, d => new Date(d.date)) as [Date, Date])
//         .range([0, chartWidth])

//       // Get min and max values with padding
//       const minValue = d3.min(chartData, d => d.value) || 0
//       const maxValue = d3.max(chartData, d => d.value) || 0
//       const valuePadding = (maxValue - minValue) * 0.2
      
//       const yScale = d3
//         .scaleLinear()
//         .domain([Math.max(0, minValue - valuePadding), maxValue + valuePadding])
//         .range([chartHeight, 0])

//       // Get colors
//       const colors = getChartColors(variant, trend?.isPositive)

//       // Create gradient for area
//       const gradient = svg
//         .append("defs")
//         .append("linearGradient")
//         .attr("id", `gradient-${variant}-${Math.random().toString(36).substring(2, 9)}`) // Unique ID
//         .attr("x1", "0%")
//         .attr("y1", "0%")
//         .attr("x2", "0%")
//         .attr("y2", "100%")
      
//       gradient
//         .append("stop")
//         .attr("offset", "0%")
//         .attr("stop-color", colors.area)
//         .attr("stop-opacity", 0.5)
      
//       gradient
//         .append("stop")
//         .attr("offset", "100%")
//         .attr("stop-color", colors.area)
//         .attr("stop-opacity", 0.1)

//       // Add subtle grid
//       svg
//         .append("line")
//         .attr("x1", 0)
//         .attr("y1", chartHeight / 2)
//         .attr("x2", chartWidth)
//         .attr("y2", chartHeight / 2)
//         .attr("stroke", colors.line)
//         .attr("stroke-opacity", 0.1)
//         .attr("stroke-dasharray", "2,2")

//       // Create the area generator
//       const area = d3
//         .area<{ date: string; value: number }>()
//         .x(d => xScale(new Date(d.date)))
//         .y0(chartHeight)
//         .y1(d => yScale(d.value))
//         .curve(d3.curveCardinal.tension(0.3)) // Smoother curve

//       // Create the line generator
//       const line = d3
//         .line<{ date: string; value: number }>()
//         .x(d => xScale(new Date(d.date)))
//         .y(d => yScale(d.value))
//         .curve(d3.curveCardinal.tension(0.3)) // Smoother curve

//       // Add area
//       svg
//         .append("path")
//         .datum(chartData)
//         .attr("fill", `url(#${gradient.attr("id")})`)
//         .attr("d", area)

//       // Add line
//       svg
//         .append("path")
//         .datum(chartData)
//         .attr("fill", "none")
//         .attr("stroke", colors.line)
//         .attr("stroke-width", 2)
//         .attr("stroke-linecap", "round")
//         .attr("stroke-linejoin", "round")
//         .attr("d", line)

//       // Add starting and ending dots for the line
//       svg
//         .append("circle")
//         .attr("cx", xScale(new Date(chartData[0].date)))
//         .attr("cy", yScale(chartData[0].value))
//         .attr("r", 3)
//         .attr("fill", colors.dot)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 1)

//       // Add ending dot with animation
//       const lastDot = svg
//         .append("circle")
//         .attr("cx", xScale(new Date(chartData[chartData.length - 1].date)))
//         .attr("cy", yScale(chartData[chartData.length - 1].value))
//         .attr("r", 4)
//         .attr("fill", colors.dot)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 1.5)

//       // Pulse animation for the last dot
//       lastDot
//         .append("animate")
//         .attr("attributeName", "r")
//         .attr("values", "4;5;4")
//         .attr("dur", "2s")
//         .attr("repeatCount", "indefinite")

//       // Add subtle hover effect for the chart area
//       svg
//         .append("rect")
//         .attr("width", chartWidth)
//         .attr("height", chartHeight)
//         .attr("fill", "transparent")
//         .on("mouseover", function() {
//           d3.select(this.parentNode as any)
//             .select("path[stroke]")
//             .attr("stroke-width", 2.5)
          
//           lastDot
//             .attr("r", 5)
//             .attr("stroke-width", 2)
//         })
//         .on("mouseout", function() {
//           d3.select(this.parentNode as any)
//             .select("path[stroke]")
//             .attr("stroke-width", 2)
          
//           lastDot
//             .attr("r", 4)
//             .attr("stroke-width", 1.5)
//         })
        
//     } catch (error) {
//       console.error("Error creating chart:", error)
//     }
//   }

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
              
//               {/* Chart container - increased height */}
//               <div className="mt-4 h-12 w-full" ref={chartRef}></div>
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
//     default: { area: "#9ca3af", line: "#6b7280", dot: "#4b5563" },
//     spend: { area: "#10b981", line: "#059669", dot: "#047857" },
//     impressions: { area: "#3b82f6", line: "#2563eb", dot: "#1d4ed8" },
//     clicks: { area: "#6366f1", line: "#4f46e5", dot: "#4338ca" },
//     ctr: { area: "#a855f7", line: "#9333ea", dot: "#7e22ce" },
//     cpc: { area: "#f59e0b", line: "#d97706", dot: "#b45309" },
//     cpm: { area: "#f43f5e", line: "#e11d48", dot: "#be123c" },
//     reach: { area: "#14b8a6", line: "#0d9488", dot: "#0f766e" },
//     frequency: { area: "#06b6d4", line: "#0891b2", dot: "#0e7490" },
//   }

//   // For cost metrics (CPC and CPM), we invert the colors when positive (lower is better)
//   if ((variant === 'cpc' || variant === 'cpm') && isPositive !== undefined) {
//     return colorMap[variant]
//   }

//   return colorMap[variant]
// }

// // Generate dummy data for the chart if none provided - with better trends
// function generateDummyData(variant: MetricVariant) {
//   const data = []
//   const now = new Date()
  
//   // Generate 14 days of data with more realistic patterns
//   for (let i = 13; i >= 0; i--) {
//     const date = new Date(now)
//     date.setDate(date.getDate() - i)
    
//     // Create different patterns based on metric type
//     let baseValue, trend, randomFactor
    
//     switch (variant) {
//       case 'spend':
//         // Gradual increase
//         baseValue = 100 + (13 - i) * 5
//         randomFactor = Math.random() * 10 - 5
//         break
//       case 'impressions':
//         // Sawtooth pattern
//         baseValue = 100 + Math.sin((13 - i) * 0.5) * 50
//         randomFactor = Math.random() * 15 - 7.5
//         break
//       case 'clicks':
//         // Step function
//         baseValue = i < 7 ? 80 : 120
//         randomFactor = Math.random() * 20 - 10
//         break
//       case 'ctr':
//         // Flat with spike
//         baseValue = i === 3 ? 150 : 100
//         randomFactor = Math.random() * 5 - 2.5
//         break
//       case 'cpc':
//       case 'cpm':
//         // Decreasing (good)
//         baseValue = 140 - (13 - i) * 3
//         randomFactor = Math.random() * 8 - 4
//         break
//       default:
//         // Slight upward trend
//         baseValue = 90 + (13 - i) * 2
//         randomFactor = Math.random() * 12 - 6
//     }
    
//     // Ensure values are positive
//     const value = Math.max(1, baseValue + randomFactor)
    
//     data.push({
//       date: date.toISOString().split('T')[0],
//       value
//     })
//   }
  
//   return data
// }