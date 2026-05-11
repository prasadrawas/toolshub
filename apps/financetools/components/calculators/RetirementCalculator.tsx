"use client";

import React, { useState, useMemo } from "react";
import { calculateRetirement } from "@/lib/calculators/retirement";
import { CalculatorShell } from "@/components/shared/CalculatorShell";
import { ResultCard } from "@/components/shared/ResultCard";
import { NumberInput } from "@/components/shared/NumberInput";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DEFAULTS = {
  currentAge: 30,
  retirementAge: 65,
  currentSavings: 50000,
  monthlyContribution: 500,
  annualReturn: 7,
  inflationRate: 3,
};

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(DEFAULTS.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS.retirementAge);
  const [currentSavings, setCurrentSavings] = useState(DEFAULTS.currentSavings);
  const [monthlyContribution, setMonthlyContribution] = useState(DEFAULTS.monthlyContribution);
  const [annualReturn, setAnnualReturn] = useState(DEFAULTS.annualReturn);
  const [inflationRate, setInflationRate] = useState(DEFAULTS.inflationRate);

  const results = useMemo(
    () =>
      calculateRetirement({
        currentAge,
        retirementAge,
        currentSavings,
        monthlyContribution,
        annualReturn,
        inflationRate,
      }),
    [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn, inflationRate]
  );

  const chartData = useMemo(
    () =>
      results.yearByYearData.map((d) => ({
        age: d.age,
        balance: Math.round(d.balance),
      })),
    [results.yearByYearData]
  );

  const inputs = (
    <>
      <NumberInput
        label="Current Age"
        value={currentAge}
        onChange={setCurrentAge}
        min={18}
        max={80}
        step={1}
        suffix="years"
      />

      <NumberInput
        label="Retirement Age"
        value={retirementAge}
        onChange={setRetirementAge}
        min={currentAge + 1}
        max={100}
        step={1}
        suffix="years"
      />

      <NumberInput
        label="Current Savings"
        value={currentSavings}
        onChange={setCurrentSavings}
        prefix="$"
        min={0}
        max={10000000}
        step={1000}
      />

      <NumberInput
        label="Monthly Contribution"
        value={monthlyContribution}
        onChange={setMonthlyContribution}
        prefix="$"
        min={0}
        max={50000}
        step={50}
      />

      <NumberInput
        label="Expected Annual Return"
        value={annualReturn}
        onChange={setAnnualReturn}
        prefix="%"
        min={1}
        max={15}
        step={0.1}
        showSlider
      />

      <NumberInput
        label="Inflation Rate"
        value={inflationRate}
        onChange={setInflationRate}
        prefix="%"
        min={0}
        max={8}
        step={0.1}
        showSlider
      />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard
        label="Projected Savings at Retirement"
        value={formatCurrency(results.projectedSavings)}
        size="large"
      />

      <div className="grid grid-cols-3 gap-4">
        <ResultCard
          label="Monthly Income (4% Rule)"
          value={formatCurrency(results.monthlyRetirementIncome)}
          size="small"
          variant="accent"
        />
        <ResultCard
          label="Total Contributions"
          value={formatCurrency(results.totalContributions)}
          size="small"
          variant="neutral"
        />
        <ResultCard
          label="Total Growth"
          value={formatCurrency(results.totalGrowth)}
          size="small"
          variant="neutral"
        />
      </div>

      <div className="flex items-center gap-2 rounded-lg border p-3">
        {results.isOnTrack ? (
          <>
            <svg
              className="h-5 w-5 flex-shrink-0 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-green-700">
              You are on track for retirement!
            </span>
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5 flex-shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-red-700">Not yet on track</p>
              <p className="text-gray-600">
                Additional monthly savings needed:{" "}
                <span className="font-semibold text-red-600">
                  {formatCurrency(results.additionalMonthlySavingsNeeded)}
                </span>
              </p>
            </div>
          </>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Balance Growth Over Time</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="age"
                tick={{ fontSize: 12 }}
                label={{ value: "Age", position: "insideBottom", offset: -2, fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`
                }
                tick={{ fontSize: 12 }}
                width={60}
              />
              {/* eslint-disable @typescript-eslint/no-explicit-any */}
              <Tooltip
                formatter={((value: any) => [formatCurrency(Number(value)), "Balance"]) as any}
                labelFormatter={((label: any) => `Age ${label}`) as any}
              />
              {/* eslint-enable @typescript-eslint/no-explicit-any */}
              <Area
                type="monotone"
                dataKey="balance"
                stroke="hsl(var(--brand))"
                fill="hsl(var(--brand-light))"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
