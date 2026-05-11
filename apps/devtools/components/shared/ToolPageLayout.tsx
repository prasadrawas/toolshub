import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Tool } from "@/lib/data/tools";
import { type CategoryInfo } from "@/lib/data/categories";
import { getToolsByCategory } from "@/lib/data/tools";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AdSlot } from "@/components/shared/AdSlot";

interface ToolPageLayoutProps {
  tool: Tool;
  category: CategoryInfo;
  children: React.ReactNode;
}

export function ToolPageLayout({ tool, category, children }: ToolPageLayoutProps) {
  const relatedTools = getToolsByCategory(category.id)
    .filter((t) => t.id !== tool.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.name,
        description: tool.description,
        url: `https://usfinancetools.com/devtools/${category.slug}/${tool.slug}`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://usfinancetools.com/devtools",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category.name,
            item: `https://usfinancetools.com/devtools/${category.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.name,
            item: `https://usfinancetools.com/devtools/${category.slug}/${tool.slug}`,
          },
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
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl mb-2">
            {tool.name}
          </h1>
          <p className="text-lg text-violet-200">{tool.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">{children}</section>

        <AdSlot slot="leaderboard" className="my-10" />

        {/* SEO content */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight mb-4">
            About {tool.name}
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {tool.name} is a free, browser-based developer tool that lets you{" "}
              {tool.description.toLowerCase().replace(/\.$/, "")}.
              No sign-up required. Your data never leaves your device &mdash; everything is processed
              100% client-side for maximum privacy and security.
            </p>
          </div>
        </section>

        {/* Related tools */}
        {relatedTools.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight mb-4">
              Related {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedTools.map((t) => (
                <Link
                  key={t.id}
                  href={`/${category.slug}/${t.slug}`}
                  className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-soft hover:shadow-card-hover hover:border-brand/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <h3 className="font-medium text-gray-900 group-hover:text-brand transition-colors">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{t.description}</p>
                  <span className="mt-2 inline-flex items-center text-sm text-brand font-medium">
                    Open tool <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="in-article" className="mt-12" />
      </div>
    </>
  );
}
