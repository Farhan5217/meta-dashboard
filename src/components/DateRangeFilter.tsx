import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "@/types/api";

interface DateRangeFilterProps {
  date?: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export function DateRangeFilter({ date, onRangeChange }: DateRangeFilterProps) {
  // Get date range helper
  const getDateRange = (days: number): DateRange => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const from = new Date();
    from.setDate(today.getDate() - days);
    from.setHours(0, 0, 0, 0);
    
    return { from, to: today };
  };

  // Initialize with last 30 days if no date provided
  useEffect(() => {
    if (!date?.from || !date?.to) {
      onRangeChange(getDateRange(30));
    }
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get current selection or default
  const currentSelection = date || getDateRange(30);

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-md shadow-sm">
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-2 text-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onRangeChange(getDateRange(7))}
        >
          Last 7 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-2 text-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onRangeChange(getDateRange(30))}
        >
          Last 30 Days
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[240px] justify-start text-left font-normal bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="mr-2">📅</span>
            {formatDate(currentSelection.from)} - {formatDate(currentSelection.to)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: currentSelection.from,
              to: currentSelection.to
            }}
            onSelect={(newDate: any) => {
              if (newDate?.from) {
                const from = new Date(newDate.from);
                from.setHours(0, 0, 0, 0);
                const to = newDate.to ? new Date(newDate.to) : new Date();
                to.setHours(23, 59, 59, 999);
                onRangeChange({ from, to });
              }
            }}
            numberOfMonths={2}
            className="rounded-md border dark:bg-gray-800 dark:border-gray-700"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}