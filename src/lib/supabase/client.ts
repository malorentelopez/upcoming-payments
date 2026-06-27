import { getBrowserClient } from "@/lib/supabase/browser";

/** Shared singleton browser Supabase client. */
export function createClient() {
  return getBrowserClient();
}
