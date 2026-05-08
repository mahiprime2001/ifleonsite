import { motion } from "framer-motion";

type Props = { className?: string };

// 3D-rendered-looking workstation scene — smooth-shaded human character with
// rounded forms, monitor, server rack, and ambient holographic detail.
// Uses radial gradients + soft highlights + drop shadows for a Pixar/Spline feel.
export const IsoWorkstation3D = ({ className }: Props) => (
  <motion.svg
    viewBox="0 0 600 600"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <defs>
      {/* SKIN — radial gradient for 3D rounded face */}
      <radialGradient id="skin3d" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#fde2c2" />
        <stop offset="0.5" stopColor="#f0c896" />
        <stop offset="1" stopColor="#b88557" />
      </radialGradient>
      <radialGradient id="skin3d-arm" cx="0.4" cy="0.35" r="0.9">
        <stop offset="0" stopColor="#fde2c2" />
        <stop offset="1" stopColor="#c89169" />
      </radialGradient>

      {/* HAIR — soft gradient */}
      <linearGradient id="hair3d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3f2f1f" />
        <stop offset="1" stopColor="#1a0f08" />
      </linearGradient>

      {/* SHIRT — emerald hoodie with depth */}
      <radialGradient id="shirt3d" cx="0.4" cy="0.3" r="0.95">
        <stop offset="0" stopColor="#5eead4" />
        <stop offset="0.5" stopColor="#10b981" />
        <stop offset="1" stopColor="#064e3b" />
      </radialGradient>

      {/* PANTS */}
      <linearGradient id="pants3d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e3a8a" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>

      {/* CHAIR */}
      <linearGradient id="chair3d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#475569" />
        <stop offset="1" stopColor="#1e293b" />
      </linearGradient>

      {/* DESK */}
      <linearGradient id="desk3d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cbd5e1" />
        <stop offset="0.4" stopColor="#94a3b8" />
        <stop offset="1" stopColor="#475569" />
      </linearGradient>

      {/* MONITOR SCREEN */}
      <linearGradient id="screen3d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#22d3ee" />
        <stop offset="1" stopColor="#3b82f6" />
      </linearGradient>

      {/* SERVER */}
      <linearGradient id="server3d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#334155" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>

      {/* ATMOSPHERIC GLOWS */}
      <radialGradient id="aura3d" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#34d399" stopOpacity="0.45" />
        <stop offset="0.6" stopColor="#22d3ee" stopOpacity="0.18" />
        <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ground-shadow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#000" stopOpacity="0.55" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>

      <filter id="soft-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>

    {/* AURA */}
    <motion.circle
      cx="300" cy="310" r="240" fill="url(#aura3d)"
      animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* FLOOR */}
    <g transform="translate(300 480)">
      <ellipse cx="0" cy="20" rx="220" ry="80" fill="#0b1220" stroke="#1e293b" />
      <g opacity="0.18" stroke="#22d3ee" strokeWidth="0.8" fill="none">
        <ellipse cx="0" cy="20" rx="220" ry="80" />
        <ellipse cx="0" cy="20" rx="160" ry="58" />
        <ellipse cx="0" cy="20" rx="100" ry="36" />
      </g>
      <motion.ellipse
        cx="0" cy="20" rx="60" ry="20" fill="none" stroke="#34d399" strokeWidth="1.5"
        animate={{ rx: [40, 200, 40], ry: [16, 72, 16], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeOut" }}
      />
    </g>

    {/* SERVER RACK — left back */}
    <motion.g
      transform="translate(105 230)"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* server box (rounded with depth) */}
      <rect x="0" y="0" width="84" height="180" rx="6" fill="url(#server3d)" stroke="#475569" />
      {/* highlight */}
      <rect x="3" y="3" width="14" height="174" rx="3" fill="#475569" opacity="0.4" />
      {/* server units */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="8" y={10 + i * 32} width="68" height="22" rx="3" fill="#0b1220" stroke="#1e293b" />
          <motion.circle
            cx="16" cy={21 + i * 32} r="2.5" fill="#34d399"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
          />
          <motion.rect
            x="24" y={18 + i * 32} width={36 - i * 4} height="6" rx="1.5"
            fill={i % 2 ? "#22d3ee" : "#60a5fa"} opacity="0.7"
            animate={{ width: [30 - i * 3, 50 - i * 5, 30 - i * 3] }}
            transition={{ duration: 2.6 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
          />
        </g>
      ))}
      {/* glow around server */}
      <ellipse cx="42" cy="92" rx="60" ry="18" fill="#22d3ee" opacity="0.18" filter="url(#soft-blur)" />
    </motion.g>

    {/* DESK — broad slab */}
    <g transform="translate(300 410)">
      <rect x="-180" y="-12" width="360" height="24" rx="6" fill="url(#desk3d)" stroke="#475569" />
      {/* depth side */}
      <rect x="-180" y="12" width="360" height="14" rx="3" fill="#475569" />
      {/* legs */}
      <rect x="-160" y="26" width="14" height="80" rx="3" fill="#334155" />
      <rect x="146" y="26" width="14" height="80" rx="3" fill="#334155" />
    </g>

    {/* MONITOR — main centerpiece, 3D-rendered look */}
    <motion.g
      transform="translate(300 270)"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* monitor halo */}
      <ellipse cx="0" cy="40" rx="160" ry="40" fill="#22d3ee" opacity="0.18" filter="url(#soft-blur)" />

      {/* outer bezel */}
      <rect x="-130" y="-90" width="260" height="170" rx="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
      {/* bezel highlight */}
      <rect x="-126" y="-86" width="252" height="6" rx="3" fill="#475569" opacity="0.6" />
      {/* screen */}
      <rect x="-118" y="-78" width="236" height="146" rx="4" fill="url(#screen3d)" />

      {/* code lines on screen */}
      <g>
        {[
          { y: -68, w: 70, c: "#fbbf24" },
          { y: -52, w: 180, c: "#fff" },
          { y: -36, w: 130, c: "#a7f3d0" },
          { y: -20, w: 200, c: "#fde68a" },
          { y: -4, w: 110, c: "#fff" },
          { y: 12, w: 170, c: "#a7f3d0" },
          { y: 28, w: 90, c: "#fbbf24" },
          { y: 44, w: 150, c: "#fff" },
        ].map((l, i) => (
          <motion.rect
            key={i}
            x="-110" y={l.y} width={l.w} height="6" rx="2"
            fill={l.c} opacity="0.85"
            animate={{ width: [l.w, l.w * 0.7, l.w] }}
            transition={{ duration: 2.6 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
        <motion.rect
          x="48" y="44" width="14" height="6" rx="2" fill="#fff"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </g>

      {/* screen reflection */}
      <path d="M -118 -78 L 118 -78 L 80 -50 L -118 -50 Z" fill="#fff" opacity="0.06" />

      {/* monitor stand */}
      <rect x="-22" y="80" width="44" height="40" rx="4" fill="#334155" />
      <ellipse cx="0" cy="124" rx="50" ry="6" fill="#1e293b" />
    </motion.g>

    {/* GROUND SHADOW under chair */}
    <ellipse cx="320" cy="492" rx="80" ry="14" fill="url(#ground-shadow)" />

    {/* CHAIR */}
    <g transform="translate(310 360)">
      {/* chair back */}
      <path
        d="M -28 0 Q -28 -50 -10 -55 L 30 -55 Q 48 -50 48 0 L 48 70 Q 48 75 44 75 L -24 75 Q -28 75 -28 70 Z"
        fill="url(#chair3d)" stroke="#0f172a"
      />
      {/* highlight on chair back */}
      <path d="M -22 -45 Q -22 -50 -10 -50 L 8 -50 Q 8 -42 0 -42 Q -22 -42 -22 -45 Z" fill="#64748b" opacity="0.6" />
      {/* chair seat */}
      <ellipse cx="10" cy="80" rx="42" ry="14" fill="#1e293b" />
      {/* chair leg pole */}
      <rect x="6" y="92" width="8" height="38" rx="2" fill="#475569" />
      {/* base */}
      <ellipse cx="10" cy="132" rx="34" ry="8" fill="#1e293b" />
    </g>

    {/* === HUMAN CHARACTER (3D rendered look) === */}
    <g transform="translate(290 250)">
      {/* TORSO — rounded blob with shading */}
      <path
        d="M -18 50 Q -28 38 -22 22 Q -18 4 -2 0 L 36 0 Q 52 4 56 22 Q 62 38 52 50 L 52 110 Q 50 125 30 128 L 4 128 Q -16 125 -18 110 Z"
        fill="url(#shirt3d)"
        stroke="#064e3b"
        strokeWidth="1.5"
      />
      {/* Shirt highlight */}
      <path
        d="M -10 32 Q -14 18 -2 12 L 18 10 Q 14 28 4 36 Z"
        fill="#5eead4" opacity="0.55"
      />
      {/* Collar */}
      <path d="M 8 0 Q 18 -4 28 0 L 24 12 Q 18 16 12 12 Z" fill="#064e3b" />
      <ellipse cx="18" cy="6" rx="8" ry="3" fill="#fde2c2" opacity="0.8" />

      {/* RIGHT ARM (toward keyboard) — rounded */}
      <motion.g
        animate={{ rotate: [0, -2, 0, 2, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ transformOrigin: "52px 30px" }}
      >
        <path
          d="M 52 24 Q 70 30 86 50 Q 96 64 100 80 Q 100 90 90 92 Q 80 92 76 84 Q 68 70 56 56 Q 48 46 50 32 Z"
          fill="url(#shirt3d)"
          stroke="#064e3b"
        />
        {/* hand */}
        <ellipse cx="92" cy="86" rx="9" ry="7" fill="url(#skin3d-arm)" stroke="#a87858" strokeWidth="0.8" />
      </motion.g>

      {/* LEFT ARM (toward keyboard) */}
      <motion.g
        animate={{ rotate: [0, 2, 0, -2, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
        style={{ transformOrigin: "-16px 30px" }}
      >
        <path
          d="M -16 26 Q -34 32 -50 52 Q -60 66 -62 82 Q -62 92 -52 94 Q -42 94 -38 86 Q -32 70 -22 56 Q -14 46 -16 32 Z"
          fill="url(#shirt3d)"
          stroke="#064e3b"
        />
        {/* hand */}
        <ellipse cx="-54" cy="88" rx="9" ry="7" fill="url(#skin3d)" stroke="#a87858" strokeWidth="0.8" />
      </motion.g>

      {/* NECK */}
      <path
        d="M 4 -2 Q 4 -10 14 -12 L 26 -12 Q 36 -10 36 -2 L 32 8 Q 20 12 8 8 Z"
        fill="url(#skin3d)"
        stroke="#a87858"
        strokeWidth="0.8"
      />

      {/* HEAD — rounded with multi-stop radial gradient */}
      <ellipse cx="20" cy="-32" rx="28" ry="32" fill="url(#skin3d)" stroke="#a87858" strokeWidth="1.2" />
      {/* face highlight */}
      <ellipse cx="10" cy="-42" rx="10" ry="14" fill="#fde2c2" opacity="0.55" />
      {/* cheek blush */}
      <ellipse cx="36" cy="-22" rx="5" ry="3.5" fill="#f9a8a8" opacity="0.55" />
      <ellipse cx="4" cy="-22" rx="4" ry="3" fill="#f9a8a8" opacity="0.45" />

      {/* HAIR — rounded organic shape */}
      <path
        d="M -8 -34 Q -14 -58 12 -64 Q 36 -68 46 -54 Q 52 -42 50 -28 Q 44 -36 30 -38 Q 12 -38 -2 -32 Q -8 -32 -8 -34 Z"
        fill="url(#hair3d)"
        stroke="#1a0f08"
      />
      {/* hair highlight */}
      <path
        d="M 6 -56 Q 18 -62 32 -58 Q 26 -52 16 -52 Q 8 -52 6 -56 Z"
        fill="#5d4530" opacity="0.7"
      />

      {/* GLASSES — rounded frames */}
      <g stroke="#0f172a" strokeWidth="1.6" fill="none">
        <ellipse cx="9" cy="-30" rx="6" ry="5" fill="rgba(34,211,238,0.18)" />
        <ellipse cx="29" cy="-30" rx="6" ry="5" fill="rgba(34,211,238,0.18)" />
        <line x1="14" y1="-30" x2="24" y2="-30" />
      </g>
      {/* glasses shine */}
      <motion.line
        x1="6" y1="-32" x2="9" y2="-31" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.85"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />

      {/* SMILE */}
      <path d="M 14 -16 Q 20 -12 26 -16" fill="none" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" />

      {/* PANTS / lap visible */}
      <path
        d="M -20 124 Q 16 132 56 124 L 50 148 Q 16 156 -16 148 Z"
        fill="url(#pants3d)" stroke="#0f172a"
      />
    </g>

    {/* KEYBOARD */}
    <g transform="translate(255 408)">
      <rect x="0" y="-8" width="120" height="14" rx="3" fill="#475569" stroke="#334155" />
      <rect x="0" y="-8" width="120" height="3" rx="1" fill="#64748b" opacity="0.7" />
      <motion.ellipse
        cx="60" cy="-3" rx="50" ry="4" fill="#34d399" opacity="0.3"
        animate={{ opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </g>

    {/* COFFEE CUP */}
    <motion.g
      transform="translate(440 380)"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <ellipse cx="0" cy="2" rx="12" ry="3" fill="#000" opacity="0.4" />
      <path d="M -10 -16 Q -10 -2 0 0 Q 10 -2 10 -16 Z" fill="#cbd5e1" stroke="#94a3b8" />
      <path d="M -8 -16 L 8 -16 L 6 -14 L -6 -14 Z" fill="#7c2d12" />
      <path d="M 10 -10 Q 18 -10 18 -4 Q 18 0 12 0" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
      <motion.path
        d="M -2 -20 Q -6 -28 0 -34 Q 6 -40 -2 -46"
        fill="none" stroke="#cbd5e1" strokeWidth="1.4" opacity="0.6" strokeLinecap="round"
        animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.g>

    {/* HOLOGRAPHIC RING — subtle */}
    <motion.g
      transform="translate(300 280)"
      animate={{ rotate: 360 }}
      transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "300px 280px" }}
    >
      <ellipse cx="0" cy="0" rx="200" ry="60" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.32" strokeDasharray="3 6" />
    </motion.g>

    {/* FLOATING CODE TAGS */}
    {[
      { x: 90, y: 130, t: "{ }", c: "#34d399" },
      { x: 490, y: 140, t: "</>", c: "#60a5fa" },
      { x: 100, y: 460, t: "λ", c: "#a78bfa" },
      { x: 500, y: 460, t: "@", c: "#fbbf24" },
    ].map((p, i) => (
      <motion.g
        key={i}
        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
      >
        <text
          x={p.x} y={p.y} fontSize="20" fontWeight="800"
          fill={p.c} fontFamily="ui-monospace, monospace" opacity="0.9"
        >
          {p.t}
        </text>
      </motion.g>
    ))}
  </motion.svg>
);
