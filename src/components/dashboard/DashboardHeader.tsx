"use client"

import * as React from "react"
import { DateRangeFilter } from "@/components/DateRangeFilter"
import { AdAccountSelector } from "@/components/AdAccountSelector"
import { toast } from "sonner"
import type { DateRange } from "@/types/api"
import { BarChart3, Cloud, Droplets, Waves } from 'lucide-react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  selectedAccount?: string
  dateRange?: DateRange
  onAccountSelect: (id: string) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  statusFilter?: number
}

export function DashboardHeader({
  selectedAccount,
  dateRange,
  onAccountSelect,
  onDateRangeChange,
  statusFilter,
}: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-teal-400 overflow-hidden shadow-xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Cloud className="absolute top-4 left-1/4 text-blue-400 dark:text-blue-500 w-12 h-12 opacity-60" />
          <Droplets className="absolute bottom-4 right-1/4 text-blue-400 dark:text-blue-500 w-8 h-8 opacity-60" />
          <Waves className="absolute top-1/2 left-3/4 text-blue-400 dark:text-blue-500 w-10 h-10 opacity-60" />
        </motion.div>
      </div>
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      
      {/* Content */}
      <div className="container mx-auto py-5 px-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Title and Logo */}
          <div className="flex items-center gap-5">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl  opacity-50" />
              <div className="relative bg-gradient-to-br from-teak-500 via-teal-600 to-teal-700 p-3.5 rounded-2xl shadow-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
            </motion.div>
            
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-blue-900 dark:text-blue-50"
              >
                Meta Campaign Dashboard
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mt-1"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Live Analytics</span>
              </motion.div>
            </div>
          </div>

          {/* Right side - Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 bg-white/40 dark:bg-blue-900/40 backdrop-blur-md p-4 rounded-xl shadow-inner border border-white/20 dark:border-blue-700/20"
          >
            <div className="flex gap-4 items-center flex-wrap">
              <AdAccountSelector
                onAccountSelect={(id) => {
                  onAccountSelect(id)
                  toast.success("Ad Account selected successfully", {
                    icon: "🎉",
                  })
                }}
                selectedAccount={selectedAccount}
                statusFilter={statusFilter}
              />
              <DateRangeFilter date={dateRange} onRangeChange={onDateRangeChange} />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient bar */}
      <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700" />
    </div>
  );
}
