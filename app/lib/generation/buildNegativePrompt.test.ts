import { describe, it, expect } from "vitest";
import { buildNegativePrompt } from "./buildNegativePrompt";

const baseArgs = {
  focusNegative: "",
  lockView: false,
  lightingStrictNegative: "",
  lightingScenarioNegative: "",
  sourceImageLayoutNegative: "",
  sourceImageFurnitureNegative: ""
};

describe("buildNegativePrompt", () => {
  it("includes the shared base negative terms", () => {
    const result = buildNegativePrompt(baseArgs);
    expect(result).toContain("blurry");
    expect(result).toContain("watermark");
    expect(result).toContain("keystone distortion");
  });

  it("appends the focus negative after the base terms", () => {
    const result = buildNegativePrompt({ ...baseArgs, focusNegative: "no plants" });
    expect(result).toContain(", no plants");
    // base list ends with "keystone distortion" and is followed by the focus negative
    expect(result.indexOf("keystone distortion")).toBeLessThan(result.indexOf("no plants"));
  });

  it("adds the view-lock negative fragment only when lockView is true", () => {
    const locked = buildNegativePrompt({ ...baseArgs, lockView: true });
    const unlocked = buildNegativePrompt({ ...baseArgs, lockView: false });
    expect(locked).toContain("changed camera angle, different viewpoint, different composition");
    expect(unlocked).not.toContain("changed camera angle");
  });

  it("concatenates all extra negative fragments in order", () => {
    const result = buildNegativePrompt({
      focusNegative: "F",
      lockView: true,
      lightingStrictNegative: "LS",
      lightingScenarioNegative: "LN",
      sourceImageLayoutNegative: "SL",
      sourceImageFurnitureNegative: "SF"
    });
    const tail = result.slice(result.indexOf(", F"));
    expect(tail).toBe(
      ", F, changed camera angle, different viewpoint, different compositionLSLNSLSF"
    );
  });

  it("produces no trailing extra fragments when they are empty", () => {
    const result = buildNegativePrompt(baseArgs);
    expect(result.endsWith(", ")).toBe(true);
  });
});
