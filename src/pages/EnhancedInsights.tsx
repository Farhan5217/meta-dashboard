import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEnhancedInsights } from "@/services/api";
import { toast } from "sonner";
import { 
    DollarSign, 
    Eye, 
    MousePointer, 
    BarChart2, 
    CircleDollarSign, 
    PieChart,
    Users,
    Repeat,
    MousePointerClick,
    LayoutGrid,
    Smartphone,
    Tablet,
    Monitor,
    // LayoutGrid
  } from "lucide-react";
import type { DateRange, InsightParams } from "@/types/api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Sparkles,
  BarChart,
  Share2,
  MonitorSmartphone,
  Zap,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const getLast30Days = () => {
  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);
  return { from: last30Days, to: today };
};

const EnhancedInsights = () => {
  const { adAccountId } = useParams();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>(getLast30Days());
  const [activeTab, setActiveTab] = useState("placements");

  useEffect(() => {
    if (!adAccountId) {
      toast.error("No ad account selected");
      navigate("/");
    }
  }, [adAccountId, navigate]);

  // Get placement insights
  const { data: placementInsights, isLoading: placementsLoading } = useQuery({
    queryKey: ["enhancedInsights", adAccountId, dateRange, "placements"],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to || !adAccountId) return [];
      
      const params = {
        since: dateRange.from.toISOString().split('T')[0],
        until: dateRange.to.toISOString().split('T')[0],
        include_placements: true,
      };

      try {
        const response = await getEnhancedInsights(adAccountId, params);
        return response;
      } catch (error) {
        console.error('Error fetching placement insights:', error);
        toast.error("Failed to fetch placement insights");
        return [];
      }
    },
    refetchOnWindowFocus: false
  });

  // Get action insights
  const { data: actionInsights, isLoading: actionsLoading } = useQuery({
    queryKey: ["enhancedInsights", adAccountId, dateRange, "actions"],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to || !adAccountId) return [];
      
      const params = {
        since: dateRange.from.toISOString().split('T')[0],
        until: dateRange.to.toISOString().split('T')[0],
        include_actions: true,
      };

      try {
        const response = await getEnhancedInsights(adAccountId, params);
        return response;
      } catch (error) {
        console.error('Error fetching action insights:', error);
        toast.error("Failed to fetch action insights");
        return [];
      }
    },
    refetchOnWindowFocus: false
  });

  // Get combined insights
  const { data: combinedInsights, isLoading: combinedLoading } = useQuery({
    queryKey: ["enhancedInsights", adAccountId, dateRange, "combined"],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to || !adAccountId) return [];
      
      const params = {
        since: dateRange.from.toISOString().split('T')[0],
        until: dateRange.to.toISOString().split('T')[0],
        include_placements: true,
        include_actions: true,
      };

      try {
        const response = await getEnhancedInsights(adAccountId, params);
        return response;
      } catch (error) {
        console.error('Error fetching combined insights:', error);
        toast.error("Failed to fetch combined insights");
        return [];
      }
    },
    refetchOnWindowFocus: false
  });

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader
        selectedAccount={adAccountId}
        dateRange={dateRange}
        onAccountSelect={(id) => navigate(`/enhanced-insights/${id}`)}
        onDateRangeChange={setDateRange}
      />

      <div className="container mx-auto px-6 py-10">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6 text-gray-600 hover:text-teal-700 hover:bg-teal-50 flex items-center gap-2"
          onClick={() => navigate("/index")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-teal-500" />
            Enhanced Insights
          </h1>
          <p className="text-gray-600">
            Detailed analytics breakdown for your ad account with advanced metrics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl bg-white dark:bg-gray-800 p-1 border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="placements" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-teal-600 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span>Placements</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="actions" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-teal-600 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Actions</span>
              </div>
            </TabsTrigger>
            {/* <TabsTrigger 
              value="combined" 
              className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white dark:data-[state=active]:bg-teal-600 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Combined</span>
              </div>
            </TabsTrigger> */}
          </TabsList>

          {/* Placements Tab */}
          <TabsContent value="placements" className="space-y-6">
            {placementsLoading ? (
              <div className="flex items-center justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Summary Stats Cards */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <motion.div 
                    whileHover={{ y: -5 }} 
                    className="bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-5 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Platforms</h3>
                        <Share2 className="h-6 w-6 text-white opacity-75" />
                      </div>
                      <div className="mt-2">
                        <p className="text-3xl font-bold">
                          {new Set(placementInsights?.map(i => i.publisher_platform)).size}
                        </p>
                        <p className="text-xs opacity-75 mt-1">Unique platforms used</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }} 
                    className="bg-gradient-to-br from-purple-500 to-indigo-400 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-5 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Placements</h3>
                        <Share2 className="h-6 w-6 text-white opacity-75" />
                      </div>
                      <div className="mt-2">
                        <p className="text-3xl font-bold">
                          {new Set(placementInsights?.map(i => i.platform_position)).size}
                        </p>
                        <p className="text-xs opacity-75 mt-1">Different placement types</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }} 
                    className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-5 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Devices</h3>
                        <MonitorSmartphone className="h-6 w-6 text-white opacity-75" />
                      </div>
                      <div className="mt-2">
                        <p className="text-3xl font-bold">
                          {new Set(placementInsights?.map(i => i.impression_device)).size}
                        </p>
                        <p className="text-xs opacity-75 mt-1">Unique device types</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }} 
                    className="bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-5 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Total Spend</h3>
                        <DollarSign className="h-6 w-6 text-white opacity-75" />
                      </div>
                      <div className="mt-2">
                        <p className="text-3xl font-bold">
                          ${placementInsights?.reduce((sum, item) => sum + Number(item.spend || 0), 0).toFixed(2)}
                        </p>
                        <p className="text-xs opacity-75 mt-1">Across all placements</p>
                      </div>
                    </div>
                  </motion.div>
                </div> */}
                
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
                      <Badge className="bg-teal-600/70 hover:bg-teal-600 text-white border-0 text-xs px-3 py-1 rounded-full shadow-sm">
                        {placementInsights?.length || 0} Entries
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-teal-100 to-blue-50">
                            <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                              <div className="flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-teal-600" />
                                <span>Platform</span>
                              </div>
                            </TableHead>
                            <TableHead className="py-4 px-2 text-xs font-medium text-teal-800 uppercase">
                              <div className="flex items-center gap-2">
                                <LayoutGrid className="h-4 w-4 text-purple-600" />
                                <span>Position</span>
                              </div>
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
                          {placementInsights?.map((insight, index) => {
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
                                <TableCell className="py-4 px-2 ">
                                  <div className="flex items-center">
                                    <div className="bg-blue-100 p-1.5 rounded-md">
                                      <Share2 className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-blue-900 dark:text-blue-100">{insight.publisher_platform}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-2 text-blue-700 dark:text-blue-300">
                                  <div className="flex items-center gap-2">
                                    <div className="bg-purple-100 p-1.5 rounded-md">
                                      <LayoutGrid className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span>{insight.platform_position.replace('facebook_', '')}</span>
                                  </div>
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
                                      {insight.cpc ? `${Number.parseFloat(insight.cpc).toFixed(2)}` : "-"}
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
            )}
          </TabsContent>
          
          {/* <TabsContent value="placements" className="space-y-6">
            {placementsLoading ? (
              <div className="flex items-center justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-0 rounded-lg shadow-sm">
                  <div className="bg-teal-500 py-3 px-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Share2 className="h-5 w-5" />
                        Placement Breakdown
                      </div>
                      <Badge className="bg-teal-600 text-white border-0 text-xs px-2.5">
                        {placementInsights?.length || 0} Entries
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-teal-100">
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Platform</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Position</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Device</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Impressions</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Clicks</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Spend</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">CTR</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">CPC</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">CPM</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {placementInsights?.map((insight, index) => (
                            <TableRow 
                              key={index}
                              className="border-b border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors duration-200"
                            >
                              <TableCell className="py-3 px-4 font-medium text-blue-900 dark:text-blue-100">
                                {insight.publisher_platform}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                {insight.platform_position}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                <div className="flex items-center gap-2">
                                  <MonitorSmartphone className="w-4 h-4" />
                                  {insight.impression_device}
                                </div>
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                {Number.parseInt(insight.impressions || "0").toLocaleString()}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                {Number.parseInt(insight.clicks || "0").toLocaleString()}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                ${Number.parseFloat(insight.spend || "0").toFixed(2)}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                {Number.parseFloat(insight.ctr || "0").toFixed(2)}%
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                {insight.cpc ? `$${Number.parseFloat(insight.cpc).toFixed(2)}` : "-"}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                ${Number.parseFloat(insight.cpm || "0").toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent> */}

          {/* Actions Tab */}
          {/* <TabsContent value="actions" className="space-y-6">
            {actionsLoading ? (
              <div className="flex items-center justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-0 rounded-lg shadow-sm mb-8">
                  <div className="bg-teal-500 py-3 px-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Zap className="h-5 w-5" />
                        Actions Summary
                      </div>
                      <Badge className="bg-teal-600 text-white border-0 text-xs px-2.5">
                        {actionInsights?.[0]?.actions?.length || 0} Actions
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-teal-100">
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Impressions</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Clicks</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Spend</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">CTR</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">CPC</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">CPM</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {actionInsights?.map((insight, index) => (
                            <TableRow 
                              key={index}
                              className="border-b border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors duration-200"
                            >
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                {Number.parseInt(insight.impressions || "0").toLocaleString()}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                {Number.parseInt(insight.clicks || "0").toLocaleString()}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                ${Number.parseFloat(insight.spend || "0").toFixed(2)}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                {Number.parseFloat(insight.ctr || "0").toFixed(2)}%
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                ${Number.parseFloat(insight.cpc || "0").toFixed(2)}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                ${Number.parseFloat(insight.cpm || "0").toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 rounded-lg shadow-sm">
                  <div className="bg-teal-500 py-3 px-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Zap className="h-5 w-5" />
                        Action Details
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-teal-100">
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Action Type</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Value</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Cost Per Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {actionInsights?.[0]?.actions?.map((action, index) => {
                            const costPerAction = actionInsights[0]?.cost_per_action_type?.find(
                              (item) => item.action_type === action.action_type
                            );
                            
                            return (
                              <TableRow 
                                key={index}
                                className="border-b border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors duration-200"
                              >
                                <TableCell className="py-3 px-4 font-medium text-blue-900 dark:text-blue-100">
                                  {action.action_type.replace(/_/g, ' ')}
                                </TableCell>
                                <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                  {Number.parseInt(action.value || "0").toLocaleString()}
                                </TableCell>
                                <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                  {costPerAction ? `$${Number.parseFloat(costPerAction.value).toFixed(2)}` : "-"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent> */}

{/* Actions Tab */}
<TabsContent value="actions" className="space-y-6">
            {actionsLoading ? (
              <div className="flex items-center justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Actions Summary as Cards */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-teal-500" />
                    <h3 className="text-lg font-medium text-gray-800">Actions Summary</h3>
                    <Badge className="bg-teal-500 text-white border-0 text-xs px-2.5 ml-2">
                      {actionInsights?.[0]?.actions?.length || 0} Actions
                    </Badge>
                  </div>
                  
                  {actionInsights?.map((insight, index) => (
  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {/* Impressions */}
    <Card className="bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition">
      <CardContent className="p-4 flex flex-col space-y-2">
        <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
          <Eye className="h-4 w-4 text-blue-700" /> Impressions
        </p>
        <p className="text-xl font-bold text-blue-900">
          {Number.parseInt(insight.impressions || "0").toLocaleString()}
        </p>
      </CardContent>
    </Card>

    {/* Clicks */}
    <Card className="bg-green-50 border-green-200 shadow-sm hover:shadow-md transition">
      <CardContent className="p-4 flex flex-col space-y-2">
        <p className="text-xs font-medium text-green-700 flex items-center gap-1">
          <MousePointer className="h-4 w-4 text-green-700" /> Clicks
        </p>
        <p className="text-xl font-bold text-green-900">
          {Number.parseInt(insight.clicks || "0").toLocaleString()}
        </p>
      </CardContent>
    </Card>
    {/* Reach */}
    <Card className="bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition">
      <CardContent className="p-4 flex flex-col space-y-2">
        <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
          <Users className="h-4 w-4 text-blue-700" /> Reach
        </p>
        <p className="text-xl font-bold text-blue-900">
          {Number.parseInt(insight.reach || "0").toLocaleString()}
        </p>
      </CardContent>
    </Card>

    {/* Spend */}
    <Card className="bg-teal-50 border-teal-200 shadow-sm hover:shadow-md transition">
      <CardContent className="p-4 flex flex-col space-y-2">
        <p className="text-xs font-medium text-teal-700 flex items-center gap-1">
          <CircleDollarSign className="h-4 w-4 text-teal-700" /> Spend
        </p>
        <p className="text-xl font-bold text-teal-900">
          ${Number.parseFloat(insight.spend || "0").toFixed(2)}
        </p>
      </CardContent>
    </Card>

    {/* CTR */}
    <Card className="bg-amber-50 border-amber-200 shadow-sm hover:shadow-md transition">
      <CardContent className="p-4 flex flex-col space-y-2">
        <p className="text-xs font-medium text-amber-700 flex items-center gap-1">
          <BarChart2 className="h-4 w-4 text-amber-700" /> CTR
        </p>
        <p className="text-xl font-bold text-amber-900">
          {Number.parseFloat(insight.ctr || "0").toFixed(2)}%
        </p>
      </CardContent>
    </Card>

    {/* CPC */}
    <Card className="bg-purple-50 border-purple-200 shadow-sm hover:shadow-md transition">
      <CardContent className="p-4 flex flex-col space-y-2">
        <p className="text-xs font-medium text-purple-700 flex items-center gap-1">
          <CircleDollarSign className="h-4 w-4 text-purple-700" /> CPC
        </p>
        <p className="text-xl font-bold text-purple-900">
          ${Number.parseFloat(insight.cpc || "0").toFixed(2)}
        </p>
      </CardContent>
    </Card>

    {/* CPM */}
    <Card className="bg-indigo-50 border-indigo-200 shadow-sm hover:shadow-md transition">
      <CardContent className="p-4 flex flex-col space-y-2">
        <p className="text-xs font-medium text-indigo-700 flex items-center gap-1">
          <CircleDollarSign className="h-4 w-4 text-indigo-700" /> CPM
        </p>
        <p className="text-xl font-bold text-indigo-900">
          ${Number.parseFloat(insight.cpm || "0").toFixed(2)}
        </p>
      </CardContent>
    </Card>
  </div>
))}

                </div>

                {/* Action Details Table */}
                {/* <Card className="overflow-hidden border-0 rounded-lg shadow-sm">
                  <div className="bg-teal-500 py-3 px-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Zap className="h-5 w-5" />
                        Action Details
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table className="w-full max-w-full table-fixed">
                        <TableHeader>
                          <TableRow className="bg-teal-100">
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/2">Action Type</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/4">Value</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/4">Cost Per Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {actionInsights?.[0]?.actions?.map((action, index) => {
                            const costPerAction = actionInsights[0]?.cost_per_action_type?.find(
                              (item) => item.action_type === action.action_type
                            );
                            
                            return (
                              <TableRow 
                                key={index}
                                className="border-b border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors duration-200"
                              >
                                <TableCell className="py-3 px-4 font-medium text-blue-900 dark:text-blue-100 truncate">
                                  {action.action_type.replace(/_/g, ' ')}
                                </TableCell>
                                <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 text-center">
                                  {Number.parseInt(action.value || "0").toLocaleString()}
                                </TableCell>
                                <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300 text-center">
                                  {costPerAction ? `${Number.parseFloat(costPerAction.value).toFixed(2)}` : "-"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card> */}

<Card className="overflow-hidden border-0 rounded-lg shadow-sm">
                  <div className="bg-teal-500 py-3 px-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Zap className="h-5 w-5" />
                        Action Details
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-teal-100">
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Action Type</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Value</TableHead>
                            <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase">Cost Per Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {actionInsights?.[0]?.actions?.map((action, index) => {
                            const costPerAction = actionInsights[0]?.cost_per_action_type?.find(
                              (item) => item.action_type === action.action_type
                            );
                            
                            return (
                              <TableRow 
                                key={index}
                                className="border-b border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors duration-200"
                              >
                                <TableCell className="py-3 px-4 font-medium text-blue-900 dark:text-blue-100">
                                  {action.action_type.replace(/_/g, ' ')}
                                </TableCell>
                                <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                  {Number.parseInt(action.value || "0").toLocaleString()}
                                </TableCell>
                                <TableCell className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                  {costPerAction ? `$${Number.parseFloat(costPerAction.value).toFixed(2)}` : "-"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Combined Tab */}
          <TabsContent value="combined" className="space-y-6">
            {combinedLoading ? (
              <div className="flex items-center justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-0 rounded-lg shadow-sm mb-8">
                  <div className="bg-teal-500 py-3 px-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <BarChart className="h-5 w-5" />
                        Combined Insights Summary
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-gray-700 mb-4">
                      This view combines placement data with action metrics for comprehensive analysis.
                    </p>
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-blue-700">Total Placements</p>
                              <p className="text-2xl font-bold">{combinedInsights?.length || 0}</p>
                            </div>
                            <Share2 className="h-8 w-8 text-blue-500 opacity-70" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-green-700">Total Actions</p>
                              <p className="text-2xl font-bold">{combinedInsights?.[0]?.actions?.length || 0}</p>
                            </div>
                            <Zap className="h-8 w-8 text-green-500 opacity-70" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-purple-700">Unique Devices</p>
                              <p className="text-2xl font-bold">
                                {new Set(combinedInsights?.map(i => i.impression_device)).size}
                              </p>
                            </div>
                            <MonitorSmartphone className="h-8 w-8 text-purple-500 opacity-70" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-700">Total Spend</p>
                              <p className="text-2xl font-bold">
                                ${Number.parseFloat(
                                  combinedInsights?.[0]?.spend || "0"
                                ).toFixed(2)}
                              </p>
                            </div>
                            <Share2 className="h-8 w-8 text-amber-500 opacity-70" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* <p className="text-sm text-gray-500 italic">
                      Use the Placements and Actions tabs for detailed breakdowns of each metric category.
                    </p> */}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedInsights;