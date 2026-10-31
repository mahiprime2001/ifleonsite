import { memo } from "react";

/*
 * The IFLEON mark: two interlocking rings ("infinite, logical elements" linked together) on a
 * deep-green tile. Drawn inline so it stays crisp at any size; app/icon.svg is the same drawing.
 */
export const LogoMark = memo(function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="#17583B" />
      <circle cx="12.6" cy="16" r="5.6" fill="none" stroke="#FAF8F4" strokeWidth="2.3" />
      <circle cx="19.4" cy="16" r="5.6" fill="none" stroke="#B3D3BF" strokeWidth="2.3" />
    </svg>
  );
});

type LogoProps = {
  /** Height of the mark in px; the wordmark scales with it. */
  size?: number;
  className?: string;
  /** Set false for the mark alone. */
  wordmark?: boolean;
  /** "dark" for use on the deep-green footer. */
  tone?: "light" | "dark";
};

/* Mark + "ifleon" wordmark (lowercase serif, as the brand is written in running text: IFLEON). */
export const Logo = memo(function Logo({ size = 32, className = "", wordmark = true, tone = "light" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {wordmark && (
        <span
          aria-hidden="true"
          className={`font-serif font-semibold leading-none tracking-[-0.03em] ${tone === "dark" ? "text-paper" : "text-ink"}`}
          style={{ fontSize: size * 0.82 }}
        >
          ifleon
        </span>
      )}
      <span className="sr-only">IFLEON</span>
    </span>
  );
});
