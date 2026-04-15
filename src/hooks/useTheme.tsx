import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "ifleon-theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  } catch {
  // ignore
  }
  if (
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
  return "dark";
  }
  return "light";
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  try {
  localStorage.setItem(STORAGE_KEY, theme);
  } catch {
  // ignore
  }
  }, [theme]);

  useEffect(() => {
  if (typeof window.matchMedia !== "function") return;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = (e: MediaQueryListEvent) => {
  try {
  if (!localStorage.getItem(STORAGE_KEY)) {
  setThemeState(e.matches ? "dark" : "light");
  }
  } catch {
  // ignore
  }
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggle = useCallback(
  () => setThemeState((p) => (p === "dark" ? "light" : "dark")),
  [],
  );

  const value = useMemo(
  () => ({ theme, toggle, setTheme }),
  [theme, toggle, setTheme],
  );

  return (
  <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};
