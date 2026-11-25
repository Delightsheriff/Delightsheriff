import { describe, expect, it } from "vitest";
import { currentMonth, formatDateRange, formatDuration, formatLongDate, formatMonthYear, monthsBetween } from "./format";

describe("format", () => {
  it("formats a month and year", () => {
    expect(formatMonthYear("2025-03")).toBe("Mar 2025");
  });

  it("formats a date range with a present end", () => {
    expect(formatDateRange("2025-03", "Present")).toBe("Mar 2025 – Present");
  });

  it("counts months inclusively", () => {
    expect(monthsBetween("2024-09", "2024-12")).toBe(4);
    expect(monthsBetween("2023-01", "2023-12")).toBe(12);
    expect(monthsBetween("2025-03", "2025-03")).toBe(1);
  });

  it("describes a duration in years and months", () => {
    expect(formatDuration(4)).toBe("4 mo");
    expect(formatDuration(12)).toBe("1 yr");
    expect(formatDuration(21)).toBe("1 yr 9 mo");
    expect(formatDuration(47)).toBe("3 yrs 11 mo");
  });

  it("returns the current month as YYYY-MM", () => {
    expect(currentMonth(new Date(2026, 10, 25))).toBe("2026-11");
    expect(currentMonth(new Date(2026, 0, 5))).toBe("2026-01");
  });

  it("writes a plain date out in full without shifting the day", () => {
    expect(formatLongDate("2026-03-04")).toBe("March 4, 2026");
    expect(formatLongDate("2026-01-01")).toBe("January 1, 2026");
  });
});
