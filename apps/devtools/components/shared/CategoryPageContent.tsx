import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type CategoryInfo } from "@/lib/data/categories";
import { getToolsByCategory, type Category } from "@/lib/data/tools";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AdSlot } from "@/components/shared/AdSlot";

export function CategoryPageContent({ category }: { category: CategoryInfo }) {
  const tools = getToolsByCategory(category.id as Category);

  return (
    <>
      <section className="relative hero-gradient overflow-hidden py-14">
        <div className="mesh-orb w-[300px] h-[300px] bg-violet-400 top-[-100px] right-[-50px]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: category.name }]} variant="light" />
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl mb-3">
            {category.name}
          </h1>
          <p className="text-lg text-violet-200 max-w-3xl">{category.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdSlot slot="leaderboard" className="mb-10" />

        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight mb-4">
            All {category.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/${category.slug}/${tool.slug}`}
                className="group relative rounded-2xl border border-gray-200/80 bg-white p-5 shadow-soft hover:shadow-card-hover hover:border-brand/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <h3 className="font-medium text-gray-900 group-hover:text-brand transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                <span className="mt-3 inline-flex items-center text-sm text-brand font-medium">
                  Open tool <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot slot="rectangle" className="mt-8" />
      </div>
    </>
  );
}
