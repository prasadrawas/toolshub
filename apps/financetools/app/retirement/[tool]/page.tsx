import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getToolBySlug, getToolsByCategory } from "@/lib/data/tools";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";
import { generateToolMetadata } from "@/lib/tool-page-helpers";

// Only import retirement calculators — code-split per category
const calculators: Record<string, ReturnType<typeof dynamic>> = {
  "retirement-savings-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculator").then((m) => ({ default: m.RetirementCalculator }))
  ),
  "401k-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.FourOhOneKCalculator }))
  ),
  "roth-ira-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.RothIraCalculator }))
  ),
  "traditional-ira-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.TraditionalIraCalculator }))
  ),
  "social-security-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.SocialSecurityCalculator }))
  ),
  "required-minimum-distribution-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.RmdCalculator }))
  ),
  "pension-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.PensionCalculator }))
  ),
  "early-retirement-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.EarlyRetirementCalculator }))
  ),
  "retirement-income-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.RetirementIncomeCalculator }))
  ),
  "catch-up-contribution-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.CatchUpContributionCalculator }))
  ),
  "annuity-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.AnnuityCalculator }))
  ),
  "403b-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.FourOhThreeBCalculator }))
  ),
  "sep-ira-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.SepIraCalculator }))
  ),
  "simple-ira-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.SimpleIraCalculator }))
  ),
  "retirement-withdrawal-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.RetirementWithdrawalCalculator }))
  ),
  "nest-egg-calculator": dynamic(() =>
    import("@/components/calculators/RetirementCalculators").then((m) => ({ default: m.NestEggCalculator }))
  ),
};

export function generateStaticParams() {
  return getToolsByCategory("retirement").map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  return generateToolMetadata(tool, "retirement");
}

export default async function RetirementToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  const category = getCategoryBySlug("retirement");
  if (!tool || !category || tool.category !== "retirement") notFound();

  const Calculator = calculators[tool.id];
  return (
    <ToolPageLayout tool={tool} category={category}>
      {Calculator ? <Calculator /> : null}
    </ToolPageLayout>
  );
}
