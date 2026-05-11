import React from "react";
import Link from "next/link";
import { Code2 } from "lucide-react";

const footerLinks = {
  Tools: [
    { href: "/formatters", label: "Formatters" },
    { href: "/converters", label: "Converters" },
    { href: "/encoders", label: "Encoders" },
    { href: "/generators", label: "Generators" },
    { href: "/text", label: "Text Tools" },
    { href: "/color", label: "Color Tools" },
    { href: "/css", label: "CSS Tools" },
    { href: "/image", label: "Image Tools" },
    { href: "/datetime", label: "Date & Time" },
    { href: "/network", label: "Network" },
    { href: "/math", label: "Math" },
    { href: "/devops", label: "DevOps" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  Popular: [
    { href: "/formatters/json-formatter", label: "JSON Formatter" },
    { href: "/generators/uuid-generator", label: "UUID Generator" },
    { href: "/encoders/base64-text-encoder", label: "Base64 Encoder" },
    { href: "/text/diff-checker", label: "Diff Checker" },
  ],
};

export function Footer() {
  return (
    <footer className="no-print bg-gray-950 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2" aria-label="DevTools Home">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand text-white">
                <Code2 className="h-4.5 w-4.5" />
              </div>
              <span className="font-display text-lg font-bold text-white">DevTools</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Free developer tools that run entirely in your browser. No backend, no tracking, no sign-up.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
                {title}
              </h3>
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
            &copy; {new Date().getFullYear()} DevTools. Free developer tools &mdash; no sign-up
            required.
          </p>
        </div>
      </div>
    </footer>
  );
}
