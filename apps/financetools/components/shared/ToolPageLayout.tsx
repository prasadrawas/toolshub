import React from "react";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { type Tool } from "@/lib/data/tools";
import { type CategoryInfo } from "@/lib/data/categories";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { FAQSection } from "@/components/shared/FAQSection";
import { AdSlot } from "@/components/shared/AdSlot";
import { ActionButtons } from "@/components/shared/ActionButtons";
import {
  getHowToSteps,
  getResultsExplanation,
  getTips,
  getFAQs,
} from "@/lib/seo-content";

interface ToolPageLayoutProps {
  tool: Tool;
  category: CategoryInfo;
  children: React.ReactNode; // The calculator component
}

export function ToolPageLayout({ tool, category, children }: ToolPageLayoutProps) {
  const howToSteps = getHowToSteps(category.id);
  const resultsExplanation = getResultsExplanation(category.id);
  const tips = getTips(category.id);
  const faqs = getFAQs(category.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.name,
        description: tool.description,
        url: `https://usfinancetools.com/${category.slug}/${tool.slug}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://usfinancetools.com" },
          { "@type": "ListItem", position: 2, name: `${category.name} Calculators`, item: `https://usfinancetools.com/${category.slug}` },
          { "@type": "ListItem", position: 3, name: tool.name, item: `https://usfinancetools.com/${category.slug}/${tool.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative hero-gradient overflow-hidden py-12">
        <div className="mesh-orb w-[250px] h-[250px] bg-violet-400 top-[-80px] right-[-50px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: category.name, href: `/${category.slug}` },
              { label: tool.name },
            ]}
            variant="light"
          />
          <h1 className="font-display text-h1 text-white mb-2">{tool.name}</h1>
          <p className="text-lg text-violet-200">{tool.description}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-medium text-violet-200">
            <CalendarDays className="h-3.5 w-3.5" />
            Updated May 2026
          </span>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {tool.isBuilt ? (
          <section className="mb-8">{children}</section>
        ) : (
          <section className="mb-8 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <div className="mx-auto max-w-md">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <p className="text-sm text-gray-500">
                Check back soon or explore our other{" "}
                <Link href={`/${category.slug}`} className="text-brand hover:underline">
                  {category.name.toLowerCase()} calculators
                </Link>.
              </p>
            </div>
          </section>
        )}

        <ActionButtons />
        <AdSlot slot="leaderboard" className="my-10" />

        {tool.isBuilt && (
          <>
            <section className="mb-10">
              <h2 className="font-display text-h2 text-gray-900 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                {howToSteps.map((step, i) => (
                  <li key={i} className="leading-relaxed pl-2">{step}</li>
                ))}
              </ol>
            </section>
            <section className="mb-10">
              <h2 className="font-display text-h2 text-gray-900 mb-4">Understanding Your Results</h2>
              <p className="text-gray-700 leading-relaxed">{resultsExplanation}</p>
            </section>
            <section className="mb-10">
              <h2 className="font-display text-h2 text-gray-900 mb-4">{category.name} Tips</h2>
              <div className="space-y-4">
                {tips.map((tip, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <FAQSection faqs={faqs} />
        <RelatedTools toolIds={tool.relatedTools} />
        <AdSlot slot="in-article" className="mt-12" />
      </div>
    </>
  );
}
