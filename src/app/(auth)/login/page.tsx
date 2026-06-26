import { getTranslations } from "next-intl/server";

import { AppLogo } from "@/components/brand/app-logo";
import { AuthForm } from "@/components/auth/auth-form";
import { PageTransition } from "@/components/motion/page-transition";

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <main className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <PageTransition className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <AppLogo href="/" size="sm" className="justify-center" />
          <h1 className="text-2xl font-semibold tracking-tight">{t("welcomeBack")}</h1>
          <p className="text-sm text-muted-foreground">{t("signInSubtitle")}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <AuthForm mode="login" />
        </div>
      </PageTransition>
    </main>
  );
}
