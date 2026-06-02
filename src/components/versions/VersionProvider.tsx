import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ============================================================
   Theme-VERSION switcher. Lets the owner preview multiple
   homepage theme directions (V1/V2/V3/...) live in-app and
   pick one. Each version is a distinct homepage composition
   inspired by an online reference. Persisted to localStorage.
   ============================================================ */

export type VersionId =
  | "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7"
  | "v8" | "v9" | "v10" | "v11" | "v12" | "v13" | "v14" | "v15" | "v16" | "v17"
  | "v18" | "v19" | "v20" | "v21" | "v22" | "v23" | "v24" | "v25" | "v26" | "v27";

export type VersionMeta = {
  id: VersionId;
  num: string;
  label: string;
  ref: string;
  /** the skin the page chrome should use for this version */
  skin: "light" | "dark";
};

export const VERSIONS: VersionMeta[] = [
  { id: "v1", num: "V1", label: "Immersive", ref: "Light WebGL ∞ field · Lusion", skin: "light" },
  { id: "v2", num: "V2", label: "Bento", ref: "Product-OS grid · Vercel / Raycast", skin: "dark" },
  { id: "v3", num: "V3", label: "Cinematic", ref: "Dark-space 3D · Active Theory", skin: "dark" },
  { id: "v4", num: "V4", label: "Editorial", ref: "Bold type · brutalist", skin: "light" },
  { id: "v5", num: "V5", label: "Orbit", ref: "Glossy 3D object · light · R3F", skin: "light" },
  { id: "v6", num: "V6", label: "Nebula", ref: "Immersive 3D scene · dark · R3F", skin: "dark" },
  { id: "v7", num: "V7", label: "Kinetic", ref: "Real 3D + bold transitions · dark", skin: "dark" },
  { id: "v8", num: "V8", label: "Aurora", ref: "Animated mesh-gradient · Stripe", skin: "light" },
  { id: "v9", num: "V9", label: "Glass", ref: "Glassmorphism frosted panels", skin: "dark" },
  { id: "v10", num: "V10", label: "Brutalist", ref: "Neubrutalism · hard shadows", skin: "light" },
  { id: "v11", num: "V11", label: "Swiss", ref: "Swiss minimal grid · monochrome", skin: "light" },
  { id: "v12", num: "V12", label: "Terminal", ref: "Dev terminal / code aesthetic", skin: "dark" },
  { id: "v13", num: "V13", label: "Clay", ref: "Claymorphism · soft 3D pastel", skin: "light" },
  { id: "v14", num: "V14", label: "Cyber", ref: "Cyberpunk neon grid", skin: "dark" },
  { id: "v15", num: "V15", label: "Retro", ref: "Y2K / retro-web", skin: "dark" },
  { id: "v16", num: "V16", label: "Press", ref: "Magazine editorial · serif", skin: "light" },
  { id: "v17", num: "V17", label: "Enterprise", ref: "Corporate clean SaaS · Vanta", skin: "light" },
  { id: "v18", num: "V18", label: "Aurora Noir", ref: "Aurora ribbons · deep dark", skin: "dark" },
  { id: "v19", num: "V19", label: "Iso", ref: "Isometric illustration grid", skin: "light" },
  { id: "v20", num: "V20", label: "Noir", ref: "Monochrome black & white", skin: "dark" },
  { id: "v21", num: "V21", label: "Liquid", ref: "Organic morphing blobs", skin: "light" },
  { id: "v22", num: "V22", label: "Bauhaus", ref: "Geometric Bauhaus blocks", skin: "light" },
  { id: "v23", num: "V23", label: "Spotlight", ref: "Cursor-spotlight reveal · dark", skin: "dark" },
  { id: "v24", num: "V24", label: "Pastel", ref: "Soft pastel · calm", skin: "light" },
  { id: "v25", num: "V25", label: "Holo", ref: "Holographic iridescent", skin: "dark" },
  { id: "v26", num: "V26", label: "Pulse", ref: "Data-viz dashboard · charts", skin: "dark" },
  { id: "v27", num: "V27", label: "Type", ref: "Kinetic typography hero", skin: "light" },
];

const STORAGE_KEY = "ifleon-version";

type VersionValue = {
  version: VersionId;
  meta: VersionMeta;
  setVersion: (v: VersionId) => void;
};

const VersionContext = createContext<VersionValue | null>(null);

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<VersionId>(() => {
    if (typeof localStorage === "undefined") return "v1";
    const saved = localStorage.getItem(STORAGE_KEY) as VersionId | null;
    return saved && VERSIONS.some((v) => v.id === saved) ? saved : "v1";
  });

  useEffect(() => {
    document.documentElement.dataset.version = version;
  }, [version]);

  const setVersion = (v: VersionId) => {
    setVersionState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  };

  const meta = VERSIONS.find((v) => v.id === version) ?? VERSIONS[0];

  const value = useMemo<VersionValue>(
    () => ({ version, meta, setVersion }),
    [version, meta],
  );

  return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>;
}

export function useVersion(): VersionValue {
  const ctx = useContext(VersionContext);
  if (!ctx) throw new Error("useVersion must be used within a VersionProvider");
  return ctx;
}
