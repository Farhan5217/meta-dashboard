
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface CampaignSelectorProps {
  onCampaignSelect: (campaignId: string) => void;
  selectedCampaign?: string;
  adAccountId?: string;
}

export function CampaignSelector({ onCampaignSelect, selectedCampaign, adAccountId }: CampaignSelectorProps) {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns", adAccountId],
    queryFn: () => getCampaigns(adAccountId!),
    enabled: !!adAccountId,
  });

  if (!adAccountId) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Ad Account first" />
        </SelectTrigger>
      </Select>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <Select onValueChange={onCampaignSelect} value={selectedCampaign}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Campaign" />
      </SelectTrigger>
      <SelectContent>
        {campaigns?.map((campaign: { id: string }) => (
          <SelectItem key={campaign.id} value={campaign.id}>
            Campaign ID: {campaign.id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
