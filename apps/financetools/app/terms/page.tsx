import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "USFinanceTools terms of service — rules and guidelines for using our financial calculators.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-h1 text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Acceptance of Terms</h2>
          <p>
            By accessing and using USFinanceTools (usfinancetools.com), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Use of Calculators</h2>
          <p>
            Our financial calculators are provided free of charge for informational and educational
            purposes only. The results produced by our calculators are estimates based on the inputs
            you provide and should not be relied upon as financial advice.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">No Financial Advice</h2>
          <p>
            USFinanceTools does not provide financial, tax, legal, or investment advice. The information
            and tools on this website are not a substitute for professional financial advice.
            Always consult with a qualified financial advisor, tax professional, or other
            appropriate expert before making financial decisions.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Accuracy</h2>
          <p>
            While we strive to keep our calculators accurate and up to date, we do not guarantee
            the accuracy, completeness, or timeliness of any information provided. Tax rates,
            interest rates, and other financial data may change without notice.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Limitation of Liability</h2>
          <p>
            USFinanceTools shall not be liable for any damages arising from the use or inability to use
            our calculators or the information provided on this website. This includes, but is not
            limited to, direct, indirect, incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be
            effective immediately upon posting to this page. Your continued use of the website
            constitutes acceptance of the modified terms.
          </p>
        </section>
      </div>
    </div>
  );
}
