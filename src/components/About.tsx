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
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { animate, stagger } from "animejs";

type Stat = {
  icon: typeof Calendar;
  number: string;
  label: string;
  countTo?: number;
  suffix?: string;
};

export const About = () => {
  const stats: Stat[] = [
    { icon: Calendar, number: "2022", label: "Founded", countTo: 2022 },
    { icon: Users, number: "20+", label: "Clients Served", countTo: 20, suffix: "+" },
    { icon: MapPin, number: "Nellore, AP", label: "Headquarters" },
    { icon: TrendingUp, number: "Pan-India", label: "Growth Vision" },
  ];

  const statsRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);

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

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const letters = el.querySelectorAll<HTMLElement>(".anim-letter");
          animate(letters, {
            opacity: [0, 1],
            translateY: [18, 0],
            duration: 600,
            delay: stagger(35),
            easing: "easeOutQuad",
          });
          observer.disconnect();
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const renderLetters = (text: string, className = "") =>
    text.split("").map((ch, i) => (
      <span
        key={i}
        className={`anim-letter inline-block opacity-0 ${className}`}
      >
        {ch === " " ? "\u00A0" : ch}
      </span>
    ));

  const milestones = [
    {
      year: "2022",
      title: "Foundation",
      description:
        "IFLEON was founded in Nellore, Andhra Pradesh with a clear mission to deliver logical, scalable technology solutions.",
    },
    {
      year: "2024",
      title: "Service Expansion",
      description:
        "Expanded into AI solutions, DevOps automation, cloud services, and cybersecurity for local and remote clients.",
    },
    {
      year: "2025",
      title: "Growth Phase",
      description:
        "Focused on structured growth, long-term client partnerships, and knowledge sharing through blogs and open source.",
    },
    {
      year: "2026",
      title: "Regional Expansion",
      description:
        "Planned expansion into Hyderabad with deeper cloud partnerships and a stronger enterprise client base.",
    },
    {
      year: "2027+",
      title: "National Presence",
      description:
        "Targeting pan-India reach with a sustainable, high-impact technology consulting model.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2
              ref={headlineRef}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              {renderLetters("About ")}
              <span className="text-blue-600">{renderLetters("IFLEON")}</span>
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              <strong>IFLEON (Infinite Logical Elements of Network)</strong> is a
              technology consulting and solutions company founded in 2022 with a
              focus on AI, DevOps, cloud engineering, and secure digital systems.
            </p>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We help startups, businesses, and individuals design, automate, and
              scale technology systems that are reliable, secure, and future-ready.
              Our approach combines deep technical expertise with practical,
              business-driven thinking.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Guided by our tagline{" "}
              <em>“Infinite Possibilities, Logical Solutions,”</em> IFLEON is
              committed to building long-term value through transparency,
              engineering excellence, and continuous innovation.
            </p>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const canCount = typeof stat.countTo === "number";
                return (
                  <motion.div
                    key={index}
                    data-stat-card
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-gray-50 rounded-xl opacity-0"
                  >
                    <Icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div
                      className="text-2xl font-bold text-gray-900"
                      {...(canCount && {
                        "data-stat-num": "",
                        "data-target": String(stat.countTo),
                        "data-suffix": stat.suffix ?? "",
                      })}
                    >
                      {canCount ? `0${stat.suffix ?? ""}` : stat.number}
                    </div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Lottie Animation — replace `src` with your chosen animation from https://lottiefiles.com */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6 overflow-hidden aspect-square flex items-center justify-center">
              <DotLottieReact
                src="/lottie/about.json"
                loop
                autoplay
                className="w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">ifleon.com</div>
              <div className="text-blue-200 text-sm">
                AI • DevOps • Cloud • Security
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Founder */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-10 mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Leadership & Vision
            </h3>

            <h4 className="text-2xl font-bold text-blue-600 mb-2">
              S. Mahendra Reddy
            </h4>
            <p className="text-gray-700 mb-4">
              Founder & Lead Engineer — AI, DevOps & Cloud Systems
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Mahendra brings hands-on experience in AI systems, DevOps automation,
              cloud infrastructure, and scalable application design. His vision
              is to make advanced technology accessible, practical, and impactful
              for businesses across India.
            </p>

            <a
              href="https://mahendra.ifleon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Brain className="h-5 w-5" />
              View Founder Portfolio
            </a>
          </div>
        </motion.div>

        {/* Vision & Mission */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become a trusted pan-India technology partner delivering
              intelligent, secure, and scalable digital solutions.
            </p>
          </div>

          <div className="bg-teal-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To solve real-world business problems using AI, DevOps, and cloud
              technologies while sharing knowledge through open platforms.
            </p>
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Growth Roadmap
          </h3>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-blue-200" />

            <div className="space-y-10">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0
                        ? "pr-8 text-right"
                        : "pl-8 text-left"
                    }`}
                  >
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <div className="text-blue-600 font-bold text-xl mb-2">
                        {milestone.year}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
                  <div className="w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Let’s Build Something Meaningful
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you’re a business, startup, or individual — IFLEON is ready
            to help you turn ideas into reliable, scalable technology.
          </p>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Start a Conversation <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
