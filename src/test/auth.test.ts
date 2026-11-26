import { describe, expect, it } from "vitest";
import { sanitizeReturnPath, validateAuthFields } from "@/lib/auth";

const validRegistration = {
  mode: "register" as const,
  fullName: "Aýlar",
  email: "aylar@example.com",
  password: "guzellik26",
  confirmPassword: "guzellik26",
};

describe("account validation", () => {
  it("requires a display name at registration", () => {
    expect(validateAuthFields({ ...validRegistration, fullName: " " })).toBe("Adyňyzy ýazyň.");
  });

  it("limits display names to 80 characters", () => {
    expect(validateAuthFields({ ...validRegistration, fullName: "a".repeat(81) })).toBe("At 80 harpdan köp bolmaly däl.");
  });

  it("requires passwords of at least eight characters", () => {
    expect(validateAuthFields({ ...validRegistration, password: "1234567", confirmPassword: "1234567" })).toBe("Açar söz azyndan 8 harpdan ybarat bolmaly.");
  });

  it("requires matching registration passwords", () => {
    expect(validateAuthFields({ ...validRegistration, confirmPassword: "different26" })).toBe("Açar sözler gabat gelmeýär.");
  });

  it("accepts valid registration details", () => {
    expect(validateAuthFields(validRegistration)).toBeNull();
  });

  it("allows only local post-sign-in paths", () => {
    expect(sanitizeReturnPath("/cart")).toBe("/cart");
    expect(sanitizeReturnPath("https://example.com")).toBe("/account");
    expect(sanitizeReturnPath("//example.com")).toBe("/account");
  });
});
