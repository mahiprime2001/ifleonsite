import { memo } from "react";

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
  src="/logo.svg"
  alt={alt}
  width={size}
  height={size}
  className={className}
  draggable={false}
  />
  );
});
