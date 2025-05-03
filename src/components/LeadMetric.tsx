import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeadMetricProps {
  leadCount: number
  previousLeadCount?: number
  isLoading?: boolean
  className?: string
}

// export function LeadMetric({
//   leadCount,
//   previousLeadCount,
//   isLoading = false,
//   className,
// }: LeadMetricProps) {
//   // Calculate percentage change if both current and previous are available
//   const percentChange = previousLeadCount && previousLeadCount > 0
//     ? ((leadCount - previousLeadCount) / previousLeadCount) * 100
//     : null;
  
//   const isPositive = percentChange ? percentChange >= 0 : true;

//   return (
//     <Card
//       className={cn(
//         "group relative overflow-hidden font-sans",
//         "bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-800/10",
//         "border border-violet-200/50 dark:border-violet-800/50",
//         "transition-all duration-300 ease-in-out",
//         "hover:shadow-lg hover:scale-[1.02]",
//         "backdrop-blur-lg",
//         className
//       )}
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <div className="bg-violet-100 text-violet-600 dark:bg-violet-800/30 w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
//               <UserPlus className="h-6 w-6" />
//             </div>
//             <h3 className="text-lg font-display font-medium tracking-wide">Total Leads</h3>
//           </div>
          
//           {percentChange !== null && (
//             <div
//               className={cn(
//                 "flex items-center gap-1 px-3 py-1.5 rounded-full",
//                 "text-sm font-medium",
//                 isPositive
//                   ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
//                   : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
//                 "transition-colors duration-200"
//               )}
//             >
//               {isPositive ? (
//                 <TrendingUp className="h-4 w-4 mr-1" />
//               ) : (
//                 <TrendingDown className="h-4 w-4 mr-1" />
//               )}
//               <span>{Math.abs(Math.round(percentChange))}%</span>
//             </div>
//           )}
//         </div>
        
//         <div className="mt-2">
//           <div className="text-4xl font-display font-bold tracking-tight text-violet-900 dark:text-violet-100">
//             {isLoading ? (
//               <div className="h-10 w-20 bg-violet-200/50 dark:bg-violet-800/30 animate-pulse rounded"></div>
//             ) : (
//               leadCount
//             )}
//           </div>
          
//           <p className="text-sm text-violet-600 dark:text-violet-300 mt-2">
//             {isLoading ? (
//               <div className="h-4 w-32 bg-violet-200/50 dark:bg-violet-800/30 animate-pulse rounded"></div>
//             ) : (
//               "Total leads generated in the date range"
//             )}
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

export function LeadMetric({ leadCount, previousLeadCount, isLoading = false, className }: LeadMetricProps) {
    const percentChange =
      previousLeadCount && previousLeadCount > 0 ? ((leadCount - previousLeadCount) / previousLeadCount) * 100 : null
  
    const isPositive = percentChange ? percentChange >= 0 : true
  
    return (
      <div className={cn("flex items-center space-x-4", className)}>
        <div className="bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400 p-3 rounded-full">
          <UserPlus className="h-5 w-5" />
        </div>
  
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-slate-800 dark:text-slate-200">Total Leads:</h3>
            <span className="ml-2 text-lg font-medium ">
              {isLoading ? (
                <div className="h-6 w-12  animate-pulse rounded ml-1"></div>
              ) : (
                leadCount
              )}
            </span>
  
            {percentChange !== null && (
              <div
                className={cn(
                  "flex items-center ml-3 px-2 py-1 rounded-md text-xs font-medium",
                  isPositive
                    ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
                    : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
                )}
              >
                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                <span>{Math.abs(Math.round(percentChange))}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }