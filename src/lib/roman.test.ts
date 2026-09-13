import { describe, expect, it } from "vitest";
import { toRoman } from "./roman";

describe("toRoman", () => {
  it("converts single-digit years", () => {
    expect(toRoman(9)).toBe("IX");
  });

  it("converts the current site's launch year", () => {
    expect(toRoman(2026)).toBe("MMXXVI");
  });

  it("handles subtractive notation across thousands", () => {
    expect(toRoman(1994)).toBe("MCMXCIV");
  });

  it("handles a bare thousand", () => {
    expect(toRoman(2000)).toBe("MM");
  });
});
