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
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  RadialBarChart,
  CartesianGrid,
  RadialBar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, PieChart, BarChart, TrendingUp, Share2, MonitorSmartphone } from "lucide-react";

// Component for the enhanced charts section
const EnhancedCharts = ({ data, chartTab, setChartTab }) => {
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
          reach: 0
        };
      }
      
      platforms[platform].impressions += Number(item.impressions || 0);
      platforms[platform].clicks += Number(item.clicks || 0);
      platforms[platform].spend += Number(item.spend || 0);
      platforms[platform].reach += Number(item.reach || 0);
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
          ctr: 0
        };
      }
      
      positions[position].impressions += Number(item.impressions || 0);
      positions[position].clicks += Number(item.clicks || 0);
      positions[position].spend += Number(item.spend || 0);
    });
    
    // Calculate CTR for each position
    Object.values(positions).forEach(pos => {
      pos.ctr = pos.impressions > 0 ? (pos.clicks / pos.impressions) * 100 : 0;
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
          cpc: 0,
          cpm: 0
        };
      }
      
      devices[device].impressions += Number(item.impressions || 0);
      devices[device].clicks += Number(item.clicks || 0);
      devices[device].spend += Number(item.spend || 0);
    });
    
    // Calculate CPC and CPM for each device
    Object.values(devices).forEach(dev => {
      dev.cpc = dev.clicks > 0 ? dev.spend / dev.clicks : 0;
      dev.cpm = dev.impressions > 0 ? (dev.spend / dev.impressions) * 1000 : 0;
    });
    
    return Object.values(devices);
  }, [data]);

  // Color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4BC0C0', '#FF6384'];
  
  // Prepare platform-position stacked data for heatmap
  const platformPositionData = useMemo(() => {
    const result = [];
    const platformsSet = new Set();
    const positionsSet = new Set();
    
    // Get unique platforms and positions
    data?.forEach(item => {
      platformsSet.add(item.publisher_platform);
      positionsSet.add(item.platform_position.replace('facebook_', ''));
    });
    
    const platforms = Array.from(platformsSet);
    const positions = Array.from(positionsSet);
    
    // Create data structure for heatmap
    platforms.forEach(platform => {
      const entry = { name: platform };
      
      positions.forEach(position => {
        const filteredItems = data?.filter(item => 
          item.publisher_platform === platform && 
          item.platform_position.replace('facebook_', '') === position
        );
        
        const impressions = filteredItems.reduce((sum, item) => sum + Number(item.impressions || 0), 0);
        entry[position] = impressions;
      });
      
      result.push(entry);
    });
    
    return { data: result, positions };
  }, [data]);

  // Prepare date-based data for time series
  const timeSeriesData = useMemo(() => {
    const dateMap = {};
    
    // Group by date
    data?.forEach(item => {
      const date = item.date_start;
      if (!dateMap[date]) {
        dateMap[date] = {
          date,
          facebook: 0,
          instagram: 0,
          total: 0
        };
      }
      
      const platform = item.publisher_platform.toLowerCase();
      const impressions = Number(item.impressions || 0);
      dateMap[date][platform] += impressions;
      dateMap[date].total += impressions;
    });
    
    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  return (
    <Card className="mb-6 border-0 rounded-xl shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Advanced Placement Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={chartTab} onValueChange={setChartTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>
          
          {/* PLATFORMS TAB */}
          <TabsContent value="platforms" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radial Bar Chart for Platform Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-blue-600" />
                    Platform Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="15%" 
                      outerRadius="80%" 
                      data={platformData} 
                      startAngle={180} 
                      endAngle={0}
                    >
                      <RadialBar
                        label={{ fill: '#666', position: 'insideStart' }}
                        background
                        dataKey="impressions"
                        nameKey="name"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </RadialBar>
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                      <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Stacked Area Chart for Time Series */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Platform Impressions Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeSeriesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="facebook" stackId="1" stroke="#0088FE" fill="#0088FE" />
                      <Area type="monotone" dataKey="instagram" stackId="1" stroke="#FF8042" fill="#FF8042" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Divergent Stacked Bar Chart for Platform Comparison */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-purple-600" />
                  Multi-Metric Platform Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    layout="vertical"
                    data={platformData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 80 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" scale="band" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="impressions" barSize={20} fill="#0088FE" name="Impressions" />
                    <Bar dataKey="clicks" barSize={20} fill="#00C49F" name="Clicks" />
                    <Line dataKey="spend" stroke="#FF8042" name="Spend ($)" />
                    <Scatter dataKey="reach" fill="#8884d8" name="Reach" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* POSITIONS TAB */}
          <TabsContent value="positions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Treemap for Position Distribution */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-purple-600" />
                    Position Distribution (Spend)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={positionData}
                      dataKey="spend"
                      aspectRatio={4/3}
                      stroke="#fff"
                      fill="#8884d8"
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
              
              {/* Stacked Column Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-indigo-600" />
                    Position Metrics Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={positionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clicks" stackId="a" fill="#0088FE" name="Clicks" />
                      <Bar dataKey="impressions" stackId="a" fill="#00C49F" name="Impressions" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Heatmap-like visualization for platform-position correlation */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-rose-600" />
                  Platform-Position Distribution Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart
                    layout="vertical"
                    data={platformPositionData.data}
                    margin={{ top: 20, right: 20, left: 60, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => value ? value.toLocaleString() : '0'} />
                    <Legend />
                    {platformPositionData.positions.map((position, index) => (
                      <Bar 
                        key={position} 
                        dataKey={position} 
                        stackId="a" 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* DEVICES TAB */}
          <TabsContent value="devices" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar Chart for Device Performance */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                    <MonitorSmartphone className="h-4 w-4 text-amber-600" />
                    Device Performance Radar
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={120} data={deviceData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                      <Radar name="Impressions" dataKey="impressions" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                      <Radar name="Clicks" dataKey="clicks" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Divergent Stacked Bars for Cost Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-rose-600" />
                    Device Cost Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={deviceData}
                      margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#FF8042" />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="cpm" fill="#8884d8" name="CPM ($)" />
                      <Line yAxisId="right" type="monotone" dataKey="cpc" stroke="#FF8042" name="CPC ($)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Multi-metric Stacked Area Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  Device Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart
                    data={deviceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="impressions" stackId="a" fill="#0088FE" name="Impressions" />
                    <Bar dataKey="clicks" stackId="a" fill="#00C49F" name="Clicks" />
                    <Bar dataKey="spend" fill="#FFBB28" name="Spend ($)" />
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedCharts;