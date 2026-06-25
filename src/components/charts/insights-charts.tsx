"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/payments/formatters";

const CHART_COLORS = [
  "#0d9488",
  "#6366f1",
  "#f59e0b",
  "#14b8a6",
  "#64748b",
  "#ec4899",
];

interface MonthlyBarChartProps {
  data: Array<{ label: string; total: number }>;
  currency: string;
}

export function MonthlyBarChart({ data, currency }: MonthlyBarChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value), currency)}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
            }}
          />
          <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="var(--primary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryDonutProps {
  data: Array<{ name: string; value: number; color?: string }>;
  currency: string;
}

export function CategoryDonut({ data, currency }: CategoryDonutProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No data for this month
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={entry.color ?? CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value), currency)}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
