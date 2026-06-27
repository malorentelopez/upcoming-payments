import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const SESSION_REFRESH_THRESHOLD_SEC = 60;

let client: SupabaseClient | null = null;

export function getBrowserClient(): SupabaseClient {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}

/** Refresh the Supabase session when missing or near expiry. */
export async function ensureSession(): Promise<boolean> {
  const supabase = getBrowserClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return false;
  }

  const expiresAt = session.expires_at ?? 0;
  const now = Math.floor(Date.now() / 1000);

  if (expiresAt - now >= SESSION_REFRESH_THRESHOLD_SEC) {
    return true;
  }

  const { data: refreshData, error: refreshError } =
    await supabase.auth.refreshSession();

  return !refreshError && refreshData.session !== null;
}
