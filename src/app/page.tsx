import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { PageTransition } from "@/components/motion/page-transition";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
        <span className="text-lg font-semibold tracking-tight">Upcoming</span>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }), "rounded-xl")}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants(), "rounded-xl")}
          >
            Get started
          </Link>
        </div>
      </header>

      <PageTransition className="relative z-10 mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 text-center md:px-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
          <Sparkles className="size-4 text-primary" />
          Know what&apos;s due, before it&apos;s due
        </div>

        <h1 className="max-w-xl text-4xl font-semibold tracking-tight md:text-5xl md:leading-tight">
          Your upcoming payments, beautifully organized
        </h1>

        <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
          Track subscriptions, rent, loans, and one-off bills. See exactly what
          you&apos;ll owe each month — clean, calm, and always at a glance.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-xl px-8",
            )}
          >
            Create free account
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-xl px-8",
            )}
          >
            I have an account
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-md gap-4 text-left sm:grid-cols-3 sm:max-w-none">
          {[
            { title: "By month", desc: "See totals and due dates at a glance" },
            { title: "Any type", desc: "Recurring, installments, or one-offs" },
            { title: "Insights", desc: "Charts to spot where money goes" },
          ].map((item) => (
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
    </main>
  );
}
