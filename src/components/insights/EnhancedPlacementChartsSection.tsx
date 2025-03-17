"use client"

import { useState, useMemo } from "react"
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Treemap,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, BarChart, LayoutDashboard } from "lucide-react"

// Add TypeScript interfaces at the top of the file
interface DataItem {
  publisher_platform: string
  platform_position: string
  impression_device: string
  impressions: number | string
  clicks: number | string
  spend: number | string
  reach: number | string
  frequency?: number
  ctr?: number
  cpc?: number
  cpm?: number
}

interface ChartProps {
  data: DataItem[]
  chartTab: string
  setChartTab: (tab: string) => void
}

interface MetricItem {
  value: string
  label: string
}

interface PlatformData {
  name: string
  impressions: number
  clicks: number
  spend: number
  reach: number
  frequency: number
  ctr: number
  cpc: number
  cpm: number
}

// Replace the FilteredCharts component with this enhanced version
const FilteredCharts = ({ data, chartTab, setChartTab }: ChartProps) => {
  // State for selected metric
  const [selectedMetric, setSelectedMetric] = useState<string>("impressions")
  // Add toggle state for devices view
  const [showAllDevices, setShowAllDevices] = useState<boolean>(true)

  // Metrics for filter
  const metrics: MetricItem[] = [
    { value: "impressions", label: "Impressions" },
    { value: "clicks", label: "Clicks" },
    { value: "spend", label: "Spend" },
    { value: "reach", label: "Reach" },
    { value: "frequency", label: "Frequency" },
    { value: "ctr", label: "CTR" },
    { value: "cpc", label: "CPC" },
    { value: "cpm", label: "CPM" },
  ]

  // Prepare platform data
  const platformData = useMemo(() => {
    const platforms: Record<string, PlatformData> = {}

    // Group by platform
    data?.forEach((item) => {
      const platform = item.publisher_platform
      if (!platforms[platform]) {
        platforms[platform] = {
          name: platform,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      platforms[platform].impressions += Number(item.impressions || 0)
      platforms[platform].clicks += Number(item.clicks || 0)
      platforms[platform].spend += Number(item.spend || 0)
      platforms[platform].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each platform
    Object.values(platforms).forEach((platform) => {
      // Frequency (reach must be non-zero to calculate)
      platform.frequency = platform.reach > 0 ? platform.impressions / platform.reach : 0

      // CTR (click-through rate) - impressions must be non-zero
      platform.ctr = platform.impressions > 0 ? (platform.clicks / platform.impressions) * 100 : 0

      // CPC (cost per click) - clicks must be non-zero
      platform.cpc = platform.clicks > 0 ? platform.spend / platform.clicks : 0

      // CPM (cost per thousand impressions) - impressions must be non-zero
      platform.cpm = platform.impressions > 0 ? (platform.spend / platform.impressions) * 1000 : 0
    })

    return Object.values(platforms)
  }, [data])

  // Prepare position data
  const positionData = useMemo(() => {
    const positions: Record<string, PlatformData> = {}

    // Group by position
    data?.forEach((item) => {
      const position = item.platform_position.replace("facebook_", "")
      if (!positions[position]) {
        positions[position] = {
          name: position,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      positions[position].impressions += Number(item.impressions || 0)
      positions[position].clicks += Number(item.clicks || 0)
      positions[position].spend += Number(item.spend || 0)
      positions[position].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each position
    Object.values(positions).forEach((position) => {
      // Frequency (reach must be non-zero to calculate)
      position.frequency = position.reach > 0 ? position.impressions / position.reach : 0

      // CTR (click-through rate) - impressions must be non-zero
      position.ctr = position.impressions > 0 ? (position.clicks / position.impressions) * 100 : 0

      // CPC (cost per click) - clicks must be non-zero
      position.cpc = position.clicks > 0 ? position.spend / position.clicks : 0

      // CPM (cost per thousand impressions) - impressions must be non-zero
      position.cpm = position.impressions > 0 ? (position.spend / position.impressions) * 1000 : 0
    })

    return Object.values(positions)
  }, [data])

  // Prepare device data
  const deviceData = useMemo(() => {
    const devices: Record<string, PlatformData> = {}

    // Group by device
    data?.forEach((item) => {
      const device = item.impression_device
      if (!devices[device]) {
        devices[device] = {
          name: device,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      devices[device].impressions += Number(item.impressions || 0)
      devices[device].clicks += Number(item.clicks || 0)
      devices[device].spend += Number(item.spend || 0)
      devices[device].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each device
    Object.values(devices).forEach((device) => {
      // Frequency (reach must be non-zero to calculate)
      device.frequency = device.reach > 0 ? device.impressions / device.reach : 0

      // CTR (click-through rate) - impressions must be non-zero
      device.ctr = device.impressions > 0 ? (device.clicks / device.impressions) * 100 : 0

      // CPC (cost per click) - clicks must be non-zero
      device.cpc = device.clicks > 0 ? device.spend / device.clicks : 0

      // CPM (cost per thousand impressions) - impressions must be non-zero
      device.cpm = device.impressions > 0 ? (device.spend / device.impressions) * 1000 : 0
    })

    return Object.values(devices)
  }, [data])

  // Prepare platform-specific device data (for Facebook and Instagram)
  const platformDeviceData = useMemo(() => {
    const result: {
      facebook: Record<string, PlatformData>
      instagram: Record<string, PlatformData>
    } = {
      facebook: {},
      instagram: {},
    }

    // Group by platform and device
    data?.forEach((item) => {
      const platform = item.publisher_platform.toLowerCase()
      const device = item.impression_device

      // Skip if not Facebook or Instagram
      if (platform !== "facebook" && platform !== "instagram") return

      if (!result[platform as "facebook" | "instagram"][device]) {
        result[platform as "facebook" | "instagram"][device] = {
          name: device,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      result[platform as "facebook" | "instagram"][device].impressions += Number(item.impressions || 0)
      result[platform as "facebook" | "instagram"][device].clicks += Number(item.clicks || 0)
      result[platform as "facebook" | "instagram"][device].spend += Number(item.spend || 0)
      result[platform as "facebook" | "instagram"][device].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each platform-device combo
    ;["facebook", "instagram"].forEach((platform) => {
      Object.values(result[platform as "facebook" | "instagram"]).forEach((device) => {
        // Frequency (reach must be non-zero to calculate)
        device.frequency = device.reach > 0 ? device.impressions / device.reach : 0

        // CTR (click-through rate) - impressions must be non-zero
        device.ctr = device.impressions > 0 ? (device.clicks / device.impressions) * 100 : 0

        // CPC (cost per click) - clicks must be non-zero
        device.cpc = device.clicks > 0 ? device.spend / device.clicks : 0

        // CPM (cost per thousand impressions) - impressions must be non-zero
        device.cpm = device.impressions > 0 ? (device.spend / device.impressions) * 1000 : 0
      })
    })

    return {
      facebook: Object.values(result.facebook),
      instagram: Object.values(result.instagram),
    }
  }, [data])

  // Prepare platform-position data for horizontal bar chart
  const platformPositionData = useMemo(() => {
    const combinedData: Record<string, PlatformData> = {}

    // Group by platform and position combination
    data?.forEach((item) => {
      const platform = item.publisher_platform
      const position = item.platform_position.replace("facebook_", "")
      const key = `${platform} - ${position}`

      if (!combinedData[key]) {
        combinedData[key] = {
          name: key,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        }
      }

      combinedData[key].impressions += Number(item.impressions || 0)
      combinedData[key].clicks += Number(item.clicks || 0)
      combinedData[key].spend += Number(item.spend || 0)
      combinedData[key].reach += Number(item.reach || 0)
    })

    // Calculate derived metrics for each combination
    Object.values(combinedData).forEach((combo) => {
      // Frequency (reach must be non-zero to calculate)
      combo.frequency = combo.reach > 0 ? combo.impressions / combo.reach : 0

      // CTR (click-through rate) - impressions must be non-zero
      combo.ctr = combo.impressions > 0 ? (combo.clicks / combo.impressions) * 100 : 0

      // CPC (cost per click) - clicks must be non-zero
      combo.cpc = combo.clicks > 0 ? combo.spend / combo.clicks : 0

      // CPM (cost per thousand impressions) - impressions must be non-zero
      combo.cpm = combo.impressions > 0 ? (combo.spend / combo.impressions) * 1000 : 0
    })

    return Object.values(combinedData).sort(
      (a, b) =>
        (b[selectedMetric as keyof PlatformData] as number) - (a[selectedMetric as keyof PlatformData] as number),
    )
  }, [data, selectedMetric])

  // Color palette
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#4BC0C0", "#FF6384"]

  // Format metric value for display
  const formatMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case "spend":
        return `$${Number(value).toFixed(2)}`
      case "cpc":
        return `$${Number(value).toFixed(2)}`
      case "cpm":
        return `$${Number(value).toFixed(2)}`
      case "ctr":
        return `${Number(value).toFixed(2)}%`
      case "frequency":
        return Number(value).toFixed(2)
      default:
        return Number(value).toLocaleString()
    }
  }

  // Custom name for the metrics
  const getMetricName = (metric: string) => {
    const metricMap: Record<string, string> = {
      impressions: "Impressions",
      clicks: "Clicks",
      spend: "Spend ($)",
      reach: "Reach",
      frequency: "Frequency",
      ctr: "CTR (%)",
      cpc: "CPC ($)",
      cpm: "CPM ($)",
    }
    return metricMap[metric] || metric
  }

  // Toggle device view handler
  const toggleDeviceView = () => {
    setShowAllDevices(!showAllDevices)
  }

  return (
    <Card className="mb-6 border rounded-xl shadow-lg overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-500 p-6">
        <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
          <LayoutDashboard className="h-6 w-6" />
          Ad Placement Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Metric Filter */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Metric for Analysis</label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-full md:w-60 bg-white border-gray-300 hover:border-teal-500 transition-colors">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value} className="hover:bg-teal-50">
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={chartTab} onValueChange={setChartTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="platforms"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-all"
            >
              Platforms
            </TabsTrigger>
            <TabsTrigger
              value="positions"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-all"
            >
              Positions
            </TabsTrigger>
            <TabsTrigger
              value="devices"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-all"
            >
              Devices
            </TabsTrigger>
          </TabsList>

          {/* PLATFORMS TAB */}
          <TabsContent value="platforms" className="space-y-4">
          <Card className="shadow-md border border-gray-100 overflow-hidden">
  <CardHeader className="pb-2 bg-teal-500 text-white">
    <CardTitle className="text-lg flex items-center gap-2">
      <PieChart className="h-4 w-4" />
      Platform Distribution by {getMetricName(selectedMetric)}
    </CardTitle>
  </CardHeader>
  <CardContent className="h-72 p-4 flex justify-center items-center">
    {platformData && platformData.length > 0 ? (
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={platformData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey={selectedMetric}
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: "#666666", strokeWidth: 0.5, strokeDasharray: "2 2" }}
            animationDuration={800}
            animationBegin={0}
          >
            {platformData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatMetricValue(value, selectedMetric)}
            labelFormatter={(name) => `Platform: ${name}`}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ paddingTop: "20px" }}
          />
        </RePieChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
    )}
  </CardContent>
</Card>

          </TabsContent>

          {/* POSITIONS TAB */}
          <TabsContent value="positions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Treemap for Position Distribution (always showing spend) */}
              <Card className="shadow-md border border-gray-100 overflow-hidden">
  <CardHeader className="pb-2 bg-teal-500 text-white">
    <CardTitle className="text-lg flex items-center gap-2">
      <PieChart className="h-4 w-4" />
      Position Distribution by Spend
    </CardTitle>
  </CardHeader>
  <CardContent className="h-72 p-4 flex items-center justify-center">
    {positionData && positionData.length > 0 ? (
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={positionData}
          dataKey="spend"
          aspectRatio={4 / 3}
          stroke="#f"
          strokeWidth={2}
          nameKey="name"
          animationDuration={800}
          animationBegin={0}
        >
          {positionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
          ))}
          <Tooltip
            formatter={(value: number) => `$${Number(value).toFixed(2)}`}
            labelFormatter={(name) => `Position: ${name}`}
            contentStyle={{
              backgroundColor: "#d1d8e0",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    ) : (
      <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
    )}
  </CardContent>

  {/* Legend Below the Chart */}
  {positionData && positionData.length > 0 && (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="grid grid-cols-2 gap-3">
        {positionData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center space-x-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span className="text-sm text-gray-700">{entry.name}:</span>
            <span className="text-sm font-semibold text-gray-800">${entry.spend.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )}
</Card>





              {/* Horizontal Bar Chart for Placement Combinations */}
              <Card className="shadow-md border border-gray-100 overflow-hidden">
  <CardHeader className="pb-2 bg-teal-500 text-white">
    <CardTitle className="text-lg flex items-center gap-2">
      <BarChart className="h-4 w-4" />
      Platform-Position by {getMetricName(selectedMetric)}
    </CardTitle>
  </CardHeader>
  <CardContent className="h-72 p-4 flex items-center justify-center">
    {platformPositionData && platformPositionData.length > 0 ? (
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          layout="vertical"
          data={platformPositionData.slice(0, 5)} // Show top 5 for readability
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barSize={20}
          animationDuration={800}
          animationBegin={0}
        >
          <XAxis
            type="number"
            dataKey={selectedMetric}
            tick={false}
            label={{ value: getMetricName(selectedMetric), position: "insideBottom", offset: 3 }}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={150}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              value.length > 20 ? `${value.substring(0, 20)}...` : value
            }
          />
          <Tooltip
            formatter={(value: number) => formatMetricValue(value, selectedMetric)}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Bar
            dataKey={selectedMetric}
            fill="#8884d8"
            name={getMetricName(selectedMetric)}
            radius={[0, 4, 4, 0]}
          >
            {platformPositionData.slice(0, 5).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
    )}
  </CardContent>
</Card>

            </div>
          </TabsContent>

          {/* DEVICES TAB */}
          {/* DEVICES TAB */}
<TabsContent value="devices" className="space-y-4">
  {/* Toggle Button for Device View */}
  <div className="flex justify-center mb-4">
    <div className="bg-gray-100 p-1 rounded-full inline-flex items-center">
      <button
        onClick={toggleDeviceView}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          showAllDevices ? "bg-teal-500 text-white shadow-md" : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        All Devices
      </button>
      <button
        onClick={toggleDeviceView}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          !showAllDevices ? "bg-teal-500 text-white shadow-md" : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        Facebook & Instagram
      </button>
    </div>
  </div>

  {showAllDevices ? (
    // All Devices View
    <CardContent className="p-6" style={{ height: Math.max(350, deviceData.length * 45) }}>
      {deviceData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={350}>
            <RePieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={Math.min(120, deviceData.length * 20)}
                dataKey={selectedMetric}
                nameKey="name"
                paddingAngle={5}
                label={({ name, percent }) =>
                  percent > 0.02 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                }
                labelStyle={{ fontSize: "14px", fontWeight: "bold", fill: "#444" }}
                labelLine={{ stroke: "#888", strokeWidth: 1 }}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {deviceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              {/* Enhanced Tooltip */}
              <Tooltip
                formatter={(value: number) => formatMetricValue(value, selectedMetric)}
                labelFormatter={(name) => `Device: ${name}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  padding: "12px",
                  fontSize: "14px",
                }}
                itemStyle={{ color: "#555", fontWeight: "bold" }}
              />

              {/* Legend with Better Spacing */}
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={12}
                formatter={(value, entry, index) => {
                  const { color } = entry;
                  const dataItem = deviceData[index];
                  const total = deviceData.reduce(
                    (sum, item) => sum + (item[selectedMetric as keyof PlatformData] as number),
                    0
                  );
                  const percentage = total > 0
                    ? (((dataItem[selectedMetric as keyof PlatformData] as number) / total) * 100).toFixed(0)
                    : 0;

                  return (
                    <span style={{ color: "#444", fontSize: "14px", marginRight: "10px" }}>
                      <span style={{ color, marginRight: "4px" }}>●</span>
                      {value}: {percentage}%
                    </span>
                  );
                }}
                wrapperStyle={{ paddingTop: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
              />
            </RePieChart>
          </ResponsiveContainer>

          {/* Color-wise Value Summary */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {deviceData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-gray-700 font-medium">
                  {entry.name}: {formatMetricValue(entry[selectedMetric as keyof PlatformData] as number, selectedMetric)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
      )}
    </CardContent>
  ) : (
    // Facebook & Instagram Devices View
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Facebook Devices Chart */}
      <Card className="shadow-md border border-gray-100 overflow-hidden">
        <CardHeader className="pb-2 bg-teal-500 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Facebook Devices by {getMetricName(selectedMetric)}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72 p-4">
          {platformDeviceData.facebook && platformDeviceData.facebook.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={platformDeviceData.facebook}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey={selectedMetric}
                  nameKey="name"
                  paddingAngle={2}
                  label={({ name, percent }) => {
                    // Only show label if percentage is significant
                    return percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : ""
                  }}
                  labelLine={{ stroke: "#666666", strokeWidth: 0.5, strokeDasharray: "2 2" }}
                  animationDuration={800}
                  animationBegin={0}
                >
                  {platformDeviceData.facebook.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatMetricValue(value, selectedMetric)}
                  labelFormatter={(name) => `Device: ${name}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value, entry, index) => {
                    // Extract the color from the entry
                    const { color } = entry
                    // Find the corresponding data item
                    const dataItem = platformDeviceData.facebook[index]
                    // Calculate the percentage
                    const total = platformDeviceData.facebook.reduce(
                      (sum, item) => sum + (item[selectedMetric as keyof PlatformData] as number),
                      0,
                    )
                    const percentage =
                      total > 0
                        ? (((dataItem[selectedMetric as keyof PlatformData] as number) / total) * 100).toFixed(
                            0,
                          )
                        : 0
                    // Create a styled legend entry with percentage
                    return (
                      <span style={{ color: "#555", fontSize: "11px" }}>
                        <span style={{ color }}>{value}: </span>
                        {percentage}%
                      </span>
                    )
                  }}
                  wrapperStyle={{
                    fontSize: "11px",
                    paddingRight: "20px",
                    width: "40%",
                    overflowX: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
          )}
        </CardContent>
      </Card>

      {/* Instagram Devices Chart */}
      <Card className="shadow-md border border-gray-100 overflow-hidden">
        <CardHeader className="pb-2 bg-teal-500 text-white">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Instagram Devices by {getMetricName(selectedMetric)}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72 p-4">
          {platformDeviceData.instagram && platformDeviceData.instagram.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={platformDeviceData.instagram}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey={selectedMetric}
                  nameKey="name"
                  paddingAngle={2}
                  label={({ name, percent }) => {
                    // Only show label if percentage is significant
                    return percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : ""
                  }}
                  labelLine={{ stroke: "#666666", strokeWidth: 0.5, strokeDasharray: "2 2" }}
                  animationDuration={800}
                  animationBegin={0}
                >
                  {platformDeviceData.instagram.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatMetricValue(value, selectedMetric)}
                  labelFormatter={(name) => `Device: ${name}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value, entry, index) => {
                    // Extract the color from the entry
                    const { color } = entry
                    // Find the corresponding data item
                    const dataItem = platformDeviceData.instagram[index]
                    // Calculate the percentage
                    const total = platformDeviceData.instagram.reduce(
                      (sum, item) => sum + (item[selectedMetric as keyof PlatformData] as number),
                      0,
                    )
                    const percentage =
                      total > 0
                        ? (((dataItem[selectedMetric as keyof PlatformData] as number) / total) * 100).toFixed(
                            0,
                          )
                        : 0
                    // Create a styled legend entry with percentage
                    return (
                      <span style={{ color: "#555", fontSize: "11px" }}>
                        <span style={{ color }}>{value}: </span>
                        {percentage}%
                      </span>
                    )
                  }}
                  wrapperStyle={{
                    fontSize: "11px",
                    paddingRight: "20px",
                    width: "40%",
                    overflowX: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )}
</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default FilteredCharts

