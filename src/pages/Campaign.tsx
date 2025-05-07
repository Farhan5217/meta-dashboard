
// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { useQuery } from "@tanstack/react-query"
// import {  getCampaignCreatives, getCombinedCampaignInsights } from "@/services/api"
// import { toast } from "sonner"
// import { MetricsGrid } from "@/components/dashboard/MetricsGrid"
// import { ChartsGrid } from "@/components/dashboard/ChartsGrid"
// import { CreativeThumbnails } from "@/components/dashboard/CreativeThumbnails"
// import { VideoPlayerModal } from "../components/creatives/VideoPlayerModal"
// import type { DateRange, CreativeItem } from "@/types/api"
// import { DateRangeFilter } from "@/components/DateRangeFilter"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, BarChart3, Sparkles, TrendingUp, DollarSign, Film } from "lucide-react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { motion } from "framer-motion"

// // Helper function to get the last 30 days
// const getLast30Days = (): DateRange => {
//   const today = new Date()
//   const past = new Date()
//   past.setDate(today.getDate() - 30)
//   return { from: past, to: today }
// }

// const Campaign = () => {
//   const navigate = useNavigate()
//   const { id } = useParams<{ id: string }>()
  
//   // State for video player modal
//   const [selectedCreative, setSelectedCreative] = useState<CreativeItem | null>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   // Initialize dateRange state from sessionStorage (if exists) or default to last 30 days
//   const [dateRange, setDateRange] = useState<DateRange>(() => {
//     const stored = sessionStorage.getItem("campaignDateRange")
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored)
//         return { from: new Date(parsed.from), to: new Date(parsed.to) }
//       } catch (error) {
//         return getLast30Days()
//       }
//     }
//     return getLast30Days()
//   })

//   // Persist dateRange changes to sessionStorage
//   useEffect(() => {
//     if (dateRange) {
//       sessionStorage.setItem("campaignDateRange", JSON.stringify(dateRange))
//     }
//   }, [dateRange])

//   // Initialize and persist the showDemographics filter similarly if needed
//   const [showDemographics, setShowDemographics] = useState<boolean>(() => {
//     const stored = sessionStorage.getItem("campaignShowDemographics")
//     return stored ? JSON.parse(stored) : false
//   })

//   useEffect(() => {
//     sessionStorage.setItem("campaignShowDemographics", JSON.stringify(showDemographics))
//   }, [showDemographics])

//   // Get combined campaign insights (time series and percentage changes)
//   const { 
//     data: combinedInsights, 
//     isLoading: insightsLoading 
//   } = useQuery({
//     queryKey: ["combinedCampaignInsights", id, dateRange],
//     queryFn: async () => {
//       if (!id || !dateRange?.from || !dateRange?.to) return { timeSeriesData: [], percentChangeData: {} };
      
//       return getCombinedCampaignInsights(
//         id,
//         { from: dateRange.from, to: dateRange.to }
//       );
//     },
//     enabled: !!id && !!dateRange?.from && !!dateRange?.to,
//     meta: {
//       onError: () => {
//         toast.error("Failed to fetch campaign insights")
//       },
//     }
//   });

//   // Get campaign creatives
//   const { 
//     data: creatives = [], 
//     isLoading: creativesLoading,
//     isError: creativesError
//   } = useQuery({
//     queryKey: ["campaignCreatives", id],
//     queryFn: () => getCampaignCreatives(id!),
//     enabled: !!id,
//     meta: {
//       onError: (error: any) => {
//         console.error("Campaign Creatives Error:", error)
//         toast.error("Failed to fetch campaign creatives")
//       },
//     },
//   });

  

//   const timeSeriesInsights = combinedInsights?.timeSeriesData || [];
//   const aggregatedMetrics = combinedInsights?.percentChangeData || {};

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="container mx-auto px-6 py-8">
//         {/* Enhanced Header Section */}
//         <Card className="mb-8 overflow-hidden bg-blue-100 dark:bg-blue-900 shadow-md rounded-3xl shadow-xl">
//           <CardHeader className="p-4">
//             <div className="flex flex-wrap justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="relative">
//                   <div className="absolute inset-0 bg-blue-300 rounded-2xl blur opacity-50" />
//                   <div className="relative bg-teal-500 p-3 rounded-lg shadow-md p-3 rounded-2xl shadow-lg">
//                     <BarChart3 className="h-6 w-6 text-white" />
//                   </div>
//                 </motion.div>
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-900 dark:text-white">
//                     Meta Campaign Dashboard
//                   </h1>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="relative flex h-2.5 w-2.5">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
//                     </span>
//                     <span className="text-xs font-medium text-gray-600 dark:text-blue-200">Live Analytics</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
//                 <DateRangeFilter date={dateRange} onRangeChange={(range) => setDateRange(range as DateRange)} />
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   onClick={() => navigate("/index")}
//                   className="group transition-all duration-300 ease-in-out"
//                 >
//                   <ArrowLeft className="h-4 w-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" />
//                   <span className="hidden sm:inline">Back to Dashboard</span>
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//         </Card>

        

