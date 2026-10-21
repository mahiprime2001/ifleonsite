import { Person } from "./people";

/** Concept E: a small team in a calm control room, a wall of dashboards behind them. */
export const ControlRoom = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 640 520" className={className} role="img" aria-label="Two colleagues in a warm, calm control room: one points at a rising chart on a wall of dashboards while the other works at a desk">
    <defs>
      <clipPath id="cr-clip"><rect width="640" height="520" rx="30" /></clipPath>
      <linearGradient id="cr-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#103A35" /><stop offset="1" stopColor="#0B2A26" />
      </linearGradient>
      <linearGradient id="cr-area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5EEAD4" stopOpacity=".45" /><stop offset="1" stopColor="#5EEAD4" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="cr-glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#FFC35A" stopOpacity=".55" /><stop offset="1" stopColor="#FFC35A" stopOpacity="0" />
      </radialGradient>
    </defs>

    <g clipPath="url(#cr-clip)">
      <rect width="640" height="520" fill="url(#cr-wall)" />
      {/* floor */}
      <rect y="400" width="640" height="120" fill="#0F332E" />
      <rect y="400" width="640" height="4" fill="#1D5A51" />
      <path d="M0 440 H640 M0 480 H640" stroke="#164740" strokeWidth="2" />

      {/* hanging lamps with glow */}
      {[190, 430].map((x) => (
        <g key={x}>
          <circle cx={x} cy="86" r="86" fill="url(#cr-glow)" />
          <line x1={x} y1="0" x2={x} y2="46" stroke="#2E6B62" strokeWidth="3" />
          <path d={`M${x - 26} 78 Q${x} 36 ${x + 26} 78 Z`} fill="#F5B544" />
          <ellipse cx={x} cy="79" rx="12" ry="4" fill="#FFE2A3" />
        </g>
      ))}

      {/* big chart screen */}
      <rect x="36" y="104" width="296" height="188" rx="14" fill="#08201D" stroke="#2E6B62" strokeWidth="3" />
      <g stroke="#17433D" strokeWidth="1.5">
        {[0, 1, 2, 3].map((i) => <line key={i} x1="56" x2="312" y1={140 + i * 34} y2={140 + i * 34} />)}
      </g>
      <path d="M56 262 L 100 240 L 144 250 L 190 208 L 236 196 L 282 158 L 312 138 V 274 H 56 Z" fill="url(#cr-area)" />
      <polyline points="56,262 100,240 144,250 190,208 236,196 282,158 312,138" fill="none" stroke="#5EEAD4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="312" cy="138" r="7" fill="#F5B544" />

      {/* side panels */}
      <rect x="346" y="104" width="170" height="86" rx="12" fill="#08201D" stroke="#2E6B62" strokeWidth="3" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={364 + i * 28} y={170 - [26, 40, 30, 52, 44][i]} width="16" height={[26, 40, 30, 52, 44][i]} rx="4" fill={i === 3 ? "#F5B544" : "#2EC4A8"} />
      ))}
      <rect x="346" y="206" width="170" height="86" rx="12" fill="#08201D" stroke="#2E6B62" strokeWidth="3" />
      <circle cx="400" cy="249" r="26" fill="none" stroke="#17433D" strokeWidth="10" />
      <circle cx="400" cy="249" r="26" fill="none" stroke="#5EEAD4" strokeWidth="10" strokeDasharray="120 200" strokeLinecap="round" transform="rotate(-90 400 249)" />
      <g stroke="#2E6B62" strokeWidth="6" strokeLinecap="round"><path d="M444 232 H 496 M444 250 H 482 M444 268 H 492" /></g>

      {/* server rack */}
      <rect x="540" y="216" width="72" height="196" rx="10" fill="#17423C" stroke="#2E6B62" strokeWidth="3" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="550" y={228 + i * 36} width="52" height="26" rx="5" fill="#0B2A26" />
          <circle cx="590" cy={241 + i * 36} r="3.5" fill={i === 3 ? "#F5B544" : "#5EEAD4"} className="c-led" style={{ animationDelay: `${i * 0.35}s` }} />
          <rect x="558" y={238 + i * 36} width="20" height="5" rx="2.5" fill="#2E6B62" />
        </g>
      ))}

      {/* desk, laptop, mug, plant */}
      <rect x="290" y="372" width="238" height="14" rx="4" fill="#C98B4E" />
      <rect x="302" y="386" width="10" height="32" fill="#A56E3A" />
      <rect x="506" y="386" width="10" height="32" fill="#A56E3A" />
      <g transform="translate(46 0)">
        <path d="M392 372 L 402 322 H 470 L 478 372 Z" fill="#E7ECEA" />
        <rect x="404" y="326" width="64" height="40" rx="3" fill="#0A2421" />
        <polyline points="410,358 424,346 438,352 452,336 464,332" fill="none" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" />
      </g>
      <rect x="296" y="354" width="16" height="18" rx="3" fill="#F4EFE6" />
      <g transform="translate(264 392)">
        <path d="M0 0 C -14 -26 -10 -56 0 -70 C 8 -52 14 -26 0 0 Z" fill="#22C55E" />
        <path d="M0 0 C 18 -22 30 -40 28 -62 C 12 -48 4 -26 0 0 Z" fill="#16A34A" />
        <path d="M0 0 C -22 -18 -38 -30 -40 -52 C -22 -44 -6 -26 0 0 Z" fill="#15803D" />
        <path d="M-18 0 H 18 L 14 28 H -14 Z" fill="#C4623A" />
      </g>

      {/* people */}
      <Person x={130} y={440} scale={0.98} skin="#E8B48A" hair="#2B2118" hairStyle="short" top="#F4EFE6" bottom="#1E3A5F" shoe="#7A3E22" pose="point" />
      <g className="c-bob">
        <Person x={346} y={436} scale={0.98} skin="#8D5A3B" hair="#1B1410" hairStyle="bun" top="#C4623A" bottom="#2C2F3A" pose="sit" />
      </g>
      {/* chair back for the seated person */}
      <rect x="306" y="318" width="14" height="96" rx="7" fill="#1D5A51" />
    </g>
  </svg>
);
