export interface BuildNegativePromptArgs {
  focusNegative: string;
  lockView: boolean;
  lightingStrictNegative: string;
  lightingScenarioNegative: string;
  sourceImageLayoutNegative: string;
  sourceImageFurnitureNegative: string;
}

export function buildNegativePrompt({
  focusNegative,
  lockView,
  lightingStrictNegative,
  lightingScenarioNegative,
  sourceImageLayoutNegative,
  sourceImageFurnitureNegative
}: BuildNegativePromptArgs) {
  const baseNegative = [
    "blurry",
    "soft focus",
    "out of focus",
    "low quality",
    "distorted",
    "watermark",
    "text",
    "motion blur",
    "jpeg artifacts",
    "simplified chandelier",
    "deformed chandelier",
    "melted handles",
    "plastic-looking hardware",
    "CGI look",
    "cartoonish",
    "painterly",
    "overprocessed",
    "fake materials",
    "close-up shot",
    "macro photo",
    "extreme close-up",
    "isolated object",
    "product photo",
    "single object composition",
    "cropped interior",
    "no room context",
    "door handle only",
    "knob closeup",
    "extra legs",
    "missing legs",
    "fused legs",
    "deformed legs",
    "broken legs",
    "floating furniture",
    "distorted table base",
    "distorted chair base",
    "malformed pedestal",
    "barrel distortion",
    "fisheye",
    "curved lines",
    "bent lines",
    "wavy lines",
    "warped perspective",
    "tilted verticals",
    "keystone distortion"
  ].join(", ");
  const viewLockNegative = lockView ? ", changed camera angle, different viewpoint, different composition" : "";
  return `${baseNegative}, ${focusNegative}${viewLockNegative}${lightingStrictNegative}${lightingScenarioNegative}${sourceImageLayoutNegative}${sourceImageFurnitureNegative}`;
}
