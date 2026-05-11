import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Methodology",
  description: "Learn how USFinanceTools calculators work — the formulas, data sources, and assumptions behind our tools.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-h1 text-gray-900 mb-6">Our Methodology</h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>
          Transparency matters when it comes to financial decisions. Here is how our calculators
          work and where the numbers come from.
        </p>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Mortgage Calculators</h2>
          <p>
            Our mortgage calculations use the standard amortization formula:
            M&nbsp;=&nbsp;P[r(1+r)<sup>n</sup>]/[(1+r)<sup>n</sup>-1], where P is the principal,
            r is the monthly interest rate, and n is the total number of payments. Property tax,
            insurance, HOA, and PMI are added to produce the total monthly payment (PITI).
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Tax Calculators</h2>
          <p>
            We use projected 2026 federal tax brackets based on IRS inflation adjustments.
            State tax rates are sourced from each state&apos;s department of revenue. FICA
            calculations include Social Security (6.2% on income up to $168,600), Medicare
            (1.45%), and the Additional Medicare Tax (0.9% on income over $200,000 for single filers).
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Retirement & Investment Calculators</h2>
          <p>
            Growth projections use compound interest with monthly contributions. The retirement
            calculator uses the 4% withdrawal rule for estimating sustainable retirement income.
            Default return rates are based on historical market averages but can be customized.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Debt Calculators</h2>
          <p>
            Our debt snowball and avalanche calculators simulate month-by-month payoff schedules.
            The snowball method targets the smallest balance first, while the avalanche method
            targets the highest interest rate. Both apply minimum payments to all debts and
            direct extra payments to the target debt.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Limitations</h2>
          <p>
            Our calculators provide estimates based on the inputs you provide and the assumptions
            described above. Actual results may vary based on lender terms, tax law changes,
            market conditions, and individual circumstances. These tools are for informational
            purposes only and do not constitute financial advice.
          </p>
        </section>
      </div>
    </div>
  );
}
