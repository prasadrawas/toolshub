import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the USFinanceTools team for questions, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-h1 text-gray-900 mb-6">Contact Us</h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          We would love to hear from you. Whether you have a question about our calculators,
          want to report an issue, or have a suggestion for a new tool, please reach out.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-h3 text-gray-900 mb-1">General Inquiries</h2>
            <p className="text-gray-600">
              For general questions and feedback, email us at{" "}
              <a href="mailto:hello@usfinancetools.com" className="text-brand hover:underline">
                hello@usfinancetools.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-h3 text-gray-900 mb-1">Bug Reports</h2>
            <p className="text-gray-600">
              Found a calculation error or a bug? Please let us know at{" "}
              <a href="mailto:support@usfinancetools.com" className="text-brand hover:underline">
                support@usfinancetools.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-h3 text-gray-900 mb-1">Partnerships & Advertising</h2>
            <p className="text-gray-600">
              For business inquiries, please contact{" "}
              <a href="mailto:partners@usfinancetools.com" className="text-brand hover:underline">
                partners@usfinancetools.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
