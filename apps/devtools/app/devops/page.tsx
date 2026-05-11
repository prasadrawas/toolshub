import { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { CategoryPageContent } from "@/components/shared/CategoryPageContent";

const category = getCategoryBySlug("devops")!;

export const metadata: Metadata = {
  title: category.seoTitle,
  description: category.seoDescription,
  alternates: { canonical: "/devops" },
};

export default function DevopsPage() {
  return <CategoryPageContent category={category} />;
}
