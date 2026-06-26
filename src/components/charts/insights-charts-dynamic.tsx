"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

function ChartSkeleton() {
  return <Skeleton className="h-64 w-full rounded-xl" />;
}

export const MonthlyBarChart = dynamic(
  () =>
    import("@/components/charts/insights-charts").then((module) => ({
      default: module.MonthlyBarChart,
    })),
  { loading: () => <ChartSkeleton />, ssr: false },
);

export const CategoryDonut = dynamic(
  () =>
    import("@/components/charts/insights-charts").then((module) => ({
      default: module.CategoryDonut,
    })),
  { loading: () => <ChartSkeleton />, ssr: false },
);
