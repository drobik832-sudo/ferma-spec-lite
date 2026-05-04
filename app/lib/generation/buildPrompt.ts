import { featureIdsToPromptFragments, lightIdsToPromptFragments } from "../features";
export type ChangeFocus = "decor" | "lighting" | "materials" | "hardware";

export interface BuildPromptArgs {
  plan: string | null;
  rooms: string[];
  style: string | null;
  brightness: string | null;
  contrast: string | null;
  lighting: string | null;
  palette: string | null;
  time: string | null;
  zodiacSign: string | null;
  family: string | null;
  features: string | null;
  lightFeatures: string | null;
  changeFocus: ChangeFocus;
}

export function buildPromptText({
  plan,
  rooms,
  style,
  brightness,
  contrast,
  lighting,
  palette,
  time,
  zodiacSign,
  family,
  features,
  lightFeatures,
  changeFocus
}: BuildPromptArgs) {
  const styleMap: Record<string, string> = {
    modern: "modern",
    neoclassic: "neoclassical",
    eco: "eco style, biophilic interior, natural materials, wood, stone, linen, rattan, indoor plants, greenery, earthy tones, warm ambient lighting, sustainable design",
    scandinavian: "scandinavian, nordic, bright airy interior, light wood, white walls, warm neutral palette, minimal decor, cozy textiles"
  };
  const brightnessMap: Record<string, string> = {
    dim: "dim lighting",
    normal: "balanced brightness",
    bright: "bright lighting"
  };
  const contrastMap: Record<string, string> = {
    soft: "soft contrast",
    natural: "natural contrast",
    high: "high contrast"
  };
  const lightingMap: Record<string, string> = {
    warm: "warm lighting",
    neutral: "neutral lighting",
    cool: "cool lighting"
  };
  const paletteMap: Record<string, string> = {
    mono: "monochrome palette",
    pastel: "pastel palette",
    rich: "rich saturated palette"
  };
  const timeMap: Record<string, string> = {
    morning: "morning light",
    day: "daylight",
    evening: "night, nighttime interior, no daylight"
  };
  const roomMap: Record<string, string> = {
    hallway: "hallway",
    kitchen: "kitchen",
    living: "living room",
    bathroom: "bathroom",
    bedroom: "bedroom",
    kids: "kids room",
    balcony: "balcony"
  };
  const planMap: Record<string, string> = {
    premium: "luxury",
    optimal: "balanced",
    budget: "budget"
  };
  const stylePart = style ? styleMap[style] || style : "modern";
  const roomsPart = rooms.length ? rooms.map(r => roomMap[r] || r).join(", ") : "";
  const planPart = plan ? planMap[plan] || plan : "balanced";
  const zodiacText = zodiacSign ? `, ${zodiacSign} vibe` : "";
  const settingsPart = [
    brightness ? brightnessMap[brightness] : null,
    contrast ? contrastMap[contrast] : null,
    lighting ? lightingMap[lighting] : null,
    palette ? paletteMap[palette] : null,
    time && changeFocus !== "lighting" ? timeMap[time] : null
  ].filter(Boolean).join(", ");
  const familyPart = family ? roomMap[family] || family : "";
  const featuresPart = features ? featureIdsToPromptFragments(style, family, features).filter(Boolean).join(", ") : "";
  const lightFeaturesPart = lightFeatures ? lightIdsToPromptFragments(style, family, lightFeatures).filter(Boolean).join(", ") : "";
  const includePart = [featuresPart, lightFeaturesPart].filter(Boolean).join(", ");
  const roomFocusPart = familyPart ? `, focus on ${familyPart}` : "";
  const featuresText = includePart ? `, include: ${includePart}` : "";
  const settingsText = settingsPart ? `, ${settingsPart}` : "";
  const lightBounceText = changeFocus === "lighting" ? "realistic light bounce" : "natural light bounce";
  const includesKitchen = rooms.includes("kitchen") || familyPart === "kitchen";
  const includesLiving = rooms.includes("living") || familyPart === "living room";
  const separateKitchenText =
    includesKitchen && !includesLiving
      ? ", separate enclosed kitchen, closed kitchen with a door, not open-plan, no living room area, no sofa, no TV"
      : "";
  const modernNeoclassicText = style === "neoclassic"
    ? ", modern neoclassical styling, subtle metallic accents, brushed brass and polished gold details, thin metal trim in wall panels, contemporary metal-framed furniture"
    : "";
  return `interior design, ${stylePart} style${modernNeoclassicText}, ${roomsPart}, ${planPart} materials${settingsText}${roomFocusPart}${featuresText}${separateKitchenText}, Architectural Digest style photography, photorealistic interior photography, full room interior view, show entire room context with walls floor ceiling and furniture, curated wall art, minimalist paintings, abstract paintings, constructivist art posters, geometric gallery wall accents, DSLR photo look, full-frame camera realism, natural lens perspective, realistic white balance, cinematic lighting, global illumination, physically based rendering, ray traced lighting, realistic shadows, realistic reflections, high dynamic range, 8k resolution, highly detailed textures, intricate details, crisp image, sharp focus, tack sharp focus, high micro-contrast, fine details, lifelike atmosphere, ${lightBounceText}, soft contact shadows, lived-in styling, realistic decor layering, authentic material variation, detailed chandelier design, crystal prism highlights, realistic brushed metal hardware, architectural interior photography, rectilinear wide angle, 24mm lens, no barrel distortion, no fisheye, straight lines, corner-to-corner room coverage, perspective corrected vertical lines, premium materials, clean composition${zodiacText}`;
}
