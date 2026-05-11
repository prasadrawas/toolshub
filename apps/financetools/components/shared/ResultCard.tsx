import React from "react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  label: string;
  value: string;
  size?: "large" | "medium" | "small";
  variant?: "primary" | "accent" | "danger" | "neutral";
  className?: string;
}

export function ResultCard({
  label,
  value,
  size = "medium",
  variant = "primary",
  className,
}: ResultCardProps) {
  const colorMap = {
    primary: "text-brand",
    accent: "text-accent",
    danger: "text-danger",
    neutral: "text-gray-900",
  };

  const sizeMap = {
    large: "text-3xl sm:text-4xl",
    medium: "text-xl sm:text-2xl",
    small: "text-lg",
  };

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p
        className={cn(
          "font-semibold tabular-nums transition-all duration-300",
          colorMap[variant],
          sizeMap[size]
        )}
      >
        {value}
      </p>
    </div>
  );
}
