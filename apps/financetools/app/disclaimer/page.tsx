import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "USFinanceTools disclaimer — important information about the use of our financial calculators.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-h1 text-gray-900 mb-2">Disclaimer</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          The financial calculators and information provided on USFinanceTools (usfinancetools.com) are
          for informational and educational purposes only. They are not intended to provide
          financial, tax, legal, or investment advice.
        </p>

        <p>
          <strong>Results are estimates.</strong> The outputs of our calculators are based on the
          inputs you provide and standard financial formulas. Actual results may differ based on
          your specific financial situation, lender terms, tax circumstances, and other factors.
        </p>

        <p>
          <strong>Not a substitute for professional advice.</strong> You should consult with a
          qualified financial advisor, certified public accountant, tax professional, or other
          appropriate expert before making any financial decisions based on information from
          this website.
        </p>

        <p>
          <strong>Tax information.</strong> Tax brackets, rates, deductions, and other tax-related
          data used in our calculators are based on publicly available information and may not
          reflect the most recent changes to tax law. Always verify current tax information with
          the IRS or a tax professional.
        </p>

        <p>
          <strong>No guarantees.</strong> We make no representations or warranties about the
          accuracy, reliability, completeness, or timeliness of the content, calculators, or
          tools provided on this website.
        </p>

        <p>
          <strong>Use at your own risk.</strong> By using USFinanceTools, you acknowledge that you are
          using the calculators and information at your own risk and that USFinanceTools shall not be
          held liable for any decisions made or actions taken based on the information provided.
        </p>
      </div>
    </div>
  );
}
