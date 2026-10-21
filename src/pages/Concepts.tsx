import { useEffect } from "react";
import type { ComponentType } from "react";
import { ControlRoom } from "../illustrations/ControlRoom";
import { ConnectedCity } from "../illustrations/ConnectedCity";
import { Workshop } from "../illustrations/Workshop";

/**
 * Temporary design-concept preview (route: /concepts). Illustrated, grown-up directions: editorial scenes
 * of people and systems, no cartoon mascot. Pick one, then the rest of this file and the other scenes go.
 */

type Concept = {
  id: string;
  letter: string;
  name: string;
  pitch: string;
  headline: [string, string];
  sub: string;
  heading: string;
  body: string;
  bg: string;
  ink: string;
  grey: string;
  brand: string;
  accent: string;
  swatches: [string, string][];
  radius: string;
  Scene: ComponentType<{ className?: string }>;
};

/** AI-generated scene, saved in public/images/concepts. Convert to WebP before launch (see performance budget). */
const StudioImage = ({ className = "" }: { className?: string }) => (
  <img
    src="/images/concepts/studio.png"
    alt="A small, diverse team in a bright studio, calmly working with a wall of dashboards and a tidy server"
    width={1264}
    height={848}
    className={`${className} rounded-[1.75rem]`}
  />
);

const CONCEPTS: Concept[] = [
  {
    id: "h",
    letter: "H",
    name: "Studio (AI art)",
    pitch: "The new level. A warm, airy studio with real light and depth. Same idea as the Control Room, but painted properly. This is the quality the whole site would have.",
    headline: ["Technology you", "can relax about."],
    sub: "We build and look after your software, cloud and security, and tell you what's happening in plain English.",
    heading: "'Newsreader', serif",
    body: "'Figtree', sans-serif",
    bg: "#F7F9F8",
    ink: "#12302B",
    grey: "#4F625E",
    brand: "#15803D",
    accent: "#F5B544",
    swatches: [["Brand green", "#15803D"], ["Sun yellow", "#F5B544"], ["Forest", "#12302B"], ["Soft grey", "#4F625E"], ["Mint", "#DDF1E6"]],
    radius: "0.75rem",
    Scene: StudioImage,
  },
  {
    id: "e",
    letter: "E",
    name: "Control Room",
    pitch: "Calm, capable, trustworthy. Warm lamps and live dashboards, with real people running the show.",
    headline: ["Technology you", "can relax about."],
    sub: "We build and look after your software, cloud and security, and tell you what's happening in plain English.",
    heading: "'Newsreader', serif",
    body: "'Figtree', sans-serif",
    bg: "#F7F9F8",
    ink: "#12302B",
    grey: "#4F625E",
    brand: "#15803D",
    accent: "#F5B544",
    swatches: [["Brand green", "#15803D"], ["Lamp amber", "#F5B544"], ["Deep teal", "#12302B"], ["Soft grey", "#4F625E"], ["Mist", "#E3F1EC"]],
    radius: "0.75rem",
    Scene: ControlRoom,
  },
  {
    id: "f",
    letter: "F",
    name: "Connected City",
    pitch: "Bright and optimistic. Towers for your cloud, security, AI and tools, linked by lines that light up when they talk.",
    headline: ["Systems that", "talk to each other."],
    sub: "We connect your cloud, software and security so they work as one, and keep them running.",
    heading: "'Playfair Display', serif",
    body: "'Public Sans', sans-serif",
    bg: "#F9FBFA",
    ink: "#1B3A35",
    grey: "#53665F",
    brand: "#15803D",
    accent: "#FF9F6B",
    swatches: [["Brand green", "#15803D"], ["Morning peach", "#FF9F6B"], ["Deep green", "#1B3A35"], ["Soft grey", "#53665F"], ["Mist", "#D7EEE6"]],
    radius: "0.5rem",
    Scene: ConnectedCity,
  },
  {
    id: "g",
    letter: "G",
    name: "Workshop",
    pitch: "Hands-on and honest. Two people build your product block by block: Cloud, DevOps, AI and Security. It maps straight onto the scroll story.",
    headline: ["Built carefully.", "Shipped calmly."],
    sub: "A small team that plans, designs, builds and launches your product, one clear step at a time.",
    heading: "'Source Serif 4', serif",
    body: "'Work Sans', sans-serif",
    bg: "#F8F9F7",
    ink: "#23302C",
    grey: "#5B6862",
    brand: "#15803D",
    accent: "#38A8E0",
    swatches: [["Brand green", "#15803D"], ["Sky", "#38A8E0"], ["Slate green", "#23302C"], ["Soft grey", "#5B6862"], ["Violet", "#8B6CE6"]],
    radius: "0.625rem",
    Scene: Workshop,
  },
];

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Playfair+Display:wght@500;600&family=Public+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Work+Sans:wght@400;500;600;700&display=swap";

