"use client";

import React, { useState, useMemo } from "react";
import { calculateMortgage } from "@/lib/calculators/mortgage";
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

const DEFAULTS = {
  homePrice: 400000,
  downPayment: 80000,
  interestRate: 6.5,
  loanTermYears: 30,
  propertyTaxPerYear: 4800,
  homeInsurancePerYear: 1800,
  hoaPerMonth: 0,
  pmiRate: 0.5,
};

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(DEFAULTS.homePrice);
  const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);
  const [interestRate, setInterestRate] = useState(DEFAULTS.interestRate);
  const [loanTermYears, setLoanTermYears] = useState(DEFAULTS.loanTermYears);
  const [propertyTaxPerYear, setPropertyTaxPerYear] = useState(DEFAULTS.propertyTaxPerYear);
  const [homeInsurancePerYear, setHomeInsurancePerYear] = useState(DEFAULTS.homeInsurancePerYear);
  const [hoaPerMonth, setHoaPerMonth] = useState(DEFAULTS.hoaPerMonth);
  const [pmiRate, setPmiRate] = useState(DEFAULTS.pmiRate);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const results = useMemo(
    () =>
      calculateMortgage({
        homePrice,
        downPayment,
        interestRate,
        loanTermYears,
        propertyTaxPerYear,
        homeInsurancePerYear,
        hoaPerMonth,
        pmiRate,
      }),
    [homePrice, downPayment, interestRate, loanTermYears, propertyTaxPerYear, homeInsurancePerYear, hoaPerMonth, pmiRate]
  );

  const breakdownItems = useMemo(() => {
    const items = [
      { label: "Principal & Interest", value: results.principalAndInterest, color: "bg-blue-500" },
      { label: "Property Tax", value: results.monthlyPropertyTax, color: "bg-amber-500" },
      { label: "Insurance", value: results.monthlyInsurance, color: "bg-emerald-500" },
    ];
    if (results.monthlyHOA > 0) {
      items.push({ label: "HOA", value: results.monthlyHOA, color: "bg-purple-500" });
    }
    if (results.monthlyPMI > 0) {
      items.push({ label: "PMI", value: results.monthlyPMI, color: "bg-rose-500" });
    }
    return items;
  }, [results]);

  const visibleSchedule = showFullSchedule
    ? results.amortizationSchedule
    : results.amortizationSchedule.slice(0, 5);

  function resetDefaults() {
    setHomePrice(DEFAULTS.homePrice);
    setDownPayment(DEFAULTS.downPayment);
    setInterestRate(DEFAULTS.interestRate);
    setLoanTermYears(DEFAULTS.loanTermYears);
    setPropertyTaxPerYear(DEFAULTS.propertyTaxPerYear);
    setHomeInsurancePerYear(DEFAULTS.homeInsurancePerYear);
    setHoaPerMonth(DEFAULTS.hoaPerMonth);
    setPmiRate(DEFAULTS.pmiRate);
    setShowFullSchedule(false);
  }

  const inputs = (
    <>
      <NumberInput
        label="Home Price"
        value={homePrice}
        onChange={setHomePrice}
        prefix="$"
        min={50000}
        max={2000000}
        step={5000}
        showSlider
      />

      <NumberInput
        label="Down Payment"
        value={downPayment}
        onChange={setDownPayment}
        prefix="$"
        min={0}
        max={homePrice}
        step={1000}
        showSlider
        helpText={`${((downPayment / homePrice) * 100).toFixed(1)}% of home price`}
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
          <SelectTrigger aria-label="Loan term">
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
        label="Property Tax (per year)"
        value={propertyTaxPerYear}
        onChange={setPropertyTaxPerYear}
        prefix="$"
        min={0}
        max={50000}
        step={100}
      />

      <NumberInput
        label="Home Insurance (per year)"
        value={homeInsurancePerYear}
        onChange={setHomeInsurancePerYear}
        prefix="$"
        min={0}
        max={20000}
        step={100}
      />

      <NumberInput
        label="HOA (per month)"
        value={hoaPerMonth}
        onChange={setHoaPerMonth}
        prefix="$"
        min={0}
        max={5000}
        step={25}
      />

      <NumberInput
        label="PMI Rate (annual %)"
        value={pmiRate}
        onChange={setPmiRate}
        prefix="%"
        min={0}
        max={3}
        step={0.1}
        helpText={downPayment / homePrice >= 0.2 ? "Not applied (down payment >= 20%)" : undefined}
      />

      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">
        Reset to defaults
      </Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard
        label="Monthly Payment"
        value={formatCurrency(results.monthlyPayment)}
        size="large"
      />

      <div className="grid grid-cols-3 gap-4">
        <ResultCard
          label="Loan Amount"
          value={formatCurrency(results.loanAmount)}
          size="small"
          variant="neutral"
        />
        <ResultCard
          label="Total Interest"
          value={formatCurrency(results.totalInterestPaid)}
          size="small"
          variant="accent"
        />
        <ResultCard
          label="Total Paid"
          value={formatCurrency(results.totalAmountPaid)}
          size="small"
          variant="neutral"
        />
      </div>

      <BreakdownBar items={breakdownItems} formatValue={formatCurrency} />

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-700">Amortization Schedule</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 ">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-3 py-2 text-left font-medium">Month</th>
                <th className="px-3 py-2 text-right font-medium">Payment</th>
                <th className="px-3 py-2 text-right font-medium">Principal</th>
                <th className="px-3 py-2 text-right font-medium">Interest</th>
                <th className="px-3 py-2 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleSchedule.map((row) => (
                <tr key={row.month} className="hover:bg-gray-50">
                  <td className="px-3 py-2 tabular-nums">{row.month}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.payment)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.principal)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.interest)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {results.amortizationSchedule.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullSchedule((prev) => !prev)}
            className="w-full"
          >
            {showFullSchedule ? "Show less" : "View full schedule"}
          </Button>
        )}
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