//         {/* Metrics and Insights Section */}
//         {dateRange && (
//           <>
//             <MetricsGrid
//               aggregatedMetrics={aggregatedMetrics}
//               timeSeriesInsights={timeSeriesInsights}
//               showCharts={false}

//             />

//             {/* Campaign Creatives Section */}
//         <Card className="mb-8 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//           <CardHeader className="bg-teal-500 dark:bg-teal-800 px-4 py-3">
//             <CardTitle className="text-md font-semibold text-white flex items-center gap-2">
//               <Film className="h-5 w-5" />
//               Campaign Creatives
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             {creativesLoading ? (
//               <div className="flex items-center justify-center p-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
//               </div>
//             ) : creativesError ? (
//               <div className="text-center p-4 text-red-500">Failed to load creatives. Please try again later.</div>
//             ) : creatives.length === 0 ? (
//               <div className="text-center p-4 text-gray-500">No creatives found for this campaign.</div>
//             ) : (
//               <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
//                 {creatives.map((creative) => (
//                   <div 
//                     key={creative.creative_id} 
//                     className="relative group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105"
//                     onClick={() => {
//                       setSelectedCreative(creative);
//                       setIsModalOpen(true);
//                     }}
//                   >
//                     <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg shadow-md overflow-hidden border border-gray-200">
//                       {creative.preview_url ? (
//                         <img
//                           src={creative.preview_url}
//                           alt={creative.creative_name || 'Campaign creative'}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                           <span className="text-sm text-gray-500">No preview</span>
//                         </div>
//                       )}
                      
//                       {/* Overlay with details */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
//                         <p className="text-xs text-white font-medium truncate">{creative.ad_name || 'Ad'}</p>
//                         <div className="flex items-center gap-1 mt-1">
//                           {creative.video_url ? (
//                             <div className="flex items-center gap-1 bg-teal-500 rounded-full px-2 py-0.5">
//                               <Film className="w-3 h-3 text-white" />
//                               <span className="text-[10px] text-white">Video</span>
//                             </div>
//                           ) : (
//                             <div className="flex items-center gap-1 bg-blue-500 rounded-full px-2 py-0.5">
//                               <TrendingUp className="w-3 h-3 text-white" />
//                               <span className="text-[10px] text-white">Image</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//             <ChartsGrid 
//               timeSeriesInsights={timeSeriesInsights || []} 
//               title="Campaign Analytics" 
//             />
//           </>
//         )}

//         {/* Loading Spinner */}
//         {(insightsLoading || creativesLoading) && (
//           <div className="flex items-center justify-center p-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
//           </div>
//         )}
//       </div>

//       {/* Video/Image Modal */}
//       <VideoPlayerModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         videoUrl={selectedCreative?.video_url}
//         imageUrl={selectedCreative?.preview_url}
//         title={selectedCreative?.ad_name || selectedCreative?.creative_name || "Creative Preview"}
//       />
//     </div>
//   )
// }

// export default Campaign



// Campaign.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getCampaignCreatives, getCombinedCampaignInsights } from "@/services/api" // Ensure getCampaignCreatives is imported
import { toast } from "sonner"
import { MetricsGrid } from "@/components/dashboard/MetricsGrid"
import { ChartsGrid } from "@/components/dashboard/ChartsGrid"
// CreativeThumbnails is not directly used here for the main display, but VideoPlayerModal is
import { VideoPlayerModal } from "../components/creatives/VideoPlayerModal"
import type { DateRange, CreativeItem } from "@/types/api"
import { DateRangeFilter } from "@/components/DateRangeFilter"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, Sparkles, TrendingUp, DollarSign, Film } from "lucide-react"
// Table components are not used in the provided Campaign.tsx for creatives, but keeping if needed elsewhere
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

// Helper function to get the last 30 days
const getLast30Days = (): DateRange => {
  const today = new Date()
  const past = new Date()
  past.setDate(today.getDate() - 30)
  return { from: past, to: today }
}

// Define a longer stale time for creative data (e.g., 24 hours)
const CREATIVE_STALE_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const INSIGHT_STALE_TIME_MS = 15 * 60 * 1000; // 15 minutes for insights, adjust as needed

const Campaign = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // State for video player modal
  const [selectedCreative, setSelectedCreative] = useState<CreativeItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Initialize dateRange state
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const stored = sessionStorage.getItem("campaignDateRange")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return { from: new Date(parsed.from), to: new Date(parsed.to) }
      } catch (error) {
        return getLast30Days()
      }
    }
    return getLast30Days()
  })

  useEffect(() => {
    if (dateRange) {
      sessionStorage.setItem("campaignDateRange", JSON.stringify(dateRange))
    }
  }, [dateRange])

  // showDemographics state (though its direct usage in API calls was simplified)
  const [showDemographics, setShowDemographics] = useState<boolean>(() => {
    const stored = sessionStorage.getItem("campaignShowDemographics")
    return stored ? JSON.parse(stored) : false
  })

  useEffect(() => {
    sessionStorage.setItem("campaignShowDemographics", JSON.stringify(showDemographics))
  }, [showDemographics])

  // Get combined campaign insights
  const {
    data: combinedInsights,
    isLoading: insightsLoading
  } = useQuery({
    queryKey: ["combinedCampaignInsights", id, dateRange],
    queryFn: async () => {
      if (!id || !dateRange?.from || !dateRange?.to) return { timeSeriesData: [], percentChangeData: {} };
      return getCombinedCampaignInsights(
        id,
        { from: dateRange.from, to: dateRange.to }
      );
    },
    enabled: !!id && !!dateRange?.from && !!dateRange?.to,
    staleTime: INSIGHT_STALE_TIME_MS, // Stale time for insights
    meta: {
      onError: () => {
        toast.error("Failed to fetch campaign insights")
      },
    }
  });

  // Get campaign creatives
  const {
    data: creatives = [],
    isLoading: creativesLoading,
    isError: creativesError
  } = useQuery({
    queryKey: ["campaignCreatives", id], // Query key includes the campaign ID
    queryFn: async () => {
      if (!id) return []; // Guard clause
      return getCampaignCreatives(id); // Call your service function
    },
    enabled: !!id, // Only run the query if `id` is available
    staleTime: CREATIVE_STALE_TIME_MS, // ***** MODIFIED: Added staleTime *****
    // Optional: Adjust cacheTime if needed, e.g., CREATIVE_STALE_TIME_MS + (5 * 60 * 1000)
    meta: {
      onError: (error: any) => {
        console.error("Campaign Creatives Error:", error);
        toast.error("Failed to fetch campaign creatives")
      },
    },
  });

  const timeSeriesInsights = combinedInsights?.timeSeriesData || [];
  const aggregatedMetrics = combinedInsights?.percentChangeData || {};

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header Section */}
        <Card className="mb-8 overflow-hidden bg-blue-100 dark:bg-blue-900 shadow-md rounded-3xl shadow-xl">
          <CardHeader className="p-4">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="relative">
                  <div className="absolute inset-0 bg-blue-300 rounded-2xl blur opacity-50" />
                  <div className="relative bg-teal-500 p-3 rounded-lg shadow-md p-3 rounded-2xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Meta Campaign Dashboard
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                    </span>
                    <span className="text-xs font-medium text-gray-600 dark:text-blue-200">Live Analytics</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
                <DateRangeFilter date={dateRange} onRangeChange={(range) => setDateRange(range as DateRange)} />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/index")}
                  className="group transition-all duration-300 ease-in-out"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Metrics and Insights Section */}
        {dateRange && (
          <>
            <MetricsGrid
              aggregatedMetrics={aggregatedMetrics}
              timeSeriesInsights={timeSeriesInsights}
              showCharts={false}
            />

            {/* Campaign Creatives Section */}
            <Card className="mb-8 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <CardHeader className="bg-teal-500 dark:bg-teal-800 px-4 py-3">
                <CardTitle className="text-md font-semibold text-white flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Campaign Creatives
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {creativesLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                  </div>
                ) : creativesError ? (
                  <div className="text-center p-4 text-red-500">Failed to load creatives. Please try again later.</div>
                ) : creatives.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">No creatives found for this campaign.</div>
                ) : (
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                    {creatives.map((creative) => (
                      <div
                        key={creative.creative_id}
                        className="relative group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105"
                        onClick={() => {
                          setSelectedCreative(creative);
                          setIsModalOpen(true);
                        }}
                      >
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg shadow-md overflow-hidden border border-gray-200">
                          {creative.preview_url ? (
                            <img
                              src={creative.preview_url}
                              alt={creative.creative_name || 'Campaign creative'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-sm text-gray-500">No preview</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <p className="text-xs text-white font-medium truncate">{creative.ad_name || 'Ad'}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {creative.video_url ? (
                                <div className="flex items-center gap-1 bg-teal-500 rounded-full px-2 py-0.5">
                                  <Film className="w-3 h-3 text-white" />
                                  <span className="text-[10px] text-white">Video</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 bg-blue-500 rounded-full px-2 py-0.5">
                                  <TrendingUp className="w-3 h-3 text-white" /> {/* Consider a more generic icon like ImageIcon if it's just an image */}
                                  <span className="text-[10px] text-white">Image</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <ChartsGrid
              timeSeriesInsights={timeSeriesInsights || []}
              title="Campaign Analytics"
            />
          </>
        )}

        {/* Loading Spinner */}
        {(insightsLoading || creativesLoading) && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        )}
      </div>

      {/* Video/Image Modal */}
      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={selectedCreative?.video_url}
        imageUrl={selectedCreative?.preview_url}
        title={selectedCreative?.ad_name || selectedCreative?.creative_name || "Creative Preview"}
      />
    </div>
  )
}

export default Campaign;
