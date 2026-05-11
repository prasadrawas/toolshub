"use client";

import React, { useState, useMemo } from "react";
import { calculateCompoundInterest } from "@/lib/calculators/investing";
import { CalculatorShell } from "@/components/shared/CalculatorShell";
import { ResultCard } from "@/components/shared/ResultCard";
import { BreakdownBar } from "@/components/shared/BreakdownBar";
import { NumberInput } from "@/components/shared/NumberInput";
import { formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type CompoundFrequency = "daily" | "monthly" | "annually";

const DEFAULTS = {
  principal: 10000,
  monthlyContribution: 200,
  annualRate: 7,
  years: 20,
  compoundFrequency: "monthly" as CompoundFrequency,
};

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(DEFAULTS.principal);
  const [monthlyContribution, setMonthlyContribution] = useState(DEFAULTS.monthlyContribution);
  const [annualRate, setAnnualRate] = useState(DEFAULTS.annualRate);
  const [years, setYears] = useState(DEFAULTS.years);
  const [compoundFrequency, setCompoundFrequency] = useState<CompoundFrequency>(
    DEFAULTS.compoundFrequency
  );

  const results = useMemo(
    () =>
      calculateCompoundInterest({
        principal,
        monthlyContribution,
        annualRate,
        years,
        compoundFrequency,
      }),
    [principal, monthlyContribution, annualRate, years, compoundFrequency]
  );

  const chartData = useMemo(
    () =>
      results.yearByYearData.map((d) => ({
        year: d.year,
        contributions: Math.round(d.contributions),
        interest: Math.round(d.interest),
      })),
    [results.yearByYearData]
  );

  const milestones = useMemo(() => {
    const items = [...results.milestones];

    // Add "balance doubles" milestone
    const doubleTarget = results.yearByYearData[0]?.contributions * 2;
    if (doubleTarget > 0) {
      const doubleYear = results.yearByYearData.find((d) => d.balance >= doubleTarget);
      if (doubleYear && doubleYear.year > 0) {
        items.push({ label: `Balance doubles`, year: doubleYear.year });
      }
    }

    items.sort((a, b) => a.year - b.year);
    return items;
  }, [results]);

  function resetDefaults() {
    setPrincipal(DEFAULTS.principal);
    setMonthlyContribution(DEFAULTS.monthlyContribution);
    setAnnualRate(DEFAULTS.annualRate);
    setYears(DEFAULTS.years);
    setCompoundFrequency(DEFAULTS.compoundFrequency);
  }

  const inputs = (
    <>
      <NumberInput
        label="Starting Balance"
        value={principal}
        onChange={setPrincipal}
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
        max={100000}
        step={50}
      />

      <NumberInput
        label="Annual Interest Rate"
        value={annualRate}
        onChange={setAnnualRate}
        prefix="%"
        min={1}
        max={20}
        step={0.1}
        showSlider
      />

      <NumberInput
        label="Investment Period"
        value={years}
        onChange={setYears}
        suffix="years"
        min={1}
        max={50}
        step={1}
        showSlider
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Compound Frequency</label>
        <Select
          value={compoundFrequency}
          onValueChange={(val) => setCompoundFrequency(val as CompoundFrequency)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">
        Reset to defaults
      </Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard
        label="Final Balance"
        value={formatCurrency(results.finalBalance)}
        size="large"
        variant="accent"
      />

      <div className="grid grid-cols-3 gap-4">
        <ResultCard
          label="Total Contributions"
          value={formatCurrency(results.totalContributions)}
          size="small"
          variant="neutral"
        />
        <ResultCard
          label="Total Interest Earned"
          value={formatCurrency(results.totalInterest)}
          size="small"
          variant="primary"
        />
        <ResultCard
          label="Interest % of Balance"
          value={`${results.interestPercentage.toFixed(1)}%`}
          size="small"
          variant="neutral"
        />
      </div>

      <BreakdownBar
        items={[
          { label: "Contributions", value: results.totalContributions, color: "bg-blue-200" },
          { label: "Interest Earned", value: results.totalInterest, color: "bg-[#185FA5]" },
        ]}
        formatValue={formatCurrency}
      />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Growth Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 1_000_000
                    ? `$${(v / 1_000_000).toFixed(1)}M`
                    : `$${(v / 1000).toFixed(0)}k`
                }
                tick={{ fontSize: 12 }}
                width={60}
              />
              {/* eslint-disable @typescript-eslint/no-explicit-any */}
              <Tooltip
                formatter={((value: any, name: any) => [
                  formatCurrency(Number(value)),
                  name === "contributions" ? "Contributions" : "Interest",
                ]) as any}
                labelFormatter={((label: any) => `Year ${label}`) as any}
              />
              {/* eslint-enable @typescript-eslint/no-explicit-any */}
              <Area
                type="monotone"
                dataKey="contributions"
                stackId="1"
                stroke="#8C5CF2"
                fill="#8C5CF2"
                name="contributions"
              />
              <Area
                type="monotone"
                dataKey="interest"
                stackId="1"
                stroke="#673DE6"
                fill="#673DE6"
                name="interest"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {milestones.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Milestones</h3>
          <div className="flex flex-wrap gap-2">
            {milestones.map((m, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200"
              >
                {m.label}: Year {m.year}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
