/* ============================================================
   Atmosphere core — time-of-day + season detection and palettes.
   Time controls the accent palette; season controls the ambient
   particle effect. Palettes are written to CSS custom properties
   (--brand, --brand-2, --brand-3 as "H S% L%" channels) so the
   whole site re-tints without touching component markup.
   ============================================================ */

export type TimeOfDay = "dawn" | "day" | "dusk" | "night";
export type Season = "winter" | "spring" | "summer" | "autumn";

export type Palette = {
  /** "H S% L%" channel strings, consumed via hsl(var(--brand) / a) */
  brand: string;
  brand2: string;
  brand3: string;
  /** base aurora-blob opacity multiplier (0–1) */
  auroraOpacity: number;
  label: string;
};

export const TIME_PALETTES: Record<TimeOfDay, Palette> = {
  dawn: {
    brand: "14 89% 67%", // coral
    brand2: "33 95% 62%", // amber
    brand3: "268 80% 70%", // soft violet
    auroraOpacity: 0.9,
    label: "Dawn",
  },
  day: {
    brand: "205 90% 58%", // azure
    brand2: "190 85% 55%", // cyan
    brand3: "245 83% 68%", // indigo
    auroraOpacity: 1.15, // brighter, luminous
    label: "Day",
  },
  dusk: {
    brand: "282 80% 66%", // magenta-violet
    brand2: "330 80% 64%", // pink
    brand3: "24 92% 60%", // sunset orange
    auroraOpacity: 1.0,
    label: "Dusk",
  },
  night: {
    brand: "239 84% 67%", // indigo (Aurora Indigo default)
    brand2: "258 90% 66%", // violet
    brand3: "199 89% 60%", // sky
    auroraOpacity: 0.85,
    label: "Night",
  },
};

/** Map a clock hour (0–23) to a time-of-day bucket. */
export function timeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

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

/** Write a palette to the document root as CSS custom properties. */
export function applyPalette(palette: Palette): void {
  const root = document.documentElement;
  root.style.setProperty("--brand", palette.brand);
  root.style.setProperty("--brand-2", palette.brand2);
  root.style.setProperty("--brand-3", palette.brand3);
  root.style.setProperty("--aurora-opacity", String(palette.auroraOpacity));
}
