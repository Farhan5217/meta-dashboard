
// import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface CampaignChartProps {
//   data: any[];
//   title: string;
//   metric: string;
// }

// export function CampaignChart({ data, title, metric }: CampaignChartProps) {
//   return (
//     <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-100/50 dark:border-blue-800/50">
//       <CardHeader>
//         <CardTitle className="text-blue-900/80 dark:text-blue-100/80">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={data}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" className="stroke-blue-200/20 dark:stroke-blue-700/20" />
//               <XAxis 
//                 dataKey="date_start" 
//                 tick={{ fill: 'hsl(var(--muted-foreground))' }}
//                 axisLine={{ stroke: 'hsl(var(--border))' }}
//                 tickLine={{ stroke: 'hsl(var(--border))' }}
//                 tickFormatter={(value) => new Date(value).toLocaleDateString()}
//               />
//               <YAxis 
//                 tick={{ fill: 'hsl(var(--muted-foreground))' }}
//                 axisLine={{ stroke: 'hsl(var(--border))' }}
//                 tickLine={{ stroke: 'hsl(var(--border))' }}
//                 tickFormatter={(value) => `$${value}`}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: 'hsl(var(--card))',
//                   border: '1px solid hsl(var(--border))',
//                   borderRadius: '8px',
//                 }}
//                 formatter={(value: any) => {
//                   const numValue = parseFloat(value);
//                   return isNaN(numValue) ? ['$0.00', 'Spend'] : [`$${numValue.toFixed(2)}`, 'Spend'];
//                 }}
//                 labelFormatter={(label) => new Date(label).toLocaleDateString()}
//               />
//               <Line
//                 type="monotone"
//                 dataKey={metric}
//                 strokeWidth={2}
//                 stroke="hsl(var(--primary))"
//                 dot={false}
//                 activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }



import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Scatter, ScatterChart, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CampaignChartProps {
  data: any[];
  title: string;
  metric: string;
}

export function CampaignChart({ data, title, metric }: CampaignChartProps) {
  // Calculate the maximum value for proper scaling
  const maxValue = Math.max(...data.map(item => parseFloat(item[metric]) || 0));
  const yAxisDomain = [0, Math.ceil(maxValue * 1.1)]; // Add 10% padding to the top

  return (
    <Card className="hover:shadow-lg transition-shadow border border-blue-100/50 dark:border-blue-800/50">
      <CardHeader>
        <CardTitle className="text-blue-900/80 dark:text-blue-100/80">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-blue-200/20 dark:stroke-blue-700/20" />
              <XAxis 
                dataKey="date_start" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={yAxisDomain}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `$${value}`}
                padding={{ top: 20 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => {
                  const numValue = parseFloat(value);
                  return isNaN(numValue) ? ['$0.00', 'Spend'] : [`$${numValue.toFixed(2)}`, 'Spend'];
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey={metric}
                strokeWidth={2}
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary)/0.2)"
              />
              <Scatter
                dataKey={metric}
                fill="hsl(var(--primary))"
              />
              <Line
                type="monotone"
                dataKey={metric}
                strokeWidth={2}
                stroke="hsl(var(--primary))"
                dot={false}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
