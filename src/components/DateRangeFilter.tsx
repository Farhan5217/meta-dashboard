// import { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import type { DateRange } from "@/types/api";

// interface DateRangeFilterProps {
//   date?: DateRange;
//   onRangeChange: (range: DateRange) => void;
// }

// export function DateRangeFilter({ date, onRangeChange }: DateRangeFilterProps) {
//   // Track active filter
//   const [activeFilter, setActiveFilter] = useState<'7days' | '30days' | 'custom'>('30days');

//   // Get date range helper
//   const getDateRange = (days: number): DateRange => {
//     const today = new Date();
//     today.setHours(23, 59, 59, 999);
    
//     const from = new Date();
//     from.setDate(today.getDate() - days);
//     from.setHours(0, 0, 0, 0);
    
//     return { from, to: today };
//   };

//   // Initialize with last 30 days if no date provided
//   useEffect(() => {
//     if (!date?.from || !date?.to) {
//       onRangeChange(getDateRange(30));
//       setActiveFilter('30days');
//     }
//   }, []);

//   const formatDate = (date: Date | undefined) => {
//     if (!date) return '';
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get current selection or default
//   const currentSelection = date || getDateRange(30);

//   // Helper to check if a date range matches 7 or 30 days
//   const isDateRangeEqual = (range: DateRange, days: number) => {
//     const targetRange = getDateRange(days);
//     return (
//       range.from?.getTime() === targetRange.from.getTime() &&
//       range.to?.getTime() === targetRange.to.getTime()
//     );
//   };

//   // Update active filter when date changes
//   useEffect(() => {
//     if (date) {
//       if (isDateRangeEqual(date, 7)) {
//         setActiveFilter('7days');
//       } else if (isDateRangeEqual(date, 30)) {
//         setActiveFilter('30days');
//       } else {
//         setActiveFilter('custom');
//       }
//     }
//   }, [date]);

//   const getButtonStyle = (filter: '7days' | '30days') => {
//     return activeFilter === filter
//       ? "px-3 py-2 text-sm bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
//       : "px-3 py-2 text-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <div className="flex rounded-md shadow-sm">
//         <Button
//           variant="outline"
//           size="sm"
//           className={getButtonStyle('7days')}
//           onClick={() => {
//             setActiveFilter('7days');
//             onRangeChange(getDateRange(7));
//           }}
//         >
//           Last 7 Days
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           className={getButtonStyle('30days')}
//           onClick={() => {
//             setActiveFilter('30days');
//             onRangeChange(getDateRange(30));
//           }}
//         >
//           Last 30 Days
//         </Button>
//       </div>

//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             size="sm"
//             className={`w-[240px] justify-start text-left font-normal ${
//               activeFilter === 'custom'
//                 ? "bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
//                 : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
//             }`}
//           >
//             <span className="mr-2">📅</span>
//             {formatDate(currentSelection.from)} - {formatDate(currentSelection.to)}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="range"
//             selected={{
//               from: currentSelection.from,
//               to: currentSelection.to
//             }}
//             onSelect={(newDate: any) => {
//               if (newDate?.from) {
//                 const from = new Date(newDate.from);
//                 from.setHours(0, 0, 0, 0);
//                 const to = newDate.to ? new Date(newDate.to) : new Date();
//                 to.setHours(23, 59, 59, 999);
//                 setActiveFilter('custom');
//                 onRangeChange({ from, to });
//               }
//             }}
//             numberOfMonths={2}
//             className="rounded-md border dark:bg-gray-800 dark:border-gray-700"
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import type { DateRange } from "@/types/api";

interface DateRangeFilterProps {
  date?: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export function DateRangeFilter({ date, onRangeChange }: DateRangeFilterProps) {
  // Track active filter
  const [activeFilter, setActiveFilter] = useState<'yesterday' | '7days' | '30days' | '90days' | 'custom'>('30days');
  
  // Track if we need to show the custom date picker
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Get date range helper
  const getDateRange = (days: number): DateRange => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const from = new Date();
    from.setDate(today.getDate() - days);
    from.setHours(0, 0, 0, 0);
    
    return { from, to: today };
  };
  
