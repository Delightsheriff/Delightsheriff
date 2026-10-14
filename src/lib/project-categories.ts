export const CATEGORY_LABELS: Record<string, string> = {
  web: "Web",
  mobile: "Mobile",
  macos: "macOS",
  api: "API",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

// Lead with the strongest work; the CMS has no field for this.
export const CATEGORY_ORDER = ["web", "mobile", "macos", "api"];

function categoryRank(category: string): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

export function sortByCategory<T extends { category: string; order: number }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) =>
      categoryRank(a.category) - categoryRank(b.category) ||
      a.category.localeCompare(b.category) ||
      a.order - b.order,
  );
}
