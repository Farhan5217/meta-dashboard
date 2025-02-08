
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AreaChartProps {
  data: any[];
  title: string;
  dataKey: string;
}

export function AreaChart({ data, title, dataKey }: AreaChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
              <XAxis 
                dataKey="date_start" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => {
                  const numValue = parseFloat(value);
                  return isNaN(numValue) ? [0, dataKey] : [numValue.toLocaleString(), dataKey];
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary)/0.2)"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
