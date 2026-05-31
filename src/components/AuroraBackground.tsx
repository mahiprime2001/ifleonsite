import { memo } from "react";
import SeasonalEffect from "./SeasonalEffect";

/**
 * Global atmospheric backdrop.
 *
 * A fixed, GPU-cheap CSS layer behind the whole app: a near-black base and
 * three slowly drifting aurora blobs whose colors are driven by the
 * --brand / --brand-2 / --brand-3 CSS variables. The AtmosphereProvider
 * rewrites those variables by time-of-day, so the blobs smoothly morph from
 * dawn → day → dusk → night. A seasonal particle layer sits on top.
 *
 * Pure CSS transforms/colors (plus one small canvas) — far lighter than the
 * WebGL hero scene, and reduced-motion is respected in index.css / the canvas.
 */
export const AuroraBackground = memo(function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0C1120] grain"
    >
      {/* drifting blue glow — subtle, single-accent (realistic, not neon) */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-1/3 -left-1/4 h-[68vmax] w-[68vmax] rounded-full blur-[150px] animate-aurora"
          style={{ backgroundColor: "hsl(var(--brand) / 0.16)" }}
        />
        <div
          className="absolute top-1/4 -right-1/4 h-[56vmax] w-[56vmax] rounded-full blur-[160px] animate-aurora-slow"
          style={{ backgroundColor: "hsl(var(--brand-2) / 0.12)" }}
        />
        <div
          className="absolute -bottom-1/3 left-1/3 h-[52vmax] w-[52vmax] rounded-full blur-[160px] animate-aurora"
          style={{ backgroundColor: "hsl(var(--brand-3) / 0.08)" }}
        />
      </div>

      {/* faint structural grid */}
      <div className="absolute inset-0 iso-grid-bg opacity-50" />

      {/* seasonal particles (snow / petals / motes / leaves) */}
      <SeasonalEffect />

      {/* top + bottom vignettes to keep content readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C1120]/80 via-transparent to-[#0C1120]/95" />
    </div>
  );
});

export default AuroraBackground;
