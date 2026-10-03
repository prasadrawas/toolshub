# ToolsHub

A large-scale Turborepo monorepo hosting 112 financial calculators and 150 developer tools under a single domain.

## Features

- 112 financial calculators across 8 categories (mortgage, retirement, tax, investment, debt, auto, insurance, real estate)
- 150 client-side developer tools (color, data conversion, CSS, encoding, formatting, random data, image, math, text)
- Gateway app routing traffic to sub-apps via Next.js rewrites
- JSON-LD structured data for SEO (WebApplication, FAQPage, BreadcrumbList)
- Dynamic imports per category for optimal code splitting
- Auto-generated sitemaps
- All calculations run client-side with zero server dependency

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Turborepo
- Radix UI
- Recharts
- next-sitemap

## Architecture

```
Gateway App (root domain routing)
├── Finance App (112 calculators)
├── DevTools App (150 utilities)
└── Shared Packages (common UI + utils)
```

## Author

**Prasad Rawas** - [GitHub](https://github.com/prasadrawas)

