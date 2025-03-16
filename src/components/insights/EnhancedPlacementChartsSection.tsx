import { useState, useMemo } from "react";
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
  Treemap
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, BarChart, LayoutDashboard } from "lucide-react";

const FilteredCharts = ({ data, chartTab, setChartTab }) => {
  // State for selected metric
  const [selectedMetric, setSelectedMetric] = useState("impressions");

  // Metrics for filter
  const metrics = [
    { value: "impressions", label: "Impressions" },
    { value: "clicks", label: "Clicks" },
    { value: "spend", label: "Spend" },
    { value: "reach", label: "Reach" },
    { value: "frequency", label: "Frequency" },
    { value: "ctr", label: "CTR" },
    { value: "cpc", label: "CPC" },
    { value: "cpm", label: "CPM" }
  ];

  // Prepare platform data
  const platformData = useMemo(() => {
    const platforms = {};
    
    // Group by platform
    data?.forEach(item => {
      const platform = item.publisher_platform;
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
          cpm: 0
        };
      }
      
      platforms[platform].impressions += Number(item.impressions || 0);
      platforms[platform].clicks += Number(item.clicks || 0);
      platforms[platform].spend += Number(item.spend || 0);
      platforms[platform].reach += Number(item.reach || 0);
    });
    
    // Calculate derived metrics for each platform
    Object.values(platforms).forEach(platform => {
      // Frequency (reach must be non-zero to calculate)
      platform.frequency = platform.reach > 0 ? platform.impressions / platform.reach : 0;
      
      // CTR (click-through rate) - impressions must be non-zero
      platform.ctr = platform.impressions > 0 ? (platform.clicks / platform.impressions) * 100 : 0;
      
      // CPC (cost per click) - clicks must be non-zero
      platform.cpc = platform.clicks > 0 ? platform.spend / platform.clicks : 0;
      
      // CPM (cost per thousand impressions) - impressions must be non-zero
      platform.cpm = platform.impressions > 0 ? (platform.spend / platform.impressions) * 1000 : 0;
    });
    
    return Object.values(platforms);
  }, [data]);

  // Prepare position data
  const positionData = useMemo(() => {
    const positions = {};
    
    // Group by position
    data?.forEach(item => {
      const position = item.platform_position.replace('facebook_', '');
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
          cpm: 0
        };
      }
      
      positions[position].impressions += Number(item.impressions || 0);
      positions[position].clicks += Number(item.clicks || 0);
      positions[position].spend += Number(item.spend || 0);
      positions[position].reach += Number(item.reach || 0);
    });
    
    // Calculate derived metrics for each position
    Object.values(positions).forEach(position => {
      // Frequency (reach must be non-zero to calculate)
      position.frequency = position.reach > 0 ? position.impressions / position.reach : 0;
      
      // CTR (click-through rate) - impressions must be non-zero
      position.ctr = position.impressions > 0 ? (position.clicks / position.impressions) * 100 : 0;
      
      // CPC (cost per click) - clicks must be non-zero
      position.cpc = position.clicks > 0 ? position.spend / position.clicks : 0;
      
      // CPM (cost per thousand impressions) - impressions must be non-zero
      position.cpm = position.impressions > 0 ? (position.spend / position.impressions) * 1000 : 0;
    });
    
    return Object.values(positions);
  }, [data]);

  // Prepare device data
  const deviceData = useMemo(() => {
    const devices = {};
    
    // Group by device
    data?.forEach(item => {
      const device = item.impression_device;
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
          cpm: 0
        };
      }
      
      devices[device].impressions += Number(item.impressions || 0);
      devices[device].clicks += Number(item.clicks || 0);
      devices[device].spend += Number(item.spend || 0);
      devices[device].reach += Number(item.reach || 0);
    });
    
    // Calculate derived metrics for each device
    Object.values(devices).forEach(device => {
      // Frequency (reach must be non-zero to calculate)
      device.frequency = device.reach > 0 ? device.impressions / device.reach : 0;
      
      // CTR (click-through rate) - impressions must be non-zero
      device.ctr = device.impressions > 0 ? (device.clicks / device.impressions) * 100 : 0;
      
      // CPC (cost per click) - clicks must be non-zero
      device.cpc = device.clicks > 0 ? device.spend / device.clicks : 0;
      
      // CPM (cost per thousand impressions) - impressions must be non-zero
      device.cpm = device.impressions > 0 ? (device.spend / device.impressions) * 1000 : 0;
    });
    
    return Object.values(devices);
  }, [data]);
  
  // Prepare platform-specific device data (for Facebook and Instagram)
  const platformDeviceData = useMemo(() => {
    const result = {
      facebook: {},
      instagram: {}
    };
    
    // Group by platform and device
    data?.forEach(item => {
      const platform = item.publisher_platform.toLowerCase();
      const device = item.impression_device;
      
      // Skip if not Facebook or Instagram
      if (platform !== 'facebook' && platform !== 'instagram') return;
      
      if (!result[platform][device]) {
        result[platform][device] = {
          name: device,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          frequency: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0
        };
      }
      
      result[platform][device].impressions += Number(item.impressions || 0);
      result[platform][device].clicks += Number(item.clicks || 0);
      result[platform][device].spend += Number(item.spend || 0);
      result[platform][device].reach += Number(item.reach || 0);
    });
    
    // Calculate derived metrics for each platform-device combo
    ['facebook', 'instagram'].forEach(platform => {
      Object.values(result[platform]).forEach(device => {
        // Frequency (reach must be non-zero to calculate)
        device.frequency = device.reach > 0 ? device.impressions / device.reach : 0;
        
        // CTR (click-through rate) - impressions must be non-zero
        device.ctr = device.impressions > 0 ? (device.clicks / device.impressions) * 100 : 0;
        
        // CPC (cost per click) - clicks must be non-zero
        device.cpc = device.clicks > 0 ? device.spend / device.clicks : 0;
        
        // CPM (cost per thousand impressions) - impressions must be non-zero
        device.cpm = device.impressions > 0 ? (device.spend / device.impressions) * 1000 : 0;
      });
    });
    
    return {
      facebook: Object.values(result.facebook),
      instagram: Object.values(result.instagram)
    };
  }, [data]);

  // Prepare platform-position data for horizontal bar chart
  const platformPositionData = useMemo(() => {
    const combinedData = {};
    
    // Group by platform and position combination
    data?.forEach(item => {
      const platform = item.publisher_platform;
      const position = item.platform_position.replace('facebook_', '');
      const key = `${platform} - ${position}`;
      
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
          cpm: 0
        };
      }
      
      combinedData[key].impressions += Number(item.impressions || 0);
      combinedData[key].clicks += Number(item.clicks || 0);
      combinedData[key].spend += Number(item.spend || 0);
      combinedData[key].reach += Number(item.reach || 0);
    });
    
    // Calculate derived metrics for each combination
    Object.values(combinedData).forEach(combo => {
      // Frequency (reach must be non-zero to calculate)
      combo.frequency = combo.reach > 0 ? combo.impressions / combo.reach : 0;
      
      // CTR (click-through rate) - impressions must be non-zero
      combo.ctr = combo.impressions > 0 ? (combo.clicks / combo.impressions) * 100 : 0;
      
      // CPC (cost per click) - clicks must be non-zero
      combo.cpc = combo.clicks > 0 ? combo.spend / combo.clicks : 0;
      
      // CPM (cost per thousand impressions) - impressions must be non-zero
      combo.cpm = combo.impressions > 0 ? (combo.spend / combo.impressions) * 1000 : 0;
    });
    
    return Object.values(combinedData).sort((a, b) => b[selectedMetric] - a[selectedMetric]);
  }, [data, selectedMetric]);

  // Color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4BC0C0', '#FF6384'];
  
  // Format metric value for display
  const formatMetricValue = (value, metric) => {
    switch (metric) {
      case "spend":
        return `${Number(value).toFixed(2)}`;
      case "cpc":
        return `${Number(value).toFixed(2)}`;
      case "cpm":
        return `${Number(value).toFixed(2)}`;
      case "ctr":
        return `${Number(value).toFixed(2)}%`;
      case "frequency":
        return Number(value).toFixed(2);
      default:
        return Number(value).toLocaleString();
    }
  };

  // Custom name for the metrics
  const getMetricName = (metric) => {
    const metricMap = {
      impressions: "Impressions",
      clicks: "Clicks",
      spend: "Spend ($)",
      reach: "Reach",
      frequency: "Frequency",
      ctr: "CTR (%)",
      cpc: "CPC ($)",
      cpm: "CPM ($)"
    };
    return metricMap[metric] || metric;
  };

  return (
    <Card className="mb-6 border rounded-xl shadow-lg overflow-hidden">
      <CardHeader className="bg-teal-500 p-6">
        <CardTitle className="text-white flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          Filtered Ad Placement Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Metric Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Metric</label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-full md:w-60">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Tabs value={chartTab} onValueChange={setChartTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>
          
          {/* PLATFORMS TAB */}
          <TabsContent value="platforms" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-blue-600" />
                  Platform Distribution by {getMetricName(selectedMetric)}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey={selectedMetric}
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatMetricValue(value, selectedMetric)} 
                      labelFormatter={(name) => `Platform: ${name}`}
                    />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* POSITIONS TAB */}
          <TabsContent value="positions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Treemap for Position Distribution (always showing spend) */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-purple-600" />
                    Position Distribution (Spend)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={positionData}
                      dataKey="spend"
                      aspectRatio={4/3}
                      stroke="#fff"
                      nameKey="name"
                    >
                      {positionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <Tooltip 
                        formatter={(value) => `$${Number(value).toFixed(2)}`} 
                        labelFormatter={(name) => `Position: ${name}`}
                      />
                    </Treemap>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Horizontal Bar Chart for Placement Combinations */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-indigo-600" />
                    Platform-Position by {getMetricName(selectedMetric)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      layout="vertical"
                      data={platformPositionData.slice(0, 5)} // Show top 5 for readability
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip 
                        formatter={(value) => formatMetricValue(value, selectedMetric)}
                      />
                      <Bar 
                        dataKey={selectedMetric} 
                        fill="#8884d8" 
                        name={getMetricName(selectedMetric)} 
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          
          {/* DEVICES TAB */}
<TabsContent value="devices" className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* All Devices Chart */}
    <Card className="shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white">
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          All Devices by {getMetricName(selectedMetric)}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 p-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              dataKey={selectedMetric}
              nameKey="name"
              paddingAngle={2}
              label={({ name, percent }) => {
                // Only show label if percentage is significant
                return percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : '';
              }}
              labelLine={{ stroke: '#666666', strokeWidth: 0.5, strokeDasharray: '2 2' }}
            >
              {deviceData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatMetricValue(value, selectedMetric)} 
              labelFormatter={(name) => `Device: ${name}`}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              iconType="circle"
              iconSize={8}
              formatter={(value, entry, index) => {
                // Extract the color from the entry
                const { color } = entry;
                // Find the corresponding data item
                const dataItem = deviceData[index];
                // Calculate the percentage
                const total = deviceData.reduce((sum, item) => sum + item[selectedMetric], 0);
                const percentage = total > 0 ? (dataItem[selectedMetric] / total * 100).toFixed(0) : 0;
                // Create a styled legend entry with percentage
                return (
                  <span style={{ color: '#555', fontSize: '10px' }}>
                    <span style={{ color }}>{value}: </span>
                    {percentage}%
                  </span>
                );
              }}
              wrapperStyle={{ 
                fontSize: '11px', 
                paddingRight: '20px',
                width: '40%', 
                overflowX: 'hidden', 
                textOverflow: 'ellipsis',
              }}
            />
          </RePieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    
    {/* Facebook Devices Chart */}
    <Card className="shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Facebook Devices by {getMetricName(selectedMetric)}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 p-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={platformDeviceData.facebook}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              dataKey={selectedMetric}
              nameKey="name"
              paddingAngle={2}
              label={({ name, percent }) => {
                // Only show label if percentage is significant
                return percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : '';
              }}
              labelLine={{ stroke: '#666666', strokeWidth: 0.5, strokeDasharray: '2 2' }}
            >
              {platformDeviceData.facebook.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatMetricValue(value, selectedMetric)} 
              labelFormatter={(name) => `Device: ${name}`}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              iconType="circle"
              iconSize={8}
              formatter={(value, entry, index) => {
                // Extract the color from the entry
                const { color } = entry;
                // Find the corresponding data item
                const dataItem = platformDeviceData.facebook[index];
                // Calculate the percentage
                const total = platformDeviceData.facebook.reduce((sum, item) => sum + item[selectedMetric], 0);
                const percentage = total > 0 ? (dataItem[selectedMetric] / total * 100).toFixed(0) : 0;
                // Create a styled legend entry with percentage
                return (
                  <span style={{ color: '#555', fontSize: '10px' }}>
                    <span style={{ color }}>{value}: </span>
                    {percentage}%
                  </span>
                );
              }}
              wrapperStyle={{ 
                fontSize: '11px', 
                paddingRight: '20px',
                width: '40%', 
                overflowX: 'hidden', 
                textOverflow: 'ellipsis',
              }}
            />
          </RePieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    
    {/* Instagram Devices Chart */}
    <Card className="shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-rose-600 to-rose-500 text-white">
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Instagram Devices by {getMetricName(selectedMetric)}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 p-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={platformDeviceData.instagram}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              dataKey={selectedMetric}
              nameKey="name"
              paddingAngle={2}
              label={({ name, percent }) => {
                // Only show label if percentage is significant
                return percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : '';
              }}
              labelLine={{ stroke: '#666666', strokeWidth: 0.5, strokeDasharray: '2 2' }}
            >
              {platformDeviceData.instagram.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatMetricValue(value, selectedMetric)} 
              labelFormatter={(name) => `Device: ${name}`}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              iconType="circle"
              iconSize={8}
              formatter={(value, entry, index) => {
                // Extract the color from the entry
                const { color } = entry;
                // Find the corresponding data item
                const dataItem = platformDeviceData.instagram[index];
                // Calculate the percentage
                const total = platformDeviceData.instagram.reduce((sum, item) => sum + item[selectedMetric], 0);
                const percentage = total > 0 ? (dataItem[selectedMetric] / total * 100).toFixed(0) : 0;
                // Create a styled legend entry with percentage
                return (
                  <span style={{ color: '#555', fontSize: '10px' }}>
                    <span style={{ color }}>{value}: </span>
                    {percentage}%
                  </span>
                );
              }}
              wrapperStyle={{ 
                fontSize: '11px', 
                paddingRight: '20px',
                width: '40%', 
                overflowX: 'hidden', 
                textOverflow: 'ellipsis',
              }}
            />
          </RePieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FilteredCharts;