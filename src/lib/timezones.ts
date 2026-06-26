export type TimezoneOption = {
  value: string;
  region: string;
  regionLabel: string;
  city: string;
  label: string;
  searchText: string;
  offset: string;
};

const REGION_LABELS: Record<string, string> = {
  Africa: "Africa",
  America: "Americas",
  Antarctica: "Antarctica",
  Arctic: "Arctic",
  Asia: "Asia",
  Atlantic: "Atlantic",
  Australia: "Australia",
  Europe: "Europe",
  Indian: "Indian Ocean",
  Pacific: "Pacific",
  UTC: "UTC",
};

const FALLBACK_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Madrid",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Pacific/Auckland",
];

export function getDetectedTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getSupportedTimezones(): string[] {
  if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
    return Intl.supportedValuesOf("timeZone");
  }
  return FALLBACK_TIMEZONES;
}

export function formatCityName(citySegment: string): string {
  return citySegment.replaceAll("_", " ");
}

export function formatTimezoneLabel(timezone: string): string {
  if (timezone === "UTC") return "UTC";

  const slashIndex = timezone.indexOf("/");
  if (slashIndex === -1) return timezone;

  const region = timezone.slice(0, slashIndex);
  const city = formatCityName(timezone.slice(slashIndex + 1));
  const regionLabel = REGION_LABELS[region] ?? region;

  return `${regionLabel} / ${city}`;
}

export function getTimezoneOffsetLabel(timezone: string, date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);

    return parts.find((part) => part.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}

function buildTimezoneOption(timezone: string): TimezoneOption {
  const slashIndex = timezone.indexOf("/");
  const region = slashIndex === -1 ? "UTC" : timezone.slice(0, slashIndex);
  const city =
    slashIndex === -1 ? timezone : formatCityName(timezone.slice(slashIndex + 1));
  const regionLabel = REGION_LABELS[region] ?? region;
  const label = formatTimezoneLabel(timezone);
  const offset = getTimezoneOffsetLabel(timezone);

  return {
    value: timezone,
    region,
    regionLabel,
    city,
    label,
    offset,
    searchText: `${timezone} ${region} ${regionLabel} ${city} ${label} ${offset}`
      .toLowerCase(),
  };
}

export function buildTimezoneOptions(): TimezoneOption[] {
  const values = new Set(getSupportedTimezones());
  values.add(getDetectedTimezone());

  return [...values]
    .sort((a, b) => a.localeCompare(b))
    .map(buildTimezoneOption);
}

export function groupTimezonesByRegion(
  options: TimezoneOption[],
): Array<{ region: string; regionLabel: string; options: TimezoneOption[] }> {
  const groups = new Map<string, TimezoneOption[]>();

  for (const option of options) {
    const existing = groups.get(option.region);
    if (existing) {
      existing.push(option);
    } else {
      groups.set(option.region, [option]);
    }
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([region, regionOptions]) => ({
      region,
      regionLabel: regionOptions[0]?.regionLabel ?? region,
      options: regionOptions.sort((a, b) => a.city.localeCompare(b.city)),
    }));
}

export function filterTimezones(
  options: TimezoneOption[],
  query: string,
): TimezoneOption[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return options;

  return options.filter((option) => option.searchText.includes(normalized));
}

export function findTimezoneOption(
  options: TimezoneOption[],
  value: string,
): TimezoneOption | undefined {
  return options.find((option) => option.value === value);
}
