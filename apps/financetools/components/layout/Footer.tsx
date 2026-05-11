import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

const footerLinks = {
  Calculators: [
    { href: "/mortgage", label: "Mortgage" },
    { href: "/retirement", label: "Retirement" },
    { href: "/tax", label: "Tax" },
    { href: "/investing", label: "Investing" },
    { href: "/debt", label: "Debt" },
    { href: "/auto", label: "Auto" },
    { href: "/insurance", label: "Insurance" },
    { href: "/real-estate", label: "Real Estate" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/methodology", label: "Our Methodology" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
  Resources: [
    { href: "/mortgage/mortgage-payment-calculator", label: "Mortgage Calculator" },
    { href: "/retirement/retirement-savings-calculator", label: "Retirement Calculator" },
    { href: "/investing/compound-interest-calculator", label: "Compound Interest" },
    { href: "/tax/income-tax-calculator-2026", label: "Tax Calculator" },
  ],
};

export function Footer() {
  return (
    <footer className="no-print bg-gray-950 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="USFinanceTools Home">
              <Logo variant="light" size="sm" />
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Free financial calculators for smarter money decisions. Accurate, updated, and easy to use.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-600 text-center">
            &copy; {new Date().getFullYear()} USFinanceTools. For informational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
