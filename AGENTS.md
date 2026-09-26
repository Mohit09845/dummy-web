<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Sunfeast Dark Fantasy Beverages: project guide

Read this before changing anything. It describes what the site is, how it is built, and the rules that keep it fast and indexable.

## What the site is

A marketing site for ITC Limited's ready-to-drink beverages in India, under three brands:

- **Dark Fantasy**: Milkshake (Belgian Chocolate, White Chocolate Vanilla)
- **Sunfeast**: Smoothie (Alphonso Mango, Berry & Mango, Breakfast Smoothie)
- **Aashirvaad**: Shahi Badam Milk, Svasti Lassi

There are 4 products and 7 flavours (the variants of the first two products, plus the two single-flavour products). There is no cart or checkout. "Buy now" opens a modal of retailer links (Blinkit, Zepto, Swiggy Instamart, BigBasket, Amazon, Flipkart, JioMart). The site shows **no prices**.

## Stack and hard constraints

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 (`@import "tailwindcss"` in `globals.css`, no tailwind config file).
- **Static export**: `next.config.ts` has `output: "export"` and `images.unoptimized: true`. Consequences:
  - There is no server. Pages can't read `searchParams` at request time. Query params (e.g. `?variant=`) are read client-side in a `useEffect`.
  - `next/image` does no resizing. Image weight is controlled by pre-optimising files on disk (see Images).
  - Metadata routes (`robots.ts`, `sitemap.ts`, `llms.txt/route.ts`) need `export const dynamic = 'force-static'`.
  - Dynamic routes need `generateStaticParams`.
- Dependencies are deliberately minimal: `next`, `react`, `react-dom`, `lucide-react`. **Do not add an animation library** (framer-motion was removed and saved ~50 KB gzipped per page). Use the CSS animations in `globals.css`.
- Font: Jost via `next/font/google`, variable font. Upright is preloaded. Italic is a separate, non-preloaded instance (`--font-jost-italic`), applied to `em`, `i` and `.italic` in `globals.css`. The fallback stack is `"Jost", "Trebuchet MS", sans-serif`.
- **`NEXT_PUBLIC_SITE_URL` must be set** at build time (see `src/lib/site.ts`). Otherwise canonicals, the sitemap, OG and JSON-LD URLs all point at `http://localhost:3000`.

Commands: `npm run dev`, `npm run build` (writes `out/`), `npm run lint`. Type-check with `npx tsc --noEmit`.

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero, Featured Products, Did you know?, Drink Finder, Explore the range, FAQ |
| `/products` | `app/products/page.tsx` → `ProductsListingClient` | "Our Beverages" heading, Drink Finder, category tabs, flavour grid — tabs sit directly above the grid, not above the quiz |
| `/product/[id]` | `app/product/[id]/page.tsx` → `ProductPageClient` | Gallery, flavour switcher, Buy now modal, ingredients & nutrition, FAQ, related |
| `/occasions/[slug]` | `app/occasions/[slug]/page.tsx` → `OccasionPage` (server component) | slugs: `beat-the-heat`, `on-the-go`, `busy-mornings`, `evening-indulgence` |
| `/occasions` | `app/occasions/page.tsx` | Renders the first occasion. Its canonical is `/occasions/beat-the-heat`, so it is **not** in the sitemap. Nav links point at the canonical URL. |
| `/llms.txt` | `app/llms.txt/route.ts` | Plain-text site summary for AI answer engines, generated from data |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | |

Occasion tabs are real `<Link>`s to separate static pages. Don't turn them back into client-side state: that hid three of the four occasions from crawlers.

## Where the data lives (single sources of truth)

- `src/data/products.ts`: products, variants, packshots, ingredients, nutrition, highlights, retailer URLs.
- `src/lib/flavours.ts`: products flattened to the 7 flavours with a category (`shakes | smoothies | dairy`). Used by the Products grid, related products, occasions and the JSON-LD ItemList.
- `src/lib/occasions.ts`: the 4 occasions (slug, copy, banner image, suggested drinks), the shared occasion FAQs, and `occasionPath()`.
- `src/lib/productFaq.ts`: per-product FAQs, derived only from product data.
- `src/lib/schema.ts`: every JSON-LD builder (Organization, WebSite, BreadcrumbList, ItemList, FAQPage, Product/ProductGroup). Render JSON-LD with `components/JsonLd.tsx`, which escapes `<`.
- `src/lib/site.ts`: `SITE_URL`, `SITE_NAME`.
- `src/lib/facts.ts`: the 7 "Did you know?" facts (one per flavour) behind the homepage `DidYouKnowSection`, each pointing at a product image and href. Copies the same claims used per-flavour in `DrinkQuiz.tsx`'s `RECOMMENDATIONS` — keep both in sync if a fact changes.

