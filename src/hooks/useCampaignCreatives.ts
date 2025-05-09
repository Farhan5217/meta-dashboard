// Improved custom hook with better cache control
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCampaignsWithCreatives } from "@/services/api";
import type { CampaignWithCreatives } from "@/types/api";
import { useEffect } from "react";

// Define cache times
const CREATIVE_STALE_TIME_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const EMPTY_CREATIVE_STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes for empty results

export function useCampaignCreatives(
  adAccountId?: string | null,
  statusFilter?: string,
  objectiveFilter?: string,
  enabled = true
) {
  const queryClient = useQueryClient();
  const queryKey = ["campaignsWithCreatives", adAccountId, statusFilter, objectiveFilter];
  
  // Add auto-refetch for campaigns with no creatives
  useEffect(() => {
    if (!adAccountId || !enabled) return;
    
    // Create a reference to the timeout
    let refetchTimeout: NodeJS.Timeout | null = null;
    
    // Get the current cached data
    const currentData = queryClient.getQueryData(queryKey) as CampaignWithCreatives[] | undefined;
    
    if (currentData) {
      // Check if we have any campaigns with no creatives
      const hasMissingCreatives = currentData.some(
        campaign => !campaign.creatives || campaign.creatives.length === 0
      );
      
      // If we have missing creatives, set up a timer to refetch
      if (hasMissingCreatives) {
        refetchTimeout = setTimeout(() => {
          console.log("Auto-refetching campaigns with missing creatives");
          queryClient.invalidateQueries({ queryKey });
        }, EMPTY_CREATIVE_STALE_TIME_MS);
      }
    }
    
    // Clean up the timeout on unmount or when dependencies change
    return () => {
      if (refetchTimeout) clearTimeout(refetchTimeout);
    };
  }, [adAccountId, statusFilter, objectiveFilter, enabled, queryClient]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!adAccountId) return [];
      
      try {
        // We'll filter on the client side based on statusFilter and objectiveFilter
        const campaigns = await getCampaignsWithCreatives(adAccountId, { active_only: true });
        
        // Filter campaigns based on criteria
        const filteredCampaigns = campaigns.filter((campaign: CampaignWithCreatives) => {
          const matchesStatus = statusFilter ? campaign.status === statusFilter : true;
          const matchesObjective = objectiveFilter ? campaign.objective === objectiveFilter : true;
          return matchesStatus && matchesObjective;
        });
        
        // Check if we have any campaigns with no creatives
        const hasMissingCreatives = filteredCampaigns.some(
          campaign => !campaign.creatives || campaign.creatives.length === 0
        );
        
        // Set appropriate stale time based on whether we have missing creatives
        if (hasMissingCreatives) {
          // This will update the query's staleness so it refetches sooner if we have missing data
          setTimeout(() => {
            queryClient.setQueryDefaults(queryKey, {
              staleTime: EMPTY_CREATIVE_STALE_TIME_MS
            });
          }, 0);
        }
        
        return filteredCampaigns;
      } catch (error) {
        console.error("Error in useCampaignCreatives queryFn:", error);
        throw error;
      }
    },
    enabled: !!adAccountId && enabled,
    staleTime: CREATIVE_STALE_TIME_MS,
    // Add a retry config for more reliability
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
  });
  
  return {
    campaignsWithCreatives: data || [],
    isLoading,
    error,
    refetch,
    refetchMissingCreatives: () => {
      if (!data) return Promise.resolve([]);
      
      // Find campaigns with missing creatives
      const campaignsWithoutCreatives = data.filter(
        campaign => !campaign.creatives || campaign.creatives.length === 0
      );
      
      if (campaignsWithoutCreatives.length > 0) {
        console.log(`Refetching data for ${campaignsWithoutCreatives.length} campaigns with missing creatives`);
        return queryClient.invalidateQueries({ queryKey });
      }
      
      return Promise.resolve(data);
    }
  };
}


// import { useQuery } from "@tanstack/react-query";
// import { getCampaignsWithCreatives } from "@/services/api";
// import type { CampaignWithCreatives } from "@/types/api";

// // Define a longer stale time for creative data (e.g., 24 hours)
// const CREATIVE_STALE_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// export function useCampaignCreatives(
//   adAccountId?: string | null,
//   statusFilter?: string,
//   objectiveFilter?: string,
//   enabled = true
// ) {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["campaignsWithCreatives", adAccountId, statusFilter, objectiveFilter],
//     queryFn: async () => {
//       if (!adAccountId) return [];
//       // We'll filter on the client side based on statusFilter and objectiveFilter
//       const campaigns = await getCampaignsWithCreatives(adAccountId, { active_only: false });

//       return campaigns.filter((campaign: CampaignWithCreatives) => {
//         const matchesStatus = statusFilter ? campaign.status === statusFilter : true;
//         const matchesObjective = objectiveFilter ? campaign.objective === objectiveFilter : true;
//         return matchesStatus && matchesObjective;
//       });
//     },
//     enabled: !!adAccountId && enabled,
//     staleTime: CREATIVE_STALE_TIME_MS, // ***** MODIFIED: Added staleTime *****
//     // Optional: Adjust cacheTime if needed, e.g., CREATIVE_STALE_TIME_MS + (5 * 60 * 1000)
//   });

//   return {
//     campaignsWithCreatives: data || [],
//     isLoading,
//     error,
//   };
// }

