export const CATEGORY_LABELS: Record<string, string> = {
  web: "Web",
  mobile: "Mobile",
  macos: "macOS",
  api: "API",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
