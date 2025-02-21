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
    <div className="sticky top-0 z-50 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700 overflow-hidden rounded-b-3xl shadow-lg">
      <div className="absolute inset-0 opacity-30">
        <Cloud className="absolute top-4 left-1/4 text-blue-300 dark:text-blue-600 w-12 h-12" />
        <Droplets className="absolute bottom-4 right-1/4 text-blue-300 dark:text-blue-600 w-8 h-8" />
        <Waves className="absolute top-1/2 left-3/4 text-blue-300 dark:text-blue-600 w-10 h-10" />
      </div>
      
      <div className="container mx-auto py-6 px-4 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-400 rounded-2xl blur opacity-50" />
              <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-2xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-100 font-comic">
                Meta Campaign Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-bounce" />
                <span className="text-sm text-blue-700 dark:text-blue-200">Live Analytics</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white/30 dark:bg-blue-800/30 backdrop-blur-md p-4 rounded-2xl shadow-inner">
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
            {/* <Button 
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            >
              Refresh Data
            </Button> */}
          </div>
        </div>
      </div>
      
      <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />
    </div>
  )
}
