const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatMonthYear(value: string): string {
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  return `${MONTHS[monthIndex]} ${year}`;
}

export function formatDateRange(start: string, end: string | "Present"): string {
  const startLabel = formatMonthYear(start);
  const endLabel = end === "Present" ? "Present" : formatMonthYear(end);
  return `${startLabel} – ${endLabel}`;
}
