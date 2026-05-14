import { memo } from "react";
// Importing the SVG through Vite so the build outputs a hashed asset
// (e.g. /assets/logo-<hash>.svg) and the URL is rewritten correctly
// regardless of where the page is served from (root, WP theme subdir, etc.).
import logoUrl from "../assets/logo.svg";

type LogoProps = {
  size?: number;
  className?: string;
  alt?: string;
};

export const Logo = memo(function Logo({
  size = 36,
  className = "",
  alt = "IFLEON logo",
}: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt={alt}
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
});
