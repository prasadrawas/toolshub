import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";
import { generateToolMetadata } from "@/lib/tool-page-helpers";

// Only import insurance calculators — code-split per category
const calculators: Record<string, ReturnType<typeof dynamic>> = {
  "life-insurance-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.LifeInsuranceCalculator }))
  ),
  "term-life-insurance-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.TermLifeInsuranceCalculator }))
  ),
  "health-insurance-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.HealthInsuranceCalculator }))
  ),
  "home-insurance-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.HomeInsuranceCalculator }))
  ),
  "disability-insurance-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.DisabilityInsuranceCalculator }))
  ),
  "umbrella-insurance-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.UmbrellaInsuranceCalculator }))
  ),
  "long-term-care-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.LongTermCareCalculator }))
  ),
  "insurance-needs-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.InsuranceNeedsCalculator }))
  ),
  "whole-life-vs-term-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.WholeLifeVsTermCalculator }))
  ),
  "renters-insurance-calculator": dynamic(() =>
    import("@/components/calculators/InsuranceCalculators").then((m) => ({ default: m.RentersInsuranceCalculator }))
  ),
};

export function generateStaticParams() {
  return getToolsByCategory("insurance").map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  return generateToolMetadata(tool, "insurance");
}

export default async function InsuranceToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const category = getCategoryBySlug("insurance");
  if (!tool || !category || tool.category !== "insurance") notFound();

  const Calculator = calculators[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Calculator ? <Calculator /> : null}
    </ToolPageLayout>
  );
}