  // Get yesterday's date range
  const getYesterdayRange = (): DateRange => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);
    
    return { from: yesterday, to: yesterdayEnd };
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

  // Helper to check if a date range matches a specific predefined range
  const isDateRangeEqual = (range: DateRange, days: number) => {
    const targetRange = getDateRange(days);
    return (
      range.from?.getTime() === targetRange.from.getTime() &&
      range.to?.getTime() === targetRange.to.getTime()
    );
  };
  
  // Helper to check if a date range is yesterday
  const isYesterday = (range: DateRange) => {
    const yesterdayRange = getYesterdayRange();
    return (
      range.from?.getTime() === yesterdayRange.from.getTime() &&
      range.to?.getTime() === yesterdayRange.to.getTime()
    );
  };

  // Update active filter when date changes
  useEffect(() => {
    if (date) {
      if (isYesterday(date)) {
        setActiveFilter('yesterday');
      } else if (isDateRangeEqual(date, 7)) {
        setActiveFilter('7days');
      } else if (isDateRangeEqual(date, 30)) {
        setActiveFilter('30days');
      } else if (isDateRangeEqual(date, 90)) {
        setActiveFilter('90days');
      } else {
        setActiveFilter('custom');
      }
    }
  }, [date]);

  // Handle dropdown selection change
  const handleFilterChange = (value: string) => {
    switch (value) {
      case 'yesterday':
        setActiveFilter('yesterday');
        onRangeChange(getYesterdayRange());
        setShowCustomPicker(false);
        break;
      case '7days':
        setActiveFilter('7days');
        onRangeChange(getDateRange(7));
        setShowCustomPicker(false);
        break;
      case '30days':
        setActiveFilter('30days');
        onRangeChange(getDateRange(30));
        setShowCustomPicker(false);
        break;
      case '90days':
        setActiveFilter('90days');
        onRangeChange(getDateRange(90));
        setShowCustomPicker(false);
        break;
      case 'custom':
        setActiveFilter('custom');
        setShowCustomPicker(true);
        break;
      default:
        break;
    }
  };

  // Get emoji for each time period
  const getFilterEmoji = () => {
    switch (activeFilter) {
      case 'yesterday':
        return '⏪';
      case '7days':
        return '🗓️';
      case '30days':
        return '📅';
      case '90days':
        return '📆';
      case 'custom':
        return '✨';
      default:
        return '🕒';
    }
  };

  // Format the display text based on the current selection
  const getDisplayText = () => {
    switch (activeFilter) {
      case 'yesterday':
        return 'Yesterday';
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case '90days':
        return 'Last 90 Days';
      case 'custom':
        return `${formatDate(currentSelection.from)} - ${formatDate(currentSelection.to)}`;
      default:
        return 'Select date range';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Select 
        value={activeFilter} 
        onValueChange={handleFilterChange}
      >
        <SelectTrigger className="w-[240px] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-2 border-indigo-100 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getFilterEmoji()}</span>
            <SelectValue className="flex-grow">{getDisplayText()}</SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-600 rounded-lg shadow-lg animate-in fade-in-80 zoom-in-95 duration-200">
          <SelectItem value="yesterday" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">⏪</span> Yesterday
          </SelectItem>
          <SelectItem value="7days" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">🗓️</span> Last 7 Days
          </SelectItem>
          <SelectItem value="30days" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">📅</span> Last 30 Days
          </SelectItem>
          <SelectItem value="90days" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">📆</span> Last 90 Days
          </SelectItem>
          <SelectItem value="custom" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">✨</span> Custom Range
          </SelectItem>
        </SelectContent>
      </Select>

      <Popover open={showCustomPicker} onOpenChange={setShowCustomPicker}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={activeFilter === 'custom' ? "ml-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-2 border-indigo-100 dark:border-gray-500 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 animate-in fade-in-80 duration-200" : "hidden"}
            onClick={() => setShowCustomPicker(true)}
          >
            <CalendarIcon className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
            <span className="text-sm font-medium">
              {formatDate(currentSelection.from)} - {formatDate(currentSelection.to)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md" align="start">
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
            className="rounded-lg bg-white dark:bg-gray-800 p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}