import React from "react";
import { cn } from "@/lib/utils";

type AdSlotType = "leaderboard" | "rectangle" | "in-article";

interface AdSlotProps {
  slot: AdSlotType;
  className?: string;
}

const dimensions: Record<AdSlotType, { width: string; height: string }> = {
  leaderboard: { width: "728px", height: "90px" },
  rectangle: { width: "300px", height: "250px" },
  "in-article": { width: "336px", height: "280px" },
};

export function AdSlot({ slot, className }: AdSlotProps) {
  const dim = dimensions[slot];

  return (
    <div
      className={cn(
        "no-print mx-auto flex items-center justify-center border border-dashed border-gray-300 bg-gray-50 rounded-lg text-gray-400 text-xs",
        className
      )}
      style={{
        maxWidth: dim.width,
        height: slot === "leaderboard" ? undefined : dim.height,
        minHeight: dim.height,
      }}
    >
      <span>Advertisement</span>
    </div>
  );
}
