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
    <Card className="border border-blue-300/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-blue-900/90 dark:text-blue-100/90">
          {title}
        </CardTitle>
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2"
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button> */}
      </CardHeader>
      <CardContent>
        <div style={{ height: chartHeight }} className="transition-all duration-300 ease-in-out">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-blue-200/30 dark:stroke-blue-700/30" 
                vertical={false}
              />
              
              <XAxis
                dataKey="custom_label"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                interval="preserveStartEnd"
                padding={{ left: 10, right: 10 }}
              />
              
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => formatValue(value, metrics[0]?.key)}
                domain={[0, maxValue * 1.1]} // Add 10% padding to top
                width={80}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: any, name: string) => {
                  const metric = metrics.find(m => m.name === name);
                  return [formatValue(value, metric?.key || ''), name];
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />

              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span className="text-sm font-medium">{value}</span>
                )}
              />

              {metrics.map((metric) => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.name}
                  stroke={metric.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: metric.color }} 
                  activeDot={{ 
                    r: 8, 
                    stroke: metric.color, 
                    strokeWidth: 2, 
                    fill: "#fff" 
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}