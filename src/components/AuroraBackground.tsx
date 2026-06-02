import { memo } from "react";

/**
 * Global page backdrop — CLARITY/SIGNAL hybrid.
 *
 * A fixed, GPU-cheap layer: the themed page color, one very soft brand-tinted
 * radial wash, a faint structural grid, and grain to kill banding. No time-of-day
 * morph, no seasonal particles, no drifting blobs — calm and consistent in both
 * skins (it reads as paper in light, carbon in dark). Decorative + inert.
 */
export const AuroraBackground = memo(function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background grain"
    >
      {/* single soft brand wash, top-right */}
      <div
        className="absolute -top-1/4 right-[-10%] h-[60vmax] w-[60vmax] rounded-full blur-[160px]"
        style={{ backgroundColor: "hsl(var(--brand) / 0.07)" }}
      />
      {/* faint structural grid, masked to center */}
      <div className="absolute inset-0 iso-grid-bg opacity-50" />
    </div>
  );
});

export default AuroraBackground;
