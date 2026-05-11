import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "css-gradient-generator": dynamic(() => import("@/components/tools/css/CssGradientGenerator")),
  "box-shadow-generator": dynamic(() => import("@/components/tools/css/BoxShadowGenerator")),
  "flexbox-playground": dynamic(() => import("@/components/tools/css/FlexboxPlayground")),
  "grid-generator": dynamic(() => import("@/components/tools/css/GridGenerator")),
  "border-radius-generator": dynamic(() => import("@/components/tools/css/BorderRadiusGenerator")),
  "css-units-converter": dynamic(() => import("@/components/tools/css/CssUnitsConverter")),
  "clip-path-generator": dynamic(() => import("@/components/tools/css/ClipPathGenerator")),
  "animation-generator": dynamic(() => import("@/components/tools/css/AnimationGenerator")),
  "glassmorphism-generator": dynamic(() => import("@/components/tools/css/GlassmorphismGenerator")),
  "svg-to-css": dynamic(() => import("@/components/tools/css/SvgToCss")),
};

export function generateStaticParams() {
  return getToolsByCategory("css").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("css");
  if (!tool || !category || tool.category !== "css") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
