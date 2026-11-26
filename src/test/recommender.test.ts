import { describe, expect, it } from "vitest";
import {
  parseRecommendationPayload,
  parseRecommendationRequest,
} from "../../supabase/functions/recommend-products/validation";

const validRequest = {
  skinType: "dry",
  concern: "hydration",
  note: "Ýeňil dokuma halaýaryn",
};

const validResponse = {
  summary: "Çygly we tebigy ýagtylyk üçin şu önümleri saýladyk.",
  recommendations: [
    { slug: "imported-axcne-ampoule-kit-1", reason: "Gialuron kislotasy we ýüpek ýaly dokumasy bar." },
  ],
};

describe("beauty recommender validation", () => {
  it("accepts a supported skin type and beauty need", () => {
    expect(parseRecommendationRequest(validRequest)).toEqual(validRequest);
  });

  it("rejects unsupported shopper selections", () => {
    expect(parseRecommendationRequest({ ...validRequest, skinType: "unknown" })).toBeNull();
    expect(parseRecommendationRequest({ ...validRequest, concern: "diagnose-acne" })).toBeNull();
  });

  it("rejects shopper notes longer than 500 characters", () => {
    expect(parseRecommendationRequest({ ...validRequest, note: "a".repeat(501) })).toBeNull();
  });

  it("rejects unknown and sold-out product IDs", () => {
    const unknown = { ...validResponse, recommendations: [{ slug: "invented-product", reason: "Sebäp" }] };
    const soldOut = { ...validResponse, recommendations: [{ slug: "botanical-lash-brow-serum", reason: "Sebäp" }] };
    expect(parseRecommendationPayload(unknown)).toBeNull();
    expect(parseRecommendationPayload(soldOut)).toBeNull();
  });

  it("rejects more than three recommendations", () => {
    const recommendations = [
      { slug: "imported-axcne-ampoule-kit-1", reason: "Sebäp" },
      { slug: "velvet-cloud-moisturizer", reason: "Sebäp" },
      { slug: "rose-quartz-facial-oil", reason: "Sebäp" },
      { slug: "silk-veil-lip-tint", reason: "Sebäp" },
    ];
    expect(parseRecommendationPayload({ ...validResponse, recommendations })).toBeNull();
  });

  it("rejects duplicate recommendations", () => {
    const recommendations = [validResponse.recommendations[0], validResponse.recommendations[0]];
    expect(parseRecommendationPayload({ ...validResponse, recommendations })).toBeNull();
  });

  it("accepts a valid recommendation from the available catalog", () => {
    expect(parseRecommendationPayload(validResponse)).toEqual(validResponse);
  });
});
