import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";
import { generateToolMetadata } from "@/lib/tool-page-helpers";

// Only import real-estate calculators — code-split per category
const calculators: Record<string, ReturnType<typeof dynamic>> = {
  "rental-property-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.RentalPropertyCalculator }))
  ),
  "cap-rate-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.CapRateCalculator }))
  ),
  "cash-on-cash-return-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.CashOnCashReturnCalculator }))
  ),
  "rental-yield-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.RentalYieldCalculator }))
  ),
  "house-flipping-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.HouseFlippingCalculator }))
  ),
  "property-roi-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.PropertyRoiCalculator }))
  ),
  "real-estate-commission-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.RealEstateCommissionCalculator }))
  ),
  "rent-affordability-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.RentAffordabilityCalculator }))
  ),
  "property-appreciation-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.PropertyAppreciationCalculator }))
  ),
  "1031-exchange-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.TenThirtyOneExchangeCalculator }))
  ),
  "real-estate-investment-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.RealEstateInvestmentCalculator }))
  ),
  "vacancy-rate-calculator": dynamic(() =>
    import("@/components/calculators/RealEstateCalculators").then((m) => ({ default: m.VacancyRateCalculator }))
  ),
};

export function generateStaticParams() {
  return getToolsByCategory("real-estate").map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  return generateToolMetadata(tool, "real-estate");
}

export default async function RealEstateToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const category = getCategoryBySlug("real-estate");
  if (!tool || !category || tool.category !== "real-estate") notFound();

  const Calculator = calculators[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Calculator ? <Calculator /> : null}
    </ToolPageLayout>
  );
}
