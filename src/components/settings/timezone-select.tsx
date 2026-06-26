"use client";

import { Check, ChevronDown, LocateFixed } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildTimezoneOptions,
  filterTimezones,
  findTimezoneOption,
  formatTimezoneLabel,
  getDetectedTimezone,
  groupTimezonesByRegion,
} from "@/lib/timezones";
import { cn } from "@/lib/utils";

interface TimezoneSelectProps {
  defaultValue: string;
  name?: string;
}

export function TimezoneSelect({
  defaultValue,
  name = "timezone",
}: TimezoneSelectProps) {
  const t = useTranslations("timezone");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const options = useMemo(() => buildTimezoneOptions(), []);
  const detectedTimezone = useMemo(() => getDetectedTimezone(), []);

  const autoDetectedFromDevice =
    defaultValue === "UTC" && detectedTimezone !== "UTC";

  const initialValue = autoDetectedFromDevice ? detectedTimezone : defaultValue;

  const [value, setValue] = useState(initialValue);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = findTimezoneOption(options, value);
  const filteredOptions = useMemo(
    () => filterTimezones(options, query),
    [options, query],
  );
  const groupedOptions = useMemo(
    () => groupTimezonesByRegion(filteredOptions),
    [filteredOptions],
  );

  useEffect(() => {
    if (!open) return;

    searchRef.current?.focus();

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectTimezone(timezone: string) {
    setValue(timezone);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative space-y-2">
      <Label htmlFor={`${name}-trigger`}>{t("title")}</Label>

      <input type="hidden" name={name} value={value} />

      <button
        id={`${name}-trigger`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 text-left text-sm"
      >
        <span className="min-w-0 truncate">
          {selected ? (
            <>
              {selected.offset && (
                <span className="text-muted-foreground">{selected.offset} · </span>
              )}
              {selected.label}
            </>
          ) : (
            formatTimezoneLabel(value)
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {autoDetectedFromDevice && value === detectedTimezone && (
        <p className="text-xs text-muted-foreground">
          {t("detectedSave")}
        </p>
      )}

      {detectedTimezone !== value && (
        <button
          type="button"
          onClick={() => selectTimezone(detectedTimezone)}
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <LocateFixed className="size-3.5" />
          {t("useDevice", { timezone: formatTimezoneLabel(detectedTimezone) })}
        </button>
      )}

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-md ring-1 ring-foreground/10">
          <div className="border-b border-border/60 p-2">
            <Input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-10 rounded-lg"
              aria-label="Search timezones"
            />
          </div>

          <div
            role="listbox"
            aria-label="Timezones"
            className="max-h-64 overflow-y-auto p-1"
          >
            {groupedOptions.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {t("noResults")}
              </p>
            ) : (
              groupedOptions.map(({ region, regionLabel, options: regionOptions }) => (
                <div key={region} className="py-1">
                  <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    {regionLabel}
                  </p>
                  {regionOptions.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => selectTimezone(option.value)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-accent",
                          isSelected && "bg-accent/60",
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {option.offset && (
                            <span className="text-muted-foreground">
                              {option.offset} ·{" "}
                            </span>
                          )}
                          {option.label}
                        </span>
                        {isSelected && (
                          <Check className="size-4 shrink-0 text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
