import type { Metadata } from "next";

/* Titles, descriptions and structured data for the public site. */

export const SITE_URL = "https://ifleon.com";
export const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export const ORGANIZATION = {
  "@type": "Organization",
  name: "IFLEON",
  url: `${SITE_URL}/`,
  logo: DEFAULT_IMAGE,
  email: "info@ifleon.com",
  address: { "@type": "PostalAddress", addressLocality: "Nellore", addressRegion: "Andhra Pradesh", addressCountry: "IN" },
} as const;

export type PageInfo = { title: string; description: string; changeFrequency?: "daily" | "monthly"; priority?: number };

export const PAGES = {
  "/": {
    title: "IFLEON - Infinite Logical Elements of Network | AI, DevOps & IT Consulting",
    description:
      "IFLEON delivers innovative AI, DevOps, and IT consulting solutions including cloud migration, cybersecurity, digital transformation, and tech support across India.",
    priority: 1,
  },
  "/services": {
    title: "Services — AI, DevOps, Cloud & Cybersecurity | IFLEON",
    description:
      "End-to-end AI, DevOps, cloud, and cybersecurity work for businesses and individuals — what we build, deploy and maintain.",
  },
  "/pricing": {
    title: "Pricing & Engagement Models | IFLEON",
    description:
      "Flexible engagement models for different business needs, project scopes, and growth stages — every engagement starts with a free consultation.",
  },
  "/case-studies": {
    title: "Case Studies | IFLEON",
    description: "Recent engagements that show how IFLEON approaches problems and ships measurable solutions.",
  },
  "/portfolio": {
    title: "Portfolio | IFLEON",
    description:
      "A showcase of recent engagements across AI, DevOps, cloud, and security — each delivering measurable business outcomes.",
  },
  "/tech-stack": {
    title: "Tech Stack | IFLEON",
    description: "The platforms, languages, and tooling IFLEON uses to build secure, scalable, and future-ready solutions.",
  },
  "/team": {
    title: "Our Team | IFLEON",
    description: "Founder-led, hands-on engineers committed to building practical technology that businesses can trust.",
  },
  "/faq": {
    title: "FAQ | IFLEON",
    description:
      "Everything you need to know about working with IFLEON — engagement models, pricing, integrations, and how we get started.",
  },
  "/blog": {
    title: "Tech Blog | IFLEON — AI, DevOps & Cloud Engineering",
    description:
      "Technical deep dives and practical guides on AI, DevOps, cloud and security from the IFLEON engineering team.",
    changeFrequency: "daily",
    priority: 0.9,
  },
} satisfies Record<string, PageInfo>;

export type PagePath = keyof typeof PAGES;

/* Metadata for one of the fixed pages above (title is absolute: it already carries the brand). */
export function pageMetadata(path: PagePath): Metadata {
  const { title, description } = PAGES[path];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
    twitter: { title, description },
  };
}

/* JSON for <script type="application/ld+json">, safe against "</script>" inside the data. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
