// import { useState } from "react";
// import { motion } from "framer-motion";
// import { 
//   Share2, 
//   MonitorSmartphone, 
//   Eye, 
//   MousePointerClick, 
//   DollarSign, 
//   BarChart, 
//   CircleDollarSign, 
//   Users,
//   Smartphone,
//   Tablet,
//   Monitor,
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// interface PlacementInsightsProps {
//   data: any[];
//   isLoading: boolean;
// }

// const PlacementInsights = ({ data, isLoading }: PlacementInsightsProps) => {
//   const [platformFilter, setPlatformFilter] = useState<string>("all");

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-10">
//         <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   // Filter data based on selected platform
//   const filteredData = data?.filter(insight => 
//     platformFilter === "all" || insight.publisher_platform === platformFilter
//   ) || [];

//   // Calculate stats for summary cards
//   const totalSpend = data?.reduce((sum, item) => sum + Number(item.spend || 0), 0).toFixed(2) || "0";
//   const uniquePlatforms = new Set(data?.map(i => i.publisher_platform)).size;
//   const uniquePlacements = new Set(data?.map(i => i.platform_position)).size;
//   const uniqueDevices = new Set(data?.map(i => i.impression_device)).size;
  
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
      
//       <Card className="overflow-hidden border-0 rounded-xl shadow-lg bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
//         <div className="bg-teal-500 py-4 px-6">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//             <div className="flex items-center gap-2">
//               <div className="bg-white/20 p-2 rounded-lg">
//                 <Share2 className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-white">Placement Breakdown</h3>
//                 <p className="text-xs text-white/70">Detailed analytics by platform, position and device</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
//                 <label htmlFor="platform-filter" className="text-white text-sm font-medium">Platform:</label>
//                 <select
//                   id="platform-filter"
//                   value={platformFilter}
//                   onChange={(e) => setPlatformFilter(e.target.value)}
//                   className="bg-white/30 text-teal-800 text-sm rounded px-2 py-1 border-0 focus:ring-2 focus:ring-white/50"
//                 >
//                   <option value="all">All Platforms</option>
//                   <option value="facebook">Facebook</option>
//                   <option value="instagram">Instagram</option>
//                 </select>
//               </div>
//               <Badge className="bg-teal-600/70 hover:bg-teal-600 text-white border-0 text-xs px-3 py-1 rounded-full shadow-sm">
//                 {filteredData.length} Entries
//               </Badge>
//             </div>
//           </div>
//         </div>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-blue-50">
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     Platform
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     Position
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <MonitorSmartphone className="h-4 w-4 text-amber-600" />
//                       <span>Device</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <Eye className="h-4 w-4 text-blue-600" />
//                       <span>Impressions</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <MousePointerClick className="h-4 w-4 text-green-600" />
//                       <span>Clicks</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <DollarSign className="h-4 w-4 text-emerald-600" />
//                       <span>Spend</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <BarChart className="h-4 w-4 text-indigo-600" />
//                       <span>CTR</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <CircleDollarSign className="h-4 w-4 text-pink-600" />
//                       <span>CPC</span>
//                     </div>
//                   </TableHead>
//                   <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
//                     <div className="flex items-center gap-2">
//                       <Users className="h-4 w-4 text-red-600" />
//                       <span>CPM</span>
//                     </div>
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredData.map((insight, index) => {
//                   // Determine device icon
//                   let DeviceIcon = MonitorSmartphone;
//                   let deviceColor = "text-gray-500";
                  
//                   if (insight.impression_device.includes('iphone')) {
//                     DeviceIcon = Smartphone;
//                     deviceColor = "text-blue-500";
//                   } else if (insight.impression_device.includes('android')) {
//                     DeviceIcon = Smartphone;
//                     deviceColor = "text-green-500";
//                   } else if (insight.impression_device.includes('ipad')) {
//                     DeviceIcon = Tablet;
//                     deviceColor = "text-purple-500";
//                   } else if (insight.impression_device.includes('desktop')) {
//                     DeviceIcon = Monitor;
//                     deviceColor = "text-gray-600";
//                   }
                  
//                   // For interactive rows with animation
//                   return (
//                     <motion.tr
//                       key={index}
//                       className="border-b border-blue-100 dark:border-blue-700 hover:bg-blue-50/70 dark:hover:bg-blue-800/50 transition-colors duration-200"
//                       whileHover={{ scale: 1.01 }}
//                       transition={{ type: "spring", stiffness: 300 }}
//                     >
//                       <TableCell className="py-4 px-2 font-medium text-blue-900 dark:text-blue-100">
//                         {insight.publisher_platform}
//                       </TableCell>
//                       <TableCell className="py-4 px-2 text-blue-700 dark:text-blue-300">
//                         {insight.platform_position.replace('facebook_', '')}
//                       </TableCell>
//                       <TableCell className="py-4 px-2 text-blue-700 dark:text-blue-300">
//                         <div className="flex items-center gap-2">
//                           <div className={`bg-gray-100 p-1.5 rounded-md`}>
//                             <DeviceIcon className={`w-4 h-4 ${deviceColor}`} />
//                           </div>
//                           <span>{insight.impression_device}</span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
//                           <Eye className="w-4 h-4 text-blue-500" />
//                           <span className="font-semibold text-blue-700">
//                             {Number.parseInt(insight.impressions || "0").toLocaleString()}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
//                           <MousePointerClick className="w-4 h-4 text-green-500" />
//                           <span className="font-semibold text-green-700">
//                             {Number.parseInt(insight.clicks || "0").toLocaleString()}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
//                           <DollarSign className="w-4 h-4 text-emerald-500" />
//                           <span className="font-semibold text-emerald-700">
//                             ${Number.parseFloat(insight.spend || "0").toFixed(2)}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg">
//                           <BarChart className="w-4 h-4 text-indigo-500" />
//                           <span className="font-semibold text-indigo-700">
//                             {Number.parseFloat(insight.ctr || "0").toFixed(2)}%
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-lg">
//                           <CircleDollarSign className="w-4 h-4 text-pink-500" />
//                           <span className="font-semibold text-pink-700">
//                             {insight.cpc ? `$${Number.parseFloat(insight.cpc).toFixed(2)}` : "-"}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="py-4 px-2">
//                         <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg">
//                           <Users className="w-4 h-4 text-red-500" />
//                           <span className="font-semibold text-red-700">
//                             ${Number.parseFloat(insight.cpm || "0").toFixed(2)}
//                           </span>
//                         </div>
//                       </TableCell>
//                     </motion.tr>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default PlacementInsights;




import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Share2, 
  MonitorSmartphone, 
  Eye, 
  MousePointerClick, 
  DollarSign, 
  BarChart, 
  CircleDollarSign, 
  Users,
  Smartphone,
  Tablet,
  Monitor,
  PieChart,
  Activity
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedCharts from "@/components/insights/EnhancedPlacementChartsSection";


interface PlacementInsightsProps {
  data: any[];
  isLoading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4BC0C0', '#FF6384'];

const PlacementInsights = ({ data, isLoading }: PlacementInsightsProps) => {
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [chartTab, setChartTab] = useState<string>("platforms");

  // Calculate stats for summary cards
  const totalSpend = useMemo(() => 
    data?.reduce((sum, item) => sum + Number(item.spend || 0), 0).toFixed(2) || "0", 
    [data]
  );
  
  // Filter data based on selected platform - do this in a useMemo to avoid recalculation
  const filteredData = useMemo(() => 
    data?.filter(insight => platformFilter === "all" || insight.publisher_platform === platformFilter) || [],
    [data, platformFilter]
  );

  // Prepare chart data - ensure these don't change between renders
  const platformChartData = useMemo(() => {
    const platforms = {};
    data?.forEach(item => {
      const platform = item.publisher_platform;
      platforms[platform] = (platforms[platform] || 0) + Number(item.impressions || 0);
    });
    
    return Object.keys(platforms).map(name => ({
      name,
      value: platforms[name]
    }));
  }, [data]);

  const positionChartData = useMemo(() => {
    const positions = {};
    data?.forEach(item => {
      const position = item.platform_position.replace('facebook_', '');
      positions[position] = (positions[position] || 0) + Number(item.impressions || 0);
    });
    
    return Object.keys(positions).map(name => ({
      name,
      value: positions[name]
    }));
  }, [data]);

  const deviceChartData = useMemo(() => {
    const devices = {};
    data?.forEach(item => {
      const device = item.impression_device;
      devices[device] = (devices[device] || 0) + Number(item.impressions || 0);
    });
    
    return Object.keys(devices).map(name => ({
      name,
      value: devices[name]
    }));
  }, [data]);

  // Spending by platform bar chart data
  const spendByPlatformData = useMemo(() => {
    const platforms = {};
    data?.forEach(item => {
      const platform = item.publisher_platform;
      platforms[platform] = (platforms[platform] || 0) + Number(item.spend || 0);
    });
    
    return Object.keys(platforms).map(name => ({
      name,
      spend: parseFloat(platforms[name].toFixed(2))
    }));
  }, [data]);

  // Position by clicks chart data
  const clicksByPositionData = useMemo(() => {
    return positionChartData.map(pos => ({
      name: pos.name,
      clicks: data.filter(item => 
        item.platform_position.replace('facebook_', '') === pos.name
      ).reduce((sum, item) => sum + Number(item.clicks || 0), 0)
    }));
  }, [data, positionChartData]);

  // Device performance chart data
  const devicePerformanceData = useMemo(() => {
    return deviceChartData.map(device => {
      const filteredItems = data.filter(item => item.impression_device === device.name);
      const totalImpressions = filteredItems.reduce((sum, item) => sum + Number(item.impressions || 0), 0);
      const totalClicks = filteredItems.reduce((sum, item) => sum + Number(item.clicks || 0), 0);
      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      
      return {
        name: device.name,
        ctr: parseFloat(ctr.toFixed(2))
      };
    });
  }, [data, deviceChartData]);
  
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
      {/* Charts Section */}
      {/* <EnhancedCharts 
        data={data} 
        chartTab={chartTab}
        setChartTab={setChartTab}
      /> */}
      
      {/* Table Section */}
      <Card className="overflow-hidden border-0 rounded-xl shadow-lg bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
        <div className="bg-teal-500 py-4 px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Placement Breakdown</h3>
                <p className="text-xs text-white/70">Detailed analytics by platform, position and device</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <label htmlFor="platform-filter" className="text-white text-sm font-medium">Platform:</label>
                <select
                  id="platform-filter"
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="bg-white/30 text-teal-800 text-sm rounded px-2 py-1 border-0 focus:ring-2 focus:ring-white/50"
                >
                  <option value="all">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
              <Badge className="bg-teal-600/70 hover:bg-teal-600 text-white border-0 text-xs px-3 py-1 rounded-full shadow-sm">
                {filteredData.length} Entries
              </Badge>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    Platform
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    Position
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <MonitorSmartphone className="h-4 w-4 text-amber-600" />
                      <span>Device</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span>Impressions</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <MousePointerClick className="h-4 w-4 text-green-600" />
                      <span>Clicks</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span>Spend</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-indigo-600" />
                      <span>CTR</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-pink-600" />
                      <span>CPC</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-red-600" />
                      <span>CPM</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((insight, index) => {
                  // Determine device icon
                  let DeviceIcon = MonitorSmartphone;
                  let deviceColor = "text-gray-500";
                  
                  if (insight.impression_device.includes('iphone')) {
                    DeviceIcon = Smartphone;
                    deviceColor = "text-blue-500";
                  } else if (insight.impression_device.includes('android')) {
                    DeviceIcon = Smartphone;
                    deviceColor = "text-green-500";
                  } else if (insight.impression_device.includes('ipad')) {
                    DeviceIcon = Tablet;
                    deviceColor = "text-purple-500";
                  } else if (insight.impression_device.includes('desktop')) {
                    DeviceIcon = Monitor;
                    deviceColor = "text-gray-600";
                  }
                  
                  // For interactive rows with animation
                  return (
                    <motion.tr
                      key={index}
                      className="border-b border-blue-100 dark:border-blue-700 hover:bg-blue-50/70 dark:hover:bg-blue-800/50 transition-colors duration-200"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <TableCell className="py-4 px-2 font-medium text-blue-900 dark:text-blue-100">
                        {insight.publisher_platform}
                      </TableCell>
                      <TableCell className="py-4 px-2 text-blue-700 dark:text-blue-300">
                        {insight.platform_position.replace('facebook_', '')}
                      </TableCell>
                      <TableCell className="py-4 px-2 text-blue-700 dark:text-blue-300">
                        <div className="flex items-center gap-2">
                          <div className={`bg-gray-100 p-1.5 rounded-md`}>
                            <DeviceIcon className={`w-4 h-4 ${deviceColor}`} />
                          </div>
                          <span>{insight.impression_device}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-2">
                        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-blue-700">
                            {Number.parseInt(insight.impressions || "0").toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-2">
                        <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                          <MousePointerClick className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-green-700">
                            {Number.parseInt(insight.clicks || "0").toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-2">
                        <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-emerald-700">
                            ${Number.parseFloat(insight.spend || "0").toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-2">
                        <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg">
                          <BarChart className="w-4 h-4 text-indigo-500" />
                          <span className="font-semibold text-indigo-700">
                            {Number.parseFloat(insight.ctr || "0").toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-2">
                        <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-lg">
                          <CircleDollarSign className="w-4 h-4 text-pink-500" />
                          <span className="font-semibold text-pink-700">
                            {insight.cpc ? `$${Number.parseFloat(insight.cpc).toFixed(2)}` : "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-2">
                        <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                          <Users className="w-4 h-4 text-red-500" />
                          <span className="font-semibold text-red-700">
                            ${Number.parseFloat(insight.cpm || "0").toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlacementInsights;