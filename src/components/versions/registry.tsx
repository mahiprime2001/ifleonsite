import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { VersionId } from "./VersionProvider";

/* Lazy registry of homepage theme versions. V1 is the inline "immersive"
   composition in App.tsx; everything from V2 up is a self-contained
   default-exported component loaded on demand. Add a version here + in
   VERSIONS (VersionProvider) and it shows up in the switcher automatically. */
export const VERSION_COMPONENTS: Partial<
  Record<VersionId, LazyExoticComponent<ComponentType>>
> = {
  v2: lazy(() => import("./BentoHome")),
  v3: lazy(() => import("./CinematicHome")),
  v4: lazy(() => import("./EditorialHome")),
  v5: lazy(() => import("./OrbitHome")),
  v6: lazy(() => import("./NebulaHome")),
  v7: lazy(() => import("./KineticHome")),
  v8: lazy(() => import("./AuroraHome")),
  v9: lazy(() => import("./GlassHome")),
  v10: lazy(() => import("./BrutalistHome")),
  v11: lazy(() => import("./SwissHome")),
  v12: lazy(() => import("./TerminalHome")),
  v13: lazy(() => import("./ClayHome")),
  v14: lazy(() => import("./CyberHome")),
  v15: lazy(() => import("./RetroHome")),
  v16: lazy(() => import("./PressHome")),
  v17: lazy(() => import("./EnterpriseHome")),
  v18: lazy(() => import("./AuroraNoirHome")),
  v19: lazy(() => import("./IsoHome")),
  v20: lazy(() => import("./NoirHome")),
  v21: lazy(() => import("./LiquidHome")),
  v22: lazy(() => import("./BauhausHome")),
  v23: lazy(() => import("./SpotlightHome")),
  v24: lazy(() => import("./PastelHome")),
  v25: lazy(() => import("./HoloHome")),
  v26: lazy(() => import("./PulseHome")),
  v27: lazy(() => import("./TypeHome")),
};
