"use server";

import { getAppShellData, type AppShellData } from "@/lib/data/queries";

export async function fetchAppData(): Promise<AppShellData> {
  return getAppShellData();
}
