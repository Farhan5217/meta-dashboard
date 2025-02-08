
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateRangeFilterProps {
  onRangeChange: (range: string) => void;
}

export function DateRangeFilter({ onRangeChange }: DateRangeFilterProps) {
  return (
    <Select onValueChange={onRangeChange} defaultValue="7d">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select date range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
        <SelectItem value="90d">Last 90 days</SelectItem>
      </SelectContent>
    </Select>
  );
}
