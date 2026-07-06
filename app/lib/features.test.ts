import { describe, it, expect } from "vitest";
import {
  getFeatureOptions,
  getLightOptions,
  featureIdsToPromptFragments,
  lightIdsToPromptFragments,
  featureIdsToLabels,
  lightIdsToLabels
} from "./features";

describe("getFeatureOptions", () => {
  it("returns the catalog options for a known style/room", () => {
    const options = getFeatureOptions("neoclassic", "kitchen");
    expect(options.length).toBeGreaterThan(0);
    expect(options.some(o => o.id === "neo_kitchen_stone_countertop")).toBe(true);
  });

  it("returns an empty array for unknown style or room", () => {
    expect(getFeatureOptions("unknown", "kitchen")).toEqual([]);
    expect(getFeatureOptions("neoclassic", "attic")).toEqual([]);
    expect(getFeatureOptions(null, null)).toEqual([]);
  });
});

describe("getLightOptions", () => {
  it("returns the light catalog options for a known style/room", () => {
    const options = getLightOptions("neoclassic", "living");
    expect(options.some(o => o.id === "neo_living_light_chandelier_set")).toBe(true);
  });

  it("returns an empty array when the light catalog has no entry", () => {
    expect(getLightOptions("eco", "attic")).toEqual([]);
    expect(getLightOptions(null, null)).toEqual([]);
  });
});

describe("featureIdsToPromptFragments", () => {
  it("maps known ids to their prompt text", () => {
    const fragments = featureIdsToPromptFragments("neoclassic", "kitchen", "neo_kitchen_stone_countertop");
    expect(fragments).toEqual(["stone countertop, marble or quartz worktop, refined classic kitchen surface"]);
  });

  it("trims whitespace and ignores empty entries", () => {
    const fragments = featureIdsToPromptFragments(
      "neoclassic",
      "kitchen",
      " neo_kitchen_stone_countertop , , "
    );
    expect(fragments).toHaveLength(1);
  });

  it("falls back to the raw id when it is not in the catalog", () => {
    const fragments = featureIdsToPromptFragments("neoclassic", "kitchen", "made_up_id");
    expect(fragments).toEqual(["made_up_id"]);
  });

  it("returns an empty array for empty input", () => {
    expect(featureIdsToPromptFragments("neoclassic", "kitchen", "")).toEqual([]);
    expect(featureIdsToPromptFragments("neoclassic", "kitchen", "   ")).toEqual([]);
  });
});

describe("lightIdsToPromptFragments", () => {
  it("maps known light ids to their prompt text", () => {
    const fragments = lightIdsToPromptFragments("neoclassic", "living", "neo_living_light_floor_lamp");
    expect(fragments[0]).toContain("classic floor lamp with fabric shade");
  });

  it("falls back to the raw id when unknown", () => {
    expect(lightIdsToPromptFragments("neoclassic", "living", "nope")).toEqual(["nope"]);
  });
});

describe("featureIdsToLabels", () => {
  it("maps known ids to their labels", () => {
    expect(featureIdsToLabels("neoclassic", "kitchen", "neo_kitchen_stone_countertop")).toEqual([
      "Столешница из камня"
    ]);
  });

  it("falls back to the raw id when unknown", () => {
    expect(featureIdsToLabels("neoclassic", "kitchen", "xyz")).toEqual(["xyz"]);
  });
});

describe("lightIdsToLabels", () => {
  it("maps known light ids to their labels", () => {
    expect(lightIdsToLabels("neoclassic", "living", "neo_living_light_chandelier_set")).toEqual([
      "Люстра + бра + торшер/лампы"
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(lightIdsToLabels("neoclassic", "living", "")).toEqual([]);
  });
});
