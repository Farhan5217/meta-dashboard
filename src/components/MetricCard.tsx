import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
    timeFrame?: string;
  };
}

export function MetricCard({
  title,
  value,
  description,
  className,
  icon,
  isLoading = false,
  trend
}: MetricCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden ",
      "bg-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
      "border border-gray-200 dark:border-gray-700",
      "transition-all duration-300 ease-in-out",
      "hover:shadow-lg hover:scale-[1.02]",
      "dark:bg-opacity-80 backdrop-blur-lg",
      className
    )}>
      {/* Decorative gradient blob */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn(
              "flex items-center justify-center",
              "text-primary w-8 h-8",
              "rounded-lg bg-primary/10",
              "transition-transform duration-300 group-hover:scale-110",
              "p-1.5"
            )}>
              {icon}
            </div>
          )}
          <CardTitle className="text-sm font-medium tracking-wide">
            {title}
          </CardTitle>
        </div>
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
              <div className="text-3xl font-bold tracking-tight">
                {value}
              </div>
              
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}

              {trend && (
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    trend.isPositive 
                      ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                      : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
                    "transition-colors duration-200"
                  )}>
                    <span className="text-lg">
                      {trend.isPositive ? "↑" : "↓"}
                    </span>
                    {trend.value}%
                    {trend.timeFrame && (
                      <span className="text-xs opacity-75 ml-1">
                        vs {trend.timeFrame}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}