import { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { CategoryPageContent } from "@/components/shared/CategoryPageContent";

const category = getCategoryBySlug("datetime")!;

export const metadata: Metadata = {
  title: category.seoTitle,
  description: category.seoDescription,
  alternates: { canonical: "/datetime" },
};

export default function DatetimePage() {
  return <CategoryPageContent category={category} />;
}
