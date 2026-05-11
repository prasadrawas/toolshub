import React from "react";
import Link from "next/link";
import { tools, type Tool } from "@/lib/data/tools";
import { ArrowRight } from "lucide-react";

interface RelatedToolsProps {
  toolIds: string[];
}

export function RelatedTools({ toolIds }: RelatedToolsProps) {
  const relatedTools = toolIds
    .map((id) => tools.find((t) => t.id === id))
    .filter((t): t is Tool => t !== undefined)
    .slice(0, 4);

  if (relatedTools.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-h2 text-gray-900 mb-6">Related Calculators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/${tool.category}/${tool.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-brand/30 transition-all"
          >
            <h3 className="font-medium text-gray-900 group-hover:text-brand transition-colors">
              {tool.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{tool.description}</p>
            <span className="mt-3 inline-flex items-center text-sm text-brand font-medium">
              Calculate <ArrowRight className="ml-1 h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
