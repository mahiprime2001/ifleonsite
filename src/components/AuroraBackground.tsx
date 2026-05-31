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
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#06060A] grain"
    >
      {/* drifting aurora blobs — color from theme vars, intensity from --aurora-opacity */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: "var(--aurora-opacity, 1)" }}
      >
        <div
          className="absolute -top-1/3 -left-1/4 h-[70vmax] w-[70vmax] rounded-full blur-[140px] animate-aurora transition-colors duration-1000"
          style={{ backgroundColor: "hsl(var(--brand) / 0.25)" }}
        />
        <div
          className="absolute top-1/4 -right-1/4 h-[60vmax] w-[60vmax] rounded-full blur-[150px] animate-aurora-slow transition-colors duration-1000"
          style={{ backgroundColor: "hsl(var(--brand-2) / 0.20)" }}
        />
        <div
          className="absolute -bottom-1/3 left-1/3 h-[55vmax] w-[55vmax] rounded-full blur-[150px] animate-aurora transition-colors duration-1000"
          style={{ backgroundColor: "hsl(var(--brand-3) / 0.16)" }}
        />
      </div>

      {/* faint structural grid */}
      <div className="absolute inset-0 iso-grid-bg opacity-60" />

      {/* seasonal particles (snow / petals / motes / leaves) */}
      <SeasonalEffect />

      {/* top + bottom vignettes to keep content readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06060A]/80 via-transparent to-[#06060A]/90" />
    </div>
  );
});

export default AuroraBackground;
