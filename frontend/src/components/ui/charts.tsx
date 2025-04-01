import { 
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
        margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        style={{ overflowX: 'hidden', overflowY: 'hidden' }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={index} 
          type={layout === 'vertical' ? 'number' : 'category'}
          tick={{ fontSize: 11 }}
          interval={0}
          tickMargin={8}
        />
        <YAxis 
          width={yAxisWidth}
          type={layout === 'vertical' ? 'category' : 'number'}
          tick={{ fontSize: 11 }}
          domain={[0, 'auto']}
          allowDecimals={false}
        />
        <Tooltip 
          formatter={(value: any) => [valueFormatter(value as number), '']} 
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        {categories.map((category, i) => (
          <Bar 
            key={category}
            dataKey={category} 
            fill={colors[i % colors.length] === 'blue' ? '#3b82f6' : colors[i % colors.length]} 
            radius={[4, 4, 0, 0]}
            maxBarSize={35}
            minPointSize={3}
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
        margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        style={{ overflowX: 'hidden', overflowY: 'hidden' }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={index} 
          tick={{ fontSize: 11 }}
          tickMargin={8}
        />
        <YAxis 
          width={yAxisWidth}
          tick={{ fontSize: 11 }}
          domain={[0, 'auto']}
          allowDecimals={false}
        />
        <Tooltip 
          formatter={(value: any) => [valueFormatter(value as number), '']} 
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length] === 'blue' ? '#3b82f6' : 
                  colors[i % colors.length] === 'orange' ? '#f59e0b' : colors[i % colors.length]}
            activeDot={{ r: 6 }}
            strokeWidth={2}
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
  const RADIAN = Math.PI / 180;
  // Custom label rendering function to improve readability
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is significant enough (>= 5%)
    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="#888888" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartContainer config={{}} className={className}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          dataKey={categories[0]}
          nameKey={index}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={65}
          paddingAngle={2}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || '#8884d8'}
              stroke="#ffffff"
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any) => [valueFormatter(value as number), '']}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          itemStyle={{ padding: '4px 0' }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          iconType="circle"
          iconSize={10}
        />
      </RechartsPieChart>
    </ChartContainer>
  );
};
