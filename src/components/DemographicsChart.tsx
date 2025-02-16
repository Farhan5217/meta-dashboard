import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DemographicsChartProps {
  data: any[];
  title: string;
}

export function DemographicsChart({ data, title }: DemographicsChartProps) {
  // Process data to group by age and gender
  const processedData = data.reduce((acc, curr) => {
    if (curr.age && curr.gender) {
      const key = curr.age;
      if (!acc[key]) {
        acc[key] = {
          age: key,
          male: 0,
          female: 0,
          unknown: 0,
        };
      }
      acc[key][curr.gender.toLowerCase()] += parseFloat(curr.spend) || 0;
    }
    return acc;
  }, {} as Record<string, { age: string; male: number; female: number; unknown: number }>);

  const chartData = Object.values(processedData);

  return (
    <Card className="border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-blue-900/80 dark:text-blue-100/80">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              barGap={5}
              barCategoryGap={20}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-blue-200/20 dark:stroke-blue-700/20" />
              <XAxis
                dataKey="age"
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
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
              <Bar name="Male" dataKey="male" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar name="Female" dataKey="female" fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar name="Unknown" dataKey="unknown" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
