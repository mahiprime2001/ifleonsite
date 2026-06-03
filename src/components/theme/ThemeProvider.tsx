import { useEffect, type ReactNode } from "react";

/* ============================================================
   Dark-only theme. The site ships a single dark "SIGNAL" skin
   (the light skin was removed). This guarantees the `.dark`
   class + color-scheme are applied. The inline script in
   index.html also sets it before first paint to avoid any flash.
   ============================================================ */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  }, []);

  return <>{children}</>;
}
