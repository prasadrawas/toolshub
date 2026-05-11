"use client";

import React, { useState, useMemo } from "react";
import { calculateTax, type FilingStatus } from "@/lib/calculators/tax";
import { CalculatorShell } from "@/components/shared/CalculatorShell";
import { ResultCard } from "@/components/shared/ResultCard";
import { BreakdownBar } from "@/components/shared/BreakdownBar";
import { NumberInput } from "@/components/shared/NumberInput";
import { formatCurrency } from "@/lib/utils";
import { states } from "@/lib/data/states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const DEFAULTS = {
  filingStatus: "single" as FilingStatus,
  grossIncome: 75000,
  retirement401k: 6000,
  otherPreTaxDeductions: 0,
  state: "TX",
};

const BRACKET_COLORS = [
  "bg-emerald-200",
  "bg-emerald-300",
  "bg-yellow-200",
  "bg-yellow-300",
  "bg-orange-200",
  "bg-orange-300",
  "bg-red-300",
];

const BRACKET_ACTIVE_COLORS = [
  "bg-emerald-500",
  "bg-emerald-600",
  "bg-yellow-400",
  "bg-yellow-500",
  "bg-orange-400",
  "bg-orange-500",
  "bg-red-500",
];

export function TaxCalculator() {
  const [filingStatus, setFilingStatus] = useState<FilingStatus>(DEFAULTS.filingStatus);
  const [grossIncome, setGrossIncome] = useState(DEFAULTS.grossIncome);
  const [retirement401k, setRetirement401k] = useState(DEFAULTS.retirement401k);
  const [otherPreTaxDeductions, setOtherPreTaxDeductions] = useState(
    DEFAULTS.otherPreTaxDeductions
  );
  const [state, setState] = useState(DEFAULTS.state);

  const results = useMemo(
    () =>
      calculateTax({
        filingStatus,
        grossIncome,
        retirement401k,
        otherPreTaxDeductions,
        state,
      }),
    [filingStatus, grossIncome, retirement401k, otherPreTaxDeductions, state]
  );

  function resetDefaults() {
    setFilingStatus(DEFAULTS.filingStatus);
    setGrossIncome(DEFAULTS.grossIncome);
    setRetirement401k(DEFAULTS.retirement401k);
    setOtherPreTaxDeductions(DEFAULTS.otherPreTaxDeductions);
    setState(DEFAULTS.state);
  }

  const inputs = (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Filing Status</label>
        <Select
          value={filingStatus}
          onValueChange={(val) => setFilingStatus(val as FilingStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select filing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="mfj">Married Filing Jointly</SelectItem>
            <SelectItem value="mfs">Married Filing Separately</SelectItem>
            <SelectItem value="hoh">Head of Household</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <NumberInput
        label="Gross Income"
        value={grossIncome}
        onChange={setGrossIncome}
        prefix="$"
        min={0}
        max={500000}
        step={1000}
        showSlider
      />

      <NumberInput
        label="401(k) Contribution"
        value={retirement401k}
        onChange={setRetirement401k}
        prefix="$"
        min={0}
        max={23000}
        step={500}
        showSlider
      />

      <NumberInput
        label="Other Pre-Tax Deductions"
        value={otherPreTaxDeductions}
        onChange={setOtherPreTaxDeductions}
        prefix="$"
        min={0}
        max={50000}
        step={100}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">State</label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.name} ({s.code})
              </SelectItem>
            ))}
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
        label="Annual Take-Home Pay"
        value={formatCurrency(results.takeHomePay)}
        size="large"
        variant="accent"
      />

      <div className="grid grid-cols-2 gap-4">
        <ResultCard
          label="Monthly Take-Home"
          value={formatCurrency(results.monthlyTakeHome)}
          size="small"
          variant="neutral"
        />
        <ResultCard
          label="Federal Tax"
          value={formatCurrency(results.federalTax)}
          size="small"
          variant="neutral"
        />
        <ResultCard
          label="State Tax"
          value={formatCurrency(results.stateTax)}
          size="small"
          variant="neutral"
        />
        <ResultCard
          label="FICA Tax"
          value={formatCurrency(results.ficaTax)}
          size="small"
          variant="neutral"
        />
        <ResultCard
          label="Effective Tax Rate"
          value={`${results.effectiveTaxRate.toFixed(1)}%`}
          size="small"
          variant="primary"
        />
        <ResultCard
          label="Marginal Tax Rate"
          value={`${results.marginalTaxRate.toFixed(0)}%`}
          size="small"
          variant="primary"
        />
      </div>

      <BreakdownBar
        items={[
          { label: "Take-Home", value: Math.max(0, results.takeHomePay), color: "bg-emerald-400" },
          { label: "Federal Tax", value: results.federalTax, color: "bg-blue-400" },
          { label: "State Tax", value: results.stateTax, color: "bg-purple-400" },
          { label: "FICA", value: results.ficaTax, color: "bg-orange-400" },
        ]}
        formatValue={formatCurrency}
      />

      {/* Tax Bracket Visualization */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Federal Tax Brackets</h3>
        <div className="space-y-1.5">
          <div className="flex h-8 rounded-lg overflow-hidden">
            {results.brackets.map((bracket, i) => {
              const bracketMax = bracket.max ?? bracket.min * 2;
              const bracketWidth = bracketMax - bracket.min;
              const totalRange =
                (results.brackets[results.brackets.length - 1].max ??
                  results.brackets[results.brackets.length - 1].min * 1.5) -
                results.brackets[0].min;
              const widthPct = Math.max((bracketWidth / totalRange) * 100, 6);
              const isActive = bracket.taxableInThisBracket > 0;

              return (
                <div
                  key={i}
                  className={`relative flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    isActive ? BRACKET_ACTIVE_COLORS[i] : BRACKET_COLORS[i]
                  } ${isActive ? "text-white" : "text-gray-500"} ${
                    i === 0 ? "rounded-l-lg" : ""
                  } ${i === results.brackets.length - 1 ? "rounded-r-lg" : ""}`}
                  style={{ width: `${widthPct}%` }}
                  title={`${bracket.rate}% bracket: ${formatCurrency(bracket.min)}${
                    bracket.max ? ` - ${formatCurrency(bracket.max)}` : "+"
                  } | Tax: ${formatCurrency(bracket.taxInThisBracket)}`}
                >
                  {bracket.rate}%
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            {results.brackets.map((bracket, i) => {
              const isActive = bracket.taxableInThisBracket > 0;
              return (
                <div key={i} className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? BRACKET_ACTIVE_COLORS[i] : BRACKET_COLORS[i]
                    }`}
                  />
                  <span className={isActive ? "text-gray-900 font-medium" : ""}>
                    {bracket.rate}%
                    {isActive && `: ${formatCurrency(bracket.taxInThisBracket)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Standard deduction: {formatCurrency(results.standardDeduction)} | Taxable income:{" "}
          {formatCurrency(results.taxableIncome)}
        </p>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
