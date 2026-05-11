"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/shared/SearchModal";
import { Logo } from "@/components/shared/Logo";

const navLinks = [
  { href: "/mortgage", label: "Mortgage" },
  { href: "/retirement", label: "Retirement" },
  { href: "/tax", label: "Tax" },
  { href: "/investing", label: "Investing" },
  { href: "/debt", label: "Debt" },
];

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`no-print sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-soft"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" aria-label="USFinanceTools Home">
                <Logo />
              </Link>
              <nav className="hidden md:flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3.5 py-2 text-sm font-medium rounded-lg transition-all text-gray-600 hover:text-brand-700 hover:bg-brand-50"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/auto"
                  className="px-3.5 py-2 text-sm font-medium rounded-lg transition-all text-gray-600 hover:text-brand-700 hover:bg-brand-50"
                  aria-label="More calculators including Auto, Insurance, and Real Estate"
                >
                  More Calculators
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Search calculators"
                className="rounded-xl"
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 pt-3 space-y-1 border-t border-gray-100">
              {[...navLinks, { href: "/auto", label: "Auto" }, { href: "/insurance", label: "Insurance" }, { href: "/real-estate", label: "Real Estate" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium rounded-xl text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
