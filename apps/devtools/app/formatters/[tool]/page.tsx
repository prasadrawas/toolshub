import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "json-formatter": dynamic(() => import("@/components/tools/formatters/JsonFormatter")),
  "xml-formatter": dynamic(() => import("@/components/tools/formatters/XmlFormatter")),
  "html-formatter": dynamic(() => import("@/components/tools/formatters/HtmlFormatter")),
  "css-formatter": dynamic(() => import("@/components/tools/formatters/CssFormatter")),
  "javascript-formatter": dynamic(() => import("@/components/tools/formatters/JavascriptFormatter")),
  "sql-formatter": dynamic(() => import("@/components/tools/formatters/SqlFormatter")),
  "yaml-formatter": dynamic(() => import("@/components/tools/formatters/YamlFormatter")),
  "toml-formatter": dynamic(() => import("@/components/tools/formatters/TomlFormatter")),
  "graphql-formatter": dynamic(() => import("@/components/tools/formatters/GraphqlFormatter")),
  "markdown-preview": dynamic(() => import("@/components/tools/formatters/MarkdownPreview")),
  "typescript-formatter": dynamic(() => import("@/components/tools/formatters/TypescriptFormatter")),
  "less-scss-formatter": dynamic(() => import("@/components/tools/formatters/LessScssFormatter")),
  "php-formatter": dynamic(() => import("@/components/tools/formatters/PhpFormatter")),
  "python-formatter": dynamic(() => import("@/components/tools/formatters/PythonFormatter")),
  "env-formatter": dynamic(() => import("@/components/tools/formatters/EnvFormatter")),
  "nginx-formatter": dynamic(() => import("@/components/tools/formatters/NginxFormatter")),
  "dockerfile-formatter": dynamic(() => import("@/components/tools/formatters/DockerfileFormatter")),
  "prettier-playground": dynamic(() => import("@/components/tools/formatters/PrettierPlayground")),
};

export function generateStaticParams() {
  return getToolsByCategory("formatters").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("formatters");
  if (!tool || !category || tool.category !== "formatters") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
