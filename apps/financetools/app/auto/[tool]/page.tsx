import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";
import { generateToolMetadata } from "@/lib/tool-page-helpers";

// Only import auto calculators — code-split per category
const calculators: Record<string, ReturnType<typeof dynamic>> = {
  "car-loan-calculator": dynamic(() =>
    import("@/components/calculators/CarLoanCalculator").then((m) => ({ default: m.CarLoanCalculator }))
  ),
  "auto-lease-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.AutoLeaseCalculator }))
  ),
  "car-affordability-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.CarAffordabilityCalculator }))
  ),
  "vehicle-depreciation-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.VehicleDepreciationCalculator }))
  ),
  "gas-mileage-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.GasMileageCalculator }))
  ),
  "ev-savings-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.EvSavingsCalculator }))
  ),
  "car-insurance-estimator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.CarInsuranceEstimator }))
  ),
  "used-car-value-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.UsedCarValueCalculator }))
  ),
  "car-payment-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.CarPaymentCalculator }))
  ),
  "auto-refinance-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.AutoRefinanceCalculator }))
  ),
  "total-cost-of-ownership-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.TotalCostOfOwnershipCalculator }))
  ),
  "trade-in-value-calculator": dynamic(() =>
    import("@/components/calculators/AutoCalculators").then((m) => ({ default: m.TradeInValueCalculator }))
  ),
};

export function generateStaticParams() {
  return getToolsByCategory("auto").map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  return generateToolMetadata(tool, "auto");
}

export default async function AutoToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const category = getCategoryBySlug("auto");
  if (!tool || !category || tool.category !== "auto") notFound();

  const Calculator = calculators[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Calculator ? <Calculator /> : null}
    </ToolPageLayout>
  );
}
