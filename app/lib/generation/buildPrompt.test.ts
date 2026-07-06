import { describe, it, expect } from "vitest";
import { buildPromptText, type BuildPromptArgs } from "./buildPrompt";

const baseArgs: BuildPromptArgs = {
  plan: null,
  rooms: [],
  style: null,
  brightness: null,
  contrast: null,
  lighting: null,
  palette: null,
  time: null,
  zodiacSign: null,
  family: null,
  features: null,
  lightFeatures: null,
  changeFocus: "decor"
};

describe("buildPromptText", () => {
  it("falls back to sensible defaults when nothing is provided", () => {
    const result = buildPromptText(baseArgs);
    expect(result.startsWith("interior design, modern style")).toBe(true);
    expect(result).toContain("balanced materials");
    expect(result).toContain("natural light bounce");
  });

  it("maps known style ids to their descriptive text", () => {
    const result = buildPromptText({ ...baseArgs, style: "eco" });
    expect(result).toContain("eco style, biophilic interior");
  });

  it("passes through unknown style ids verbatim", () => {
    const result = buildPromptText({ ...baseArgs, style: "brutalist" });
    expect(result).toContain("interior design, brutalist style");
  });

  it("maps rooms through the room map and joins them", () => {
    const result = buildPromptText({ ...baseArgs, rooms: ["living", "kitchen"] });
    expect(result).toContain("living room, kitchen");
  });

  it("adds neoclassic-specific styling only for the neoclassic style", () => {
    const neo = buildPromptText({ ...baseArgs, style: "neoclassic" });
    const modern = buildPromptText({ ...baseArgs, style: "modern" });
    expect(neo).toContain("modern neoclassical styling");
    expect(modern).not.toContain("modern neoclassical styling");
  });

  it("joins provided settings fragments", () => {
    const result = buildPromptText({
      ...baseArgs,
      brightness: "bright",
      contrast: "high",
      lighting: "warm",
      palette: "pastel"
    });
    expect(result).toContain("bright lighting, high contrast, warm lighting, pastel palette");
  });

  it("omits the time fragment when the change focus is lighting", () => {
    const withTime = buildPromptText({ ...baseArgs, time: "evening" });
    const lightingFocus = buildPromptText({ ...baseArgs, time: "evening", changeFocus: "lighting" });
    expect(withTime).toContain("night, nighttime interior, no daylight");
    expect(lightingFocus).not.toContain("night, nighttime interior");
    expect(lightingFocus).toContain("realistic light bounce");
  });

  it("adds a room focus fragment when family is set", () => {
    const result = buildPromptText({ ...baseArgs, family: "bedroom" });
    expect(result).toContain("focus on bedroom");
  });

  it("adds the separate-kitchen fragment for a kitchen without a living room", () => {
    const kitchenOnly = buildPromptText({ ...baseArgs, rooms: ["kitchen"] });
    const kitchenAndLiving = buildPromptText({ ...baseArgs, rooms: ["kitchen", "living"] });
    expect(kitchenOnly).toContain("separate enclosed kitchen");
    expect(kitchenAndLiving).not.toContain("separate enclosed kitchen");
  });

  it("resolves feature ids to catalog prompt fragments", () => {
    const result = buildPromptText({
      ...baseArgs,
      style: "neoclassic",
      family: "kitchen",
      features: "neo_kitchen_stone_countertop"
    });
    expect(result).toContain("include: stone countertop");
  });

  it("appends a zodiac vibe at the very end when provided", () => {
    const result = buildPromptText({ ...baseArgs, zodiacSign: "Leo" });
    expect(result.endsWith(", Leo vibe")).toBe(true);
  });
});
