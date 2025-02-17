import { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCampaignInsights, getAdSets } from "@/services/api";
import { toast } from "sonner";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import type { DateRange } from "@/types/api";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Helper function to get the last 30 days
const getLast30Days = (): DateRange => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 30);
  return { from: past, to: today };
};

const Campaign = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Initialize dateRange state from sessionStorage (if exists) or default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const stored = sessionStorage.getItem("campaignDateRange");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { from: new Date(parsed.from), to: new Date(parsed.to) };
      } catch (error) {
        return getLast30Days();
      }
    }
    return getLast30Days();
  });

  // Persist dateRange changes to sessionStorage
  useEffect(() => {
    if (dateRange) {
      sessionStorage.setItem("campaignDateRange", JSON.stringify(dateRange));
    }
  }, [dateRange]);

  // Initialize and persist the showDemographics filter similarly if needed
  const [showDemographics, setShowDemographics] = useState<boolean>(() => {
    const stored = sessionStorage.getItem("campaignShowDemographics");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    sessionStorage.setItem("campaignShowDemographics", JSON.stringify(showDemographics));
  }, [showDemographics]);

  // Get campaign insights (time series)
  const { data: timeSeriesInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ["campaignInsights", id, dateRange, "timeSeries", showDemographics],
    queryFn: async () => {
      if (!id || !dateRange?.from || !dateRange?.to) return [];
      return getCampaignInsights(id, {
        since: dateRange.from.toISOString().split("T")[0],
        until: dateRange.to.toISOString().split("T")[0],
        time_increment: 1,
        breakdown: showDemographics,
      });
    },
    meta: {
      onError: () => {
        toast.error("Failed to fetch campaign insights");
      }
    }
  });

  // Get aggregated insights
  const { data: aggregatedInsights } = useQuery({
    queryKey: ["campaignInsights", id, dateRange, "aggregated"],
    queryFn: async () => {
      if (!id || !dateRange?.from || !dateRange?.to) return [];
      return getCampaignInsights(id, {
        since: dateRange.from.toISOString().split("T")[0],
        until: dateRange.to.toISOString().split("T")[0],
      });
    }
  });

  // Get ad sets
  const { data: adSets = [], isLoading: adSetsLoading, isError: adSetsError } = useQuery({
    queryKey: ["adSets", id],
    queryFn: () => getAdSets(id!),
    enabled: !!id,
    meta: {
      onError: (error: any) => {
        console.error("Ad Sets Error:", error);
        toast.error("Failed to fetch ad sets");
      }
    }
  });

  const aggregatedMetrics = aggregatedInsights?.[0] || {};
  const latestData = timeSeriesInsights?.[timeSeriesInsights.length - 1] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-slate-950">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Campaign Details</h1>
          </div>
          <div className="flex gap-4">
            <DateRangeFilter 
              date={dateRange} 
              onRangeChange={(range) => setDateRange(range as DateRange)}
            />
            {/* <div className="flex items-center space-x-2">
              <Switch
                id="demographics"
                checked={showDemographics}
                onCheckedChange={setShowDemographics}
                disabled
              />
              <Label htmlFor="demographics" className="text-gray-700 dark:text-gray-300">Show Demographics</Label>
            </div> */}
            <Button
      variant="aesthetic"
      size="sm"
      onClick={() => navigate("/")}
      className="group transition-all duration-300 ease-in-out"
    >
      <ArrowLeft className="h-4 w-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" />
      <span className="hidden sm:inline">Back to Dashboard</span>
    </Button>
          </div>
          
        </div>
        
        {/* Metrics and Insights Section */}
        {dateRange && (
          <>
            <MetricsGrid
              aggregatedMetrics={aggregatedMetrics}
              latestReach={parseInt(latestData.reach || "0")}
              latestFrequency={latestData.frequency || "0"}
            />
            <ChartsGrid 
              timeSeriesInsights={timeSeriesInsights || []}
              showDemographics={showDemographics}
            />

            {/* Ad Sets Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Ad Sets</h2>
              {adSetsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : adSetsError ? (
                <div className="text-center p-8 text-red-500">
                  Failed to load ad sets. Please try again later.
                </div>
              ) : adSets.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No ad sets found for this campaign.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Optimization Goal</TableHead>
                      <TableHead>Budget Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adSets.map((adSet) => (
                      <TableRow key={adSet.id}>
                        <TableCell>{adSet.name}</TableCell>
                        <TableCell>{adSet.optimization_goal}</TableCell>
                        <TableCell>${parseFloat(adSet.budget_remaining || "0").toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        )}

        {/* Loading Spinner */}
        {insightsLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaign;
