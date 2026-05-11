import { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { CategoryPageContent } from "@/components/shared/CategoryPageContent";

const category = getCategoryBySlug("image")!;

export const metadata: Metadata = {
  title: category.seoTitle,
  description: category.seoDescription,
  alternates: { canonical: "/image" },
};

export default function ImagePage() {
  return <CategoryPageContent category={category} />;
}
