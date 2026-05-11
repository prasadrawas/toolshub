import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "uuid-generator": dynamic(() => import("@/components/tools/generators/UuidGenerator")),
  "ulid-generator": dynamic(() => import("@/components/tools/generators/UlidGenerator")),
  "nanoid-generator": dynamic(() => import("@/components/tools/generators/NanoidGenerator")),
  "password-generator": dynamic(() => import("@/components/tools/generators/PasswordGenerator")),
  "random-string-generator": dynamic(() => import("@/components/tools/generators/RandomStringGenerator")),
  "hash-generator": dynamic(() => import("@/components/tools/generators/HashGenerator")),
  "hmac-generator": dynamic(() => import("@/components/tools/generators/HmacGenerator")),
  "bcrypt-generator": dynamic(() => import("@/components/tools/generators/BcryptGenerator")),
  "lorem-ipsum-generator": dynamic(() => import("@/components/tools/generators/LoremIpsumGenerator")),
  "qr-code-generator": dynamic(() => import("@/components/tools/generators/QrCodeGenerator")),
  "barcode-generator": dynamic(() => import("@/components/tools/generators/BarcodeGenerator")),
  "color-palette-generator": dynamic(() => import("@/components/tools/generators/ColorPaletteGenerator")),
  "regex-tester": dynamic(() => import("@/components/tools/generators/RegexTester")),
  "cron-builder": dynamic(() => import("@/components/tools/generators/CronBuilder")),
  "gitignore-generator": dynamic(() => import("@/components/tools/generators/GitignoreGenerator")),
  "meta-tag-generator": dynamic(() => import("@/components/tools/generators/MetaTagGenerator")),
  "robots-txt-generator": dynamic(() => import("@/components/tools/generators/RobotsTxtGenerator")),
  "favicon-generator": dynamic(() => import("@/components/tools/generators/FaviconGenerator")),
  "mock-data-generator": dynamic(() => import("@/components/tools/generators/MockDataGenerator")),
  "token-generator": dynamic(() => import("@/components/tools/generators/TokenGenerator")),
};

export function generateStaticParams() {
  return getToolsByCategory("generators").map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const t = getToolBySlug(tool);
  if (!t) return {};
  return {
    title: t.name,
    description: `Free online ${t.name.toLowerCase()}. ${t.description} No sign-up required. 100% client-side.`,
    alternates: { canonical: `/${t.category}/${t.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const category = getCategoryBySlug("generators");
  if (!tool || !category || tool.category !== "generators") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
