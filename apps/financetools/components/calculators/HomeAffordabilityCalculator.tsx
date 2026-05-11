"use client";

import React, { useState, useMemo } from "react";
import { CalculatorShell } from "@/components/shared/CalculatorShell";
import { ResultCard } from "@/components/shared/ResultCard";
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

const DEFAULTS = {
  annualIncome: 85000,
  monthlyDebts: 500,
  downPayment: 60000,
  interestRate: 6.5,
  loanTermYears: 30,
  propertyTaxRate: 1.2,
  insuranceRate: 0.35,
};

export function HomeAffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState(DEFAULTS.annualIncome);
  const [monthlyDebts, setMonthlyDebts] = useState(DEFAULTS.monthlyDebts);
  const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);
  const [interestRate, setInterestRate] = useState(DEFAULTS.interestRate);
  const [loanTermYears, setLoanTermYears] = useState(DEFAULTS.loanTermYears);
  const [propertyTaxRate, setPropertyTaxRate] = useState(DEFAULTS.propertyTaxRate);
  const [insuranceRate, setInsuranceRate] = useState(DEFAULTS.insuranceRate);

  const results = useMemo(() => {
    const monthlyGross = annualIncome / 12;

    // 28/36 DTI rule
    const frontEndLimit = monthlyGross * 0.28;
    const backEndLimit = monthlyGross * 0.36;

    // Max monthly housing payment is the lesser of:
    // - 28% of monthly income (front-end)
    // - 36% of monthly income minus existing debts (back-end)
    const maxMonthlyPayment = Math.min(frontEndLimit, backEndLimit - monthlyDebts);

    // Monthly rate and total months
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTermYears * 12;

    // We need to reverse-engineer the max loan amount.
    // The max monthly payment includes P&I + tax + insurance.
    // Tax and insurance are proportional to home price, which is loan + down payment.
    // Let L = loan amount, then home price = L + downPayment
    // Monthly tax = (L + downPayment) * propertyTaxRate / 100 / 12
    // Monthly insurance = (L + downPayment) * insuranceRate / 100 / 12
    // Monthly P&I = L * [r(1+r)^n] / [(1+r)^n - 1]
    //
    // maxMonthlyPayment = P&I + monthlyTax + monthlyInsurance
    // maxMonthlyPayment = L * piRate + (L + downPayment) * (propertyTaxRate + insuranceRate) / 100 / 12
    // maxMonthlyPayment = L * piRate + L * tiRate + downPayment * tiRate
    // maxMonthlyPayment - downPayment * tiRate = L * (piRate + tiRate)
    // L = (maxMonthlyPayment - downPayment * tiRate) / (piRate + tiRate)

    let piRate: number; // P&I factor per dollar of loan
    if (monthlyRate === 0) {
      piRate = 1 / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      piRate = (monthlyRate * factor) / (factor - 1);
    }

    const tiRate = (propertyTaxRate + insuranceRate) / 100 / 12;

    const maxLoanAmount = Math.max(
      0,
      (maxMonthlyPayment - downPayment * tiRate) / (piRate + tiRate)
    );

    const maxHomePrice = maxLoanAmount + downPayment;

    // Estimated monthly payment breakdown at max home price
    const estimatedPI = maxLoanAmount * piRate;
    const estimatedMonthlyTax = maxHomePrice * propertyTaxRate / 100 / 12;
    const estimatedMonthlyInsurance = maxHomePrice * insuranceRate / 100 / 12;
    const estimatedMonthlyPayment = estimatedPI + estimatedMonthlyTax + estimatedMonthlyInsurance;

    // Actual DTI ratios at this price
    const frontEndDTI = monthlyGross > 0 ? (estimatedMonthlyPayment / monthlyGross) * 100 : 0;
    const backEndDTI = monthlyGross > 0
      ? ((estimatedMonthlyPayment + monthlyDebts) / monthlyGross) * 100
      : 0;

    const downPaymentPercent = maxHomePrice > 0 ? (downPayment / maxHomePrice) * 100 : 0;

    return {
      maxHomePrice,
      maxLoanAmount,
      estimatedMonthlyPayment,
      downPaymentPercent,
      frontEndDTI,
      backEndDTI,
      maxMonthlyPayment: Math.max(0, maxMonthlyPayment),
    };
  }, [annualIncome, monthlyDebts, downPayment, interestRate, loanTermYears, propertyTaxRate, insuranceRate]);

  function resetDefaults() {
    setAnnualIncome(DEFAULTS.annualIncome);
    setMonthlyDebts(DEFAULTS.monthlyDebts);
    setDownPayment(DEFAULTS.downPayment);
    setInterestRate(DEFAULTS.interestRate);
    setLoanTermYears(DEFAULTS.loanTermYears);
    setPropertyTaxRate(DEFAULTS.propertyTaxRate);
    setInsuranceRate(DEFAULTS.insuranceRate);
  }

  function dtiColor(ratio: number): string {
    if (ratio < 28) return "bg-emerald-500";
    if (ratio <= 36) return "bg-amber-500";
    return "bg-red-500";
  }

  function dtiTextColor(ratio: number): string {
    if (ratio < 28) return "text-emerald-600";
    if (ratio <= 36) return "text-amber-600";
    return "text-red-600";
  }

  const inputs = (
    <>
      <NumberInput
        label="Annual Income"
        value={annualIncome}
        onChange={setAnnualIncome}
        prefix="$"
        min={10000}
        max={1000000}
        step={1000}
        showSlider
      />

      <NumberInput
        label="Monthly Debts (car, student loans, etc.)"
        value={monthlyDebts}
        onChange={setMonthlyDebts}
        prefix="$"
        min={0}
        max={20000}
        step={50}
        showSlider
      />

      <NumberInput
        label="Down Payment Available"
        value={downPayment}
        onChange={setDownPayment}
        prefix="$"
        min={0}
        max={1000000}
        step={1000}
        showSlider
      />

      <NumberInput
        label="Interest Rate"
        value={interestRate}
        onChange={setInterestRate}
        prefix="%"
        min={1}
        max={15}
        step={0.1}
        showSlider
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Loan Term</label>
        <Select
          value={loanTermYears.toString()}
          onValueChange={(val) => setLoanTermYears(parseInt(val, 10))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <NumberInput
        label="Property Tax Rate"
        value={propertyTaxRate}
        onChange={setPropertyTaxRate}
        prefix="%"
        min={0}
        max={5}
        step={0.1}
        helpText="Annual rate as % of home value"
      />

      <NumberInput
        label="Insurance Rate"
        value={insuranceRate}
        onChange={setInsuranceRate}
        prefix="%"
        min={0}
        max={3}
        step={0.05}
        helpText="Annual rate as % of home value"
      />

      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">
        Reset to defaults
      </Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard
        label="You can afford up to"
        value={formatCurrency(results.maxHomePrice)}
        size="large"
        variant="accent"
      />

      <div className="grid grid-cols-3 gap-4">
        <ResultCard
          label="Max Loan Amount"
          value={formatCurrency(results.maxLoanAmount)}
          size="small"
          variant="neutral"
        />
        <ResultCard
          label="Est. Monthly Payment"
          value={formatCurrency(results.estimatedMonthlyPayment)}
          size="small"
          variant="primary"
        />
        <ResultCard
          label="Down Payment"
          value={`${results.downPaymentPercent.toFixed(1)}%`}
          size="small"
          variant="neutral"
        />
      </div>

      {/* DTI Ratio Display */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-medium text-gray-700">Debt-to-Income Ratios</h3>

        {/* Front-end DTI */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Front-end DTI (housing only)</span>
            <span className={`font-semibold tabular-nums ${dtiTextColor(results.frontEndDTI)}`}>
              {results.frontEndDTI.toFixed(1)}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${dtiColor(results.frontEndDTI)}`}
              style={{ width: `${Math.min(results.frontEndDTI / 50 * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>0%</span>
            <span className="text-emerald-500">28%</span>
            <span className="text-amber-500">36%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Back-end DTI */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Back-end DTI (housing + debts)</span>
            <span className={`font-semibold tabular-nums ${dtiTextColor(results.backEndDTI)}`}>
              {results.backEndDTI.toFixed(1)}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${dtiColor(results.backEndDTI)}`}
              style={{ width: `${Math.min(results.backEndDTI / 50 * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>0%</span>
            <span className="text-emerald-500">28%</span>
            <span className="text-amber-500">36%</span>
            <span>50%</span>
          </div>
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
