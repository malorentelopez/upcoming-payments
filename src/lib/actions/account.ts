"use server";

import { toUserErrorMessage } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type DeleteAccountResult = { success: true } | { error: string };

export async function deleteAccount(
  confirmEmail: string,
): Promise<DeleteAccountResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Not signed in." };
  }

  if (confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
    return { error: "Email does not match your account." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    return {
      error: toUserErrorMessage(
        error,
        "Could not delete your account. Please try again or contact support.",
      ),
    };
  }

  await supabase.auth.signOut();
  return { success: true };
}
