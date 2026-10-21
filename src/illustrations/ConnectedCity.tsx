import type { ReactNode } from "react";
import { Person } from "./people";

/** Concept F: a skyline whose towers are linked by glowing lines; someone crosses the bridge with a laptop bag. */

const TOWERS: { x: number; w: number; h: number; c: string }[] = [
  { x: 24, w: 62, h: 150, c: "#4F8A7E" },
  { x: 88, w: 52, h: 214, c: "#2F5D56" },
  { x: 142, w: 70, h: 128, c: "#7FB3A4" },
  { x: 214, w: 58, h: 262, c: "#2F5D56" },
  { x: 274, w: 66, h: 168, c: "#4F8A7E" },
  { x: 342, w: 54, h: 226, c: "#A9CFC2" },
  { x: 398, w: 70, h: 140, c: "#4F8A7E" },
  { x: 470, w: 58, h: 252, c: "#2F5D56" },
  { x: 530, w: 62, h: 160, c: "#7FB3A4" },
  { x: 594, w: 50, h: 196, c: "#4F8A7E" },
];

const BASE = 372;

const Badge = ({ cx, cy, children, delay = 0 }: { cx: number; cy: number; children: ReactNode; delay?: number }) => (
  <g className="c-float" style={{ animationDelay: `${delay}s` }}>
    <circle cx={cx} cy={cy} r="27" fill="#FFFFFF" stroke="#15803D" strokeWidth="3.5" />
    <g transform={`translate(${cx} ${cy})`} fill="none" stroke="#15803D" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </g>
);

