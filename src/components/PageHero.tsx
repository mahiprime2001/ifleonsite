import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimeText } from "./animations/AnimeText";

type Props = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
};

// Reusable premium dark page header — used across inner pages
// for visual consistency. Sits on top of the existing dark canvas.
export const PageHero = ({
  eyebrow,
  title,
  highlight,
  description,
  children,
  size = "md",
}: Props) => {
  const padY =
    size === "lg"
      ? "pt-32 pb-20 md:pt-40 md:pb-28"
      : size === "sm"
      ? "pt-24 pb-12 md:pt-28 md:pb-16"
      : "pt-28 pb-16 md:pt-32 md:pb-20";

  const titleSize =
    size === "lg"
      ? "text-4xl md:text-6xl lg:text-7xl"
      : size === "sm"
      ? "text-3xl md:text-5xl"
      : "text-4xl md:text-5xl lg:text-6xl";

  return (
    <section
      className={`relative ${padY} bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden border-b border-white/5`}
    >
      {/* glow orbs */}
      <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-blue-500/12 blur-[120px]" />
      <div className="absolute inset-0 mesh-bg opacity-30" />
      <div className="absolute inset-0 iso-grid-bg opacity-20" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold text-emerald-300">
                {eyebrow}
              </span>
            </motion.div>
          )}

          <h1 className={`${titleSize} font-black leading-[1.05] mb-5`}>
            <AnimeText
              as="span"
              text={title}
              className="block text-white"
              staggerMs={28}
              duration={700}
            />
            {highlight && (
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="block text-gradient-iflo animate-gradient mt-2"
              >
                {highlight}
              </motion.span>
            )}
          </h1>

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base md:text-xl text-slate-300 leading-relaxed"
            >
              {description}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
