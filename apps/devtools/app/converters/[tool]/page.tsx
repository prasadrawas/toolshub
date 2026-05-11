import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "json-to-yaml": dynamic(() => import("@/components/tools/converters/JsonToYaml")),
  "yaml-to-json": dynamic(() => import("@/components/tools/converters/YamlToJson")),
  "json-to-xml": dynamic(() => import("@/components/tools/converters/JsonToXml")),
  "xml-to-json": dynamic(() => import("@/components/tools/converters/XmlToJson")),
  "json-to-csv": dynamic(() => import("@/components/tools/converters/JsonToCsv")),
  "csv-to-json": dynamic(() => import("@/components/tools/converters/CsvToJson")),
  "json-to-toml": dynamic(() => import("@/components/tools/converters/JsonToToml")),
  "toml-to-json": dynamic(() => import("@/components/tools/converters/TomlToJson")),
  "json-to-typescript": dynamic(() => import("@/components/tools/converters/JsonToTypescript")),
  "json-to-go-struct": dynamic(() => import("@/components/tools/converters/JsonToGoStruct")),
  "json-to-rust-serde": dynamic(() => import("@/components/tools/converters/JsonToRustSerde")),
  "json-to-java-class": dynamic(() => import("@/components/tools/converters/JsonToJavaClass")),
  "json-to-python-dataclass": dynamic(() => import("@/components/tools/converters/JsonToPythonDataclass")),
  "json-to-zod-schema": dynamic(() => import("@/components/tools/converters/JsonToZodSchema")),
  "json-to-json-schema": dynamic(() => import("@/components/tools/converters/JsonToJsonSchema")),
  "json-to-graphql": dynamic(() => import("@/components/tools/converters/JsonToGraphql")),
  "csv-to-sql": dynamic(() => import("@/components/tools/converters/CsvToSql")),
  "json-to-html-table": dynamic(() => import("@/components/tools/converters/JsonToHtmlTable")),
  "markdown-to-html": dynamic(() => import("@/components/tools/converters/MarkdownToHtml")),
  "html-to-markdown": dynamic(() => import("@/components/tools/converters/HtmlToMarkdown")),
  "html-to-jsx": dynamic(() => import("@/components/tools/converters/HtmlToJsx")),
  "curl-to-code": dynamic(() => import("@/components/tools/converters/CurlToCode")),
};

export function generateStaticParams() {
  return getToolsByCategory("converters").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("converters");
  if (!tool || !category || tool.category !== "converters") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
