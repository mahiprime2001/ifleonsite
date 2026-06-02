import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

/**
 * Light/dark skin toggle. Disabled (and hidden) when a route forces a skin,
 * since the user's choice can't apply there (e.g. the dark app console).
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, isForced, toggle } = useTheme();
  if (isForced) return null;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground/80 transition-colors hover:text-foreground hover:bg-accent ${className}`}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex"
      >
        {isDark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
      </motion.span>
    </button>
  );
}
