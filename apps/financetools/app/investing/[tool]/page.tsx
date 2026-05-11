import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";
import { generateToolMetadata } from "@/lib/tool-page-helpers";

// Only import investing calculators — code-split per category
const calculators: Record<string, ReturnType<typeof dynamic>> = {
  "compound-interest-calculator": dynamic(() =>
    import("@/components/calculators/CompoundInterestCalculator").then((m) => ({ default: m.CompoundInterestCalculator }))
  ),
  "investment-return-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.InvestmentReturnCalculator }))
  ),
  "stock-return-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.StockReturnCalculator }))
  ),
  "bond-yield-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.BondYieldCalculator }))
  ),
  "dividend-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.DividendCalculator }))
  ),
  "dollar-cost-averaging-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.DollarCostAveragingCalculator }))
  ),
  "portfolio-rebalancing-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.PortfolioRebalancingCalculator }))
  ),
  "real-return-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.RealReturnCalculator }))
  ),
  "index-fund-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.IndexFundCalculator }))
  ),
  "etf-expense-ratio-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.EtfExpenseRatioCalculator }))
  ),
  "rule-of-72-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.RuleOf72Calculator }))
  ),
  "investment-growth-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.InvestmentGrowthCalculator }))
  ),
  "stock-profit-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.StockProfitCalculator }))
  ),
  "mutual-fund-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.MutualFundCalculator }))
  ),
  "cd-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.CdCalculator }))
  ),
  "savings-goal-calculator": dynamic(() =>
    import("@/components/calculators/InvestingCalculators").then((m) => ({ default: m.SavingsGoalCalculator }))
  ),
};

export function generateStaticParams() {
  return getToolsByCategory("investing").map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  return generateToolMetadata(tool, "investing");
}

export default async function InvestingToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const category = getCategoryBySlug("investing");
  if (!tool || !category || tool.category !== "investing") notFound();

  const Calculator = calculators[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Calculator ? <Calculator /> : null}
    </ToolPageLayout>
  );
}
