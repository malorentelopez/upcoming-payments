import { describe, expect, it } from "vitest";

import {
  filterTimezones,
  formatCityName,
  formatTimezoneLabel,
  groupTimezonesByRegion,
} from "@/lib/timezones";

const SAMPLE_OPTIONS = [
  {
    value: "America/New_York",
    region: "America",
    regionLabel: "Americas",
    city: "New York",
    label: "Americas / New York",
    searchText: "america/new_york america americas new york americas / new york gmt-5",
    offset: "GMT-5",
  },
  {
    value: "Europe/Madrid",
    region: "Europe",
    regionLabel: "Europe",
    city: "Madrid",
    label: "Europe / Madrid",
    searchText: "europe madrid",
    offset: "GMT+1",
  },
];

describe("formatTimezoneLabel", () => {
  it("formats region and city labels", () => {
    expect(formatTimezoneLabel("Europe/Madrid")).toBe("Europe / Madrid");
    expect(formatTimezoneLabel("America/Los_Angeles")).toBe("Americas / Los Angeles");
    expect(formatTimezoneLabel("UTC")).toBe("UTC");
  });
});

describe("formatCityName", () => {
  it("replaces underscores with spaces", () => {
    expect(formatCityName("Buenos_Aires")).toBe("Buenos Aires");
  });
});

describe("filterTimezones", () => {
  it("matches city and region text", () => {
    expect(filterTimezones(SAMPLE_OPTIONS, "madrid")).toHaveLength(1);
    expect(filterTimezones(SAMPLE_OPTIONS, "americas")).toHaveLength(1);
  });
});

describe("groupTimezonesByRegion", () => {
  it("groups options under region labels", () => {
    const groups = groupTimezonesByRegion(SAMPLE_OPTIONS);
    expect(groups).toHaveLength(2);
    expect(groups[0]?.regionLabel).toBe("Americas");
    expect(groups[1]?.regionLabel).toBe("Europe");
  });
});
