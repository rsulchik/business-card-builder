import { availableCatalog } from "./catalog.ts";

export const skinTypes = ["dry", "oily", "combination", "normal", "sensitive"] as const;
export const concerns = [
  "hydration",
  "glow",
  "gentle-care",
  "even-tone",
  "lip-color",
  "cheek-color",
  "daily-routine",
  "gift",
] as const;

export type SkinType = typeof skinTypes[number];
export type Concern = typeof concerns[number];

export interface RecommendationRequest {
  skinType: SkinType;
  concern: Concern;
  note: string;
}

export interface RecommendationItem {
  slug: string;
  reason: string;
}

export interface RecommendationPayload {
  summary: string;
  recommendations: RecommendationItem[];
}

const availableSlugs = new Set(availableCatalog.map(product => product.slug));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function parseRecommendationRequest(value: unknown): RecommendationRequest | null {
  if (!isRecord(value)) return null;
  if (!skinTypes.includes(value.skinType as SkinType)) return null;
  if (!concerns.includes(value.concern as Concern)) return null;
  if (typeof value.note !== "string" || value.note.length > 500) return null;

  return {
    skinType: value.skinType as SkinType,
    concern: value.concern as Concern,
    note: value.note.trim(),
  };
}

export function parseRecommendationPayload(value: unknown): RecommendationPayload | null {
  if (!isRecord(value)) return null;
  if (typeof value.summary !== "string" || !value.summary.trim() || value.summary.length > 500) return null;
  if (!Array.isArray(value.recommendations) || value.recommendations.length < 1 || value.recommendations.length > 3) return null;

  const seen = new Set<string>();
  const recommendations: RecommendationItem[] = [];

  for (const item of value.recommendations) {
    if (!isRecord(item)) return null;
    if (typeof item.slug !== "string" || !availableSlugs.has(item.slug) || seen.has(item.slug)) return null;
    if (typeof item.reason !== "string" || !item.reason.trim() || item.reason.length > 600) return null;
    seen.add(item.slug);
    recommendations.push({ slug: item.slug, reason: item.reason.trim() });
  }

  return { summary: value.summary.trim(), recommendations };
}
