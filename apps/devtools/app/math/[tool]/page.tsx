import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "number-base-converter": dynamic(() => import("@/components/tools/math/NumberBaseConverter")),
  "byte-unit-converter": dynamic(() => import("@/components/tools/math/ByteUnitConverter")),
  "aspect-ratio-calculator": dynamic(() => import("@/components/tools/math/AspectRatioCalculator")),
  "chmod-calculator": dynamic(() => import("@/components/tools/math/ChmodCalculator")),
  "percentage-calculator": dynamic(() => import("@/components/tools/math/PercentageCalculator")),
  "scientific-notation-converter": dynamic(() => import("@/components/tools/math/ScientificNotationConverter")),
  "roman-numeral-converter": dynamic(() => import("@/components/tools/math/RomanNumeralConverter")),
  "fibonacci-prime-generator": dynamic(() => import("@/components/tools/math/FibonacciPrimeGenerator")),
};

export function generateStaticParams() {
  return getToolsByCategory("math").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("math");
  if (!tool || !category || tool.category !== "math") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
