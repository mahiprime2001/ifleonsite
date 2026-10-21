"use client";

import { useEffect, useRef } from "react";

/* Marks a message read once it's been opened. Runs from the browser so a page render never writes. */
export function MarkAsRead({ action }: { action: () => Promise<void> }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    void action();
  }, [action]);
  return null;
}
