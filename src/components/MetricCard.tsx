
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { cn } from "@/lib/utils";
// import { Skeleton } from "@/components/ui/skeleton";

// interface MetricCardProps {
//   title: string;
//   value: string | number;
//   description?: string;
//   className?: string;
//   icon?: React.ReactNode;
//   isLoading?: boolean;
//   trend?: {
//     value: number;
//     isPositive: boolean;
//   };
// }

// export function MetricCard({ 
//   title, 
//   value, 
//   description, 
//   className, 
//   icon,
//   isLoading = false,
//   trend 
// }: MetricCardProps) {
//   return (
//     <Card className={cn(
//       "overflow-hidden transition-all duration-200 hover:shadow-lg border-none",
//       "relative backdrop-blur-sm bg-opacity-50",
//       className
//     )}>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         {icon && <div className="text-primary h-4 w-4">{icon}</div>}
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col gap-1">
//           {isLoading ? (
//             <Skeleton className="h-8 w-24" />
//           ) : (
//             <div className="text-2xl font-bold">{value}</div>
//           )}
//           {description && (
//             <p className="text-xs text-muted-foreground">{description}</p>
//           )}
//           {trend && (
//             <div className={cn(
//               "text-xs font-medium flex items-center gap-1",
//               trend.isPositive ? "text-green-500" : "text-red-500"
//             )}>
//               {trend.isPositive ? "↑" : "↓"}
//               {trend.value}%
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { cva, type VariantProps } from "class-variance-authority"
import type React from "react" // Import React

const metricCardVariants = cva(
  "overflow-hidden transition-all duration-200 hover:shadow-lg border-none relative backdrop-blur-sm bg-opacity-50",
  {
    variants: {
      variant: {
        default: "bg-card",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface MetricCardProps extends VariantProps<typeof metricCardVariants> {
  title: string
  value: string | number
  description?: string
  className?: string
  icon?: React.ReactNode
  isLoading?: boolean
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function MetricCard({
  title,
  value,
  description,
  className,
  icon,
  isLoading = false,
  trend,
  variant,
}: MetricCardProps) {
  return (
    <Card className={cn(metricCardVariants({ variant }), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-primary h-5 w-5 opacity-80">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <Skeleton className="h-9 w-28" />
          ) : (
            <div className="text-3xl font-bold tracking-tight">{value}</div>
          )}
          {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
          {trend && (
            <div
              className={cn(
                "text-xs font-semibold flex items-center gap-1 rounded-full px-2 py-0.5 w-fit",
                trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
              )}
            >
              {trend.isPositive ? "↑" : "↓"}
              {trend.value}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

