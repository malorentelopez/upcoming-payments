"use client";

import { Check, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateLocale } from "@/lib/actions/locale";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/i18n/locale";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const t = useTranslations("language");
  const tAuth = useTranslations("auth");
  const currentLocale = useLocale() as SupportedLocale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(locale: SupportedLocale) {
    if (locale === currentLocale || isPending) return;

    startTransition(async () => {
      try {
        await updateLocale(locale);
        router.refresh();
      } catch {
        toast.error(tAuth("somethingWrong"));
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        aria-label={t("changeLanguage")}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-9 gap-1.5 rounded-xl px-2.5",
          className,
        )}
      >
        <Globe className="size-4" />
        <span className="text-sm">{LOCALE_LABELS[currentLocale].native}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {SUPPORTED_LOCALES.map((locale) => {
          const { native, english } = LOCALE_LABELS[locale];
          const selected = locale === currentLocale;

          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleSelect(locale)}
              className="flex items-center justify-between gap-3"
            >
              <span>
                <span className="font-medium">{native}</span>
                <span className="ml-1.5 text-muted-foreground">{english}</span>
              </span>
              {selected && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
