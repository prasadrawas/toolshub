import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: "default" | "light";
}

export function Breadcrumb({ items, variant = "default" }: BreadcrumbProps) {
  const isLight = variant === "light";

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol
        className={cn(
          "flex items-center gap-1.5 text-sm flex-wrap",
          isLight ? "text-brand-200" : "text-gray-500"
        )}
      >
        <li>
          <Link
            href="/"
            className={cn(
              "flex items-center transition-colors",
              isLight ? "hover:text-white" : "hover:text-brand"
            )}
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight
              className={cn("h-3.5 w-3.5", isLight ? "text-brand-300" : "text-gray-300")}
            />
            {item.href ? (
              <Link
                href={item.href}
                className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-brand")}
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn("font-medium", isLight ? "text-white" : "text-gray-900")}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
