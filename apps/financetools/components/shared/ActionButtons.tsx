"use client";

import React from "react";
import { Share2, Printer } from "lucide-react";

export function ActionButtons() {
  return (
    <div className="flex gap-3 mt-6 no-print">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: document.title,
              url: window.location.href,
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
          }
        }}
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        onClick={() => window.print()}
      >
        <Printer className="h-4 w-4" />
        Print
      </button>
    </div>
  );
}
