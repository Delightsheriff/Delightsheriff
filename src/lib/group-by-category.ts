export function groupByCategory<T extends { category: string }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
}
