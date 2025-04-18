// hooks/useCampaignCreatives.ts
import { useQuery } from "@tanstack/react-query";
import { getCampaignsWithCreatives } from "@/services/api";
import type { CampaignWithCreatives } from "@/types/api";

export function useCampaignCreatives(
  adAccountId?: string | null,
  statusFilter?: string,
  objectiveFilter?: string,
  enabled = true
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaignsWithCreatives", adAccountId, statusFilter, objectiveFilter],
    queryFn: async () => {
      if (!adAccountId) return [];
      // We'll filter on the client side based on statusFilter and objectiveFilter
      const campaigns = await getCampaignsWithCreatives(adAccountId, { active_only: false });
      
      return campaigns.filter((campaign: CampaignWithCreatives) => {
        const matchesStatus = statusFilter ? campaign.status === statusFilter : true;
        const matchesObjective = objectiveFilter ? campaign.objective === objectiveFilter : true;
        return matchesStatus && matchesObjective;
      });
    },
    enabled: !!adAccountId && enabled,
  });

  return {
    campaignsWithCreatives: data || [],
    isLoading,
    error,
  };
}