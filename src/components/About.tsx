import { useEffect, useRef } from "react";
import {
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Brain,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import { AboutScene } from "./animations/AboutScene";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./animations/ScrollReveal";
import { Parallax } from "./animations/Parallax";
import { MagnetCard } from "./animations/MagnetCard";

type Stat = {
  icon: typeof Calendar;
  number: string;
  label: string;
  countTo?: number;
  suffix?: string;
};

export const About = () => {
  const stats: Stat[] = [
    { icon: Calendar, number: "2022", label: "Founded" },
    { icon: Users, number: "20+", label: "Clients Served", countTo: 20, suffix: "+" },
    { icon: MapPin, number: "Nellore, AP", label: "Headquarters" },
    { icon: TrendingUp, number: "Pan-India", label: "Growth Vision" },
  ];

  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const statsEl = statsRef.current;
    if (!statsEl) return;

    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played) return;
          played = true;

          const cards = statsEl.querySelectorAll<HTMLElement>("[data-stat-card]");
          animate(cards, {
            opacity: [0, 1],
            translateY: [24, 0],
            scale: [0.92, 1],
            duration: 700,
            delay: stagger(110),
            easing: "easeOutExpo",
          });

          statsEl
            .querySelectorAll<HTMLElement>("[data-stat-num]")
            .forEach((el) => {
              const target = Number(el.dataset.target || 0);
              const suffix = el.dataset.suffix || "";
              const proxy = { v: 0 };
              animate(proxy, {
                v: target,
                duration: 1800,
                easing: "easeOutQuad",
                delay: 300,
                update: () => {
                  el.textContent = Math.round(proxy.v).toString() + suffix;
                },
              });
            });
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(statsEl);
    return () => observer.disconnect();
  }, []);

  const milestones = [
    {
      year: "2022",
      title: "Foundation",
      description:
        "Founded in Nellore with a clear mission — deliver logical, scalable technology solutions.",
    },
    {
      year: "2024",
      title: "Service Expansion",
      description:
        "Scaled into AI, DevOps automation, cloud, and cybersecurity for local and remote clients.",
    },
    {
      year: "2025",
      title: "Growth Phase",
      description:
        "Structured growth, long-term partnerships, and open knowledge sharing through blogs.",
    },
    {
      year: "2026+",
      title: "National Presence",
      description:
        "Hyderabad expansion and a sustainable, high-impact pan-India consulting footprint.",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden"
    >
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-[40rem] h-[40rem] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute -bottom-40 left-1/4 w-[40rem] h-[40rem] rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <ScrollReveal direction="right">
              <p className="text-sm font-bold text-emerald-400 tracking-[0.3em] uppercase mb-3">
                About IFLEON
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                A team that turns{" "}
                <span className="text-gradient-iflo">infinite ideas</span>{" "}
                into logical solutions.
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <p className="text-base md:text-lg text-slate-300 mb-5 leading-relaxed">
                <strong className="text-white">IFLEON (Infinite Logical Elements of Network)</strong>{" "}
                is a consulting and solutions company founded in 2022 — focused
                on AI, DevOps, cloud engineering, and secure digital systems.
              </p>
              <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed">
                We help startups, businesses, and individuals build technology
                that's reliable, secure, and future-ready — combining deep
                engineering with practical, business-driven thinking.
              </p>
            </ScrollReveal>

            <div ref={statsRef} className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const canCount = typeof stat.countTo === "number";
                return (
                  <div
                    key={index}
                    data-stat-card
                    className="text-center p-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl hover:bg-white/10 hover:border-emerald-400/40 transition-colors opacity-0"
                  >
                    <Icon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <div
                      className="text-2xl font-black text-white"
                      {...(canCount && {
                        "data-stat-num": "",
                        "data-target": String(stat.countTo),
                        "data-suffix": stat.suffix ?? "",
                      })}
                    >
                      {canCount ? `0${stat.suffix ?? ""}` : stat.number}
                    </div>
                    <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <Parallax offset={40}>
            <ScrollReveal direction="scale">
              <MagnetCard
                intensity={10}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-2 shadow-2xl border border-white/10"
              >
                <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-4 aspect-square iso-grid-bg">
                  <AboutScene className="w-full h-full" />
                </div>
                <div className="absolute -bottom-5 -left-5 bg-gradient-to-br from-blue-600 to-emerald-500 text-white p-5 rounded-2xl shadow-xl glow-blue">
                  <div className="text-2xl font-black">ifleon.com</div>
                  <div className="text-blue-100 text-xs tracking-wide">
                    AI · DevOps · Cloud · Security
                  </div>
                </div>
              </MagnetCard>
            </ScrollReveal>
          </Parallax>
        </div>

        {/* Founder card */}
        <ScrollReveal direction="up">
          <motion.div
            className="relative rounded-3xl p-8 md:p-12 mb-24 overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="relative text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-3">
                Leadership & Vision
              </h3>
              <h4 className="text-2xl font-black text-emerald-400 mb-2">
                S. Mahendra Reddy
              </h4>
              <p className="text-slate-200 mb-4 font-medium">
                Founder & Lead Engineer — AI, DevOps & Cloud Systems
              </p>
              <p className="text-slate-300 leading-relaxed mb-7 max-w-2xl mx-auto">
                Mahendra brings hands-on experience in AI systems, DevOps
                automation, cloud infrastructure, and scalable application design.
                His vision is to make advanced technology accessible, practical,
                and impactful for businesses across India.
              </p>
              <a
                href="https://mahendra.ifleon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all font-semibold hover:-translate-y-0.5"
              >
                <Brain className="h-5 w-5" />
                View Founder Portfolio
              </a>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Vision & Mission */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          <StaggerItem direction="left">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 h-full hover:bg-white/10 hover:border-blue-400/40 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-slate-300 leading-relaxed">
                To become a trusted pan-India technology partner delivering
                intelligent, secure, and scalable digital solutions.
              </p>
            </div>
          </StaggerItem>
          <StaggerItem direction="right">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 h-full hover:bg-white/10 hover:border-emerald-400/40 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-slate-300 leading-relaxed">
                To solve real-world business problems using AI, DevOps, and cloud
                technologies while sharing knowledge through open platforms.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Roadmap timeline */}
        <ScrollReveal direction="up">
          <h3 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">
            Growth Roadmap
          </h3>
        </ScrollReveal>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-emerald-400 via-blue-400 to-purple-400 rounded-full opacity-60" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.06 }}
                className={`flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-400/40 transition-all"
                  >
                    <div className="text-emerald-400 font-black text-xl mb-2">
                      {milestone.year}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      {milestone.title}
                    </h4>
                    <p className="text-slate-300 text-sm">
                      {milestone.description}
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  className="relative z-10 w-5 h-5 rounded-full border-4 border-slate-950 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #34d399, #3b82f6)",
                  }}
                  whileInView={{ scale: [0, 1.4, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.06 + 0.15 }}
                />
                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <ScrollReveal direction="up">
          <div className="mt-24 text-center bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-12 text-white relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 mesh-bg opacity-50" />
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-black mb-4">
                Let's build something meaningful.
              </h3>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                Whether you're a business, startup, or individual — IFLEON is ready
                to help you turn ideas into reliable, scalable technology.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all font-semibold hover:-translate-y-0.5"
              >
                Start a Conversation <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
