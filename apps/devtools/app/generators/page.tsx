import { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { CategoryPageContent } from "@/components/shared/CategoryPageContent";

const category = getCategoryBySlug("generators")!;

export const metadata: Metadata = {
  title: category.seoTitle,
  description: category.seoDescription,
  alternates: { canonical: "/generators" },
};

export default function GeneratorsPage() {
  return <CategoryPageContent category={category} />;
}