const MOTION_CSS = `
.c-bob{animation:c-bob 3.6s ease-in-out infinite}
@keyframes c-bob{50%{transform:translateY(-3px)}}
.c-float{animation:c-float 5s ease-in-out infinite}
@keyframes c-float{50%{transform:translateY(-8px)}}
.c-led{animation:c-led 1.8s steps(1,end) infinite}
@keyframes c-led{0%,55%{opacity:1}56%,100%{opacity:.25}}
.c-pulse{animation:c-pulse 2.6s ease-in-out infinite}
@keyframes c-pulse{0%,100%{opacity:.35}50%{opacity:1}}
.c-dash{animation:c-dash 3.4s linear infinite}
@keyframes c-dash{from{stroke-dashoffset:100}to{stroke-dashoffset:-100}}
@media (prefers-reduced-motion: reduce){.c-bob,.c-float,.c-led,.c-pulse,.c-dash{animation:none!important}}
`;

export default function Concepts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    document.head.appendChild(link);
    const prev = document.title;
    document.title = "Design concepts | IFLEON";
    return () => {
      link.remove();
      document.title = prev;
    };
  }, []);

  return (
    <div className="bg-white">
      <style>{MOTION_CSS}</style>

      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 text-sm text-neutral-800 sm:px-6">
        <span className="font-semibold">IFLEON design concepts. Pick your favourite.</span>
        <nav className="flex gap-2" aria-label="Concepts">
          {CONCEPTS.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="rounded-full border border-neutral-300 px-3 py-1 font-medium hover:bg-neutral-100">
              {c.letter}. {c.name}
            </a>
          ))}
        </nav>
      </div>

      {CONCEPTS.map((c) => (
        <section key={c.id} id={c.id} style={{ background: c.bg, color: c.ink, fontFamily: c.body }} className="relative scroll-mt-14 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="mb-8 text-sm font-semibold" style={{ color: c.grey }}>
              Concept {c.letter}: {c.name}
            </p>

            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h1 style={{ fontFamily: c.heading, color: c.ink }} className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
                  {c.headline[0]}
                  <br />
                  <span style={{ background: `linear-gradient(transparent 64%, ${c.accent}99 64%)` }}>{c.headline[1]}</span>
                </h1>
                <p className="mt-6 max-w-[44ch] text-lg leading-relaxed" style={{ color: c.grey }}>
                  {c.sub}
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contact"
                    style={{ background: c.brand, color: "#FFFFFF", borderRadius: c.radius, fontWeight: 600 }}
                    className="inline-flex items-center justify-center whitespace-nowrap px-7 py-3.5 text-base transition-transform active:scale-[0.98]"
                  >
                    Book a free consultation
                  </a>
                  <a
                    href="#services"
                    style={{ color: c.ink, borderRadius: c.radius, fontWeight: 600, border: `2px solid ${c.ink}26` }}
                    className="inline-flex items-center justify-center whitespace-nowrap px-7 py-3.5 text-base transition-transform active:scale-[0.98]"
                  >
                    See what we do
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <c.Scene className="mx-auto h-auto w-full max-w-[680px] drop-shadow-xl" />
              </div>
            </div>

            <div className="mt-12 grid gap-6 border-t pt-8 lg:grid-cols-12" style={{ borderColor: `${c.ink}1f` }}>
              <p className="max-w-[60ch] text-base lg:col-span-6">{c.pitch}</p>
              <div className="lg:col-span-6">
                <ul className="flex flex-wrap gap-3">
                  {c.swatches.map(([label, hex]) => (
                    <li key={hex} className="flex items-center gap-2 text-xs" style={{ color: c.grey }}>
                      <span className="h-6 w-6 rounded-full border" style={{ background: hex, borderColor: `${c.ink}33` }} aria-hidden="true" />
                      {label} {hex}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs" style={{ color: c.grey }}>
                  Fonts: {c.heading.split(",")[0].replace(/'/g, "")} for headings, {c.body.split(",")[0].replace(/'/g, "")} for text.
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
