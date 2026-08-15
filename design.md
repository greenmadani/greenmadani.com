# GMI Website — Design Reference

> **Stack:** React 19 + Vite + Tailwind CSS v4 + framer-motion 12 + shadcn/ui
> **Source:** `artifacts/gmi-website/src/`
> **Updated:** 2026-08-15

---

## 1. Design Language

Premium, organic, and corporate: deep forest green + harvest gold on a warm cream canvas. The aesthetic blends glassmorphism, fluid type scaling, subtle floating shapes, and scroll-triggered reveals to convey "sustainable agriculture meets modern conglomerate".

Key traits:
- **Green + gold + cream** palette, dark green gradient hero/portfolio sections
- **DM Serif Display** serif for headings (display), **Inter** for body
- Square/straight corners with **0.75rem radius cap**; sharp category badges
- Low-opacity floating geometric shapes + Islamic star pattern overlays on dark sections
- Card hover lift (`card-hover`), image zoom (`img-hover`), underline animations

---

## 2. Color System (`src/index.css`)

Defined as HSL CSS variables in `:root` (light) and `.dark`, consumed via Tailwind v4 `@theme inline`.

### Light mode
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `43 30% 97%` | Warm cream page bg |
| `--foreground` | `0 0% 10%` | Near-black text |
| `--card` | `0 0% 100%` | White cards |
| `--primary` | `145 56% 23%` | Deep forest green |
| `--secondary` | `148 65% 15%` | Darker green (gradients) |
| `--muted` | `140 27% 95%` | Light green-grey panels |
| `--muted-foreground` | `0 0% 29%` | Grey body text |
| `--accent` | `44 89% 42%` | Harvest gold |
| `--accent-foreground` | `0 0% 10%` | Dark text on gold |
| `--border` | `43 30% 92%` | Subtle borders |
| `--ring` | `145 56% 23%` | Focus rings |

### Dark mode
Green-tinted inversion: `--background: 148 65% 15%`, `--foreground: 0 0% 100%`, `--card: 148 65% 15%`, `--accent` stays gold.

### Signature gradients
- Hero / Portfolio: `bg-gradient-to-br from-primary via-secondary to-[#09281A]`
- Sustainability strip: `bg-secondary/90` overlay on a fixed farm photo (Unsplash)

---

## 3. Typography

| Role | Font | Sizes |
|------|------|-------|
| Headings `h1–h6` | DM Serif Display (Georgia fallback), weight 400 | `h1: clamp(2.25rem, 5vw, 4rem)`, `h2: clamp(1.75rem, 3vw, 2.5rem)`, `h3: clamp(1.25rem, 1.5vw, 1.5rem)` |
| Body | Inter | `body: clamp(0.9375rem, 1vw, 1rem)` (line-height 1.6) |
| Captions / badges | Inter 600, uppercase, `letter-spacing 0.05em` | `0.75–0.875rem` |

Fluid `clamp()` scale via `--text-2xl` … `--text-7xl`. `text-wrap: balance` on headings.

---

## 4. Home Page Structure (`src/pages/home.tsx`)

1. **Hero** — dark gradient, `AnimatedBackground`, eyebrow (`Bangladesh's Premier...`), display H1 with gold accent line, subcopy, `Explore Businesses` + `Contact Us →` link. Stats row below a `border-t border-white/10`: 4 `StatDisplay`s (Subsidiaries, Products+, Districts, Years).
2. **Who We Are** — 2-col: copy + 4 value cards (Quality/Innovation/Integrity/Sustainability) with lucide icons; offset 2-up image collage with caption chips and corner accent frame.
3. **Business Portfolio** — dark gradient, `SectionHeader`, 6 random subsidiaries (`shuffle().slice(0,6)`) in glass cards with industry badge + `Explore {name}` chip, skeleton loading, `View All Businesses`.
4. **Featured Products** — category filter pills (horizontal snap scroll, `hide-scrollbar`), 8 shuffled products (2-col mobile / 4-col desktop) with category badge, `View Details` button.
5. **Why Partner With GMI** — `border-y-4 border-accent` section, 4 glass feature cards (Vertical Integration, Diversified Strength, Nationwide Reach, Export-Ready Quality).
6. **CTASection** — split card: Distributor (primary top border) + Investor (accent top border).
7. **Sustainability Strip** — fixed-bg farm image, italic display quote, 3 stat tiles (100% / 42 / 70+), `Read Our Sustainability Report`.
8. **News Preview** — 4 news cards with `border-t-4 border-accent`, date, category badge, excerpt, `Read More`.

Data sources: `useGetCompanyStats`, `useBusinessesList`, `useListProducts` (by category), `useListNews`.

---

## 5. Shared Components

| Component | Purpose |
|-----------|---------|
| `SectionHeader` | Badge + display title + optional description (center/left) |
| `StatDisplay` | Count-up number (IntersectionObserver, 1.5s) + uppercase label |
| `AnimatedSection` | Scroll-triggered fade-up wrapper |
| `AnimatedBackground` | Floating gold/green shapes + star-pattern SVG; disabled under `prefers-reduced-motion` |
| `CTASection` | Distributor/Investor split CTA |
| `PageHero`, `GridCard`, `FilterBar`, `PageSkeleton` | Used on other pages |
| Button (`ui/button`) | 5 variants (`primary`, `secondary`, `outline`, `ghost`, `link`), 6 sizes, `active:scale-[0.97]` |

---

## 6. Animation & Interaction

- **Reveals:** `AnimatedSection` + CSS `animate-fade-in/up/down/left/right/scale-in/zoom-in`
- **Stagger:** `animate-stagger` utility staggers children 0–1100ms
- **Hover:** `card-hover` (lift + shadow + border tint), `img-hover` (1.06 scale), `icon-hover`, `nav-link` (underline slide), `link-underline`
- **Micro:** button press scale, stat count-up, shimmer loading (`shimmer-wrap`), image fade-in on load
- **Reduced motion:** global media query zeroes animations; `AnimatedBackground` renders static pattern

---

## 7. Spacing / Layout Conventions

- Section padding: `py-16 md:py-24` (consistent site-wide)
- Container: `container mx-auto px-4`
- Grids: `grid-cols-2` mobile → `lg:grid-cols-4` (products/news), `lg:grid-cols-3` (businesses)
- Radius: `--radius: 0.75rem` (via shadcn scale)
- Hero offset: `-mt-20` + `pt-[96px] md:pt-[128px]` to sit under sticky navbar

---

## 8. Mobile UX

- Fixed bottom nav (Home/Businesses/Products/News/Contact) — `lg:hidden`, with `pb-16` on main
- Animated drawer menu with branding header + sticky CTA
- Scroll-to-top FAB past 600px
- Horizontal snap-scroll category pills (`snap-x snap-mandatory`), `hide-scrollbar`

---

## 9. Accessibility

- Focus-visible rings (shadcn)
- Semantic heading hierarchy (h1 → h2 → h3)
- `prefers-reduced-motion` support
- ARIA labels on icon-only buttons
- WCAG AA green/gold/cream contrast
