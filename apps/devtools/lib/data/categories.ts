import { type Category } from "./tools";

export type CategoryInfo = {
  id: Category;
  name: string;
  slug: string;
  icon: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
};

export const categories: CategoryInfo[] = [
  {
    id: "formatters",
    name: "Formatters",
    slug: "formatters",
    icon: "FileCode",
    description:
      "Beautify and format code in JSON, XML, HTML, CSS, SQL, YAML, and more with instant pretty-printing.",
    seoTitle: "Online Code Formatters & Beautifiers | DevTools",
    seoDescription:
      "Free online code formatters for JSON, XML, HTML, CSS, SQL, YAML, TypeScript, Python, and more. Instantly beautify and pretty-print your code.",
  },
  {
    id: "converters",
    name: "Converters",
    slug: "converters",
    icon: "ArrowLeftRight",
    description:
      "Convert data between formats like JSON, YAML, XML, CSV, TypeScript, Go structs, and more.",
    seoTitle: "Online Data Converters | JSON, YAML, XML, CSV | DevTools",
    seoDescription:
      "Convert between JSON, YAML, XML, CSV, TypeScript, Go structs, Zod schemas, and more. Free online data format converters for developers.",
  },
  {
    id: "encoders",
    name: "Encoders & Decoders",
    slug: "encoders",
    icon: "Lock",
    description:
      "Encode and decode Base64, URLs, HTML entities, JWTs, Unicode, hex, binary, and other formats.",
    seoTitle: "Online Encoders & Decoders | Base64, URL, JWT | DevTools",
    seoDescription:
      "Encode and decode Base64, URLs, HTML entities, JWTs, Unicode, hex, and binary. Free online encoding and decoding tools for developers.",
  },
  {
    id: "generators",
    name: "Generators",
    slug: "generators",
    icon: "Wand2",
    description:
      "Generate UUIDs, passwords, hashes, QR codes, lorem ipsum, regex patterns, mock data, and more.",
    seoTitle: "Online Generators | UUID, Password, Hash, QR Code | DevTools",
    seoDescription:
      "Generate UUIDs, ULIDs, passwords, hashes, QR codes, barcodes, lorem ipsum, regex patterns, and mock data. Free online generator tools.",
  },
  {
    id: "text",
    name: "Text Tools",
    slug: "text",
    icon: "Type",
    description:
      "Diff, count words, convert case, sort lines, find and replace, and manipulate text strings.",
    seoTitle: "Online Text Tools | Diff, Word Counter, Case Converter | DevTools",
    seoDescription:
      "Compare text with diff checker, count words, convert case, sort lines, find and replace, and remove duplicates. Free online text manipulation tools.",
  },
  {
    id: "color",
    name: "Color Tools",
    slug: "color",
    icon: "Palette",
    description:
      "Pick colors, convert formats, check contrast ratios, simulate color blindness, and generate palettes.",
    seoTitle: "Online Color Tools | Picker, Converter, Contrast Checker | DevTools",
    seoDescription:
      "Pick colors, convert between HEX, RGB, and HSL, check WCAG contrast ratios, simulate color blindness, and generate color palettes.",
  },
  {
    id: "css",
    name: "CSS Tools",
    slug: "css",
    icon: "PaintBucket",
    description:
      "Build CSS gradients, shadows, flexbox layouts, grids, animations, and glassmorphism effects visually.",
    seoTitle: "Online CSS Generators | Gradient, Shadow, Flexbox, Grid | DevTools",
    seoDescription:
      "Generate CSS gradients, box shadows, flexbox layouts, grid templates, animations, clip paths, and glassmorphism effects with visual editors.",
  },
  {
    id: "image",
    name: "Image Tools",
    slug: "image",
    icon: "Image",
    description:
      "Convert, resize, compress, crop, and optimize images and SVGs directly in the browser.",
    seoTitle: "Online Image Tools | Resize, Compress, Convert | DevTools",
    seoDescription:
      "Resize, compress, crop, and convert images. Optimize SVGs, generate placeholders, and convert to Base64. Free browser-based image tools.",
  },
  {
    id: "datetime",
    name: "Date & Time",
    slug: "datetime",
    icon: "Clock",
    description:
      "Convert Unix timestamps, compare dates, format ISO 8601, preview cron schedules, and calculate time differences.",
    seoTitle: "Online Date & Time Tools | Timestamp, Timezone, Cron | DevTools",
    seoDescription:
      "Convert Unix timestamps, calculate date differences, format ISO 8601, preview cron schedules, and convert timezones. Free online datetime tools.",
  },
  {
    id: "network",
    name: "Network Tools",
    slug: "network",
    icon: "Globe",
    description:
      "Look up HTTP status codes, MIME types, build CORS and CSP headers, calculate subnets, and parse URLs.",
    seoTitle: "Online Network Tools | HTTP Status, CORS, Subnet Calculator | DevTools",
    seoDescription:
      "Look up HTTP status codes, MIME types, build CORS and CSP headers, calculate IPv4 subnets, parse URLs, and preview Open Graph meta tags.",
  },
  {
    id: "math",
    name: "Math & Numbers",
    slug: "math",
    icon: "Calculator",
    description:
      "Convert number bases, byte units, aspect ratios, chmod values, percentages, and Roman numerals.",
    seoTitle: "Online Math Tools | Base Converter, Chmod Calculator | DevTools",
    seoDescription:
      "Convert number bases, byte units, aspect ratios, and chmod permissions. Calculate percentages, scientific notation, and Roman numerals.",
  },
  {
    id: "devops",
    name: "DevOps Tools",
    slug: "devops",
    icon: "Server",
    description:
      "Convert Docker run commands to Compose, validate JSON/YAML schemas, and generate Nginx configs.",
    seoTitle: "Online DevOps Tools | Docker, Schema Validator, Nginx | DevTools",
    seoDescription:
      "Convert Docker run commands to Compose files, validate JSON and YAML schemas, convert env files, and generate Nginx configurations.",
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((c) => c.slug === slug);
}
