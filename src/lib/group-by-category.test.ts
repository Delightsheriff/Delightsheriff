import { describe, expect, it } from "vitest";
import { groupByCategory } from "./group-by-category";

describe("groupByCategory", () => {
  it("buckets items under their category key", () => {
    const items = [
      { name: "Dfood", category: "mobile" },
      { name: "SmartHub", category: "web" },
      { name: "Archive", category: "mobile" },
    ];

    expect(groupByCategory(items)).toEqual({
      mobile: [
        { name: "Dfood", category: "mobile" },
        { name: "Archive", category: "mobile" },
      ],
      web: [{ name: "SmartHub", category: "web" }],
    });
  });

  it("preserves input order within each category", () => {
    const items = [
      { id: 1, category: "a" },
      { id: 2, category: "a" },
      { id: 3, category: "a" },
    ];

    expect(groupByCategory(items).a.map((i) => i.id)).toEqual([1, 2, 3]);
  });

  it("returns an empty object for an empty list", () => {
    expect(groupByCategory([])).toEqual({});
  });
});
