import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md";
  className?: string;
}

function LogoIcon({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  return (
    <div className={cn(dim, "relative shrink-0")}>
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Rounded square background */}
        <rect width="36" height="36" rx="10" fill="url(#logo-gradient)" />

        {/* Rising bar chart bars */}
        <rect x="7" y="22" width="5" height="8" rx="1.5" fill="white" opacity="0.5" />
        <rect x="15.5" y="16" width="5" height="14" rx="1.5" fill="white" opacity="0.7" />
        <rect x="24" y="9" width="5" height="21" rx="1.5" fill="white" />

        {/* Upward trend line */}
        <path
          d="M8 26L17 18L24 21L30 11"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Arrow tip on trend line */}
        <path
          d="M27 10.5L30 11L29.5 14"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* US accent — small star */}
        <circle cx="8.5" cy="7" r="2" fill="white" opacity="0.3" />

        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED" />
            <stop offset="0.5" stopColor="#6D28D9" />
            <stop offset="1" stopColor="#4C1D95" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function Logo({ variant = "default", size = "md", className }: LogoProps) {
  const isLight = variant === "light";
  const textSize = size === "sm" ? "text-base" : "text-xl";

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoIcon size={size} />
      <span className={cn("font-display font-bold tracking-tight", textSize)}>
        <span className={isLight ? "text-brand-300" : "text-brand-600"}>US</span>
        <span className={isLight ? "text-white" : "text-gray-900"}>Finance</span>
        <span className={isLight ? "text-brand-300" : "text-brand-600"}>Tools</span>
      </span>
    </span>
  );
}
