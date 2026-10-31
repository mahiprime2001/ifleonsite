import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Self-contained server bundle for the Docker image (node server.js, no node_modules install).
  output: "standalone",
  // A new id for every build (this config is evaluated once, at build time). Tabs still open from an
  // older deploy then reload themselves instead of failing with "Failed to find Server Action".
  deploymentId: process.env.NEXT_DEPLOYMENT_ID || `build-${Date.now().toString(36)}`,
  poweredByHeader: false,
  turbopack: {
    // Pin the root to this folder. Otherwise Turbopack picks the repo root (it has its own
    // package-lock.json) and applies the Vite site's Tailwind 3 postcss.config.js to our CSS.
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [{ source: "/", destination: "/admin", permanent: false }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
