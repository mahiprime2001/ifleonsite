import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { VersionId } from "./VersionProvider";

/* Lazy registry of homepage theme versions. V1 is the inline "immersive"
   composition in App.tsx; everything from V2 up is a self-contained
   default-exported component loaded on demand. Add a version here + in
   VERSIONS (VersionProvider) and it shows up in the switcher automatically. */
export const VERSION_COMPONENTS: Partial<
  Record<VersionId, LazyExoticComponent<ComponentType>>
> = {
  v2: lazy(() => import("./TerminalHome")),
  // Combination themes (motion-rich)
  v3: lazy(() => import("./FluxHome")),
  v4: lazy(() => import("./ForgeHome")),
  v5: lazy(() => import("./NexusHome")),
  v6: lazy(() => import("./MotionHome")),
  v7: lazy(() => import("./SagaHome")),
  v8: lazy(() => import("./PrismHome")),
  // Advanced WebGL / shader / interaction combos
  v9: lazy(() => import("./DistortHome")),
  v10: lazy(() => import("./TrailHome")),
  v11: lazy(() => import("./LumenHome")),
  v12: lazy(() => import("./CanvasHome")),
  v13: lazy(() => import("./ShaderHome")),
};
