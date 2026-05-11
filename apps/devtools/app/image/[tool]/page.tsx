import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "image-to-base64": dynamic(() => import("@/components/tools/image/ImageToBase64")),
  "svg-optimizer": dynamic(() => import("@/components/tools/image/SvgOptimizer")),
  "image-resizer": dynamic(() => import("@/components/tools/image/ImageResizer")),
  "image-compressor": dynamic(() => import("@/components/tools/image/ImageCompressor")),
  "image-format-converter": dynamic(() => import("@/components/tools/image/ImageFormatConverter")),
  "placeholder-image-generator": dynamic(() => import("@/components/tools/image/PlaceholderImageGenerator")),
  "svg-path-viewer": dynamic(() => import("@/components/tools/image/SvgPathViewer")),
  "image-cropper": dynamic(() => import("@/components/tools/image/ImageCropper")),
  "screenshot-mockup": dynamic(() => import("@/components/tools/image/ScreenshotMockup")),
  "ico-converter": dynamic(() => import("@/components/tools/image/IcoConverter")),
};

export function generateStaticParams() {
  return getToolsByCategory("image").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("image");
  if (!tool || !category || tool.category !== "image") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
