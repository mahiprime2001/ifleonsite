"use client";

import { motion } from "framer-motion";

/* A short fade on every page change (Next.js re-mounts templates on navigation). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="min-h-screen">
      {children}
    </motion.div>
  );
}
