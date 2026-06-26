"use client";

import { useEffect, useState } from "react";

import { useConsent } from "@/components/consent/consent-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_REJECTED,
  type ConsentCategories,
} from "@/lib/consent/types";

export function CookiePreferencesDialog() {
  const {
    consent,
    preferencesOpen,
    closePreferences,
    savePreferences,
    acceptAll,
    rejectNonEssential,
  } = useConsent();

  const [draft, setDraft] = useState<ConsentCategories>(
    consent?.categories ?? DEFAULT_REJECTED,
  );

  useEffect(() => {
    if (preferencesOpen) {
      setDraft(consent?.categories ?? DEFAULT_REJECTED);
    }
  }, [consent, preferencesOpen]);

  return (
    <Dialog open={preferencesOpen} onOpenChange={(open) => !open && closePreferences()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Cookie preferences</DialogTitle>
          <DialogDescription>
            Choose which cookies we may use. Essential cookies are required for
            sign-in and cannot be disabled.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <PreferenceRow
            title="Essential"
            description="Authentication and security (Supabase session cookies)."
            checked
            disabled
          />
          <PreferenceRow
            title="Functional"
            description="Remembers settings such as your cookie choice."
            checked={draft.functional}
            onChange={(checked) =>
              setDraft((current) => ({ ...current, functional: checked }))
            }
          />
          <PreferenceRow
            title="Analytics"
            description="Helps us understand usage and measure performance (Vercel Analytics & Speed Insights)."
            checked={draft.analytics}
            onChange={(checked) =>
              setDraft((current) => ({ ...current, analytics: checked }))
            }
          />
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="h-10 w-full rounded-xl"
            onClick={() => savePreferences(draft)}
          >
            Save preferences
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={rejectNonEssential}
            >
              Reject all
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={acceptAll}
            >
              Accept all
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 p-3">
      <div className="space-y-1">
        <Label className="text-sm font-medium">{title}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-1 size-4 shrink-0 rounded border-border disabled:opacity-60"
        aria-label={title}
      />
    </div>
  );
}

export function CookiePreferencesTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { openPreferences } = useConsent();

  return (
    <button type="button" className={className} onClick={openPreferences}>
      {children}
    </button>
  );
}
