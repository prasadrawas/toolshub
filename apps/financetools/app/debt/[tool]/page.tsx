import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";
import { generateToolMetadata } from "@/lib/tool-page-helpers";

// Only import debt calculators — code-split per category
const calculators: Record<string, ReturnType<typeof dynamic>> = {
  "debt-snowball-calculator": dynamic(() =>
    import("@/components/calculators/DebtSnowballCalculator").then((m) => ({ default: m.DebtSnowballCalculator }))
  ),
  "debt-payoff-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.DebtPayoffCalculator }))
  ),
  "credit-card-payoff-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.CreditCardPayoffCalculator }))
  ),
  "debt-consolidation-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.DebtConsolidationCalculator }))
  ),
  "debt-avalanche-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.DebtAvalancheCalculator }))
  ),
  "personal-loan-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.PersonalLoanCalculator }))
  ),
  "student-loan-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.StudentLoanCalculator }))
  ),
  "student-loan-refinance-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.StudentLoanRefinanceCalculator }))
  ),
  "debt-to-income-ratio-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.DebtToIncomeCalculator }))
  ),
  "line-of-credit-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.LineOfCreditCalculator }))
  ),
  "balance-transfer-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.BalanceTransferCalculator }))
  ),
  "debt-management-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.DebtManagementCalculator }))
  ),
  "loan-comparison-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.LoanComparisonCalculator }))
  ),
  "payoff-date-calculator": dynamic(() =>
    import("@/components/calculators/DebtCalculators").then((m) => ({ default: m.PayoffDateCalculator }))
  ),
};

export function generateStaticParams() {
  return getToolsByCategory("debt").map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  return generateToolMetadata(tool, "debt");
}

export default async function DebtToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const category = getCategoryBySlug("debt");
  if (!tool || !category || tool.category !== "debt") notFound();

  const Calculator = calculators[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Calculator ? <Calculator /> : null}
    </ToolPageLayout>
  );
}