export const ConnectedCity = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 640 520" className={className} role="img" aria-label="A city skyline in soft morning light with towers connected by glowing lines, and a person crossing a bridge with a laptop bag">
    <defs>
      <clipPath id="cc-clip"><rect width="640" height="520" rx="30" /></clipPath>
      <linearGradient id="cc-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFF1DE" /><stop offset=".6" stopColor="#EAF5EF" /><stop offset="1" stopColor="#D7EEE6" />
      </linearGradient>
      <linearGradient id="cc-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#B9E2D8" /><stop offset="1" stopColor="#9ED1C5" />
      </linearGradient>
      <pattern id="cc-win" width="14" height="16" patternUnits="userSpaceOnUse">
        <rect x="4" y="4" width="5" height="7" rx="1" fill="#FFFFFF" opacity=".42" />
      </pattern>
      <radialGradient id="cc-sun" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#FFD9A0" stopOpacity=".9" /><stop offset="1" stopColor="#FFD9A0" stopOpacity="0" />
      </radialGradient>
    </defs>

    <g clipPath="url(#cc-clip)">
      <rect width="640" height="520" fill="url(#cc-sky)" />
      <circle cx="470" cy="150" r="120" fill="url(#cc-sun)" />
      <circle cx="470" cy="150" r="46" fill="#FFD9A0" />

      {/* hills */}
      <path d="M0 330 C 90 280, 200 300, 300 322 S 520 290, 640 316 V 380 H 0 Z" fill="#CFE5DA" />
      <path d="M0 352 C 110 318, 220 336, 330 346 S 540 326, 640 344 V 380 H 0 Z" fill="#B4D6C8" />

      {/* towers */}
      {TOWERS.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={BASE - t.h} width={t.w} height={t.h} rx="3" fill={t.c} />
          <rect x={t.x} y={BASE - t.h} width={t.w} height={t.h} rx="3" fill="url(#cc-win)" />
          <rect x={t.x} y={BASE - t.h} width={t.w} height="6" rx="3" fill="#000" opacity=".12" />
        </g>
      ))}

      {/* connection lines between rooftops */}
      <g fill="none" strokeLinecap="round">
        {[
          "M114 130 Q 170 70 241 88",
          "M241 88 Q 300 90 369 140",
          "M369 140 Q 430 80 499 102",
          "M499 102 Q 545 110 560 168",
        ].map((d, i) => (
          <g key={i}>
            <path d={d} stroke="#15803D" strokeWidth="2.5" opacity=".35" />
            <path d={d} className="c-dash" style={{ animationDelay: `${i * 0.6}s` }} stroke="#22C55E" strokeWidth="5" pathLength={100} strokeDasharray="10 90" />
          </g>
        ))}
      </g>

      {/* service badges on rooftops */}
      <Badge cx={114} cy={130} delay={-1}>
        <path d="M0 -11 L 11 -6 V 3 C 11 9, 5 12, 0 14 C -5 12, -11 9, -11 3 V -6 Z" />
        <path d="M-5 1 l4 4 7 -8" />
      </Badge>
      <Badge cx={241} cy={88} delay={-2.4}>
        <path d="M-12 6 a7 7 0 0 1 2 -14 a10 10 0 0 1 19 -1 a7 7 0 0 1 3 15 Z" />
      </Badge>
      <Badge cx={369} cy={140} delay={-0.4}>
        <rect x="-9" y="-9" width="18" height="18" rx="3" />
        <path d="M-5 -13 V -9 M0 -13 V -9 M5 -13 V -9 M-5 9 V 13 M0 9 V 13 M5 9 V 13 M-13 -5 H -9 M-13 0 H -9 M-13 5 H -9 M9 -5 H 13 M9 0 H 13 M9 5 H 13" />
        <path d="M-3 -3 H 3 V 3 H -3 Z" />
      </Badge>
      <Badge cx={499} cy={102} delay={-3}>
        <circle r="4.5" />
        <path d="M0 -12 V -8 M0 8 V 12 M-12 0 H -8 M8 0 H 12 M-8.5 -8.5 L -6 -6 M6 6 L 8.5 8.5 M-8.5 8.5 L -6 6 M6 -6 L 8.5 -8.5" />
      </Badge>
      <Badge cx={560} cy={168} delay={-1.6}>
        <path d="M-9 -6 H 9 M-9 0 H 9 M-9 6 H 9" />
        <circle cx="-4" cy="-6" r="2" fill="#15803D" stroke="none" />
        <circle cx="4" cy="0" r="2" fill="#15803D" stroke="none" />
        <circle cx="-2" cy="6" r="2" fill="#15803D" stroke="none" />
      </Badge>

      {/* river */}
      <rect y={BASE} width="640" height="86" fill="url(#cc-water)" />
      <g stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity=".55">
        <path d="M30 420 h60 M150 436 h80 M300 424 h70 M440 440 h90 M560 422 h50" />
      </g>

      {/* bridge */}
      <g>
        <path d="M0 400 Q 70 336 140 318 Q 320 392 500 318 Q 570 336 640 400" fill="none" stroke="#2F5D56" strokeWidth="3.5" />
        <rect x="136" y="310" width="10" height="94" rx="3" fill="#2F5D56" />
        <rect x="494" y="310" width="10" height="94" rx="3" fill="#2F5D56" />
        <rect x="0" y="398" width="640" height="12" fill="#2F5D56" />
        <rect x="0" y="398" width="640" height="3" fill="#FFFFFF" opacity=".35" />
      </g>

      {/* person crossing, with a laptop bag */}
      <Person
        x={330}
        y={400}
        scale={0.5}
        skin="#C98A5E"
        hair="#1F1713"
        hairStyle="long"
        top="#F7F3EA"
        bottom="#1E3A5F"
        shoe="#2B2118"
        pose="carry"
        accessory={<rect x="34" y="-136" width="46" height="34" rx="6" fill="#C4623A" />}
      />

      {/* foreground bank and trees */}
      <path d="M0 470 C 120 440, 260 462, 380 456 S 560 446, 640 462 V 520 H 0 Z" fill="#4F8A7E" />
      <path d="M0 500 C 140 476, 300 492, 420 488 S 580 480, 640 492 V 520 H 0 Z" fill="#2F5D56" />
      {[[70, 468, 34], [120, 474, 24], [540, 462, 38], [592, 470, 26]].map(([x, y, r], i) => (
        <g key={i}>
          <rect x={x - 3} y={y} width="6" height={r} fill="#2B4A3A" />
          <circle cx={x} cy={y - 4} r={r} fill={i % 2 ? "#22C55E" : "#16A34A"} />
          <circle cx={x - r * 0.35} cy={y - r * 0.2} r={r * 0.55} fill="#15803D" opacity=".55" />
        </g>
      ))}
    </g>
  </svg>
);
