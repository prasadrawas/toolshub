import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "diff-checker": dynamic(() => import("@/components/tools/text/DiffChecker")),
  "word-counter": dynamic(() => import("@/components/tools/text/WordCounter")),
  "case-converter": dynamic(() => import("@/components/tools/text/CaseConverter")),
  "text-to-slug": dynamic(() => import("@/components/tools/text/TextToSlug")),
  "line-sorter": dynamic(() => import("@/components/tools/text/LineSorter")),
  "find-and-replace": dynamic(() => import("@/components/tools/text/FindAndReplace")),
  "text-repeater": dynamic(() => import("@/components/tools/text/TextRepeater")),
  "whitespace-remover": dynamic(() => import("@/components/tools/text/WhitespaceRemover")),
  "string-inspector": dynamic(() => import("@/components/tools/text/StringInspector")),
  "numeronym-generator": dynamic(() => import("@/components/tools/text/NumeronymGenerator")),
  "text-truncator": dynamic(() => import("@/components/tools/text/TextTruncator")),
  "lorem-to-content": dynamic(() => import("@/components/tools/text/LoremToContent")),
  "multiline-to-single": dynamic(() => import("@/components/tools/text/MultilineToSingle")),
  "remove-duplicate-lines": dynamic(() => import("@/components/tools/text/RemoveDuplicateLines")),
};

export function generateStaticParams() {
  return getToolsByCategory("text").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("text");
  if (!tool || !category || tool.category !== "text") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
