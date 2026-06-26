import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CookiePreferencesTrigger } from "@/components/consent/cookie-preferences-dialog";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  className?: string;
}

export async function SiteFooter({ className }: SiteFooterProps) {
  const t = await getTranslations("footer");
  const tCommon = await getTranslations("common");

  return (
    <footer
      className={cn(
        "border-t border-border/60 px-6 py-6 text-sm text-muted-foreground md:px-10",
        className,
      )}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 md:max-w-4xl md:flex-row md:items-center md:justify-between">
        <p>{tCommon("copyright", { year: new Date().getFullYear() })}</p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/privacy" className="hover:text-foreground">
            {t("privacy")}
          </Link>
          <Link href="/cookies" className="hover:text-foreground">
            {t("cookies")}
          </Link>
          <CookiePreferencesTrigger className="hover:text-foreground">
            {t("cookieSettings")}
          </CookiePreferencesTrigger>
        </nav>
      </div>
    </footer>
  );
}
