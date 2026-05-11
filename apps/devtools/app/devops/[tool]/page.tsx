import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "docker-run-to-compose": dynamic(() => import("@/components/tools/devops/DockerRunToCompose")),
  "json-schema-validator": dynamic(() => import("@/components/tools/devops/JsonSchemaValidator")),
  "yaml-schema-validator": dynamic(() => import("@/components/tools/devops/YamlSchemaValidator")),
  "env-to-json": dynamic(() => import("@/components/tools/devops/EnvToJson")),
  "nginx-config-generator": dynamic(() => import("@/components/tools/devops/NginxConfigGenerator")),
};

export function generateStaticParams() {
  return getToolsByCategory("devops").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("devops");
  if (!tool || !category || tool.category !== "devops") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
