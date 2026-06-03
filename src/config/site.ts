/* ============================================================
   IFLEON — GLOBAL SITE DETAILS (single source of truth)
   Edit values here and they update across the site. Keep this
   the ONE place for facts: company info, contact, links,
   headline metrics, and compliance.

   (Service definitions live in src/data/services.ts.)
   ============================================================ */

export const site = {
  // ---- Identity ----
  name: "IFLEON",
  legalName: "Infinite Logical Elements of Network",
  tagline: "Infinite Possibilities, Logical Solutions.",
  shortPitch:
    "We build AI-powered software, automate DevOps pipelines, and deliver secure cloud solutions that help businesses scale faster and smarter.",
  founder: "S. Mahendra Reddy",
  foundedYear: 2022,
  /** shown as the hero eyebrow, e.g. "AI · DevOps · Cloud · Security" */
  specialties: ["AI", "DevOps", "Cloud", "Security"],

  // ---- Location ----
  location: {
    city: "Nellore",
    region: "Andhra Pradesh",
    country: "India",
    /** how reach is described in copy */
    reach: "Pan-India",
  },

  // ---- Contact ----
  contact: {
    email: "info@ifleon.com",
    phone: "", // add when available
  },

  // ---- Links / social ----
  links: {
    website: "https://ifleon.com",
    github: "https://github.com/ifleonlabs",
    linkedin: "https://www.linkedin.com/company/ifleon/",
  },

  // ---- Trust / compliance badges ----
  compliance: ["ISO 27001", "DPDP", "SOC 2"],

  // ---- Headline metrics ("By the Numbers" / stat rows) ----
  metrics: {
    projectsDelivered: 72,
    industriesServed: 6,
    clients: 25,
    /** shown as-is, e.g. "99.9%" */
    uptime: "99.9%",
    /** "Security-First Approach" percentage */
    securityFirstPct: 99,
  },
} as const;

export type Site = typeof site;
export default site;
