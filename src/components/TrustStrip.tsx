import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2,
  Rocket,
  ShieldCheck,
  Cloud,
  Bot,
  GitBranch,
  Zap,
  Globe,
  Briefcase,
  Layers,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const trustItems = [
  { icon: Rocket, label: "Startups" },
  { icon: Building2, label: "SMBs & Enterprises" },
  { icon: Bot, label: "AI / ML Projects" },
  { icon: Cloud, label: "Cloud-Native Teams" },
  { icon: GitBranch, label: "DevOps Pipelines" },
  { icon: ShieldCheck, label: "Security-Conscious Clients" },
  { icon: Globe, label: "Global Remote Teams" },
  { icon: Zap, label: "High-Growth SaaS" },
  { icon: Briefcase, label: "Consultancies" },
  { icon: Layers, label: "Platform Teams" },
];

export const TrustStrip = () => {
  const loop = [...trustItems, ...trustItems];
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // base infinite scroll
    const tl = gsap.to(track, {
      xPercent: -50,
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tl.pause();
      gsap.set(track, { xPercent: 0 });
      return () => tl.kill();
    }

    // skew + speed up with scroll velocity (the marquee "reacts" to scrolling)
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        gsap.to(track, {
          skewX: gsap.utils.clamp(-14, 14, v / -90),
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
        tl.timeScale(gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 400));
      },
    });

    // ease the speed back to normal each frame
    const decay = () => {
      tl.timeScale(gsap.utils.interpolate(tl.timeScale(), 1, 0.06));
    };
    gsap.ticker.add(decay);

    return () => {
      st.kill();
      tl.kill();
      gsap.ticker.remove(decay);
    };
  }, []);

  return (
    <section className="relative py-10 md:py-12 bg-transparent border-y border-border overflow-hidden">
      <div className="absolute inset-0 iso-grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="eyebrow text-xs md:text-sm">Trusted by teams across</p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div ref={trackRef} className="flex gap-8 md:gap-12 w-max will-change-transform">
          {loop.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-border flex items-center justify-center">
                  <Icon className="h-4 w-4 text-brand" />
                </div>
                <span className="text-sm md:text-base font-medium whitespace-nowrap text-foreground">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
