
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { AdAccountSelector } from "@/components/AdAccountSelector";
import { toast } from "sonner";
import type { DateRange } from "@/types/api";

interface DashboardHeaderProps {
  selectedAccount?: string;
  dateRange?: DateRange;
  onAccountSelect: (id: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  statusFilter?: number;
}

export function DashboardHeader({
  selectedAccount,
  dateRange,
  onAccountSelect,
  onDateRangeChange,
  statusFilter,
}: DashboardHeaderProps) {
  return (
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
                onAccountSelect(id);
                toast.success("Ad Account selected successfully");
              }}
              selectedAccount={selectedAccount}
              statusFilter={statusFilter}
            />
            <DateRangeFilter 
              date={dateRange} 
              onRangeChange={onDateRangeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
