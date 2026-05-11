"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface CalculatorShellProps {
  inputs: React.ReactNode;
  results: React.ReactNode;
}

export function CalculatorShell({ inputs, results }: CalculatorShellProps) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        <div className="p-6 space-y-5">{inputs}</div>
        <div className="p-6 bg-gray-50/50">{results}</div>
      </div>
    </Card>
  );
}
