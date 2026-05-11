import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about USFinanceTools — free financial calculators for smarter money decisions.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-h1 text-gray-900 mb-6">About USFinanceTools</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <p>
          USFinanceTools is a free, comprehensive suite of financial calculators designed to help Americans
          make smarter money decisions. Whether you are buying a home, planning for retirement,
          managing debt, or estimating your taxes, our tools provide accurate, easy-to-understand
          results — no sign-up required.
        </p>

        <h2 className="text-h2 text-gray-900 mt-10">Our Mission</h2>
        <p>
          We believe everyone deserves access to reliable financial tools. Complex financial
          decisions should not require expensive advisors or confusing spreadsheets. USFinanceTools puts
          professional-grade calculators in your hands, completely free.
        </p>

        <h2 className="text-h2 text-gray-900 mt-10">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>112 free financial calculators across 8 categories</li>
          <li>Mortgage, retirement, tax, investing, debt, auto, insurance, and real estate tools</li>
          <li>State-specific calculations for all 50 US states</li>
          <li>Updated for 2026 tax brackets, rates, and contribution limits</li>
          <li>No account required — just open and calculate</li>
        </ul>

        <h2 className="text-h2 text-gray-900 mt-10">Accuracy & Methodology</h2>
        <p>
          Our calculators use industry-standard formulas and are regularly updated to reflect the
          latest IRS tax brackets, federal rates, and financial benchmarks. While we strive for
          accuracy, our tools are for informational purposes only and should not be considered
          professional financial advice.
        </p>
      </div>
    </div>
  );
}
