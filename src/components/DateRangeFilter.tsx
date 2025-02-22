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
  // Track active filter
  const [activeFilter, setActiveFilter] = useState<'7days' | '30days' | 'custom'>('30days');

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
      setActiveFilter('30days');
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

  // Helper to check if a date range matches 7 or 30 days
  const isDateRangeEqual = (range: DateRange, days: number) => {
    const targetRange = getDateRange(days);
    return (
      range.from?.getTime() === targetRange.from.getTime() &&
      range.to?.getTime() === targetRange.to.getTime()
    );
  };

  // Update active filter when date changes
  useEffect(() => {
    if (date) {
      if (isDateRangeEqual(date, 7)) {
        setActiveFilter('7days');
      } else if (isDateRangeEqual(date, 30)) {
        setActiveFilter('30days');
      } else {
        setActiveFilter('custom');
      }
    }
  }, [date]);

  const getButtonStyle = (filter: '7days' | '30days') => {
    return activeFilter === filter
      ? "px-3 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      : "px-3 py-2 text-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-md shadow-sm">
        <Button
          variant="outline"
          size="sm"
          className={getButtonStyle('7days')}
          onClick={() => {
            setActiveFilter('7days');
            onRangeChange(getDateRange(7));
          }}
        >
          Last 7 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={getButtonStyle('30days')}
          onClick={() => {
            setActiveFilter('30days');
            onRangeChange(getDateRange(30));
          }}
        >
          Last 30 Days
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`w-[240px] justify-start text-left font-normal ${
              activeFilter === 'custom'
                ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
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
                setActiveFilter('custom');
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