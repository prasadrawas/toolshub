import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "color-converter": dynamic(() => import("@/components/tools/color/ColorConverter")),
  "color-picker": dynamic(() => import("@/components/tools/color/ColorPicker")),
  "contrast-checker": dynamic(() => import("@/components/tools/color/ContrastChecker")),
  "tailwind-color-finder": dynamic(() => import("@/components/tools/color/TailwindColorFinder")),
  "color-blindness-simulator": dynamic(() => import("@/components/tools/color/ColorBlindnessSimulator")),
  "image-color-extractor": dynamic(() => import("@/components/tools/color/ImageColorExtractor")),
  "css-named-colors": dynamic(() => import("@/components/tools/color/CssNamedColors")),
  "color-shade-generator": dynamic(() => import("@/components/tools/color/ColorShadeGenerator")),
};

export function generateStaticParams() {
  return getToolsByCategory("color").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("color");
  if (!tool || !category || tool.category !== "color") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
