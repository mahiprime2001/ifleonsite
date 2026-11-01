import type { PortfolioKind } from "@/db/schema";

/*
 * What each kind of portfolio entry uses. All kinds share one table (portfolio_entries); this decides
 * which fields the admin form shows, what they're called, and the address segment under /admin/portfolio.
 */
export type EntryField =
  | "slug"
  | "subtitle"
  | "location"
  | "dates"
  | "summary"
  | "body"
  | "image"
  | "gallery"
  | "url"
  | "repoUrl"
  | "tags"
  | "featured";

type LabelKey = EntryField | "title" | "startDate" | "endDate";

type KindConfig = {
  /* URL segment, e.g. /admin/portfolio/projects */
  segment: string;
  plural: string;
  singular: string;
  description: string;
  fields: EntryField[];
  /* Labels that differ from DEFAULT_LABELS. */
  labels: Partial<Record<LabelKey, string>>;
  placeholders?: Partial<Record<LabelKey, string>>;
};

export const ENTRY_KINDS: Record<PortfolioKind, KindConfig> = {
  project: {
    segment: "projects",
    plural: "Projects",
    singular: "project",
    description: "Work to show off. Featured projects lead the home page; each project gets its own page.",
    fields: ["slug", "subtitle", "dates", "summary", "body", "image", "gallery", "url", "repoUrl", "tags", "featured"],
    labels: {
      title: "Project name",
      subtitle: "Client or context",
      summary: "One-line summary",
      body: "Write-up (Markdown): the problem, what you built, the result",
      image: "Cover image",
      url: "Live link",
      tags: "Tech stack",
      featured: "Feature on the home page",
    },
    placeholders: { subtitle: "e.g. IFLEON client, personal project", tags: "Next.js, Postgres, Docker" },
  },
  experience: {
    segment: "experience",
    plural: "Experience",
    singular: "role",
    description: "Jobs and roles, shown as a timeline. Leave the end date empty for a current role.",
    fields: ["subtitle", "location", "dates", "summary", "body", "image", "url", "tags"],
    labels: {
      title: "Role",
      subtitle: "Company",
      summary: "One-line summary",
      body: "Details (Markdown, e.g. bullet points)",
      image: "Company logo",
      url: "Company website",
      tags: "Skills used",
    },
    placeholders: { title: "e.g. Founder & Lead Engineer", subtitle: "e.g. IFLEON" },
  },
  education: {
    segment: "education",
    plural: "Education",
    singular: "course",
    description: "Degrees, schools and courses.",
    fields: ["subtitle", "location", "dates", "summary", "image", "url"],
    labels: { title: "Degree or course", subtitle: "School or institution", summary: "Notes", image: "Logo" },
    placeholders: { title: "e.g. B.Tech, Computer Science" },
  },
  skill: {
    segment: "skills",
    plural: "Skills",
    singular: "skill",
    description: "Grouped on the site by the group you give them, in this order.",
    fields: ["subtitle", "featured"],
    labels: { title: "Skill", subtitle: "Group", featured: "Highlight this skill" },
    placeholders: { title: "e.g. Kubernetes", subtitle: "e.g. Cloud & DevOps" },
  },
  certification: {
    segment: "certifications",
    plural: "Certifications",
    singular: "certification",
    description: "Certificates and credentials.",
    fields: ["subtitle", "dates", "summary", "image", "url"],
    labels: {
      title: "Certificate",
      subtitle: "Issued by",
      startDate: "Issued",
      endDate: "Expires",
      summary: "Notes",
      image: "Badge",
      url: "Credential link",
    },
  },
  achievement: {
    segment: "achievements",
    plural: "Achievements",
    singular: "achievement",
    description: "Awards, talks, publications and milestones.",
    fields: ["subtitle", "dates", "summary", "image", "url"],
    labels: { title: "Achievement", subtitle: "Awarded by or where", startDate: "Date", summary: "Description" },
  },
  service: {
    segment: "services",
    plural: "Services",
    singular: "service",
    description: "What you offer, shown as “What I do” near the top of the site.",
    fields: ["summary", "tags", "featured"],
    labels: { title: "Service", summary: "What it covers", tags: "Typical tools", featured: "Highlight this service" },
    placeholders: { title: "e.g. Desktop & web apps", tags: "Next.js, Tauri, PostgreSQL" },
  },
  interest: {
    segment: "interests",
    plural: "Interests",
    singular: "interest",
    description: "Life outside work, shown as “Off the clock”.",
    fields: ["summary", "image", "url"],
    labels: { title: "Interest", summary: "A line about it", url: "Link (e.g. your YouTube channel)" },
    placeholders: { title: "e.g. Travel" },
  },
  photo: {
    segment: "photos",
    plural: "Photos",
    singular: "photo",
    description: "Your photos for the site. Featured photos are the ones the site may use as your portrait.",
    fields: ["image", "summary", "featured"],
    labels: { title: "Caption", image: "Photo", summary: "Description for screen readers", featured: "Feature this photo" },
  },
};

const DEFAULT_LABELS: Record<LabelKey, string> = {
  title: "Title",
  slug: "Page address",
  subtitle: "Subtitle",
  location: "Location",
  dates: "Dates",
  startDate: "Start",
  endDate: "End",
  summary: "Summary",
  body: "Details (Markdown)",
  image: "Image",
  gallery: "More images",
  url: "Link",
  repoUrl: "Source code link",
  tags: "Tags",
  featured: "Featured",
};

export function labelFor(kind: PortfolioKind, key: LabelKey) {
  return ENTRY_KINDS[kind].labels[key] ?? DEFAULT_LABELS[key];
}

export function placeholderFor(kind: PortfolioKind, key: LabelKey) {
  return ENTRY_KINDS[kind].placeholders?.[key];
}

/* Address segment ("projects") back to its kind ("project"); null for anything else. */
export function kindFromSegment(segment: string): PortfolioKind | null {
  const match = Object.entries(ENTRY_KINDS).find(([, config]) => config.segment === segment);
  return match ? (match[0] as PortfolioKind) : null;
}

/* Cache tag for everything the portfolio's public API returns. */
export const PORTFOLIO_TAG = "portfolio";
