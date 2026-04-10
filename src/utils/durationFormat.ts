/**
 * Shared duration formatting for the entire dashboard.
 *
 * Convention:
 *   < 1 min   → "< 1 min"
 *   < 60 min  → "X min"
 *   ≥ 60 min  → "X.Xh"  (one decimal)
 *
 * Accepts **hours** as the canonical API unit (most backend responses use hours).
 */

export interface FormattedDuration {
  /** Human-readable value, e.g. "42 min" or "3.2h" */
  text: string;
  /** Dynamic label suitable for headings: "Active time" when value may be < 1h,
   *  or "Active hours" when guaranteed to be ≥ 1h. Caller can override. */
  label: string;
}

/** Format a duration given in **hours** (the API's default unit). */
export function formatDurationHours(hours: number): FormattedDuration {
  if (!Number.isFinite(hours) || hours < 0) {
    return { text: "0 min", label: "Active time" };
  }
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 1) {
    return { text: "< 1 min", label: "Active time" };
  }
  if (totalMinutes < 60) {
    return { text: `${totalMinutes} min`, label: "Active time" };
  }
  return { text: `${hours.toFixed(1)}h`, label: "Active hours" };
}

/** Format a duration given in **seconds**. */
export function formatDurationSeconds(seconds: number): FormattedDuration {
  return formatDurationHours(seconds / 3600);
}

/**
 * Returns just the value string — a convenience wrapper for inline use
 * where the label is not needed.
 */
export function fmtHours(hours: number): string {
  return formatDurationHours(hours).text;
}

export function fmtSeconds(seconds: number): string {
  return formatDurationSeconds(seconds).text;
}
