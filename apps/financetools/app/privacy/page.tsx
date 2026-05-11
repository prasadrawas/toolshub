import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "USFinanceTools privacy policy — how we handle your data and protect your privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-h1 text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Overview</h2>
          <p>
            USFinanceTools (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website
            usfinancetools.com. This Privacy Policy explains how we collect, use, and protect
            your information when you use our website and calculators.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Information We Collect</h2>
          <p>
            <strong>Calculator inputs:</strong> All calculator inputs are processed entirely in
            your browser. We do not collect, store, or transmit any financial data you enter into
            our calculators.
          </p>
          <p className="mt-3">
            <strong>Analytics data:</strong> We may collect anonymous usage data such as page views,
            browser type, and device information to improve our service. This data cannot be used
            to identify you personally.
          </p>
          <p className="mt-3">
            <strong>Cookies:</strong> We use essential cookies for website functionality and may use
            third-party cookies for analytics and advertising (Google AdSense). You can control
            cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Third-Party Services</h2>
          <p>
            We may use third-party services including Google Analytics for usage analytics and
            Google AdSense for advertising. These services have their own privacy policies
            governing how they collect and use data.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Data Security</h2>
          <p>
            Since all calculations happen client-side in your browser, your financial data never
            leaves your device. We do not have access to any numbers you enter into our calculators.
          </p>
        </section>

        <section>
          <h2 className="text-h2 text-gray-900 mb-3">Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@usfinancetools.com" className="text-brand hover:underline">
              privacy@usfinancetools.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
