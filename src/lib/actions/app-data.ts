"use server";

import { getDashboardData, type DashboardData } from "@/lib/data/queries";

export async function fetchAppData(): Promise<DashboardData> {
  return getDashboardData();
}
