import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";
import { generateToolMetadata } from "@/lib/tool-page-helpers";

// Only import tax calculators — code-split per category
const calculators: Record<string, ReturnType<typeof dynamic>> = {
  "income-tax-calculator-2026": dynamic(() =>
    import("@/components/calculators/TaxCalculator").then((m) => ({ default: m.TaxCalculator }))
  ),
  "capital-gains-tax-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.CapitalGainsTaxCalculator }))
  ),
  "sales-tax-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.SalesTaxCalculator }))
  ),
  "property-tax-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.PropertyTaxCalculator }))
  ),
  "tax-bracket-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.TaxBracketCalculator }))
  ),
  "self-employment-tax-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.SelfEmploymentTaxCalculator }))
  ),
  "estate-tax-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.EstateTaxCalculator }))
  ),
  "gift-tax-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.GiftTaxCalculator }))
  ),
  "tax-withholding-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.TaxWithholdingCalculator }))
  ),
  "quarterly-tax-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.QuarterlyTaxCalculator }))
  ),
  "tax-refund-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.TaxRefundCalculator }))
  ),
  "amt-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.AmtCalculator }))
  ),
  "tax-deduction-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.TaxDeductionCalculator }))
  ),
  "earned-income-credit-calculator": dynamic(() =>
    import("@/components/calculators/TaxCalculators").then((m) => ({ default: m.EarnedIncomeCalculator }))
  ),
};

export function generateStaticParams() {
  return getToolsByCategory("tax").map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  return generateToolMetadata(tool, "tax");
}

export default async function TaxToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const category = getCategoryBySlug("tax");
  if (!tool || !category || tool.category !== "tax") notFound();

  const Calculator = calculators[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Calculator ? <Calculator /> : null}
    </ToolPageLayout>
  );
}
