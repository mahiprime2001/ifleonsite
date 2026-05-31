/* ============================================================
   Atmosphere core — season detection for the ambient particle layer.
   (The time-of-day color theming was removed in favour of a single
   fixed palette; only the seasonal effect remains.)
   ============================================================ */

export type Season = "winter" | "spring" | "summer" | "autumn";

/** Map a month (0–11) to a season (Northern Hemisphere — IFLEON is India). */
export function seasonFromMonth(month: number): Season {
  if (month === 11 || month <= 1) return "winter"; // Dec, Jan, Feb
  if (month >= 2 && month <= 4) return "spring"; // Mar–May
  if (month >= 5 && month <= 7) return "summer"; // Jun–Aug
  return "autumn"; // Sep–Nov
}

export const SEASON_LABELS: Record<Season, string> = {
  winter: "Winter",
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
};
