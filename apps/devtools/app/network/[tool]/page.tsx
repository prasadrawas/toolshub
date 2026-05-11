import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "http-status-codes": dynamic(() => import("@/components/tools/network/HttpStatusCodes")),
  "mime-type-lookup": dynamic(() => import("@/components/tools/network/MimeTypeLookup")),
  "cors-header-builder": dynamic(() => import("@/components/tools/network/CorsHeaderBuilder")),
  "csp-header-generator": dynamic(() => import("@/components/tools/network/CspHeaderGenerator")),
  "ipv4-subnet-calculator": dynamic(() => import("@/components/tools/network/Ipv4SubnetCalculator")),
  "ipv4-address-converter": dynamic(() => import("@/components/tools/network/Ipv4AddressConverter")),
  "ipv6-ula-generator": dynamic(() => import("@/components/tools/network/Ipv6UlaGenerator")),
  "mac-address-generator": dynamic(() => import("@/components/tools/network/MacAddressGenerator")),
  "open-graph-preview": dynamic(() => import("@/components/tools/network/OpenGraphPreview")),
  "sitemap-generator": dynamic(() => import("@/components/tools/network/SitemapGenerator")),
  "url-parser": dynamic(() => import("@/components/tools/network/UrlParser")),
  "user-agent-parser": dynamic(() => import("@/components/tools/network/UserAgentParser")),
};

export function generateStaticParams() {
  return getToolsByCategory("network").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("network");
  if (!tool || !category || tool.category !== "network") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
