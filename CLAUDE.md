clos# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Turborepo monorepo hosting multiple Next.js 14 (App Router) tool apps under a single domain (`usfinancetools.com`). Each app runs at its own basePath and is independently buildable/deployable.

## Monorepo Structure

```
apps/
  gateway/        — Reverse proxy at root domain (port 3000). Routes /financetools/* and /devtools/* to sub-apps via next.config.mjs rewrites.
  financetools/   — 112 financial calculators (port 3001, basePath: /financetools). Package name: "usfinancetools"
  devtools/       — 150 client-side developer tools (port 3002, basePath: /devtools). Package name: "devtools"
```

## Commands

```bash
# All apps
npm run dev                    # Start all 3 apps via Turborepo
npm run build                  # Build all apps

# Individual apps
npm run dev:financetools       # Start only financetools (port 3001)
npm run dev:devtools           # Start only devtools (port 3002)
npm run dev:gateway            # Start only gateway (port 3000)
npm run build:financetools     # Build only financetools
npm run build:devtools         # Build only devtools

# Inside an app directory
npx tsc --noEmit               # Type-check
npx next lint                  # Lint
```

To test through the gateway (single-domain routing), start all 3 apps and access via `localhost:3000`.

## Architecture

### Gateway App (`apps/gateway/`)
Minimal Next.js app. Its `next.config.mjs` uses `rewrites()` to proxy paths to sub-apps. In production, destination URLs come from env vars (`FINANCETOOLS_URL`, `DEVTOOLS_URL`). The landing page (`app/page.tsx`) lists all available tool apps.

### Finance Tools App (`apps/financetools/`)
- **Route pattern**: Per-category routes for code splitting. Each category (mortgage, retirement, tax, etc.) has its own `app/{category}/[tool]/page.tsx` that only `dynamic()`-imports calculators for that category.
- **Calculator components**: Original 7 calculators are individual files (`MortgageCalculator.tsx`, etc.). Batch calculators are grouped per-category in plural files (`MortgageCalculators.tsx` has 16 exports, `RetirementCalculators.tsx` has 15, etc.).
- **Tool data**: `lib/data/tools.ts` contains all 112 tools with metadata. `lib/data/categories.ts` defines 8 categories. `lib/data/states.ts` has US state tax data.
- **Math logic**: `lib/calculators/` has pure TypeScript functions (mortgage.ts, tax.ts, retirement.ts, investing.ts, debt.ts, auto.ts). Batch calculators do inline math in useMemo.
- **SEO**: `lib/seo-content.ts` returns how-to steps, tips, and FAQs per category. `lib/tool-page-helpers.ts` generates metadata. `components/shared/ToolPageLayout.tsx` renders JSON-LD (WebApplication, FAQPage, BreadcrumbList).
- **Category pages**: `app/{category}/page.tsx` are thin wrappers importing `CategoryPageContent`.
- **Sitemap**: `next-sitemap` runs as postbuild. Config at `next-sitemap.config.js`.

### DevTools App (`apps/devtools/`)
- **Same route pattern**: 12 category routes, each with `[tool]/page.tsx` using `dynamic()` imports.
- **Tool components**: `components/tools/{category}/ToolName.tsx` — each is a self-contained "use client" component with default export. All processing is 100% client-side (no backend).
- **Common tool layout**: Two-panel textarea (input/output) with action buttons (Format, Copy, Clear, etc.). Some tools use Canvas API (image tools, QR generator, favicon generator).
- **Tool data**: Same pattern as financetools — `lib/data/tools.ts` (150 tools) and `lib/data/categories.ts` (12 categories).

### Shared Patterns Across Apps
- **Design system**: Tailwind CSS with custom `brand-*` color scale (purple #6C3AED), `font-display` (DM Sans) for headings, `font-sans` (Inter) for body. `hero-gradient` CSS class for animated purple gradient headers. `mesh-orb` class for decorative blur orbs.
- **Component conventions**: `components/ui/` for base primitives (Radix UI based), `components/shared/` for app-level shared components, `components/layout/` for Navbar/Footer/Breadcrumb.
- **Dynamic imports**: All tool/calculator components are loaded via `next/dynamic` to enable per-route code splitting. Never statically import all tools in a single route file.
- **SEO**: Every page uses `generateMetadata()` and `generateStaticParams()` for SSG. Tool pages include JSON-LD structured data.

## Adding a New App

1. Create `apps/newapp/` with its own `package.json`, `next.config.mjs` (set `basePath: "/newapp"`), and Next.js app structure.
2. Add a rewrite in `apps/gateway/next.config.mjs`.
3. Add scripts to root `package.json`: `"dev:newapp": "turbo run dev --filter=newapp"`.
4. Add to gateway landing page (`apps/gateway/app/page.tsx`).

## Adding a New Tool (to an existing app)

1. Add tool entry to `lib/data/tools.ts`.
2. Create the tool component in `components/tools/{category}/` (devtools) or `components/calculators/` (financetools).
3. Add a `dynamic()` import entry in the category's `app/{category}/[tool]/page.tsx`.

## Key Constraints

- **No shared packages yet**: Each app is fully self-contained. No `packages/` directory. Shared code may be extracted later.
- **tsconfig target**: devtools uses `"target": "es2020"` to support Map/Set/Uint8Array iteration. Financetools uses default.
- **Turbo filter names**: financetools filter is `--filter=usfinancetools` (package.json name), not `--filter=financetools`.
