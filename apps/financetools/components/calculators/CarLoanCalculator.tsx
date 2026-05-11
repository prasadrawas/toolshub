"use client";

import React, { useState, useMemo } from "react";
import { calculateCarLoan } from "@/lib/calculators/auto";
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
  vehiclePrice: 35000,
  downPayment: 5000,
  tradeInValue: 0,
  interestRate: 5.9,
  loanTermMonths: 60,
  salesTaxRate: 6,
};

export function CarLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState(DEFAULTS.vehiclePrice);
  const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);
  const [tradeInValue, setTradeInValue] = useState(DEFAULTS.tradeInValue);
  const [interestRate, setInterestRate] = useState(DEFAULTS.interestRate);
  const [loanTermMonths, setLoanTermMonths] = useState(DEFAULTS.loanTermMonths);
  const [salesTaxRate, setSalesTaxRate] = useState(DEFAULTS.salesTaxRate);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const results = useMemo(
    () =>
      calculateCarLoan({
        vehiclePrice,
        downPayment,
        tradeInValue,
        interestRate,
        loanTermMonths,
        salesTaxRate,
      }),
    [vehiclePrice, downPayment, tradeInValue, interestRate, loanTermMonths, salesTaxRate]
  );

  const salesTax = useMemo(() => {
    const taxableAmount = Math.max(0, vehiclePrice - tradeInValue);
    return taxableAmount * (salesTaxRate / 100);
  }, [vehiclePrice, tradeInValue, salesTaxRate]);

  const principalPortion = results.loanAmount - salesTax;

  const breakdownItems = useMemo(
    () => [
      { label: "Principal", value: Math.max(0, principalPortion), color: "bg-blue-500" },
      { label: "Interest", value: results.totalInterestPaid, color: "bg-amber-500" },
      { label: "Sales Tax", value: salesTax, color: "bg-emerald-500" },
    ],
    [principalPortion, results.totalInterestPaid, salesTax]
  );

  const visibleSchedule = showFullSchedule
    ? results.amortizationSchedule
    : results.amortizationSchedule.slice(0, 5);

  function resetDefaults() {
    setVehiclePrice(DEFAULTS.vehiclePrice);
    setDownPayment(DEFAULTS.downPayment);
    setTradeInValue(DEFAULTS.tradeInValue);
    setInterestRate(DEFAULTS.interestRate);
    setLoanTermMonths(DEFAULTS.loanTermMonths);
    setSalesTaxRate(DEFAULTS.salesTaxRate);
    setShowFullSchedule(false);
  }

  const inputs = (
    <>
      <NumberInput
        label="Vehicle Price"
        value={vehiclePrice}
        onChange={setVehiclePrice}
        prefix="$"
        min={5000}
        max={100000}
        step={500}
        showSlider
      />

      <NumberInput
        label="Down Payment"
        value={downPayment}
        onChange={setDownPayment}
        prefix="$"
        min={0}
        max={vehiclePrice}
        step={500}
        showSlider
        helpText={`${((downPayment / vehiclePrice) * 100).toFixed(1)}% of vehicle price`}
      />

      <NumberInput
        label="Trade-in Value"
        value={tradeInValue}
        onChange={setTradeInValue}
        prefix="$"
        min={0}
        max={vehiclePrice}
        step={500}
      />

      <NumberInput
        label="Interest Rate"
        value={interestRate}
        onChange={setInterestRate}
        prefix="%"
        min={0}
        max={20}
        step={0.1}
        showSlider
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Loan Term</label>
        <Select
          value={loanTermMonths.toString()}
          onValueChange={(val) => setLoanTermMonths(parseInt(val, 10))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24">24 months</SelectItem>
            <SelectItem value="36">36 months</SelectItem>
            <SelectItem value="48">48 months</SelectItem>
            <SelectItem value="60">60 months</SelectItem>
            <SelectItem value="72">72 months</SelectItem>
            <SelectItem value="84">84 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <NumberInput
        label="Sales Tax Rate"
        value={salesTaxRate}
        onChange={setSalesTaxRate}
        prefix="%"
        min={0}
        max={12}
        step={0.1}
        showSlider
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
          label="Total Cost"
          value={formatCurrency(results.totalCost)}
          size="small"
          variant="neutral"
        />
      </div>

      <BreakdownBar items={breakdownItems} formatValue={formatCurrency} />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Amortization Schedule</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100text-gray-600">
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
