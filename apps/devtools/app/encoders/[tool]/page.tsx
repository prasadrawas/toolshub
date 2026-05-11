import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "base64-text-encoder": dynamic(() => import("@/components/tools/encoders/Base64TextEncoder")),
  "base64-image-encoder": dynamic(() => import("@/components/tools/encoders/Base64ImageEncoder")),
  "base64-file-encoder": dynamic(() => import("@/components/tools/encoders/Base64FileEncoder")),
  "url-encoder": dynamic(() => import("@/components/tools/encoders/UrlEncoder")),
  "html-entity-encoder": dynamic(() => import("@/components/tools/encoders/HtmlEntityEncoder")),
  "jwt-decoder": dynamic(() => import("@/components/tools/encoders/JwtDecoder")),
  "unicode-converter": dynamic(() => import("@/components/tools/encoders/UnicodeConverter")),
  "hex-to-ascii": dynamic(() => import("@/components/tools/encoders/HexToAscii")),
  "binary-converter": dynamic(() => import("@/components/tools/encoders/BinaryConverter")),
  "octal-converter": dynamic(() => import("@/components/tools/encoders/OctalConverter")),
  "utf8-inspector": dynamic(() => import("@/components/tools/encoders/Utf8Inspector")),
  "rot13-encoder": dynamic(() => import("@/components/tools/encoders/Rot13Encoder")),
  "morse-code-translator": dynamic(() => import("@/components/tools/encoders/MorseCodeTranslator")),
  "punycode-converter": dynamic(() => import("@/components/tools/encoders/PunycodeConverter")),
  "backslash-escape": dynamic(() => import("@/components/tools/encoders/BackslashEscape")),
  "string-escape": dynamic(() => import("@/components/tools/encoders/StringEscape")),
};

export function generateStaticParams() {
  return getToolsByCategory("encoders").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("encoders");
  if (!tool || !category || tool.category !== "encoders") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