When you add a product, flavour or occasion, the grids, sitemap, JSON-LD and `llms.txt` all update from these files. Don't hardcode product copy in components.

## Components

- Shell: `Header` (client; hides on scroll down, reappears on scroll up; mobile drawer; active nav uses `match` prefixes), `Footer`.
- `Hero` (server component, no client JS): a single static banner (`kvs/hero-range.webp`), not a carousel — that was tried and explicitly reverted. The frame is sized off the viewport (`h-[86svh] ... lg:h-[calc(100svh-84px)]`), not an aspect-ratio, so the image always reaches the bottom of the section with no gap before the next one. `kvs/home-slider-two/three.webp` are unused leftovers from the carousel version; don't wire them back in without being asked.
- Cards:
  - `ProductCard` (`src/components/ProductCard.tsx`) is the **one** product card used everywhere a product/flavour is shown as a card: Featured Products (`ProductsSection`, fixed-width rail), the Products grid (`ProductsListingClient`, `fluid` prop so it stretches to the CSS Grid cell) and Product Detail's "You may also like" (`ProductPageClient`, also `fluid`). Dark `#24120B` body, pastel-tinted image panel on top, tag pill + title + text + "View product →". `flavourToProductCard(flavour)` (exported from the same file) is the one place a `Flavour` becomes card data — use it rather than re-deriving the fields inline. Don't fork this component per page; add a prop instead (see `fluid`).
  - `FloatingCard` (`src/components/FloatingCard.tsx`) is the pastel card with its image floating half above the top edge. Used for the homepage "Did you know?" rail (`DidYouKnowSection`, fact copy from `src/lib/facts.ts`) and Occasion "Suggested drinks" (`OccasionPage`'s `occasionCards()`). Both of those are laid out with `.stagger-row` so alternating cards sit lower — see the Design system gotcha below.
  - `FlavourCard` no longer exists — it was the Products-grid-only card, replaced by `ProductCard` with `fluid`.
- `FaqSection` (client): the one shared FAQ UI (centered heading + accordion) used on home, product and occasion pages. Answers are always in the HTML and collapsed with CSS grid-rows. Don't render answers conditionally.
- `DrinkQuiz` (client, dynamically imported, still SSR'd): 4 questions → flavour match. Scoring lives in the component. Takes an optional `hideHeading` prop — the Products page renders its own "Drink Finder" eyebrow/heading in the hero (next to the floating packshots) and passes `hideHeading` so it isn't duplicated; the homepage instance renders the default heading.
- `BuyNowModal` (client, loaded on first click via `next/dynamic`): portal, Escape and backdrop close, scroll lock, CSS enter/exit animation.
- `Reveal` (client): scroll-in animation via IntersectionObserver plus CSS classes. It only hides elements that start below the fold, so above-the-fold content never flashes.
- `OccasionPage` is a **server component**. Keep pages server-rendered wherever there's no interactivity.
- `DidYouKnowSection` (client, homepage only): a scroll rail + arrow buttons + progress bar, same interaction pattern as `ProductsSection`, showing `FactCard`s from `src/lib/facts.ts`.

## Design system

- Dark shell (`#090503` / `#24120B`, cream text, gold `#D4AF37` / `#F7D78D`) for the header, hero, explore range, footer and occasion hero. Light cream sections (`--bg-light #FAF3E0`) for content.
- Use the CSS variables in `globals.css`: `--bg-light`, `--surface-light`, `--text-on-light`, `--text-on-light-muted`, `--accent-on-light`, `--border-on-light(-strong)`. `body` text is cream (for the dark shell), so **light sections must set an explicit text colour**, e.g. `style={{ color: 'var(--text-on-light)' }}` on `<main>`. Otherwise text renders invisible cream-on-cream.
- Buttons: `.btn-gold` (dark sections), `.btn-dark` and `.btn-outline-dark` (light sections). Pills are `rounded-full`, uppercase, tracked.
- Motion utilities: `.hero-rise`, `.panel-in` (re-key an element to replay), `.quiz-step`, `.image-swap`, `.modal-fade`, `.stagger-row`, `Reveal`. All motion is disabled under `prefers-reduced-motion`.
- Breakpoints: mobile 390, tablet 768 (`sm`/`md`), desktop 1440 (`lg` 1024+, `xl` 1280+). Always check for horizontal overflow at 390px.
- Gotcha: a horizontally scrolling container (`overflow-x:auto`) also clips vertically. `FloatingCard` pops its pack image out above the card (needs **top padding inside** the scroll container, not margin outside it, to clear that pop-out — see `.stagger-row` usages in `DidYouKnowSection` and `OccasionPage`). The downward `.stagger-row` offset on alternating cards is ordinary margin-top, so it grows the row's own height and needs no extra bottom padding. `ProductCard`'s image sits fully inside the card and isn't staggered, so none of this applies to Featured Products.

## SEO / GEO rules

- Every page sets its own `title` (the layout template appends the site name), `description` (≤160 chars), `alternates.canonical`, and OpenGraph `url`. The root layout must never contain a page-specific canonical.
- One `<h1>` per page. `<html lang="en-IN">`.
- JSON-LD per page: layout (Organization, WebSite); home (FAQPage); products (BreadcrumbList, ItemList); product (Product or ProductGroup, BreadcrumbList, FAQPage); occasion (BreadcrumbList, ItemList, FAQPage).
- **No fabrication.** Only state facts already in `src/data` or on-page copy. No prices, `offers`, ratings, reviews, stock, or health claims that aren't already on the site.
- The sitemap lists canonical URLs only: no `/occasions` index, no `?variant=` URLs.
- `?variant=` URLs canonicalise to the product page.

## Performance rules

- Keep components server-side unless they need state or effects. Page-level client components exist only where there's interaction.
- Split heavy client widgets with `next/dynamic` (DrinkQuiz, BuyNowModal).
- Never animate the first paint of an LCP element (hero slide 1, product gallery image, occasion banner). Animate only user-triggered changes (see `swapped` in `ProductPageClient`).
- Current baseline (gzipped JS per page): about 183–196 KB, of which about 158 KB is the React/Next runtime. CSS is about 9 KB. Check `out/` after a build if you add dependencies.

## Images

- All assets live in `public/assets/{kvs,packshots,logos}` and are already WebP, pre-sized with `scripts/optimize-images.js` (sharp; run `node scripts/optimize-images.js` when new source art arrives, then add a job line). The script never deletes sources.
- Packshots: `fop`/`render` (front), `bop`/`bop1` (back), plus `*-detail.webp` large versions. Those are only referenced through `toDetail()` in `ProductPageClient`, so a filename search won't find them. Don't delete them.
- `kvs/og-image.jpg` (1200×630) is the social share image; `kvs/hero-range.webp` is the same image in WebP for hero slide 1. `kvs/lifestyle-berry-chill.webp` belongs to the Drink Finder; don't reuse it in banners.
- `logos/Instagram_logo.svg` (vector), `logos/facebook.webp`, `logos/twitter-x.webp`, `logos/youtube.webp` (each ~2-3 KB, extracted from oversized source SVGs with embedded base64 PNGs and resized with sharp) are the footer's social icons. If new social art arrives as an SVG wrapping a `data:image/png;base64,` payload, extract and resize it the same way rather than shipping the wrapper file directly — the originals were 90–182 KB each.
- Give every `next/image` `fill` + a sized parent, or width/height, to avoid layout shift. Decorative images get `alt=""`.

## Known open items (not fixed; need owner input)

- The footer "Enter email" form doesn't send anything (it only shows a thank-you). Wire it up or remove it.
- Social links are placeholders: the footer YouTube link points to youtube.com (not a channel), and the X/Twitter link (`https://x.com/darkfantasycreations`) is a guessed handle, not confirmed. Retailer links in `products.ts` are store homepages, not product listings.
- Hero slides 2–3 are 2.8:1 desktop creatives (`home-slider-two/three.webp`) cropped for mobile via `object-position`. Dedicated mobile crops would look sharper than cropping the wide originals.
- With `images.unoptimized`, phones download the same image files as desktop. If image weight grows, add pre-generated responsive sizes rather than larger single files.
