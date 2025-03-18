import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, MonitorSmartphone, Eye, MousePointerClick, DollarSign, Users ,Filter} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define the correct types based on your API response
const DeviceInsights = ({ data = [], isLoading = false }) => {
  const [selectedMetric, setSelectedMetric] = useState("impressions");

  // Helper function to get the formatted name of the selected metric
  const getMetricName = (metric) => {
    switch (metric) {
      case "impressions": return "Impressions";
      case "clicks": return "Clicks";
      case "spend": return "Spend";
      case "ctr": return "CTR";
      case "cpc": return "CPC";
      case "cpm": return "CPM";
      default: return "Impressions";
    }
  };

  // Helper function to format the metric values appropriately
  const formatMetricValue = (value, metric) => {
    if (typeof value !== 'number') {
      // Try to convert to number if it's a string
      value = parseFloat(value) || 0;
    }
    
    switch (metric) {
      case "impressions":
      case "clicks":
        return Math.round(value).toLocaleString();
      case "spend":
      case "cpc":
      case "cpm":
        return `$${parseFloat(value).toFixed(2)}`;
      case "ctr":
        return `${parseFloat(value).toFixed(2)}%`;
      default:
        return value.toString();
    }
  };

  // Format device name to make it more user-friendly
  const formatDeviceName = (device) => {
    if (!device || typeof device !== 'string') return "Unknown";
    
    return device
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Prepare data for charts
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      name: formatDeviceName(item.impression_device),
      impressions: parseFloat(item.impressions) || 0,
      clicks: parseFloat(item.clicks) || 0,
      spend: parseFloat(item.spend) || 0,
      reach: parseFloat(item.reach) || 0,
      frequency: parseFloat(item.frequency) || 0,
      ctr: parseFloat(item.ctr) || 0,
      cpc: parseFloat(item.cpc) || 0,
      cpm: parseFloat(item.cpm) || 0,
      // Add a value field specifically for the pie chart
      value: parseFloat(item[selectedMetric]) || 0
    }));
  }, [data, selectedMetric]);

  // Colors for the chart
  const COLORS = ["#0077B6", "#00A6FB", "#0096C7", "#00B4D8", "#48CAE4", "#90E0EF", "#00CED1"];



  // Calculate totals for summary cards
  const totals = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        impressions: 0,
        clicks: 0,
        spend: 0,
        reach: 0
      };
    }

    return data.reduce((acc, item) => {
      acc.impressions += parseFloat(item.impressions || 0);
      acc.clicks += parseFloat(item.clicks || 0);
      acc.spend += parseFloat(item.spend || 0);
      acc.reach += parseFloat(item.reach || 0);
      return acc;
    }, { impressions: 0, clicks: 0, spend: 0, reach: 0 });
  }, [data]);

  // Custom tooltip component for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900">{data.name}</p>
          <div className="text-sm text-gray-600 mt-1">
            <p>{getMetricName(selectedMetric)}: {formatMetricValue(data[selectedMetric], selectedMetric)}</p>
            <p>Impressions: {formatMetricValue(data.impressions, "impressions")}</p>
            <p>Clicks: {formatMetricValue(data.clicks, "clicks")}</p>
            <p>CTR: {formatMetricValue(data.ctr, "ctr")}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border border-gray-100 shadow-md mb-6">
        <CardHeader className="bg-teal-500 py-3 px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <MonitorSmartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-white">Device Breakdown</CardTitle>
                <p className="text-xs text-white/70">Analytics by device type</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/20 px-3 py-2 rounded-lg">
              <Filter className="h-6 w-6 text-white" />
                <span className="text-white text-sm font-medium">Metric:</span>
                <Select 
                  value={selectedMetric} 
                  onValueChange={setSelectedMetric}
                >
                  <SelectTrigger className="bg-white/30 text-teal-800 text-sm h-8 rounded border-0 focus:ring-2 focus:ring-white/50 min-w-[120px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impressions">Impressions</SelectItem>
                    <SelectItem value="clicks">Clicks</SelectItem>
                    <SelectItem value="spend">Spend</SelectItem>
                    <SelectItem value="ctr">CTR</SelectItem>
                    <SelectItem value="cpc">CPC</SelectItem>
                    <SelectItem value="cpm">CPM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Badge className="bg-teal-600/70 hover:bg-teal-600 text-white border-0 text-xs px-3 py-1 rounded-full shadow-sm">
                {data.length} Devices
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Device Distribution Chart */}
          <Card className="shadow-md border border-gray-100 overflow-hidden mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                Device Distribution by {getMetricName(selectedMetric)}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72 p-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      nameKey="name"
                      paddingAngle={2}
                      labelLine={false}
                      animationDuration={800}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value, entry) => {
                        const { payload } = entry;
                        return (
                          <span className="text-sm">
                            {value} ({formatMetricValue(payload[selectedMetric], selectedMetric)})
                          </span>
                        );
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
                </div>
              )}
            </CardContent>
          </Card>

          

          {/* Device Metrics Table */}
          {/* <Card className="mt-6 border border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Device Performance Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Device</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Impressions</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Clicks</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">CTR</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">CPC</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((device, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-800 font-medium">
                          {device.name}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatMetricValue(device.impressions, "impressions")}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatMetricValue(device.clicks, "clicks")}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatMetricValue(device.ctr, "ctr")}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatMetricValue(device.cpc, "cpc")}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatMetricValue(device.spend, "spend")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card> */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeviceInsights;