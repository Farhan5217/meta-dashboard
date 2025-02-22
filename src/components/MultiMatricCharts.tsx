import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface MultiMetricChartProps {
  data: any[];
  title: string;
  metrics: {
    key: string;
    name: string;
    color: string;
  }[];
}

export function MultiMetricChart({ data, title, metrics }: MultiMetricChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxValue, setMaxValue] = useState(0);

  // Calculate max value for dynamic Y-axis
  useEffect(() => {
    const max = Math.max(
      ...data.flatMap(item =>
        metrics.map(metric => Number(item[metric.key]) || 0)
      )
    );
    setMaxValue(max);
  }, [data, metrics]);

  const formatValue = (value: number, key: string) => {
    switch (key) {
      case 'frequency':
        return value.toFixed(2);
      case 'cpc':
      case 'cpm':
        return `$${value.toFixed(2)}`;
      case 'ctr':
        return `${(value * 100).toFixed(2)}%`;
      case 'impressions':
        return value.toLocaleString('en-US');
      default:
        return value.toLocaleString();
    }
  };

  const chartHeight = isExpanded ? 600 : 400;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700">
        <CardTitle className="text-slate-800 dark:text-slate-100 font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div style={{ height: chartHeight }} className="transition-all duration-300 ease-in-out">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-slate-200 dark:stroke-slate-700" 
                vertical={false}
              />
              
              <XAxis
                dataKey="custom_label"
                tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }}
                axisLine={{ stroke: 'rgb(203, 213, 225)' }}
                tickLine={{ stroke: 'rgb(203, 213, 225)' }}
                interval="preserveStartEnd"
                padding={{ left: 10, right: 10 }}
              />
              
              <YAxis
                tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }}
                axisLine={{ stroke: 'rgb(203, 213, 225)' }}
                tickLine={{ stroke: 'rgb(203, 213, 225)' }}
                tickFormatter={(value) => formatValue(value, metrics[0]?.key)}
                domain={[0, maxValue * 1.1]}
                width={80}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid rgb(226, 232, 240)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: any, name: string) => {
                  const metric = metrics.find(m => m.name === name);
                  return [formatValue(value, metric?.key || ''), name];
                }}
                labelStyle={{ color: 'rgb(100, 116, 139)' }}
              />

              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</span>
                )}
              />

              {metrics.map((metric, index) => {
                // Professional color palette
                const colorPalette = [
                  "#2563eb", // Primary blue
                  "#0ea5e9", // Sky blue
                  "#0d9488", // Teal
                  "#6366f1", // Indigo
                  "#8b5cf6", // Purple
                  "#0891b2"  // Cyan
                ];

                return (
                  <Line
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    name={metric.name}
                    stroke={colorPalette[index % colorPalette.length]}
                    strokeWidth={2}
                    dot={{ 
                      r: 4, 
                      fill: colorPalette[index % colorPalette.length],
                      strokeWidth: 0
                    }}
                    activeDot={{ 
                      r: 6,
                      stroke: colorPalette[index % colorPalette.length],
                      strokeWidth: 2,
                      fill: "white"
                    }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </div>
  );
}