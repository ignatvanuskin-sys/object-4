/**
 * Locale-aware formatting.
 *
 * Prices and dates used to be hard-coded strings ("10 000 ₸", "30 сентября
 * 2026"), which the web interface guidelines list as an anti-pattern: the
 * grouping separator, the currency position and the month name are all
 * locale decisions, not author decisions. They are real values now, formatted
 * through Intl so the render follows the locale instead of a literal.
 */

const kzt = new Intl.NumberFormat("ru-KZ", {
  style: "currency",
  currency: "KZT",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 10000 → "10 000 ₸" (with a non-breaking group separator). */
export const money = (amount: number) => kzt.format(amount);

const longDate = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * "2026-09-30" → "30 сентября 2026".
 * Composed from parts to drop the " г." suffix that ru-RU appends to a full
 * date. Midday UTC is used so no timezone can shift the calendar day.
 */
export function formatDate(iso: string): string {
  const parts = longDate.formatToParts(new Date(`${iso}T12:00:00Z`));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("day")} ${part("month")} ${part("year")}`;
}
