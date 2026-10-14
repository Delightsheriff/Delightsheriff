import { describe, expect, it } from "vitest";
import { categoryLabel, sortByCategory } from "./project-categories";

describe("categoryLabel", () => {
  it("labels known categories, including macOS", () => {
    expect(categoryLabel("macos")).toBe("macOS");
    expect(categoryLabel("api")).toBe("API");
  });

  it("falls back to the raw value for unknown categories", () => {
    expect(categoryLabel("cli")).toBe("cli");
  });
});

describe("sortByCategory", () => {
  it("orders groups web, mobile, macos, api and keeps order within each", () => {
    const items = [
      { name: "Soundfork", category: "macos", order: 1 },
      { name: "Gateway", category: "api", order: 1 },
      { name: "Dfood", category: "mobile", order: 2 },
      { name: "Archive", category: "mobile", order: 1 },
      { name: "SmartHub", category: "web", order: 1 },
    ];

    expect(sortByCategory(items).map((i) => i.name)).toEqual([
      "SmartHub",
      "Archive",
      "Dfood",
      "Soundfork",
      "Gateway",
    ]);
  });

  it("puts unknown categories last", () => {
    const items = [
      { name: "Tool", category: "cli", order: 1 },
      { name: "Gateway", category: "api", order: 1 },
    ];

    expect(sortByCategory(items).map((i) => i.name)).toEqual(["Gateway", "Tool"]);
  });

  it("does not mutate its input", () => {
    const items = [
      { category: "api", order: 1 },
      { category: "web", order: 1 },
    ];
    sortByCategory(items);
    expect(items[0].category).toBe("api");
  });
});
