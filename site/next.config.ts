import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (node server.js).
  output: "standalone",
  poweredByHeader: false,
  // This app lives inside the Vite site's repo; keep Next from picking up the parent's config files.
  turbopack: { root: path.join(__dirname) },
  // `npm run dev` only: let phones/laptops on the home network load the dev server (live reload).
  allowedDevOrigins: ["192.168.29.97", "192.168.*.*"],
  // A new id per build, so tabs open from an older deploy reload instead of breaking.
  deploymentId: process.env.NEXT_DEPLOYMENT_ID || `build-${Date.now().toString(36)}`,
  async redirects() {
    return [
      { source: "/feed", destination: "/blog", permanent: true },
      { source: "/feed/", destination: "/blog", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/post-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-blog.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-pages.xml", destination: "/sitemap.xml", permanent: true },
    ];
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
