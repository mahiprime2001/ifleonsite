# IFLEON website rebuild: project plan

Owner: S. Mahendra Reddy. Updated: 2026-10-11. Keep this file current at the end of every milestone.

## Goal

A clear, trustworthy, fast consultancy site for IFLEON (AI, DevOps, Cloud, Cybersecurity, custom software) that turns visitors from India and abroad into "Book a free consultation" requests. Light, warm, grown-up. Fast on mid-range Android phones.

## Who it is for

1. Founders and CTOs of startups and SMBs who need a reliable technical partner.
2. Operations and IT managers at larger companies comparing vendors.
3. Individuals who want personal security, career guidance or a small build.

Main action on every page: **Book a free consultation**. Secondary: see services, read case studies.

## Site map (UX)

| Page | Job |
|---|---|
| Home | Say what we do, prove it, send people to the consultation form |
| Services (+ detail) | Explain each offer in plain English with outcomes |
| Case studies and Work | Show results and how we work |
| Team | Put faces to the promise (founder-led) |
| Pricing | Explain engagement models, remove fear of cost |
| Blog | Technical credibility and search traffic |
| FAQ | Remove last doubts |
| Contact | One short form, plain next steps |
| Login, Sign up, Profile, Settings | Existing member pages, restyled only |
| 404 | Original page, unchanged |

## Design system (UI)

- Light base, charcoal text, one green `brand` (#15803D). Warm yellow `sun` for rare highlights.
- Newsreader headings, Figtree body. Define colours and fonts in `tailwind.config.js` only.
- Buttons rounded-xl, cards rounded-2xl. One primary button per section.
- Illustration: AI-generated editorial scenes in one style (first: `public/images/concepts/studio.png`). No cartoon mascots.
- Components: shadcn/ui base in `src/components/ui`, 21st.dev for polished section pieces, an optional light shader background from shaders.com with a static fallback.
- Motion: transform and opacity only, respect reduced motion, nothing that blocks reading.

## Milestones

| # | Milestone | Status |
|---|---|---|
| M0 | Foundation: light theme tokens, fonts, `@/` alias, shadcn base, GSAP/Lenis scaffolding | Mostly done. Left: style guide page, remove temporary `/concepts` |
| M1 | Header, footer, hero (new components) | Next |
| M2 | Trust strip, services, process | |
| M3 | Case studies, testimonials, FAQ | |
| M4 | Contact form, newsletter, closing call to action | |
| M5 | Inner pages rebuilt: services detail, work, team, pricing, blog | |
| M6 | Speed and search: pre-render every route, per-page titles and previews, WebP images, Lighthouse | |
| M7 | WordPress packaging and deploy checklist, contact form check | |
| M8 | Launch QA | |

Each milestone ends with: desktop (1440px) and phone (390px) screenshots reviewed by the owner, `pnpm build` and `pnpm lint` passing, and this file updated.

## Quality gates (QA)

- Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 95+.
- One `<h1>` per page, headings in order, visible focus, WCAG AA contrast.
- Every image has width, height and alt text. Hero image under 200 KB (WebP).
- Reduced-motion users see a still page. No animation on layout properties.
- Contact form tested end to end on the live WordPress site.

## Risks and open items

| Risk or item | Owner | Plan |
|---|---|---|
| Shader backgrounds use WebGPU, missing on many mid-range phones | Dev | Static gradient fallback, one effect per page, pause off-screen, test on a low-end phone |
| Free `shaders` package licence is not stated on its site | Dev | Check the package licence before shipping |
| More AI images cost Figma credits (VDC-1 plan) | Owner | Ask before each batch, review before using |
| Unverifiable claims on the site ("10K+ Active Users", "50+ Countries" on Login; counters on Home) | Owner | Confirm real numbers or remove them |
| External photos (Pexels) on Team and Portfolio are blocked by the dev server's cross-origin header | Dev | Self-host the photos in WebP |
| `public/reasons.json` for the 404 quotes is not in the repo | Owner | Confirm where it lives, or add a copy |
| Old unused files (`backup/`, three.js scene, unused packages) | Dev | Remove in M6 |

## Decisions log

- 2026-10-11: Stay on Vite + React (Astro was tried and undone). Pre-render later with `vite-react-ssg`.
- 2026-10-11: Light consultancy theme first, then rebuild each section on the new design system.
- 2026-10-11: Logo and the original 404 page do not change.
