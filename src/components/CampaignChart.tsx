// import { Line, LineChart, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface CampaignChartProps {
//   data: any[];
//   title: string;
//   metric: string;
// }

// export function CampaignChart({ data, title, metric }: CampaignChartProps) {
//   // Calculate the maximum value for Y-axis scaling
//   const maxValue = Math.max(...data.map(item => parseFloat(item[metric]) || 0));
//   const yAxisDomain = [0, Math.ceil(maxValue * 1.1)]; // Add 10% padding to the top

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
//               margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" className="stroke-blue-200/20 dark:stroke-blue-700/20" />
              
//               <XAxis 
//                 dataKey="date_start" 
//                 tick={{ fill: 'hsl(var(--muted-foreground))' }}
//                 axisLine={{ stroke: 'hsl(var(--border))' }}
//                 tickLine={{ stroke: 'hsl(var(--border))' }}
//                 tickFormatter={(value) => new Date(value).toLocaleDateString()}
//                 padding={{ left: 10, right: 10 }}
//               />
              
//               <YAxis 
//                 domain={yAxisDomain}
//                 tick={{ fill: 'hsl(var(--muted-foreground))' }}
//                 axisLine={{ stroke: 'hsl(var(--border))' }}
//                 tickLine={{ stroke: 'hsl(var(--border))' }}
//                 tickFormatter={(value) => `$${value}`}
//                 padding={{ top: 20 }}
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

//               {/* Area Chart for shaded effect */}
//               <Area
//                 type="monotone"
//                 dataKey={metric}
//                 stroke="hsl(var(--primary))"
//                 fill="hsl(var(--primary) / 0.2)"
//                 strokeWidth={2}
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


import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Scatter, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CampaignChartProps {
  data: any[];
  title: string;
  metric: string;
}

export function CampaignChart({ data, title, metric }: CampaignChartProps) {
  const maxValue = Math.max(...data.map(item => parseFloat(item[metric]) || 0));
  const yAxisDomain = [0, Math.ceil(maxValue * 1.1)];

  return (
    <Card className="hover:shadow-lg transition-shadow border border-blue-100/50 dark:border-blue-800/50 shadow-xl rounded-lg col-span-full">
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
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#80b3ff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#cce0ff" stopOpacity={0.1} />
                </linearGradient>
              </defs>

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
                stroke="#80b3ff"
                fill="url(#colorArea)"
                fillOpacity={1}
              />

              <Scatter
                dataKey={metric}
                fill="#80b3ff"
                stroke="white"
                strokeWidth={1}
                r={3}
              />

              <Line
                type="monotone"
                dataKey={metric}
                strokeWidth={2}
                stroke="#80b3ff"
                dot={false}
                activeDot={{ r: 6, fill: '#80b3ff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}