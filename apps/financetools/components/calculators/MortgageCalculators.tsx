"use client";

import React, { useState, useMemo } from "react";
import { CalculatorShell } from "@/components/shared/CalculatorShell";
import { NumberInput } from "@/components/shared/NumberInput";
import { ResultCard } from "@/components/shared/ResultCard";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

/* ───────────────────────── helpers ───────────────────────── */

/** Standard mortgage payment: M = P[r(1+r)^n]/[(1+r)^n-1] */
function pmt(principal: number, annualRate: number, totalMonths: number): number {
  if (annualRate === 0) return principal / totalMonths;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
}

/* ═══════════════════════════════════════════════════════════
   1. RefinanceCalculator
   ═══════════════════════════════════════════════════════════ */

const REFINANCE_DEFAULTS = {
  currentBalance: 300000,
  currentRate: 7.0,
  currentPayment: 1996,
  remainingTerm: 25,
  newRate: 5.5,
  newTerm: 30,
  closingCosts: 5000,
};

export function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState(REFINANCE_DEFAULTS.currentBalance);
  const [currentRate, setCurrentRate] = useState(REFINANCE_DEFAULTS.currentRate);
  const [currentPayment, setCurrentPayment] = useState(REFINANCE_DEFAULTS.currentPayment);
  const [remainingTerm, setRemainingTerm] = useState(REFINANCE_DEFAULTS.remainingTerm);
  const [newRate, setNewRate] = useState(REFINANCE_DEFAULTS.newRate);
  const [newTerm, setNewTerm] = useState(REFINANCE_DEFAULTS.newTerm);
  const [closingCosts, setClosingCosts] = useState(REFINANCE_DEFAULTS.closingCosts);

  const results = useMemo(() => {
    const newMonthly = pmt(currentBalance, newRate, newTerm * 12);
    const monthlySavings = currentPayment - newMonthly;
    const breakEvenMonth = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;
    const totalCostCurrent = currentPayment * remainingTerm * 12;
    const totalCostNew = newMonthly * newTerm * 12 + closingCosts;
    const totalSavings = totalCostCurrent - totalCostNew;
    return { newMonthly, monthlySavings, totalSavings, breakEvenMonth, totalCostNew };
  }, [currentBalance, currentRate, currentPayment, remainingTerm, newRate, newTerm, closingCosts]);

  function resetDefaults() {
    setCurrentBalance(REFINANCE_DEFAULTS.currentBalance);
    setCurrentRate(REFINANCE_DEFAULTS.currentRate);
    setCurrentPayment(REFINANCE_DEFAULTS.currentPayment);
    setRemainingTerm(REFINANCE_DEFAULTS.remainingTerm);
    setNewRate(REFINANCE_DEFAULTS.newRate);
    setNewTerm(REFINANCE_DEFAULTS.newTerm);
    setClosingCosts(REFINANCE_DEFAULTS.closingCosts);
  }

  const inputs = (
    <>
      <NumberInput label="Current Loan Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={10000} max={2000000} step={5000} showSlider />
      <NumberInput label="Current Interest Rate" value={currentRate} onChange={setCurrentRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <NumberInput label="Current Monthly Payment" value={currentPayment} onChange={setCurrentPayment} prefix="$" min={100} max={20000} step={50} />
      <NumberInput label="Remaining Term (years)" value={remainingTerm} onChange={setRemainingTerm} min={1} max={30} step={1} showSlider />
      <NumberInput label="New Interest Rate" value={newRate} onChange={setNewRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">New Loan Term</label>
        <Select value={newTerm.toString()} onValueChange={(v) => setNewTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Closing Costs" value={closingCosts} onChange={setClosingCosts} prefix="$" min={0} max={30000} step={500} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="New Monthly Payment" value={formatCurrency(results.newMonthly)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Savings" value={formatCurrency(results.monthlySavings)} size="small" variant={results.monthlySavings > 0 ? "accent" : "danger"} />
        <ResultCard label="Break-Even Month" value={results.breakEvenMonth === Infinity ? "Never" : `Month ${results.breakEvenMonth}`} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Savings" value={formatCurrency(results.totalSavings)} size="small" variant={results.totalSavings > 0 ? "accent" : "danger"} />
        <ResultCard label="Total Cost of New Loan" value={formatCurrency(results.totalCostNew)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   2. ArmCalculator
   ═══════════════════════════════════════════════════════════ */

const ARM_DEFAULTS = {
  loanAmount: 400000,
  initialRate: 5.0,
  adjustmentPeriod: 5,
  rateCapPerAdj: 2,
  lifetimeCap: 5,
  expectedRateAfterAdj: 7.0,
  loanTerm: 30,
};

export function ArmCalculator() {
  const [loanAmount, setLoanAmount] = useState(ARM_DEFAULTS.loanAmount);
  const [initialRate, setInitialRate] = useState(ARM_DEFAULTS.initialRate);
  const [adjustmentPeriod, setAdjustmentPeriod] = useState(ARM_DEFAULTS.adjustmentPeriod);
  const [rateCapPerAdj, setRateCapPerAdj] = useState(ARM_DEFAULTS.rateCapPerAdj);
  const [lifetimeCap, setLifetimeCap] = useState(ARM_DEFAULTS.lifetimeCap);
  const [expectedRateAfterAdj, setExpectedRateAfterAdj] = useState(ARM_DEFAULTS.expectedRateAfterAdj);
  const [loanTerm, setLoanTerm] = useState(ARM_DEFAULTS.loanTerm);

  const results = useMemo(() => {
    const totalMonths = loanTerm * 12;
    const initialPayment = pmt(loanAmount, initialRate, totalMonths);
    // Balance remaining after the fixed period
    const r0 = initialRate / 100 / 12;
    const fixedMonths = adjustmentPeriod * 12;
    let balance = loanAmount;
    for (let i = 0; i < fixedMonths; i++) {
      const interest = balance * r0;
      balance = balance - (initialPayment - interest);
    }
    const remainingMonths = totalMonths - fixedMonths;
    const paymentAfterAdj = pmt(Math.max(balance, 0), expectedRateAfterAdj, remainingMonths);
    const worstRate = Math.min(initialRate + lifetimeCap, 18);
    const worstPayment = pmt(Math.max(balance, 0), worstRate, remainingMonths);
    const fixedComparison = pmt(loanAmount, expectedRateAfterAdj, totalMonths);
    return { initialPayment, paymentAfterAdj, worstPayment, fixedComparison };
  }, [loanAmount, initialRate, adjustmentPeriod, rateCapPerAdj, lifetimeCap, expectedRateAfterAdj, loanTerm]);

  function resetDefaults() {
    setLoanAmount(ARM_DEFAULTS.loanAmount);
    setInitialRate(ARM_DEFAULTS.initialRate);
    setAdjustmentPeriod(ARM_DEFAULTS.adjustmentPeriod);
    setRateCapPerAdj(ARM_DEFAULTS.rateCapPerAdj);
    setLifetimeCap(ARM_DEFAULTS.lifetimeCap);
    setExpectedRateAfterAdj(ARM_DEFAULTS.expectedRateAfterAdj);
    setLoanTerm(ARM_DEFAULTS.loanTerm);
  }

  const inputs = (
    <>
      <NumberInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} prefix="$" min={50000} max={2000000} step={5000} showSlider />
      <NumberInput label="Initial Rate" value={initialRate} onChange={setInitialRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Adjustment Period</label>
        <Select value={adjustmentPeriod.toString()} onValueChange={(v) => setAdjustmentPeriod(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 years</SelectItem>
            <SelectItem value="5">5 years</SelectItem>
            <SelectItem value="7">7 years</SelectItem>
            <SelectItem value="10">10 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Rate Cap per Adjustment" value={rateCapPerAdj} onChange={setRateCapPerAdj} prefix="%" min={0.5} max={5} step={0.25} />
      <NumberInput label="Lifetime Rate Cap" value={lifetimeCap} onChange={setLifetimeCap} prefix="%" min={1} max={10} step={0.5} />
      <NumberInput label="Expected Rate After Adjustment" value={expectedRateAfterAdj} onChange={setExpectedRateAfterAdj} prefix="%" min={1} max={15} step={0.1} showSlider />
      <NumberInput label="Loan Term (years)" value={loanTerm} onChange={setLoanTerm} min={10} max={30} step={5} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Initial Monthly Payment" value={formatCurrency(results.initialPayment)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Payment After Adjustment" value={formatCurrency(results.paymentAfterAdj)} size="small" variant="accent" />
        <ResultCard label="Worst-Case Payment" value={formatCurrency(results.worstPayment)} size="small" variant="danger" />
      </div>
      <ResultCard label={`Fixed-Rate Comparison (${expectedRateAfterAdj}%)`} value={formatCurrency(results.fixedComparison)} size="medium" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   3. FhaLoanCalculator
   ═══════════════════════════════════════════════════════════ */

const FHA_DEFAULTS = {
  homePrice: 350000,
  downPaymentPct: 3.5,
  interestRate: 6.5,
  loanTerm: 30,
  upfrontMipPct: 1.75,
  annualMipPct: 0.55,
};

export function FhaLoanCalculator() {
  const [homePrice, setHomePrice] = useState(FHA_DEFAULTS.homePrice);
  const [downPaymentPct, setDownPaymentPct] = useState(FHA_DEFAULTS.downPaymentPct);
  const [interestRate, setInterestRate] = useState(FHA_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(FHA_DEFAULTS.loanTerm);
  const [upfrontMipPct, setUpfrontMipPct] = useState(FHA_DEFAULTS.upfrontMipPct);
  const [annualMipPct, setAnnualMipPct] = useState(FHA_DEFAULTS.annualMipPct);

  const results = useMemo(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const baseLoan = homePrice - downPayment;
    const upfrontMip = baseLoan * (upfrontMipPct / 100);
    const loanWithMip = baseLoan + upfrontMip;
    const monthlyPI = pmt(loanWithMip, interestRate, loanTerm * 12);
    const monthlyMip = (baseLoan * (annualMipPct / 100)) / 12;
    const monthlyPayment = monthlyPI + monthlyMip;
    const totalMipCost = upfrontMip + monthlyMip * loanTerm * 12;
    return { monthlyPayment, monthlyPI, monthlyMip, upfrontMip, loanWithMip, totalMipCost, downPayment, baseLoan };
  }, [homePrice, downPaymentPct, interestRate, loanTerm, upfrontMipPct, annualMipPct]);

  function resetDefaults() {
    setHomePrice(FHA_DEFAULTS.homePrice);
    setDownPaymentPct(FHA_DEFAULTS.downPaymentPct);
    setInterestRate(FHA_DEFAULTS.interestRate);
    setLoanTerm(FHA_DEFAULTS.loanTerm);
    setUpfrontMipPct(FHA_DEFAULTS.upfrontMipPct);
    setAnnualMipPct(FHA_DEFAULTS.annualMipPct);
  }

  const inputs = (
    <>
      <NumberInput label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" min={50000} max={1000000} step={5000} showSlider />
      <NumberInput label="Down Payment" value={downPaymentPct} onChange={setDownPaymentPct} prefix="%" min={3.5} max={20} step={0.5} showSlider helpText={`${formatCurrency(homePrice * downPaymentPct / 100)}`} />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Loan Term</label>
        <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Upfront MIP %" value={upfrontMipPct} onChange={setUpfrontMipPct} prefix="%" min={0} max={3} step={0.25} />
      <NumberInput label="Annual MIP %" value={annualMipPct} onChange={setAnnualMipPct} prefix="%" min={0} max={2} step={0.05} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Payment (PI + MIP)" value={formatCurrency(results.monthlyPayment)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Principal & Interest" value={formatCurrency(results.monthlyPI)} size="small" variant="neutral" />
        <ResultCard label="Monthly MIP" value={formatCurrency(results.monthlyMip)} size="small" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Upfront MIP" value={formatCurrency(results.upfrontMip)} size="small" variant="neutral" />
        <ResultCard label="Total MIP Cost" value={formatCurrency(results.totalMipCost)} size="small" variant="danger" />
      </div>
      <ResultCard label="Loan Amount (with upfront MIP)" value={formatCurrency(results.loanWithMip)} size="medium" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   4. VaLoanCalculator
   ═══════════════════════════════════════════════════════════ */

const VA_DEFAULTS = {
  homePrice: 400000,
  interestRate: 6.0,
  loanTerm: 30,
  fundingFeePct: 2.15,
  disabilityExempt: false,
};

export function VaLoanCalculator() {
  const [homePrice, setHomePrice] = useState(VA_DEFAULTS.homePrice);
  const [interestRate, setInterestRate] = useState(VA_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(VA_DEFAULTS.loanTerm);
  const [fundingFeePct, setFundingFeePct] = useState(VA_DEFAULTS.fundingFeePct);
  const [disabilityExempt, setDisabilityExempt] = useState(VA_DEFAULTS.disabilityExempt);

  const results = useMemo(() => {
    const fundingFee = disabilityExempt ? 0 : homePrice * (fundingFeePct / 100);
    const loanAmount = homePrice + fundingFee;
    const monthlyPayment = pmt(loanAmount, interestRate, loanTerm * 12);
    const totalCost = monthlyPayment * loanTerm * 12;
    const totalInterest = totalCost - loanAmount;
    return { monthlyPayment, fundingFee, totalCost, totalInterest, loanAmount };
  }, [homePrice, interestRate, loanTerm, fundingFeePct, disabilityExempt]);

  function resetDefaults() {
    setHomePrice(VA_DEFAULTS.homePrice);
    setInterestRate(VA_DEFAULTS.interestRate);
    setLoanTerm(VA_DEFAULTS.loanTerm);
    setFundingFeePct(VA_DEFAULTS.fundingFeePct);
    setDisabilityExempt(VA_DEFAULTS.disabilityExempt);
  }

  const inputs = (
    <>
      <NumberInput label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" min={50000} max={2000000} step={5000} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Loan Term</label>
        <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="VA Funding Fee %" value={fundingFeePct} onChange={setFundingFeePct} prefix="%" min={0} max={5} step={0.05} helpText="First use: 2.15%, subsequent: 3.3%" />
      <div className="flex items-center gap-3">
        <input type="checkbox" id="va-exempt" checked={disabilityExempt} onChange={(e) => setDisabilityExempt(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        <Label htmlFor="va-exempt">Disability Exempt (no funding fee)</Label>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} size="large" />
      <p className="text-xs text-gray-500">No down payment, no PMI required</p>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="VA Funding Fee" value={disabilityExempt ? "Exempt" : formatCurrency(results.fundingFee)} size="small" variant={disabilityExempt ? "accent" : "neutral"} />
        <ResultCard label="Total Loan Amount" value={formatCurrency(results.loanAmount)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest" value={formatCurrency(results.totalInterest)} size="small" variant="accent" />
        <ResultCard label="Total Cost" value={formatCurrency(results.totalCost)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   5. MortgagePointsCalculator
   ═══════════════════════════════════════════════════════════ */

const POINTS_DEFAULTS = {
  loanAmount: 400000,
  interestRate: 7.0,
  points: 2,
  costPerPointPct: 1,
  rateReductionPerPoint: 0.25,
  loanTerm: 30,
};

export function MortgagePointsCalculator() {
  const [loanAmount, setLoanAmount] = useState(POINTS_DEFAULTS.loanAmount);
  const [interestRate, setInterestRate] = useState(POINTS_DEFAULTS.interestRate);
  const [points, setPoints] = useState(POINTS_DEFAULTS.points);
  const [costPerPointPct, setCostPerPointPct] = useState(POINTS_DEFAULTS.costPerPointPct);
  const [rateReductionPerPoint, setRateReductionPerPoint] = useState(POINTS_DEFAULTS.rateReductionPerPoint);
  const [loanTerm, setLoanTerm] = useState(POINTS_DEFAULTS.loanTerm);

  const results = useMemo(() => {
    const costOfPoints = loanAmount * (costPerPointPct / 100) * points;
    const newRate = Math.max(interestRate - rateReductionPerPoint * points, 0.1);
    const origPayment = pmt(loanAmount, interestRate, loanTerm * 12);
    const newPayment = pmt(loanAmount, newRate, loanTerm * 12);
    const monthlySavings = origPayment - newPayment;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(costOfPoints / monthlySavings) : Infinity;
    return { costOfPoints, newRate, origPayment, newPayment, monthlySavings, breakEvenMonths };
  }, [loanAmount, interestRate, points, costPerPointPct, rateReductionPerPoint, loanTerm]);

  function resetDefaults() {
    setLoanAmount(POINTS_DEFAULTS.loanAmount);
    setInterestRate(POINTS_DEFAULTS.interestRate);
    setPoints(POINTS_DEFAULTS.points);
    setCostPerPointPct(POINTS_DEFAULTS.costPerPointPct);
    setRateReductionPerPoint(POINTS_DEFAULTS.rateReductionPerPoint);
    setLoanTerm(POINTS_DEFAULTS.loanTerm);
  }

  const inputs = (
    <>
      <NumberInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} prefix="$" min={50000} max={2000000} step={5000} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <NumberInput label="Points to Buy" value={points} onChange={setPoints} min={0} max={4} step={0.5} showSlider />
      <NumberInput label="Cost per Point (% of loan)" value={costPerPointPct} onChange={setCostPerPointPct} prefix="%" min={0.5} max={2} step={0.25} />
      <NumberInput label="Rate Reduction per Point" value={rateReductionPerPoint} onChange={setRateReductionPerPoint} prefix="%" min={0.1} max={0.5} step={0.05} />
      <NumberInput label="Loan Term (years)" value={loanTerm} onChange={setLoanTerm} min={10} max={30} step={5} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Cost of Points" value={formatCurrency(results.costOfPoints)} size="large" variant="danger" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Original Rate" value={`${interestRate.toFixed(2)}%`} size="small" variant="neutral" />
        <ResultCard label="New Rate" value={`${results.newRate.toFixed(2)}%`} size="small" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Original Payment" value={formatCurrency(results.origPayment)} size="small" variant="neutral" />
        <ResultCard label="New Payment" value={formatCurrency(results.newPayment)} size="small" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Savings" value={formatCurrency(results.monthlySavings)} size="small" variant="accent" />
        <ResultCard label="Break-Even" value={results.breakEvenMonths === Infinity ? "Never" : `${results.breakEvenMonths} months`} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   6. RentVsBuyCalculator
   ═══════════════════════════════════════════════════════════ */

const RENT_VS_BUY_DEFAULTS = {
  monthlyRent: 2000,
  rentIncreasePct: 3,
  homePrice: 400000,
  downPaymentPct: 20,
  interestRate: 6.5,
  propertyTaxRate: 1.2,
  insurancePerYear: 1800,
  maintenancePerYear: 3000,
  appreciationPct: 3,
  yearsToCompare: 10,
};

export function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState(RENT_VS_BUY_DEFAULTS.monthlyRent);
  const [rentIncreasePct, setRentIncreasePct] = useState(RENT_VS_BUY_DEFAULTS.rentIncreasePct);
  const [homePrice, setHomePrice] = useState(RENT_VS_BUY_DEFAULTS.homePrice);
  const [downPaymentPct, setDownPaymentPct] = useState(RENT_VS_BUY_DEFAULTS.downPaymentPct);
  const [interestRate, setInterestRate] = useState(RENT_VS_BUY_DEFAULTS.interestRate);
  const [propertyTaxRate, setPropertyTaxRate] = useState(RENT_VS_BUY_DEFAULTS.propertyTaxRate);
  const [insurancePerYear, setInsurancePerYear] = useState(RENT_VS_BUY_DEFAULTS.insurancePerYear);
  const [maintenancePerYear, setMaintenancePerYear] = useState(RENT_VS_BUY_DEFAULTS.maintenancePerYear);
  const [appreciationPct, setAppreciationPct] = useState(RENT_VS_BUY_DEFAULTS.appreciationPct);
  const [yearsToCompare, setYearsToCompare] = useState(RENT_VS_BUY_DEFAULTS.yearsToCompare);

  const results = useMemo(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyMortgage = pmt(loanAmount, interestRate, 30 * 12);
    const r = interestRate / 100 / 12;

    let totalRent = 0;
    let totalBuy = downPayment;
    let balance = loanAmount;
    let currentRent = monthlyRent;

    const yearByYear: { year: number; rentCost: number; buyCost: number; equity: number }[] = [];

    for (let yr = 1; yr <= yearsToCompare; yr++) {
      let yearRent = 0;
      let yearBuy = 0;
      for (let m = 0; m < 12; m++) {
        yearRent += currentRent;
        const interest = balance * r;
        const principal = monthlyMortgage - interest;
        balance = Math.max(balance - principal, 0);
        yearBuy += monthlyMortgage + (homePrice * propertyTaxRate / 100) / 12 + insurancePerYear / 12 + maintenancePerYear / 12;
      }
      totalRent += yearRent;
      totalBuy += yearBuy;
      currentRent *= 1 + rentIncreasePct / 100;

      const homeVal = homePrice * Math.pow(1 + appreciationPct / 100, yr);
      const equity = homeVal - balance;
      yearByYear.push({ year: yr, rentCost: totalRent, buyCost: totalBuy, equity });
    }

    const finalHomeValue = homePrice * Math.pow(1 + appreciationPct / 100, yearsToCompare);
    const finalEquity = finalHomeValue - balance;
    const netBuyCost = totalBuy - finalEquity;
    const betterOption = netBuyCost < totalRent ? "Buy" : "Rent";

    return { totalRent, totalBuy, finalEquity, betterOption, netBuyCost, yearByYear };
  }, [monthlyRent, rentIncreasePct, homePrice, downPaymentPct, interestRate, propertyTaxRate, insurancePerYear, maintenancePerYear, appreciationPct, yearsToCompare]);

  function resetDefaults() {
    setMonthlyRent(RENT_VS_BUY_DEFAULTS.monthlyRent);
    setRentIncreasePct(RENT_VS_BUY_DEFAULTS.rentIncreasePct);
    setHomePrice(RENT_VS_BUY_DEFAULTS.homePrice);
    setDownPaymentPct(RENT_VS_BUY_DEFAULTS.downPaymentPct);
    setInterestRate(RENT_VS_BUY_DEFAULTS.interestRate);
    setPropertyTaxRate(RENT_VS_BUY_DEFAULTS.propertyTaxRate);
    setInsurancePerYear(RENT_VS_BUY_DEFAULTS.insurancePerYear);
    setMaintenancePerYear(RENT_VS_BUY_DEFAULTS.maintenancePerYear);
    setAppreciationPct(RENT_VS_BUY_DEFAULTS.appreciationPct);
    setYearsToCompare(RENT_VS_BUY_DEFAULTS.yearsToCompare);
  }

  const inputs = (
    <>
      <NumberInput label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} prefix="$" min={500} max={10000} step={100} showSlider />
      <NumberInput label="Annual Rent Increase" value={rentIncreasePct} onChange={setRentIncreasePct} prefix="%" min={0} max={10} step={0.5} />
      <NumberInput label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" min={100000} max={2000000} step={10000} showSlider />
      <NumberInput label="Down Payment %" value={downPaymentPct} onChange={setDownPaymentPct} prefix="%" min={0} max={50} step={1} showSlider />
      <NumberInput label="Mortgage Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <NumberInput label="Property Tax Rate" value={propertyTaxRate} onChange={setPropertyTaxRate} prefix="%" min={0} max={5} step={0.1} />
      <NumberInput label="Insurance / Year" value={insurancePerYear} onChange={setInsurancePerYear} prefix="$" min={0} max={10000} step={100} />
      <NumberInput label="Maintenance / Year" value={maintenancePerYear} onChange={setMaintenancePerYear} prefix="$" min={0} max={20000} step={500} />
      <NumberInput label="Home Appreciation / Year" value={appreciationPct} onChange={setAppreciationPct} prefix="%" min={0} max={10} step={0.5} />
      <NumberInput label="Years to Compare" value={yearsToCompare} onChange={setYearsToCompare} min={1} max={30} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Better Option" value={results.betterOption} size="large" variant={results.betterOption === "Buy" ? "accent" : "primary"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Rent Cost" value={formatCurrency(results.totalRent)} size="small" variant="danger" />
        <ResultCard label="Total Buy Cost" value={formatCurrency(results.totalBuy)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Equity Built" value={formatCurrency(results.finalEquity)} size="small" variant="accent" />
        <ResultCard label="Net Cost of Buying" value={formatCurrency(results.netBuyCost)} size="small" variant="neutral" />
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Year-by-Year</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-3 py-2 text-left font-medium">Year</th>
                <th className="px-3 py-2 text-right font-medium">Rent Cost</th>
                <th className="px-3 py-2 text-right font-medium">Buy Cost</th>
                <th className="px-3 py-2 text-right font-medium">Equity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.yearByYear.slice(0, 10).map((row) => (
                <tr key={row.year} className="hover:bg-gray-50">
                  <td className="px-3 py-2 tabular-nums">{row.year}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.rentCost)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.buyCost)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.equity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   7. HelocCalculator
   ═══════════════════════════════════════════════════════════ */

const HELOC_DEFAULTS = {
  homeValue: 500000,
  mortgageBalance: 300000,
  helocRate: 8.5,
  drawAmount: 50000,
  drawPeriodYears: 10,
  repaymentPeriodYears: 20,
};

export function HelocCalculator() {
  const [homeValue, setHomeValue] = useState(HELOC_DEFAULTS.homeValue);
  const [mortgageBalance, setMortgageBalance] = useState(HELOC_DEFAULTS.mortgageBalance);
  const [helocRate, setHelocRate] = useState(HELOC_DEFAULTS.helocRate);
  const [drawAmount, setDrawAmount] = useState(HELOC_DEFAULTS.drawAmount);
  const [drawPeriodYears, setDrawPeriodYears] = useState(HELOC_DEFAULTS.drawPeriodYears);
  const [repaymentPeriodYears, setRepaymentPeriodYears] = useState(HELOC_DEFAULTS.repaymentPeriodYears);

  const results = useMemo(() => {
    const availableCredit = Math.max(homeValue * 0.8 - mortgageBalance, 0);
    const monthlyRate = helocRate / 100 / 12;
    const interestOnlyPayment = drawAmount * monthlyRate;
    const repaymentMonths = repaymentPeriodYears * 12;
    const piPayment = pmt(drawAmount, helocRate, repaymentMonths);
    const totalInterestDraw = interestOnlyPayment * drawPeriodYears * 12;
    const totalInterestRepay = piPayment * repaymentMonths - drawAmount;
    const totalInterest = totalInterestDraw + totalInterestRepay;
    return { availableCredit, interestOnlyPayment, piPayment, totalInterest };
  }, [homeValue, mortgageBalance, helocRate, drawAmount, drawPeriodYears, repaymentPeriodYears]);

  function resetDefaults() {
    setHomeValue(HELOC_DEFAULTS.homeValue);
    setMortgageBalance(HELOC_DEFAULTS.mortgageBalance);
    setHelocRate(HELOC_DEFAULTS.helocRate);
    setDrawAmount(HELOC_DEFAULTS.drawAmount);
    setDrawPeriodYears(HELOC_DEFAULTS.drawPeriodYears);
    setRepaymentPeriodYears(HELOC_DEFAULTS.repaymentPeriodYears);
  }

  const inputs = (
    <>
      <NumberInput label="Home Value" value={homeValue} onChange={setHomeValue} prefix="$" min={100000} max={3000000} step={10000} showSlider />
      <NumberInput label="Mortgage Balance" value={mortgageBalance} onChange={setMortgageBalance} prefix="$" min={0} max={homeValue} step={5000} showSlider />
      <NumberInput label="HELOC Rate" value={helocRate} onChange={setHelocRate} prefix="%" min={1} max={20} step={0.1} showSlider />
      <NumberInput label="Draw Amount" value={drawAmount} onChange={setDrawAmount} prefix="$" min={5000} max={500000} step={5000} showSlider />
      <NumberInput label="Draw Period (years)" value={drawPeriodYears} onChange={setDrawPeriodYears} min={1} max={15} step={1} showSlider />
      <NumberInput label="Repayment Period (years)" value={repaymentPeriodYears} onChange={setRepaymentPeriodYears} min={5} max={30} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Available Credit (80% LTV)" value={formatCurrency(results.availableCredit)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Interest-Only Payment (draw)" value={formatCurrency(results.interestOnlyPayment)} size="small" variant="accent" />
        <ResultCard label="P&I Payment (repayment)" value={formatCurrency(results.piPayment)} size="small" variant="primary" />
      </div>
      <ResultCard label="Total Interest" value={formatCurrency(results.totalInterest)} size="medium" variant="danger" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   8. HomeEquityLoanCalculator
   ═══════════════════════════════════════════════════════════ */

const HE_LOAN_DEFAULTS = {
  homeValue: 500000,
  mortgageBalance: 280000,
  loanAmount: 60000,
  interestRate: 7.5,
  loanTerm: 15,
};

export function HomeEquityLoanCalculator() {
  const [homeValue, setHomeValue] = useState(HE_LOAN_DEFAULTS.homeValue);
  const [mortgageBalance, setMortgageBalance] = useState(HE_LOAN_DEFAULTS.mortgageBalance);
  const [loanAmount, setLoanAmount] = useState(HE_LOAN_DEFAULTS.loanAmount);
  const [interestRate, setInterestRate] = useState(HE_LOAN_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(HE_LOAN_DEFAULTS.loanTerm);

  const results = useMemo(() => {
    const availableEquity = Math.max(homeValue * 0.8 - mortgageBalance, 0);
    const monthlyPayment = pmt(loanAmount, interestRate, loanTerm * 12);
    const totalPaid = monthlyPayment * loanTerm * 12;
    const totalInterest = totalPaid - loanAmount;
    return { availableEquity, monthlyPayment, totalInterest, totalPaid };
  }, [homeValue, mortgageBalance, loanAmount, interestRate, loanTerm]);

  function resetDefaults() {
    setHomeValue(HE_LOAN_DEFAULTS.homeValue);
    setMortgageBalance(HE_LOAN_DEFAULTS.mortgageBalance);
    setLoanAmount(HE_LOAN_DEFAULTS.loanAmount);
    setInterestRate(HE_LOAN_DEFAULTS.interestRate);
    setLoanTerm(HE_LOAN_DEFAULTS.loanTerm);
  }

  const inputs = (
    <>
      <NumberInput label="Home Value" value={homeValue} onChange={setHomeValue} prefix="$" min={100000} max={3000000} step={10000} showSlider />
      <NumberInput label="Mortgage Balance" value={mortgageBalance} onChange={setMortgageBalance} prefix="$" min={0} max={homeValue} step={5000} showSlider />
      <NumberInput label="Loan Amount Needed" value={loanAmount} onChange={setLoanAmount} prefix="$" min={5000} max={500000} step={5000} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={20} step={0.1} showSlider />
      <NumberInput label="Loan Term (years)" value={loanTerm} onChange={setLoanTerm} min={5} max={30} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Available Equity (80% LTV)" value={formatCurrency(results.availableEquity)} size="large" />
      <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} size="large" variant="primary" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest" value={formatCurrency(results.totalInterest)} size="small" variant="accent" />
        <ResultCard label="Total Paid" value={formatCurrency(results.totalPaid)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   9. FifteenYearMortgageCalculator
   ═══════════════════════════════════════════════════════════ */

const FIFTEEN_DEFAULTS = {
  homePrice: 400000,
  downPayment: 80000,
  rate15: 5.75,
  rate30: 6.5,
};

export function FifteenYearMortgageCalculator() {
  const [homePrice, setHomePrice] = useState(FIFTEEN_DEFAULTS.homePrice);
  const [downPayment, setDownPayment] = useState(FIFTEEN_DEFAULTS.downPayment);
  const [rate15, setRate15] = useState(FIFTEEN_DEFAULTS.rate15);
  const [rate30, setRate30] = useState(FIFTEEN_DEFAULTS.rate30);

  const results = useMemo(() => {
    const loanAmount = homePrice - downPayment;
    const payment15 = pmt(loanAmount, rate15, 15 * 12);
    const payment30 = pmt(loanAmount, rate30, 30 * 12);
    const diff = payment15 - payment30;
    const totalPaid15 = payment15 * 15 * 12;
    const totalPaid30 = payment30 * 30 * 12;
    const totalInterest15 = totalPaid15 - loanAmount;
    const totalInterest30 = totalPaid30 - loanAmount;
    const interestSaved = totalInterest30 - totalInterest15;
    return { payment15, payment30, diff, totalPaid15, totalPaid30, totalInterest15, totalInterest30, interestSaved, loanAmount };
  }, [homePrice, downPayment, rate15, rate30]);

  function resetDefaults() {
    setHomePrice(FIFTEEN_DEFAULTS.homePrice);
    setDownPayment(FIFTEEN_DEFAULTS.downPayment);
    setRate15(FIFTEEN_DEFAULTS.rate15);
    setRate30(FIFTEEN_DEFAULTS.rate30);
  }

  const inputs = (
    <>
      <NumberInput label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" min={50000} max={2000000} step={5000} showSlider />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={homePrice} step={5000} showSlider helpText={`${((downPayment / homePrice) * 100).toFixed(1)}% of home price`} />
      <NumberInput label="15-Year Rate" value={rate15} onChange={setRate15} prefix="%" min={1} max={15} step={0.1} showSlider />
      <NumberInput label="30-Year Rate" value={rate30} onChange={setRate30} prefix="%" min={1} max={15} step={0.1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="15-Year Payment" value={formatCurrency(results.payment15)} size="large" variant="primary" />
        <ResultCard label="30-Year Payment" value={formatCurrency(results.payment30)} size="large" variant="neutral" />
      </div>
      <ResultCard label="Monthly Difference (higher with 15-yr)" value={formatCurrency(results.diff)} size="medium" variant="danger" />
      <ResultCard label="Interest Saved with 15-Year" value={formatCurrency(results.interestSaved)} size="large" variant="accent" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest (15-yr)" value={formatCurrency(results.totalInterest15)} size="small" variant="accent" />
        <ResultCard label="Total Interest (30-yr)" value={formatCurrency(results.totalInterest30)} size="small" variant="danger" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Paid (15-yr)" value={formatCurrency(results.totalPaid15)} size="small" variant="neutral" />
        <ResultCard label="Total Paid (30-yr)" value={formatCurrency(results.totalPaid30)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   10. BiweeklyMortgageCalculator
   ═══════════════════════════════════════════════════════════ */

const BIWEEKLY_DEFAULTS = {
  loanAmount: 350000,
  interestRate: 6.5,
  loanTerm: 30,
};

export function BiweeklyMortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(BIWEEKLY_DEFAULTS.loanAmount);
  const [interestRate, setInterestRate] = useState(BIWEEKLY_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(BIWEEKLY_DEFAULTS.loanTerm);

  const results = useMemo(() => {
    const monthlyPayment = pmt(loanAmount, interestRate, loanTerm * 12);
    const biweeklyPayment = monthlyPayment / 2;
    const r = interestRate / 100 / 12;

    // Simulate monthly payoff
    let balanceMonthly = loanAmount;
    let monthlyMonths = 0;
    while (balanceMonthly > 0.01 && monthlyMonths < loanTerm * 12) {
      const interest = balanceMonthly * r;
      balanceMonthly = Math.max(balanceMonthly - (monthlyPayment - interest), 0);
      monthlyMonths++;
    }
    const totalPaidMonthly = monthlyPayment * monthlyMonths;

    // Simulate biweekly payoff: 26 half-payments per year = 13 monthly payments
    let balanceBiweekly = loanAmount;
    const biweeklyRate = interestRate / 100 / 26;
    let biweeklyPeriods = 0;
    while (balanceBiweekly > 0.01 && biweeklyPeriods < loanTerm * 26) {
      const interest = balanceBiweekly * biweeklyRate;
      balanceBiweekly = Math.max(balanceBiweekly - (biweeklyPayment - interest), 0);
      biweeklyPeriods++;
    }
    const biweeklyYears = biweeklyPeriods / 26;
    const totalPaidBiweekly = biweeklyPayment * biweeklyPeriods;

    const yearsSaved = loanTerm - biweeklyYears;
    const interestSaved = totalPaidMonthly - totalPaidBiweekly;

    const monthlyPayoffDate = new Date();
    monthlyPayoffDate.setMonth(monthlyPayoffDate.getMonth() + monthlyMonths);
    const biweeklyPayoffDate = new Date();
    biweeklyPayoffDate.setDate(biweeklyPayoffDate.getDate() + biweeklyPeriods * 14);

    return {
      monthlyPayment,
      biweeklyPayment,
      yearsSaved: Math.max(yearsSaved, 0),
      interestSaved: Math.max(interestSaved, 0),
      monthlyPayoffDate: monthlyPayoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      biweeklyPayoffDate: biweeklyPayoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  }, [loanAmount, interestRate, loanTerm]);

  function resetDefaults() {
    setLoanAmount(BIWEEKLY_DEFAULTS.loanAmount);
    setInterestRate(BIWEEKLY_DEFAULTS.interestRate);
    setLoanTerm(BIWEEKLY_DEFAULTS.loanTerm);
  }

  const inputs = (
    <>
      <NumberInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} prefix="$" min={50000} max={2000000} step={5000} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <NumberInput label="Loan Term (years)" value={loanTerm} onChange={setLoanTerm} min={10} max={30} step={5} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} size="large" variant="neutral" />
        <ResultCard label="Biweekly Payment" value={formatCurrency(results.biweeklyPayment)} size="large" variant="primary" />
      </div>
      <ResultCard label="Years Saved" value={`${results.yearsSaved.toFixed(1)} years`} size="large" variant="accent" />
      <ResultCard label="Interest Saved" value={formatCurrency(results.interestSaved)} size="large" variant="accent" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Payoff" value={results.monthlyPayoffDate} size="small" variant="neutral" />
        <ResultCard label="Biweekly Payoff" value={results.biweeklyPayoffDate} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   11. MortgageAmortizationCalculator
   ═══════════════════════════════════════════════════════════ */

const AMORT_DEFAULTS = {
  loanAmount: 350000,
  interestRate: 6.5,
  loanTerm: 30,
};

export function MortgageAmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState(AMORT_DEFAULTS.loanAmount);
  const [interestRate, setInterestRate] = useState(AMORT_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(AMORT_DEFAULTS.loanTerm);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const results = useMemo(() => {
    const totalMonths = loanTerm * 12;
    const monthlyPayment = pmt(loanAmount, interestRate, totalMonths);
    const r = interestRate / 100 / 12;

    const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    let balance = loanAmount;
    let totalInterest = 0;

    for (let m = 1; m <= totalMonths; m++) {
      const interest = balance * r;
      const principal = monthlyPayment - interest;
      balance = Math.max(balance - principal, 0);
      totalInterest += interest;
      schedule.push({ month: m, payment: monthlyPayment, principal, interest, balance });
    }

    const totalPaid = monthlyPayment * totalMonths;
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + totalMonths);
    const payoffStr = payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    return { monthlyPayment, totalInterest, totalPaid, payoffStr, schedule };
  }, [loanAmount, interestRate, loanTerm]);

  function resetDefaults() {
    setLoanAmount(AMORT_DEFAULTS.loanAmount);
    setInterestRate(AMORT_DEFAULTS.interestRate);
    setLoanTerm(AMORT_DEFAULTS.loanTerm);
    setShowFullSchedule(false);
  }

  const visibleSchedule = showFullSchedule ? results.schedule : results.schedule.slice(0, 12);

  const inputs = (
    <>
      <NumberInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} prefix="$" min={50000} max={2000000} step={5000} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Loan Term</label>
        <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 years</SelectItem>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} size="large" />
      <div className="grid grid-cols-3 gap-4">
        <ResultCard label="Total Interest" value={formatCurrency(results.totalInterest)} size="small" variant="accent" />
        <ResultCard label="Total Paid" value={formatCurrency(results.totalPaid)} size="small" variant="neutral" />
        <ResultCard label="Payoff Date" value={results.payoffStr} size="small" variant="neutral" />
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Amortization Schedule</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
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
        {results.schedule.length > 12 && (
          <Button variant="ghost" size="sm" onClick={() => setShowFullSchedule((p) => !p)} className="w-full">
            {showFullSchedule ? "Show less" : "View full schedule"}
          </Button>
        )}
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   12. ClosingCostCalculator
   ═══════════════════════════════════════════════════════════ */

const CLOSING_DEFAULTS = {
  homePrice: 400000,
  loanAmount: 320000,
  state: "average",
};

const STATE_RATES: Record<string, { label: string; pct: number }> = {
  low: { label: "Low-cost state (e.g. MO, IN)", pct: 2.0 },
  average: { label: "Average (national)", pct: 3.0 },
  high: { label: "High-cost state (e.g. NY, CT)", pct: 5.0 },
};

export function ClosingCostCalculator() {
  const [homePrice, setHomePrice] = useState(CLOSING_DEFAULTS.homePrice);
  const [loanAmount, setLoanAmount] = useState(CLOSING_DEFAULTS.loanAmount);
  const [state, setState] = useState(CLOSING_DEFAULTS.state);

  const results = useMemo(() => {
    const pct = STATE_RATES[state]?.pct ?? 3;
    const totalClosing = loanAmount * (pct / 100);
    const appraisal = 500;
    const origination = loanAmount * 0.01;
    const titleInsurance = homePrice * 0.005;
    const recording = 300;
    const creditReport = 50;
    const survey = 400;
    const other = Math.max(totalClosing - appraisal - origination - titleInsurance - recording - creditReport - survey, 0);
    const downPayment = homePrice - loanAmount;
    const cashNeeded = downPayment + totalClosing;

    const items = [
      { label: "Appraisal", amount: appraisal },
      { label: "Origination Fee (1%)", amount: origination },
      { label: "Title Insurance", amount: titleInsurance },
      { label: "Recording Fees", amount: recording },
      { label: "Credit Report", amount: creditReport },
      { label: "Survey", amount: survey },
      { label: "Other Fees", amount: other },
    ];

    return { totalClosing, items, downPayment, cashNeeded };
  }, [homePrice, loanAmount, state]);

  function resetDefaults() {
    setHomePrice(CLOSING_DEFAULTS.homePrice);
    setLoanAmount(CLOSING_DEFAULTS.loanAmount);
    setState(CLOSING_DEFAULTS.state);
  }

  const inputs = (
    <>
      <NumberInput label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" min={50000} max={2000000} step={5000} showSlider />
      <NumberInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} prefix="$" min={0} max={homePrice} step={5000} showSlider helpText={`Down payment: ${formatCurrency(homePrice - loanAmount)}`} />
      <div className="space-y-2">
        <label className="text-sm font-medium">State / Cost Level</label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(STATE_RATES).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Closing Costs" value={formatCurrency(results.totalClosing)} size="large" />
      <ResultCard label="Total Cash Needed at Closing" value={formatCurrency(results.cashNeeded)} size="large" variant="danger" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Down Payment" value={formatCurrency(results.downPayment)} size="small" variant="neutral" />
        <ResultCard label="Closing Costs" value={formatCurrency(results.totalClosing)} size="small" variant="accent" />
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Itemized Breakdown</h3>
        <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
          {results.items.map((item) => (
            <div key={item.label} className="flex justify-between px-4 py-2 text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium tabular-nums">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   13. PmiCalculator
   ═══════════════════════════════════════════════════════════ */

const PMI_DEFAULTS = {
  homePrice: 400000,
  downPayment: 40000,
  pmiRate: 0.7,
  interestRate: 6.5,
  loanTerm: 30,
};

export function PmiCalculator() {
  const [homePrice, setHomePrice] = useState(PMI_DEFAULTS.homePrice);
  const [downPayment, setDownPayment] = useState(PMI_DEFAULTS.downPayment);
  const [pmiRate, setPmiRate] = useState(PMI_DEFAULTS.pmiRate);
  const [interestRate, setInterestRate] = useState(PMI_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(PMI_DEFAULTS.loanTerm);

  const results = useMemo(() => {
    const loanAmount = homePrice - downPayment;
    const ltv = loanAmount / homePrice;
    const monthlyPI = pmt(loanAmount, interestRate, loanTerm * 12);
    const monthlyPMI = ltv > 0.8 ? (loanAmount * (pmiRate / 100)) / 12 : 0;
    const paymentWithPMI = monthlyPI + monthlyPMI;
    const paymentWithoutPMI = monthlyPI;

    // Find when LTV hits 80%
    const r = interestRate / 100 / 12;
    let balance = loanAmount;
    let pmiDropMonth = 0;
    let totalPMIPaid = 0;
    const target80 = homePrice * 0.8;
    for (let m = 1; m <= loanTerm * 12; m++) {
      const interest = balance * r;
      balance = Math.max(balance - (monthlyPI - interest), 0);
      if (balance <= target80 && pmiDropMonth === 0) {
        pmiDropMonth = m;
      }
      if (pmiDropMonth === 0) {
        totalPMIPaid += monthlyPMI;
      }
    }

    return { monthlyPMI, pmiDropMonth, totalPMIPaid, paymentWithPMI, paymentWithoutPMI, ltv };
  }, [homePrice, downPayment, pmiRate, interestRate, loanTerm]);

  function resetDefaults() {
    setHomePrice(PMI_DEFAULTS.homePrice);
    setDownPayment(PMI_DEFAULTS.downPayment);
    setPmiRate(PMI_DEFAULTS.pmiRate);
    setInterestRate(PMI_DEFAULTS.interestRate);
    setLoanTerm(PMI_DEFAULTS.loanTerm);
  }

  const inputs = (
    <>
      <NumberInput label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" min={50000} max={2000000} step={5000} showSlider />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={homePrice} step={1000} showSlider helpText={`${((downPayment / homePrice) * 100).toFixed(1)}% down — LTV ${((1 - downPayment / homePrice) * 100).toFixed(1)}%`} />
      <NumberInput label="PMI Rate (annual %)" value={pmiRate} onChange={setPmiRate} prefix="%" min={0.3} max={1.5} step={0.05} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Loan Term</label>
        <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly PMI" value={results.monthlyPMI > 0 ? formatCurrency(results.monthlyPMI) : "N/A — 20%+ down"} size="large" variant={results.monthlyPMI > 0 ? "danger" : "accent"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Payment with PMI" value={formatCurrency(results.paymentWithPMI)} size="small" variant="primary" />
        <ResultCard label="Payment without PMI" value={formatCurrency(results.paymentWithoutPMI)} size="small" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="PMI Drops Off" value={results.pmiDropMonth > 0 ? `Month ${results.pmiDropMonth} (~${(results.pmiDropMonth / 12).toFixed(1)} yrs)` : "N/A"} size="small" variant="neutral" />
        <ResultCard label="Total PMI Paid" value={formatCurrency(results.totalPMIPaid)} size="small" variant="danger" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   14. JumboLoanCalculator
   ═══════════════════════════════════════════════════════════ */

const CONFORMING_LIMIT = 766550;

const JUMBO_DEFAULTS = {
  homePrice: 1200000,
  downPayment: 240000,
  interestRate: 7.0,
  loanTerm: 30,
};

export function JumboLoanCalculator() {
  const [homePrice, setHomePrice] = useState(JUMBO_DEFAULTS.homePrice);
  const [downPayment, setDownPayment] = useState(JUMBO_DEFAULTS.downPayment);
  const [interestRate, setInterestRate] = useState(JUMBO_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(JUMBO_DEFAULTS.loanTerm);

  const results = useMemo(() => {
    const loanAmount = homePrice - downPayment;
    const jumboAboveLimit = Math.max(loanAmount - CONFORMING_LIMIT, 0);
    const monthlyPayment = pmt(loanAmount, interestRate, loanTerm * 12);
    const totalPaid = monthlyPayment * loanTerm * 12;
    const totalInterest = totalPaid - loanAmount;

    // Conforming comparison: if loan was limited to conforming limit
    const conformingLoan = Math.min(loanAmount, CONFORMING_LIMIT);
    const conformingRate = Math.max(interestRate - 0.5, 1); // typically lower
    const conformingPayment = pmt(conformingLoan, conformingRate, loanTerm * 12);
    const conformingTotalInterest = conformingPayment * loanTerm * 12 - conformingLoan;

    return { loanAmount, jumboAboveLimit, monthlyPayment, totalInterest, totalPaid, conformingPayment, conformingTotalInterest, conformingLoan, conformingRate };
  }, [homePrice, downPayment, interestRate, loanTerm]);

  function resetDefaults() {
    setHomePrice(JUMBO_DEFAULTS.homePrice);
    setDownPayment(JUMBO_DEFAULTS.downPayment);
    setInterestRate(JUMBO_DEFAULTS.interestRate);
    setLoanTerm(JUMBO_DEFAULTS.loanTerm);
  }

  const inputs = (
    <>
      <NumberInput label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" min={500000} max={5000000} step={25000} showSlider />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={homePrice} step={10000} showSlider helpText={`${((downPayment / homePrice) * 100).toFixed(1)}% down`} />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Loan Term</label>
        <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-gray-500">2026 conforming loan limit: {formatCurrency(CONFORMING_LIMIT)}</p>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Payment (Jumbo)" value={formatCurrency(results.monthlyPayment)} size="large" />
      <ResultCard label="Jumbo Amount Above Limit" value={formatCurrency(results.jumboAboveLimit)} size="medium" variant={results.jumboAboveLimit > 0 ? "danger" : "accent"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest" value={formatCurrency(results.totalInterest)} size="small" variant="accent" />
        <ResultCard label="Total Paid" value={formatCurrency(results.totalPaid)} size="small" variant="neutral" />
      </div>
      <div className="space-y-2 pt-2 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Conforming Loan Comparison</h3>
        <div className="grid grid-cols-2 gap-4">
          <ResultCard label={`Conforming Payment (${results.conformingRate.toFixed(1)}%)`} value={formatCurrency(results.conformingPayment)} size="small" variant="accent" />
          <ResultCard label="Conforming Interest" value={formatCurrency(results.conformingTotalInterest)} size="small" variant="neutral" />
        </div>
        <p className="text-xs text-gray-500">Conforming loan capped at {formatCurrency(CONFORMING_LIMIT)} with ~0.5% lower rate</p>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   15. SecondMortgageCalculator
   ═══════════════════════════════════════════════════════════ */

const SECOND_DEFAULTS = {
  homeValue: 500000,
  firstMortgageBalance: 300000,
  firstMortgagePayment: 1900,
  secondMortgageAmount: 50000,
  secondMortgageRate: 9.0,
  secondTerm: 15,
};

export function SecondMortgageCalculator() {
  const [homeValue, setHomeValue] = useState(SECOND_DEFAULTS.homeValue);
  const [firstMortgageBalance, setFirstMortgageBalance] = useState(SECOND_DEFAULTS.firstMortgageBalance);
  const [firstMortgagePayment, setFirstMortgagePayment] = useState(SECOND_DEFAULTS.firstMortgagePayment);
  const [secondMortgageAmount, setSecondMortgageAmount] = useState(SECOND_DEFAULTS.secondMortgageAmount);
  const [secondMortgageRate, setSecondMortgageRate] = useState(SECOND_DEFAULTS.secondMortgageRate);
  const [secondTerm, setSecondTerm] = useState(SECOND_DEFAULTS.secondTerm);

  const results = useMemo(() => {
    const combinedLTV = (firstMortgageBalance + secondMortgageAmount) / homeValue;
    const secondPayment = pmt(secondMortgageAmount, secondMortgageRate, secondTerm * 12);
    const totalPaidSecond = secondPayment * secondTerm * 12;
    const totalInterestSecond = totalPaidSecond - secondMortgageAmount;
    const totalMonthly = firstMortgagePayment + secondPayment;
    return { combinedLTV, secondPayment, totalInterestSecond, totalMonthly, totalPaidSecond };
  }, [homeValue, firstMortgageBalance, firstMortgagePayment, secondMortgageAmount, secondMortgageRate, secondTerm]);

  function resetDefaults() {
    setHomeValue(SECOND_DEFAULTS.homeValue);
    setFirstMortgageBalance(SECOND_DEFAULTS.firstMortgageBalance);
    setFirstMortgagePayment(SECOND_DEFAULTS.firstMortgagePayment);
    setSecondMortgageAmount(SECOND_DEFAULTS.secondMortgageAmount);
    setSecondMortgageRate(SECOND_DEFAULTS.secondMortgageRate);
    setSecondTerm(SECOND_DEFAULTS.secondTerm);
  }

  const inputs = (
    <>
      <NumberInput label="Home Value" value={homeValue} onChange={setHomeValue} prefix="$" min={100000} max={3000000} step={10000} showSlider />
      <NumberInput label="First Mortgage Balance" value={firstMortgageBalance} onChange={setFirstMortgageBalance} prefix="$" min={0} max={homeValue} step={5000} showSlider />
      <NumberInput label="First Mortgage Payment" value={firstMortgagePayment} onChange={setFirstMortgagePayment} prefix="$" min={0} max={20000} step={50} />
      <NumberInput label="Second Mortgage Amount" value={secondMortgageAmount} onChange={setSecondMortgageAmount} prefix="$" min={5000} max={500000} step={5000} showSlider />
      <NumberInput label="Second Mortgage Rate" value={secondMortgageRate} onChange={setSecondMortgageRate} prefix="%" min={1} max={20} step={0.1} showSlider />
      <NumberInput label="Second Mortgage Term (years)" value={secondTerm} onChange={setSecondTerm} min={5} max={30} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Combined LTV" value={`${(results.combinedLTV * 100).toFixed(1)}%`} size="large" variant={results.combinedLTV > 0.9 ? "danger" : results.combinedLTV > 0.8 ? "accent" : "primary"} />
      <ResultCard label="Second Mortgage Payment" value={formatCurrency(results.secondPayment)} size="large" variant="primary" />
      <ResultCard label="Total Monthly (1st + 2nd)" value={formatCurrency(results.totalMonthly)} size="large" variant="danger" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest (2nd)" value={formatCurrency(results.totalInterestSecond)} size="small" variant="accent" />
        <ResultCard label="Total Paid (2nd)" value={formatCurrency(results.totalPaidSecond)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   16. UsdaLoanCalculator
   ═══════════════════════════════════════════════════════════ */

const USDA_DEFAULTS = {
  homePrice: 280000,
  interestRate: 6.0,
  loanTerm: 30,
  upfrontFeePct: 1.0,
  annualFeePct: 0.35,
};

export function UsdaLoanCalculator() {
  const [homePrice, setHomePrice] = useState(USDA_DEFAULTS.homePrice);
  const [interestRate, setInterestRate] = useState(USDA_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(USDA_DEFAULTS.loanTerm);
  const [upfrontFeePct, setUpfrontFeePct] = useState(USDA_DEFAULTS.upfrontFeePct);
  const [annualFeePct, setAnnualFeePct] = useState(USDA_DEFAULTS.annualFeePct);

  const results = useMemo(() => {
    const upfrontFee = homePrice * (upfrontFeePct / 100);
    const loanWithFee = homePrice + upfrontFee;
    const monthlyPI = pmt(loanWithFee, interestRate, loanTerm * 12);
    const monthlyAnnualFee = (homePrice * (annualFeePct / 100)) / 12;
    const monthlyPayment = monthlyPI + monthlyAnnualFee;
    const totalGuaranteeCost = upfrontFee + monthlyAnnualFee * loanTerm * 12;
    const totalCost = monthlyPayment * loanTerm * 12;
    return { monthlyPayment, monthlyPI, monthlyAnnualFee, upfrontFee, totalGuaranteeCost, totalCost, loanWithFee };
  }, [homePrice, interestRate, loanTerm, upfrontFeePct, annualFeePct]);

  function resetDefaults() {
    setHomePrice(USDA_DEFAULTS.homePrice);
    setInterestRate(USDA_DEFAULTS.interestRate);
    setLoanTerm(USDA_DEFAULTS.loanTerm);
    setUpfrontFeePct(USDA_DEFAULTS.upfrontFeePct);
    setAnnualFeePct(USDA_DEFAULTS.annualFeePct);
  }

  const inputs = (
    <>
      <NumberInput label="Home Price" value={homePrice} onChange={setHomePrice} prefix="$" min={50000} max={500000} step={5000} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={15} step={0.1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Loan Term</label>
        <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Upfront Guarantee Fee %" value={upfrontFeePct} onChange={setUpfrontFeePct} prefix="%" min={0} max={3} step={0.25} />
      <NumberInput label="Annual Fee %" value={annualFeePct} onChange={setAnnualFeePct} prefix="%" min={0} max={2} step={0.05} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} size="large" />
      <p className="text-xs text-gray-500">No down payment required</p>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Principal & Interest" value={formatCurrency(results.monthlyPI)} size="small" variant="neutral" />
        <ResultCard label="Monthly Annual Fee" value={formatCurrency(results.monthlyAnnualFee)} size="small" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Upfront Guarantee Fee" value={formatCurrency(results.upfrontFee)} size="small" variant="neutral" />
        <ResultCard label="Total Guarantee Costs" value={formatCurrency(results.totalGuaranteeCost)} size="small" variant="danger" />
      </div>
      <ResultCard label="Total Cost" value={formatCurrency(results.totalCost)} size="medium" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
