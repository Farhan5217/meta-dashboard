
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAdAccounts } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface AdAccountSelectorProps {
  onAccountSelect: (accountId: string) => void;
  selectedAccount?: string;
}

export function AdAccountSelector({ onAccountSelect, selectedAccount }: AdAccountSelectorProps) {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["adAccounts"],
    queryFn: getAdAccounts,
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <Select onValueChange={onAccountSelect} value={selectedAccount}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Ad Account" />
      </SelectTrigger>
      <SelectContent>
        {accounts?.map((account: { id: string; name: string }) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
