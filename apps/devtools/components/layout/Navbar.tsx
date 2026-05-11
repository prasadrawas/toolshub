"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Code2, Search, Menu, X } from "lucide-react";
import { SearchModal } from "@/components/shared/SearchModal";

const navLinks = [
  { href: "/formatters", label: "Formatters" },
  { href: "/converters", label: "Converters" },
  { href: "/encoders", label: "Encoders" },
  { href: "/generators", label: "Generators" },
  { href: "/text", label: "Text" },
];

const mobileLinks = [
  ...navLinks,
  { href: "/color", label: "Color" },
  { href: "/css", label: "CSS" },
  { href: "/image", label: "Image" },
  { href: "/datetime", label: "Date & Time" },
  { href: "/network", label: "Network" },
  { href: "/math", label: "Math" },
  { href: "/devops", label: "DevOps" },
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

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
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
              <Link href="/" className="flex items-center gap-2" aria-label="DevTools Home">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand text-white">
                  <Code2 className="h-4.5 w-4.5" />
                </div>
                <span className="font-display text-lg font-bold text-gray-900">DevTools</span>
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
                  href="/color"
                  className="px-3.5 py-2 text-sm font-medium rounded-lg transition-all text-gray-600 hover:text-brand-700 hover:bg-brand-50"
                  aria-label="More tools including Color, CSS, Image, and more"
                >
                  More
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search tools"
                className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-all"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <button
                className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 pt-3 space-y-1 border-t border-gray-100">
              {mobileLinks.map((link) => (
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
