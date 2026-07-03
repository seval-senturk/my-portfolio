import type { EmploymentDate, ExperienceEntry } from "@/types/experience";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatMonthYear(date: EmploymentDate): string {
  const monthIndex = date.month - 1;
  const monthLabel = MONTH_LABELS[monthIndex] ?? "Jan";

  return `${monthLabel} ${date.year}`;
}

export function formatEmploymentPeriod(
  entry: Pick<ExperienceEntry, "startDate" | "endDate" | "current">,
): string {
  const start = formatMonthYear(entry.startDate);
  const end = entry.current
    ? "Present"
    : entry.endDate
      ? formatMonthYear(entry.endDate)
      : "Present";

  return `${start} – ${end}`;
}

export function formatBlogPostDate(iso?: string | null): string {
  if (!iso) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}
