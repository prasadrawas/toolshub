import { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { CategoryPageContent } from "@/components/shared/CategoryPageContent";

const category = getCategoryBySlug("text")!;

export const metadata: Metadata = {
  title: category.seoTitle,
  description: category.seoDescription,
  alternates: { canonical: "/text" },
};

export default function TextPage() {
  return <CategoryPageContent category={category} />;
}
