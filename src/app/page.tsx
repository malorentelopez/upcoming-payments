import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { AppLogo } from "@/components/brand/app-logo";
import { buttonVariants } from "@/components/ui/button";
import { PageTransition } from "@/components/motion/page-transition";
import { SiteFooter } from "@/components/layout/site-footer";
import { cn } from "@/lib/utils";

export default async function LandingPage() {
  const t = await getTranslations("landing");

  const features = [
    { title: t("features.byMonth.title"), desc: t("features.byMonth.desc") },
    { title: t("features.anyType.title"), desc: t("features.anyType.desc") },
    { title: t("features.insights.title"), desc: t("features.insights.desc") },
  ];

  return (
    <main className="relative flex min-h-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
        <AppLogo href="/" size="lg" />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }), "rounded-xl")}
          >
            {t("signIn")}
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants(), "rounded-xl")}
          >
            {t("getStarted")}
          </Link>
        </div>
      </header>

      <PageTransition className="relative z-10 mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 text-center md:px-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
          <Sparkles className="size-4 text-primary" />
          {t("tagline")}
        </div>

        <h1 className="max-w-xl text-4xl font-semibold tracking-tight md:text-5xl md:leading-tight">
          {t("headline")}
        </h1>

        <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
          {t("description")}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-xl px-8",
            )}
          >
            {t("createAccount")}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-xl px-8",
            )}
          >
            {t("haveAccount")}
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-md gap-4 text-left sm:grid-cols-3 sm:max-w-none">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur"
            >
              <CalendarDays className="mb-2 size-5 text-primary" />
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </PageTransition>

      <SiteFooter className="relative z-10" />
    </main>
  );
}
