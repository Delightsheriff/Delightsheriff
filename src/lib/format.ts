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

// Inclusive month count between two YYYY-MM values, so Jan to Dec is 12 months.
export function monthsBetween(start: string, end: string): number {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
}

export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (rest > 0) parts.push(`${rest} mo`);
  return parts.join(" ");
}

export function currentMonth(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// "March 4, 2026". Dates from the CMS are plain dates, so read them as UTC to avoid
// showing the day before in timezones behind UTC.
export function formatLongDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
