import { Person } from "./people";

/** Concept G: two people build a product from four blocks (Cloud, DevOps, AI, Security) on a workshop bench. */

const BLOCKS: { label: string; c: string; d: string }[] = [
  { label: "CLOUD", c: "#22A06B", d: "#177A51" },
  { label: "DEVOPS", c: "#38A8E0", d: "#2380B0" },
  { label: "AI", c: "#8B6CE6", d: "#6A4DC4" },
  { label: "SECURITY", c: "#F0647A", d: "#C94459" },
];

export const Workshop = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 640 520" className={className} role="img" aria-label="Two colleagues in a bright workshop point at a tower of four blocks labelled Cloud, DevOps, AI and Security that they are building together">
    <defs>
      <clipPath id="ws-clip"><rect width="640" height="520" rx="30" /></clipPath>
      <linearGradient id="ws-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F1F6F3" /><stop offset="1" stopColor="#E1ECE6" />
      </linearGradient>
      <radialGradient id="ws-glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#FFD58A" stopOpacity=".7" /><stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
      </radialGradient>
      <pattern id="ws-grid" width="14" height="14" patternUnits="userSpaceOnUse">
        <path d="M14 0 H0 V14" fill="none" stroke="#FFFFFF" strokeOpacity=".16" strokeWidth="1" />
      </pattern>
    </defs>

    <g clipPath="url(#ws-clip)">
      <rect width="640" height="520" fill="url(#ws-wall)" />

      {/* blueprint poster */}
      <g>
        <rect x="36" y="58" width="150" height="112" rx="6" fill="#1F4E79" />
        <rect x="36" y="58" width="150" height="112" rx="6" fill="url(#ws-grid)" />
        <g fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity=".9">
          <rect x="58" y="112" width="34" height="34" />
          <rect x="98" y="88" width="34" height="58" />
          <rect x="138" y="104" width="30" height="42" />
          <path d="M58 90 H 124 M58 76 H 100" opacity=".6" />
        </g>
      </g>

      {/* pegboard + tools */}
      <rect x="470" y="58" width="134" height="124" rx="8" fill="#D5E3DC" />
      <g fill="#9DB7AC">
        {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4, 5].map((c) => <circle key={`${r}-${c}`} cx={488 + c * 22} cy={76 + r * 22} r="2.2" />))}
      </g>
      <g>
        <rect x="496" y="84" width="8" height="52" rx="3" fill="#8A5A34" />
        <rect x="484" y="80" width="32" height="14" rx="4" fill="#5B6B72" />
        <rect x="540" y="96" width="7" height="60" rx="3" fill="#F0647A" />
        <path d="M530 92 a14 14 0 1 1 27 0 v6 h-8 v-6 a6 6 0 1 0 -11 0 v6 h-8 Z" fill="#5B6B72" />
        <rect x="574" y="90" width="9" height="62" rx="3" fill="#38A8E0" />
        <path d="M570 86 h17 l-3 12 h-11 Z" fill="#5B6B72" />
      </g>

      {/* shelf with plants */}
      <rect x="222" y="132" width="196" height="9" rx="3" fill="#C98B4E" />
      <g>
        <path d="M250 132 v-24 h26 v24 Z" fill="#C4623A" />
        <path d="M263 108 C 248 92, 252 76, 263 68 C 272 80, 278 94, 263 108 Z" fill="#22C55E" />
        <path d="M263 108 C 282 98, 290 84, 288 70 C 272 78, 266 92, 263 108 Z" fill="#16A34A" />
        <rect x="320" y="104" width="30" height="28" rx="6" fill="#F4EFE6" />
        <rect x="326" y="98" width="18" height="8" rx="3" fill="#C4623A" />
        <rect x="366" y="112" width="34" height="20" rx="4" fill="#38A8E0" opacity=".85" />
      </g>

      {/* pendant lamps */}
      {[110, 530].map((x) => (
        <g key={x}>
          <circle cx={x} cy="40" r="76" fill="url(#ws-glow)" />
          <line x1={x} y1="0" x2={x} y2="22" stroke="#8A9A93" strokeWidth="3" />
          <path d={`M${x - 24} 46 Q${x} 10 ${x + 24} 46 Z`} fill="#F5B544" />
        </g>
      ))}

      {/* floor */}
      <rect y="470" width="640" height="50" fill="#CFE0D8" />

      {/* people behind the bench */}
      <Person x={138} y={540} scale={1.1} skin="#8D5A3B" hair="#161013" hairStyle="curly" top="#2F6F52" bottom="#2C2F3A" pose="point" />
      <Person x={502} y={540} scale={1.1} flip skin="#F0C9A4" hair="#C98A3A" hairStyle="long" top="#F4EFE6" bottom="#1E3A5F" pose="point" />

      {/* the tower of blocks */}
      <g>
        <circle cx="320" cy="254" r="92" fill="url(#ws-glow)" opacity=".7" />
        {BLOCKS.map((b, i) => {
          const y = 368 - i * 46;
          return (
            <g key={b.label} className={i === 3 ? "c-float" : undefined}>
              <rect x="252" y={y} width="136" height="42" rx="9" fill={b.d} />
              <rect x="252" y={y} width="136" height="37" rx="9" fill={b.c} />
              <rect x="262" y={y + 7} width="18" height="6" rx="3" fill="#FFFFFF" opacity=".45" />
              <text x="320" y={y + 25} textAnchor="middle" fontFamily="Figtree, sans-serif" fontSize="15" fontWeight="700" letterSpacing="1.5" fill="#FFFFFF">{b.label}</text>
            </g>
          );
        })}
        {/* launch flag */}
        <g>
          <line x1="352" y1="232" x2="352" y2="204" stroke="#5B6B72" strokeWidth="3" strokeLinecap="round" />
          <path d="M352 204 L 378 212 L 352 220 Z" fill="#15803D" />
        </g>
      </g>

      {/* bench in front */}
      <rect x="0" y="412" width="640" height="22" rx="4" fill="#D9A066" />
      <rect x="0" y="412" width="640" height="5" fill="#FFFFFF" opacity=".25" />
      <rect x="0" y="434" width="640" height="90" fill="#A56E3A" />
      <g stroke="#8A5A34" strokeWidth="3">
        <path d="M214 434 V524 M426 434 V524" />
      </g>
      {/* things on the bench */}
      <g transform="translate(0 40)">
        <rect x="64" y="350" width="70" height="22" rx="3" fill="#F4EFE6" />
        <rect x="70" y="344" width="60" height="6" rx="2" fill="#FFFFFF" />
        <path d="M468 372 v-24 h22 v24 Z" fill="#F4EFE6" />
        <rect x="474" y="356" width="10" height="3" rx="1.5" fill="#38A8E0" />
        <rect x="514" y="360" width="26" height="12" rx="3" fill="#F0647A" />
        <rect x="548" y="356" width="26" height="16" rx="3" fill="#8B6CE6" />
      </g>
    </g>
  </svg>
);
