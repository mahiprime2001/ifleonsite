import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, Check } from "lucide-react";
import { useVersion, VERSIONS } from "./VersionProvider";

/* Floating theme-version preview switcher (bottom-left). Lets the owner
   flip between homepage theme directions live and pick one. Deliberately
   uses its own self-contained dark chrome so it reads clearly on every
   version's background. */
export default function VersionSwitcher() {
  const { version, setVersion } = useVersion();
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-4 left-4 z-[150] font-sans" data-cursor>
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-[230px] rounded-2xl border border-white/10 bg-[#0b0e14]/95 backdrop-blur-xl p-2.5 shadow-2xl shadow-black/50 text-white"
          >
            <div className="flex items-center justify-between px-1.5 pb-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Preview themes
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Hide theme switcher"
                className="rounded-md p-1 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex max-h-[64vh] flex-col gap-1 overflow-y-auto overscroll-contain pr-1">
              {VERSIONS.map((v) => {
                const active = v.id === version;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVersion(v.id)}
                    className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${
                      active ? "bg-white/12" : "hover:bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                        active
                          ? "bg-gradient-to-br from-[#3b82f6] to-[#2dd4bf] text-white"
                          : "bg-white/10 text-white/70"
                      }`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {v.num}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        {v.label}
                        {active && <Check className="h-3.5 w-3.5 text-[#2dd4bf]" />}
                      </span>
                      <span className="block truncate text-[10px] text-white/45">{v.ref}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            aria-label="Show theme switcher"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0b0e14]/95 backdrop-blur-xl px-3.5 py-2.5 text-white shadow-2xl shadow-black/50"
          >
            <Layers className="h-4 w-4" />
            <span className="text-xs font-semibold">{version.toUpperCase()}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
