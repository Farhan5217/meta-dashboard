
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAdSets } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface AdSetSelectorProps {
  onAdSetSelect: (adSetId: string) => void;
  selectedAdSet?: string;
  campaignId?: string;
}

export function AdSetSelector({ onAdSetSelect, selectedAdSet, campaignId }: AdSetSelectorProps) {
  const { data: adSets, isLoading } = useQuery({
    queryKey: ["adSets", campaignId],
    queryFn: () => getAdSets(campaignId!),
    enabled: !!campaignId,
  });

  if (!campaignId) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Campaign first" />
        </SelectTrigger>
      </Select>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <Select onValueChange={onAdSetSelect} value={selectedAdSet}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Ad Set" />
      </SelectTrigger>
      <SelectContent>
        {adSets?.map((adSet: { id: string; name: string }) => (
          <SelectItem key={adSet.id} value={adSet.id}>
            {adSet.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
