import { motion } from "framer-motion";
import { 
  DollarSign, 
  Eye, 
  MousePointer, 
  BarChart2, 
  CircleDollarSign, 
  Users,
  Zap
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActionInsightsProps {
  data: any[];
  isLoading: boolean;
}

const ActionInsights = ({ data, isLoading }: ActionInsightsProps) => {
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
      {/* Actions Summary as Cards */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-teal-500" />
          <h3 className="text-lg font-medium text-gray-800">Actions Summary</h3>
          <Badge className="bg-teal-500 text-white border-0 text-xs px-2.5 ml-2">
            {data?.[0]?.actions?.length || 0} Actions
          </Badge>
        </div>
        
        {data?.map((insight, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
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
                  <DollarSign className="h-4 w-4 text-teal-700" /> Spend
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

      {/* Action Details */}
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
            <Table className="w-full max-w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/2">Action Type</TableHead>
                  <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/4 text-center">Value</TableHead>
                  <TableHead className="py-3 px-4 text-xs font-medium text-teal-800 uppercase w-1/4 text-center">Cost Per Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.[0]?.actions?.map((action, index) => {
                  const costPerAction = data[0]?.cost_per_action_type?.find(
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
  );
};

export default ActionInsights;