import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/** One Supabase auth lookup per request, shared across server modules. */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
