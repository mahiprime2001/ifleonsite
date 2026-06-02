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
  | "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7" | "v8"
  | "v9" | "v10" | "v11" | "v12" | "v13";

export type VersionMeta = {
  id: VersionId;
  num: string;
  label: string;
  ref: string;
  /** the skin the page chrome should use for this version */
  skin: "light" | "dark";
};

export const VERSIONS: VersionMeta[] = [
  // ── Kept favorites ──
  { id: "v1", num: "V1", label: "Immersive", ref: "Light WebGL ∞ particle field", skin: "light" },
  { id: "v2", num: "V2", label: "Terminal", ref: "Animated dev/CLI · typed commands", skin: "dark" },
  // ── Motion-rich combination themes ──
  { id: "v3", num: "C1", label: "Flux", ref: "Mesh-gradient + scrollytelling + parallax + live stats", skin: "light" },
  { id: "v4", num: "C2", label: "Forge", ref: "3D objects + bento + glass + GSAP reveals", skin: "dark" },
  { id: "v5", num: "C3", label: "Nexus", ref: "Interactive network/globe viz + cinematic transitions", skin: "dark" },
  { id: "v6", num: "C4", label: "Motion", ref: "Moving illustrations (Lottie/SVG) + morphing + bento", skin: "light" },
  { id: "v7", num: "C5", label: "Saga", ref: "Scrollytelling cinematic + SVG morph + parallax depth", skin: "dark" },
  { id: "v8", num: "C6", label: "Prism", ref: "Light glass + bento + live interactive stats + mesh", skin: "light" },
  // ── Advanced WebGL / shader / interaction combos ──
  { id: "v9", num: "C7", label: "Distort", ref: "Liquid distortion + shaders + pixel displacement (WebGL)", skin: "dark" },
  { id: "v10", num: "C8", label: "Trail", ref: "Image trail + mouse trail + cinematic transitions + smooth scroll", skin: "dark" },
  { id: "v11", num: "C9", label: "Lumen", ref: "Dynamic lighting + volumetric + depth mapping (R3F)", skin: "dark" },
  { id: "v12", num: "C10", label: "Canvas", ref: "Infinite draggable canvas + smooth scroll + motion system", skin: "light" },
  { id: "v13", num: "C11", label: "Shader", ref: "Full-screen WebGL shader experience + scrollytelling", skin: "dark" },
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
