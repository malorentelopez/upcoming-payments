import { getTranslations } from "next-intl/server";

import { AppLogo } from "@/components/brand/app-logo";
import { AuthForm } from "@/components/auth/auth-form";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { PageTransition } from "@/components/motion/page-transition";
import { safeRedirectPath } from "@/lib/security/safe-redirect";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const t = await getTranslations("auth");
  const { redirect: redirectParam } = await searchParams;

  return (
    <main className="relative flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4 flex items-center gap-1 md:right-8 md:top-6">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <PageTransition className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <AppLogo href="/" size="sm" className="justify-center" />
          <h1 className="text-2xl font-semibold tracking-tight">{t("welcomeBack")}</h1>
          <p className="text-sm text-muted-foreground">{t("signInSubtitle")}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <AuthForm mode="login" redirectTo={safeRedirectPath(redirectParam)} />
        </div>
      </PageTransition>
    </main>
  );
}
