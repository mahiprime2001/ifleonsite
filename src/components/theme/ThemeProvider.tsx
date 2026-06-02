import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ============================================================
   Theme engine for the CLARITY + SIGNAL hybrid.
   - CLARITY (light) is the default marketing skin.
   - SIGNAL (dark) is the "engine room" — and the user's choice.
   - `forced` lets route owners pin a skin (e.g. dark app/console)
     without disturbing the user's saved preference.
   Replaces the old time-of-day AtmosphereProvider.
   ============================================================ */

export type Skin = "light" | "dark";
export type Preference = Skin | "system";

type ThemeValue = {
  preference: Preference;
  resolvedTheme: Skin; // what the user's preference resolves to
  activeTheme: Skin; // what's actually on the document (after any force)
  isForced: boolean;
  setPreference: (p: Preference) => void;
  toggle: () => void;
  setForced: (s: Skin | null) => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);
const STORAGE_KEY = "ifleon-theme";

function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<Preference>(() => {
    if (typeof localStorage === "undefined") return "system";
    const saved = localStorage.getItem(STORAGE_KEY) as Preference | null;
    return saved ?? "system";
  });
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark);
  const [forced, setForcedState] = useState<Skin | null>(null);

  // Track OS scheme changes while preference is "system".
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme: Skin =
    preference === "system" ? (systemDark ? "dark" : "light") : preference;
  const activeTheme: Skin = forced ?? resolvedTheme;

  // Single source of truth for the document class.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", activeTheme === "dark");
    root.style.colorScheme = activeTheme;
  }, [activeTheme]);

  const setPreference = useCallback((p: Preference) => {
    setPreferenceState(p);
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {
      /* ignore (private mode) */
    }
  }, []);

  const toggle = useCallback(() => {
    setPreference(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setPreference]);

  const setForced = useCallback((s: Skin | null) => setForcedState(s), []);

  const value = useMemo<ThemeValue>(
    () => ({
      preference,
      resolvedTheme,
      activeTheme,
      isForced: forced !== null,
      setPreference,
      toggle,
      setForced,
    }),
    [preference, resolvedTheme, activeTheme, forced, setPreference, toggle, setForced],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
