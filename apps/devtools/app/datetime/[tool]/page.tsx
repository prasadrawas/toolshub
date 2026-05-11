import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";

const components: Record<string, ReturnType<typeof dynamic>> = {
  "unix-timestamp-converter": dynamic(() => import("@/components/tools/datetime/UnixTimestampConverter")),
  "timezone-converter": dynamic(() => import("@/components/tools/datetime/TimezoneConverter")),
  "date-diff-calculator": dynamic(() => import("@/components/tools/datetime/DateDiffCalculator")),
  "iso-8601-formatter": dynamic(() => import("@/components/tools/datetime/Iso8601Formatter")),
  "cron-schedule-viewer": dynamic(() => import("@/components/tools/datetime/CronScheduleViewer")),
  "relative-time-calculator": dynamic(() => import("@/components/tools/datetime/RelativeTimeCalculator")),
  "week-number-calculator": dynamic(() => import("@/components/tools/datetime/WeekNumberCalculator")),
};

export function generateStaticParams() {
  return getToolsByCategory("datetime").map((t) => ({ tool: t.slug }));
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
  const category = getCategoryBySlug("datetime");
  if (!tool || !category || tool.category !== "datetime") notFound();
  const Component = components[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Component ? <Component /> : null}
    </ToolPageLayout>
  );
}
