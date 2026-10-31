"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useRef } from "react";
import { PageCta, PageIntro } from "../components/PageIntro";

const EASE = [0.22, 1, 0.36, 1] as const;

const founder = {
  name: "S. Mahendra Reddy",
  role: "Founder & lead engineer",
  specialization: "AI, DevOps and cloud architecture",
  bio: "Works hands-on across AI and ML solutions, DevOps automation and cloud infrastructure, and enjoys turning complex business problems into systems that simply run.",
  skills: ["Machine learning", "AWS / Azure", "CI/CD", "Python", "Kubernetes"],
  links: [
    { label: "GitHub", href: "https://github.com/mahiprime2001", Icon: Github },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/ifleon/", Icon: Linkedin },
    { label: "Email", href: "mailto:mahendra@ifleon.com", Icon: Mail },
  ],
};

const values = [
  { title: "Excellence in delivery", text: "We hold the work to a standard we would accept for our own systems." },
  { title: "Client-centric", text: "Your success is ours. We work as an extension of your team, not a vendor at arm's length." },
  { title: "Continuous learning", text: "We keep up with what is new and adopt it only when it earns its place." },
];

/* Team: the founder, featured, then the values the team works by. */
export default function TeamPage() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 35]);

  return (
    <>
      <PageIntro
        eyebrow="Team"
        title={
          <>
            Engineers, not <em className="text-brand-700">account managers.</em>
          </>
        }
        intro="IFLEON is founder-led. The person who scopes your project is the person who builds it."
      />

      <section ref={ref} className="pb-20 md:pb-28">
        <div className="shell grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-brand-900 shadow-lift"
          >
            <div aria-hidden className="absolute inset-0 iso-grid-bg opacity-20 invert" />
            <motion.svg style={{ rotate }} viewBox="0 0 200 200" className="absolute inset-[14%]" aria-hidden>
              <circle cx="82" cy="100" r="52" fill="none" stroke="#FAF8F4" strokeOpacity="0.85" strokeWidth="2" />
              <circle cx="118" cy="100" r="52" fill="none" stroke="#84B699" strokeWidth="2" />
            </motion.svg>
            <span className="absolute inset-0 grid place-items-center font-serif text-6xl text-paper">SMR</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-brand-700">{founder.role}</p>
            <h2 className="mt-3 font-serif text-4xl font-normal md:text-6xl">{founder.name}</h2>
            <p className="mt-2 text-ink-3">{founder.specialization}</p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">{founder.bio}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {founder.skills.map((s) => (
                <li key={s} className="rounded-full border border-line bg-white px-3 py-1 text-xs text-ink-2">
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-2">
              {founder.links.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`${label}: ${founder.name}`}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-white text-ink-2 transition hover:border-brand-700 hover:bg-brand-700 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-line py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow">What we work by</p>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {values.map((v, i) => (
              <motion.li
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="border-t border-ink pt-6"
              >
                <span className="font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-serif text-2xl font-normal">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{v.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <PageCta
        title={
          <>
            Work with the people who <em className="text-brand-300">build it.</em>
          </>
        }
        text="Start with a free consultation. You will talk to an engineer from the first call."
      />
    </>
  );
}
