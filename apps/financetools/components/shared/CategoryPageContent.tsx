import Link from "next/link";
import { ArrowRight, Flame, Clock } from "lucide-react";
import { type CategoryInfo } from "@/lib/data/categories";
import { getToolsByCategory, type Category } from "@/lib/data/tools";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AdSlot } from "@/components/shared/AdSlot";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

export function CategoryPageContent({ category }: { category: CategoryInfo }) {
  const tools = getToolsByCategory(category.id as Category);
  const popularTools = tools.filter((t) => t.isPopular);
  const hasPopular = popularTools.length > 0;

  return (
    <>
      <section className="relative hero-gradient overflow-hidden py-14">
        <div className="mesh-orb w-[300px] h-[300px] bg-violet-400 top-[-100px] right-[-50px]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: category.name }]} variant="light" />
          <h1 className="font-display text-h1 text-white mb-3">{category.name} Calculators</h1>
          <p className="text-lg text-violet-200 max-w-3xl">{category.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {hasPopular && (
          <section className="mb-12">
            <h2 className="font-display text-h2 text-gray-900 mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Most Popular
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/${category.slug}/${tool.slug}`}
                  className="group relative rounded-2xl border border-brand/20 bg-brand-50/50 p-5 shadow-soft hover:shadow-card-hover hover:border-brand/40 transition-all"
                >
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                    <Flame className="h-3 w-3" /> Popular
                  </span>
                  <h3 className="font-display font-semibold text-gray-900 group-hover:text-brand transition-colors pr-16">{tool.name}</h3>
                  <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">{tool.description}</p>
                  <span className="mt-3 inline-flex items-center text-sm text-brand font-medium">Calculate <ArrowRight className="ml-1 h-3 w-3" /></span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="leaderboard" className="mb-10" />

        <section className="mb-12">
          <h2 className="font-display text-h2 text-gray-900 mb-4">All {category.name} Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/${category.slug}/${tool.slug}`}
                className="group relative rounded-2xl border border-gray-200/80 bg-white p-5 shadow-soft hover:shadow-card-hover hover:border-brand/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start gap-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-brand transition-colors flex-1">{tool.name}</h3>
                  <div className="flex gap-1.5 shrink-0">
                    {tool.isPopular && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                        <Flame className="h-3 w-3" /> Popular
                      </span>
                    )}
                    {!tool.isBuilt && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        <Clock className="h-3 w-3" /> Coming soon
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                <span className="mt-3 inline-flex items-center text-sm text-brand font-medium">
                  {tool.isBuilt ? "Calculate" : "Learn more"} <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {category.id === "mortgage" && (
          <section className="mb-12 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-display text-h2 text-gray-900 mb-4">Mortgage Calculators by State</h2>
            <p className="text-sm text-gray-600 mb-4">Mortgage rates, property taxes, and insurance costs vary by state. Use our mortgage calculator and adjust rates for your location.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {US_STATES.map((state) => (
                <Link key={state} href="/mortgage/mortgage-payment-calculator" className="text-sm text-gray-700 hover:text-brand transition-colors">{state}</Link>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="rectangle" className="mt-8" />
      </div>
    </>
  );
}
