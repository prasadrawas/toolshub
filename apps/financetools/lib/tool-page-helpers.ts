import { Metadata } from "next";
import { getToolBySlug } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";

export function generateToolMetadata(toolSlug: string, catSlug: string): Metadata {
  const tool = getToolBySlug(toolSlug);
  const category = getCategoryBySlug(catSlug);
  if (!tool || !category) return {};

  const description = `Use our free ${tool.name.toLowerCase()} to ${tool.description.charAt(0).toLowerCase()}${tool.description.slice(1)} Updated for 2026. No sign-up required.`;

  return {
    title: tool.name,
    description,
    alternates: { canonical: `/${category.slug}/${tool.slug}` },
    openGraph: {
      title: `${tool.name} | USFinanceTools`,
      description,
      url: `https://usfinancetools.com/${category.slug}/${tool.slug}`,
      type: "website",
    },
  };
}
