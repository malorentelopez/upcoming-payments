import Link from "next/link";
import type { ReactNode } from "react";

import { AppLogo } from "@/components/brand/app-logo";
import { SiteFooter } from "@/components/layout/site-footer";

interface LegalPageProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <main className="flex min-h-full flex-col">
      <header className="border-b border-border/60 px-6 py-6 md:px-10">
        <AppLogo href="/" size="md" />
      </header>

      <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:px-8">
        <header className="mb-8 space-y-2">
          <p className="text-sm text-muted-foreground">Legal</p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </header>

        <div className="prose prose-neutral max-w-none space-y-6 text-sm leading-relaxed text-foreground/90 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:text-foreground/90 [&_p]:text-foreground/90 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Questions? Contact us at{" "}
          <a href="mailto:malorentelopez@gmail.com" className="text-primary hover:underline">
            malorentelopez@gmail.com
          </a>
          .
        </p>
      </article>

      <SiteFooter className="mt-auto" />
    </main>
  );
}

export function LegalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="text-primary underline-offset-2 hover:underline">
      {children}
    </Link>
  );
}
