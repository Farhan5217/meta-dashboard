
import { CampaignChart } from "@/components/CampaignChart";
import { BarChartVertical } from "@/components/BarChart";
import { SpendDistributionChart } from "@/components/SpendDistributionChart";
import { DemographicsChart } from "@/components/DemographicsChart";

interface ChartsGridProps {
  timeSeriesInsights: any[];
  showDemographics?: boolean;
}

export function ChartsGrid({ timeSeriesInsights, showDemographics = false }: ChartsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
      {timeSeriesInsights?.length > 0 && (
        <>
          <CampaignChart
            data={timeSeriesInsights}
            title="Daily Ad Spend"
            metric="spend"
          />
          <BarChartVertical
            data={timeSeriesInsights}
            title="Daily Impressions"
            dataKey="impressions"
          />
          {showDemographics && (
            <DemographicsChart
              data={timeSeriesInsights}
              title="Spend by Demographics"
            />
          )}
        </>
      )}
    </div>
  );
}
