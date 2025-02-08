import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface BarChartProps {
  data: any[];
  title: string;
  dataKey: string;
}

export function BarChartVertical({ data, title, dataKey }: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical" // Makes it a vertical bar chart
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
              <XAxis 
                type="number" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                dataKey="date_start" 
                type="category" 
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
              />
              <Bar
                dataKey={dataKey}
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]} // Rounded edges on the right
                barSize={20} // Adjust bar thickness
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
