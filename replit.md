# Green Madani International — Corporate Website

A premium, internationally-positioned corporate website for Green Madani International Private Ltd. (GMI) — a diversified Bangladeshi business group operating 12 subsidiaries across agriculture, food, beverages, beauty, fashion, hospitality, travel, education, healthcare, media, R&D, and retail.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, path /api)
- `pnpm --filter @workspace/gmi-website run dev` — run the frontend (port 23280, path /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, framer-motion, wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod, drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Fonts: Manrope (headings) + Inter (body) from Google Fonts
- Icons: lucide-react (social icons replaced react-icons/si due to missing exports)

## Where things live

- **OpenAPI spec**: `lib/api-spec/openapi.yaml`
- **DB schema**: `lib/db/src/schema/` — businesses.ts, products.ts, news.ts, careers.ts, inquiries.ts
- **API routes**: `artifacts/api-server/src/routes/` — businesses, products, news, careers, inquiries, stats
- **Frontend pages**: `artifacts/gmi-website/src/pages/`
- **Shared layout**: `artifacts/gmi-website/src/components/layout.tsx`
- **Theme + CSS**: `artifacts/gmi-website/src/index.css`

## Architecture decisions

- This is a presentation-first corporate site with a thin Express backend for form submissions and data fetching
- Social icons use lucide-react (Facebook, Twitter, Youtube, Linkedin) — react-icons/si did not export these in the installed version
- Array parameters in PostgreSQL seeding use inline array literals `'{...}'::text[]` syntax since executeSql params don't support JS arrays
- Zod is added as an explicit dependency to `@workspace/api-server` (not only in workspace root) for route validation
- All 12 GMI subsidiaries are seeded in the businesses table; first 6 are `featured: true`

## Product

GMI corporate website with:
- Full homepage with hero, business portfolio, featured products, sustainability strip, news preview
- About Us with vision, mission, values, leadership, timeline
- All 12 subsidiaries as browsable business pages
- Product catalog with category filtering (seeds, agriculture, food, skincare, beverages, etc.)
- Sustainability page with impact metrics
- News & Updates with article detail pages
- Careers page with job listings and application form
- Contact page with general and business inquiry forms

## Brand Colors

- Primary: #1A5C38 (Deep Forest Green)
- Accent: #C8960C (Gold/Amber)
- Dark bg: #0D3D25 (Footer/dark sections)
- Off-white: #F9F7F2 (light section backgrounds)

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after OpenAPI spec changes
- `react-icons/si` SiLinkedin, SiTwitter, SiFacebook, SiYoutube are NOT available in the installed version — use lucide-react equivalents
- Zod must be in `@workspace/api-server`'s own `dependencies`, not just root
- Array columns use `.array()` method in Drizzle schema
- Islamic geometric pattern overlay is a CSS class `.islamic-pattern-overlay` defined in index.css

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- PRD: `attached_assets/GMI-PRD_1781577764109.md`
