import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sunrise, Sun, Sunset, Moon, Wand2, Snowflake, Flower2, Sparkles, Leaf } from "lucide-react";
import { useAtmosphere } from "./AtmosphereProvider";
import { SEASON_LABELS, type TimeOfDay } from "./atmosphere-core";

type Option = { key: TimeOfDay | "auto"; label: string; Icon: typeof Sun };

const OPTIONS: Option[] = [
  { key: "auto", label: "Auto", Icon: Wand2 },
  { key: "dawn", label: "Dawn", Icon: Sunrise },
  { key: "day", label: "Day", Icon: Sun },
  { key: "dusk", label: "Dusk", Icon: Sunset },
  { key: "night", label: "Night", Icon: Moon },
];

const TIME_ICON: Record<TimeOfDay, typeof Sun> = {
  dawn: Sunrise,
  day: Sun,
  dusk: Sunset,
  night: Moon,
};

const SEASON_ICON = {
  winter: Snowflake,
  spring: Flower2,
  summer: Sparkles,
  autumn: Leaf,
} as const;

export default function AtmosphereToggle() {
  const { timeOfDay, season, override, setOverride } = useAtmosphere();
  const [open, setOpen] = useState(false);

  const CurrentIcon = override === "auto" ? TIME_ICON[timeOfDay] : TIME_ICON[override];
  const SeasonIcon = SEASON_ICON[season];

  return (
    <div className="fixed bottom-5 left-5 z-[90] flex flex-col items-start gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong rounded-2xl p-1.5 flex flex-col gap-1 shadow-2xl"
          >
            {OPTIONS.map(({ key, label, Icon }) => {
              const active = override === key;
              return (
                <button
                  key={key}
                  onClick={() => setOverride(key)}
                  aria-pressed={active}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                    active
                      ? "text-white bg-brand-soft ring-brand"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              );
            })}
            <div className="mt-1 flex items-center gap-2 px-3 py-1.5 text-[11px] text-white/45 border-t border-white/10">
              <SeasonIcon className="h-3.5 w-3.5" />
              <span>{SEASON_LABELS[season]} effects</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        aria-label="Change site atmosphere"
        title="Change atmosphere"
        className="glass-strong h-11 w-11 rounded-full grid place-items-center text-white shadow-xl glow-brand"
      >
        <CurrentIcon className="h-5 w-5 text-brand" />
      </motion.button>
    </div>
  );
}
