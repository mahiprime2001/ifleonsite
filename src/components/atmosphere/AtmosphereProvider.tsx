import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyPalette,
  seasonFromMonth,
  timeOfDayFromHour,
  TIME_PALETTES,
  type Season,
  type TimeOfDay,
} from "./atmosphere-core";

type Override = TimeOfDay | "auto";

type AtmosphereValue = {
  /** the time-of-day currently applied (after override resolution) */
  timeOfDay: TimeOfDay;
  /** the season currently applied */
  season: Season;
  /** user override, or "auto" to follow the clock */
  override: Override;
  setOverride: (o: Override) => void;
};

const AtmosphereContext = createContext<AtmosphereValue | null>(null);

const STORAGE_KEY = "ifleon-atmosphere";

export function AtmosphereProvider({ children }: { children: ReactNode }) {
  // Auto values follow the clock; recomputed on an interval.
  const [autoTime, setAutoTime] = useState<TimeOfDay>(() =>
    timeOfDayFromHour(new Date().getHours()),
  );
  const [season, setSeason] = useState<Season>(() =>
    seasonFromMonth(new Date().getMonth()),
  );

  const [override, setOverrideState] = useState<Override>(() => {
    if (typeof localStorage === "undefined") return "auto";
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as Override) || "auto";
  });

  const setOverride = (o: Override) => {
    setOverrideState(o);
    try {
      localStorage.setItem(STORAGE_KEY, o);
    } catch {
      /* ignore storage failures (private mode, etc.) */
    }
  };

  // Re-read the clock every minute so the theme transitions across boundaries
  // even if the visitor leaves the page open.
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setAutoTime(timeOfDayFromHour(now.getHours()));
      setSeason(seasonFromMonth(now.getMonth()));
    };
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const timeOfDay = override === "auto" ? autoTime : override;

  // Apply the palette whenever the resolved time-of-day changes.
  useEffect(() => {
    applyPalette(TIME_PALETTES[timeOfDay]);
  }, [timeOfDay]);

  const value = useMemo<AtmosphereValue>(
    () => ({ timeOfDay, season, override, setOverride }),
    [timeOfDay, season, override],
  );

  return (
    <AtmosphereContext.Provider value={value}>
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere(): AtmosphereValue {
  const ctx = useContext(AtmosphereContext);
  if (!ctx) {
    throw new Error("useAtmosphere must be used within an AtmosphereProvider");
  }
  return ctx;
}
