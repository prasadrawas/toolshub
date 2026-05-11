import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";
import { generateToolMetadata } from "@/lib/tool-page-helpers";

// Only import mortgage calculators — code-split per category
const calculators: Record<string, ReturnType<typeof dynamic>> = {
  "mortgage-payment-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculator").then((m) => ({ default: m.MortgageCalculator }))
  ),
  "how-much-house-can-i-afford": dynamic(() =>
    import("@/components/calculators/HomeAffordabilityCalculator").then((m) => ({ default: m.HomeAffordabilityCalculator }))
  ),
  "refinance-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.RefinanceCalculator }))
  ),
  "arm-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.ArmCalculator }))
  ),
  "fha-loan-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.FhaLoanCalculator }))
  ),
  "va-loan-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.VaLoanCalculator }))
  ),
  "mortgage-points-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.MortgagePointsCalculator }))
  ),
  "rent-vs-buy-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.RentVsBuyCalculator }))
  ),
  "heloc-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.HelocCalculator }))
  ),
  "home-equity-loan-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.HomeEquityLoanCalculator }))
  ),
  "15-year-mortgage-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.FifteenYearMortgageCalculator }))
  ),
  "biweekly-mortgage-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.BiweeklyMortgageCalculator }))
  ),
  "mortgage-amortization-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.MortgageAmortizationCalculator }))
  ),
  "closing-cost-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.ClosingCostCalculator }))
  ),
  "pmi-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.PmiCalculator }))
  ),
  "jumbo-loan-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.JumboLoanCalculator }))
  ),
  "second-mortgage-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.SecondMortgageCalculator }))
  ),
  "usda-loan-calculator": dynamic(() =>
    import("@/components/calculators/MortgageCalculators").then((m) => ({ default: m.UsdaLoanCalculator }))
  ),
};

export function generateStaticParams() {
  return getToolsByCategory("mortgage").map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  return generateToolMetadata(tool, "mortgage");
}

export default async function MortgageToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const category = getCategoryBySlug("mortgage");
  if (!tool || !category || tool.category !== "mortgage") notFound();

  const Calculator = calculators[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Calculator ? <Calculator /> : null}
    </ToolPageLayout>
  );
}
