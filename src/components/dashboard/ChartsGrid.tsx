
import { CampaignChart } from "@/components/CampaignChart";
import { DemographicsChart } from "@/components/DemographicsChart";
import { MultiMetricChart } from "@/components/MultiMatricCharts";

interface ChartsGridProps {
  timeSeriesInsights: any[];
}

export function ChartsGrid({ timeSeriesInsights }: ChartsGridProps) {
  const processedData = timeSeriesInsights.map(item => ({
    ...item,
    frequency: parseFloat(item.frequency || "0"),
    clicks: parseInt(item.clicks || "0"),
    reach: parseInt(item.reach || "0"),
    cpc: parseFloat(item.cpc || "0"),
    cpm: parseFloat(item.cpm || "0")
  }));

  const reachMetrics = [
    { key: "frequency", name: "Frequency", color: "#3b82f6" },
    { key: "clicks", name: "Clicks", color: "#ec4899" },
    { key: "reach", name: "Reach", color: "#10b981" }
  ];

  const costMetrics = [
    { key: "cpc", name: "CPC", color: "#f59e0b" },
    { key: "cpm", name: "CPM", color: "#6366f1" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {timeSeriesInsights?.length > 0 && (
        <>
        {/* <BarChartVertical
            data={timeSeriesInsights}
            title="Daily Impressions"
            dataKey="impressions"
          /> */}
          
          <CampaignChart
            data={timeSeriesInsights}
            title="Daily Ad Spend"
            metric="spend"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 col-span-3 gap-6">
            <MultiMetricChart
              data={processedData}
              title="Reach Metrics"
              metrics={reachMetrics}
            />
            <MultiMetricChart
              data={processedData}
              title="Cost Metrics"
              metrics={costMetrics}
            />
            <DemographicsChart
              data={timeSeriesInsights}
              title="Spend by Gender"
            />
          </div>
        </>
      )}
    </div>
  );
}