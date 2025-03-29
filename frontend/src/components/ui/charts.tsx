
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

import { ChartContainer } from '@/components/ui/chart';

interface ChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

interface BarChartProps extends ChartProps {
  layout?: 'vertical' | 'horizontal';
  yAxisWidth?: number;
}

export const BarChart = ({
  data,
  index,
  categories,
  colors = ['blue'],
  valueFormatter = (value: number) => value.toString(),
  className,
  layout = 'horizontal',
  yAxisWidth = 40
}: BarChartProps) => {
  return (
    <ChartContainer config={{}} className={className}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={index} 
          type={layout === 'vertical' ? 'number' : 'category'}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          width={yAxisWidth}
          type={layout === 'vertical' ? 'category' : 'number'}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value: any) => [valueFormatter(value as number), '']} 
        />
        <Legend />
        {categories.map((category, i) => (
          <Bar 
            key={category}
            dataKey={category} 
            fill={colors[i % colors.length] === 'blue' ? '#3b82f6' : colors[i % colors.length]} 
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

export const LineChart = ({
  data,
  index,
  categories,
  colors = ['blue', 'orange'],
  valueFormatter = (value: number) => value.toString(),
  className,
  yAxisWidth = 40
}: BarChartProps) => {
  return (
    <ChartContainer config={{}} className={className}>
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={index} 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          width={yAxisWidth}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value: any) => [valueFormatter(value as number), '']} 
        />
        <Legend />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length] === 'blue' ? '#3b82f6' : 
                  colors[i % colors.length] === 'orange' ? '#f59e0b' : colors[i % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

interface PieChartProps {
  data: any[];
  index: string;
  categories: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const PieChart = ({
  data,
  index,
  categories,
  valueFormatter = (value: number) => value.toString(),
  className,
}: PieChartProps) => {
  return (
    <ChartContainer config={{}} className={className}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          dataKey={categories[0]}
          nameKey={index}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => [valueFormatter(value as number), '']} />
      </RechartsPieChart>
    </ChartContainer>
  );
};
