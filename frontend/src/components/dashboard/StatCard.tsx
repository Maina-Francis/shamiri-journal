
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const cardVariants = cva(
  "transition-all duration-200 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-border",
        primary: "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/30",
        success: "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/30",
        warning: "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
        danger: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/30",
        info: "border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/30",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  className,
  trend,
  variant = 'default',
}) => {
  return (
    <Card className={cn(cardVariants({ variant }), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-full bg-muted/50 p-1.5 flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <span
              className={cn(
                "flex items-center",
                trend.isPositive ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
            <span className="text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
