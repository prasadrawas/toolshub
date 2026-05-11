"use client";

import React, { useState, useMemo } from "react";
import { CalculatorShell } from "@/components/shared/CalculatorShell";
import { NumberInput } from "@/components/shared/NumberInput";
import { ResultCard } from "@/components/shared/ResultCard";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ───────────────────────── helpers ───────────────────────── */

function pmt(principal: number, annualRate: number, totalMonths: number): number {
  if (annualRate === 0) return principal / totalMonths;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
}

function fv(presentValue: number, annualRate: number, years: number): number {
  return presentValue * Math.pow(1 + annualRate / 100, years);
}

/* ═══════════════════════════════════════════════════════════
   1. RentalPropertyCalculator
   ═══════════════════════════════════════════════════════════ */

const RENTAL_PROPERTY_DEFAULTS = {
  purchasePrice: 300000,
  downPayment: 60000,
  interestRate: 7.0,
  loanTerm: 30,
  monthlyRent: 2200,
  vacancyRate: 5,
  propertyTax: 3600,
  insurance: 1200,
  maintenance: 1800,
  managementFee: 10,
};

export function RentalPropertyCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(RENTAL_PROPERTY_DEFAULTS.purchasePrice);
  const [downPayment, setDownPayment] = useState(RENTAL_PROPERTY_DEFAULTS.downPayment);
  const [interestRate, setInterestRate] = useState(RENTAL_PROPERTY_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(RENTAL_PROPERTY_DEFAULTS.loanTerm);
  const [monthlyRent, setMonthlyRent] = useState(RENTAL_PROPERTY_DEFAULTS.monthlyRent);
  const [vacancyRate, setVacancyRate] = useState(RENTAL_PROPERTY_DEFAULTS.vacancyRate);
  const [propertyTax, setPropertyTax] = useState(RENTAL_PROPERTY_DEFAULTS.propertyTax);
  const [insurance, setInsurance] = useState(RENTAL_PROPERTY_DEFAULTS.insurance);
  const [maintenance, setMaintenance] = useState(RENTAL_PROPERTY_DEFAULTS.maintenance);
  const [managementFee, setManagementFee] = useState(RENTAL_PROPERTY_DEFAULTS.managementFee);

  const results = useMemo(() => {
    const loanAmount = purchasePrice - downPayment;
    const monthlyMortgage = pmt(loanAmount, interestRate, loanTerm * 12);
    const effectiveRent = monthlyRent * (1 - vacancyRate / 100);
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyMaintenance = maintenance / 12;
    const monthlyManagement = effectiveRent * (managementFee / 100);
    const totalMonthlyExpenses = monthlyMortgage + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance + monthlyManagement;
    const monthlyCashFlow = effectiveRent - totalMonthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCashReturn = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;
    const annualNOI = effectiveRent * 12 - propertyTax - insurance - maintenance - (effectiveRent * 12 * managementFee / 100);
    const capRate = purchasePrice > 0 ? (annualNOI / purchasePrice) * 100 : 0;
    return { monthlyCashFlow, annualCashFlow, cashOnCashReturn, capRate, totalMonthlyExpenses };
  }, [purchasePrice, downPayment, interestRate, loanTerm, monthlyRent, vacancyRate, propertyTax, insurance, maintenance, managementFee]);

  function resetDefaults() {
    setPurchasePrice(RENTAL_PROPERTY_DEFAULTS.purchasePrice);
    setDownPayment(RENTAL_PROPERTY_DEFAULTS.downPayment);
    setInterestRate(RENTAL_PROPERTY_DEFAULTS.interestRate);
    setLoanTerm(RENTAL_PROPERTY_DEFAULTS.loanTerm);
    setMonthlyRent(RENTAL_PROPERTY_DEFAULTS.monthlyRent);
    setVacancyRate(RENTAL_PROPERTY_DEFAULTS.vacancyRate);
    setPropertyTax(RENTAL_PROPERTY_DEFAULTS.propertyTax);
    setInsurance(RENTAL_PROPERTY_DEFAULTS.insurance);
    setMaintenance(RENTAL_PROPERTY_DEFAULTS.maintenance);
    setManagementFee(RENTAL_PROPERTY_DEFAULTS.managementFee);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={10000} max={5000000} step={5000} showSlider />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={purchasePrice} step={1000} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={0} max={15} step={0.1} showSlider />
      <NumberInput label="Loan Term (years)" value={loanTerm} onChange={setLoanTerm} min={1} max={30} step={1} showSlider />
      <NumberInput label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} prefix="$" min={0} max={20000} step={50} showSlider />
      <NumberInput label="Vacancy Rate" value={vacancyRate} onChange={setVacancyRate} prefix="%" min={0} max={50} step={1} showSlider />
      <NumberInput label="Property Tax / Year" value={propertyTax} onChange={setPropertyTax} prefix="$" min={0} max={50000} step={100} />
      <NumberInput label="Insurance / Year" value={insurance} onChange={setInsurance} prefix="$" min={0} max={20000} step={100} />
      <NumberInput label="Maintenance / Year" value={maintenance} onChange={setMaintenance} prefix="$" min={0} max={20000} step={100} />
      <NumberInput label="Management Fee" value={managementFee} onChange={setManagementFee} prefix="%" min={0} max={30} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Cash Flow" value={formatCurrency(results.monthlyCashFlow)} size="large" variant={results.monthlyCashFlow >= 0 ? "accent" : "danger"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Cash Flow" value={formatCurrency(results.annualCashFlow)} size="small" variant={results.annualCashFlow >= 0 ? "accent" : "danger"} />
        <ResultCard label="Total Monthly Expenses" value={formatCurrency(results.totalMonthlyExpenses)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Cash-on-Cash Return" value={`${results.cashOnCashReturn.toFixed(2)}%`} size="small" variant="neutral" />
        <ResultCard label="Cap Rate" value={`${results.capRate.toFixed(2)}%`} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   2. CapRateCalculator
   ═══════════════════════════════════════════════════════════ */

const CAP_RATE_DEFAULTS = {
  propertyValue: 400000,
  grossAnnualRent: 36000,
  vacancyRate: 5,
  annualOperatingExpenses: 8000,
};

export function CapRateCalculator() {
  const [propertyValue, setPropertyValue] = useState(CAP_RATE_DEFAULTS.propertyValue);
  const [grossAnnualRent, setGrossAnnualRent] = useState(CAP_RATE_DEFAULTS.grossAnnualRent);
  const [vacancyRate, setVacancyRate] = useState(CAP_RATE_DEFAULTS.vacancyRate);
  const [annualOperatingExpenses, setAnnualOperatingExpenses] = useState(CAP_RATE_DEFAULTS.annualOperatingExpenses);

  const results = useMemo(() => {
    const effectiveGrossIncome = grossAnnualRent * (1 - vacancyRate / 100);
    const noi = effectiveGrossIncome - annualOperatingExpenses;
    const capRate = propertyValue > 0 ? (noi / propertyValue) * 100 : 0;
    const valueAt5 = noi > 0 ? noi / 0.05 : 0;
    const valueAt7 = noi > 0 ? noi / 0.07 : 0;
    const valueAt10 = noi > 0 ? noi / 0.10 : 0;
    return { noi, capRate, valueAt5, valueAt7, valueAt10 };
  }, [propertyValue, grossAnnualRent, vacancyRate, annualOperatingExpenses]);

  function resetDefaults() {
    setPropertyValue(CAP_RATE_DEFAULTS.propertyValue);
    setGrossAnnualRent(CAP_RATE_DEFAULTS.grossAnnualRent);
    setVacancyRate(CAP_RATE_DEFAULTS.vacancyRate);
    setAnnualOperatingExpenses(CAP_RATE_DEFAULTS.annualOperatingExpenses);
  }

  const inputs = (
    <>
      <NumberInput label="Property Value" value={propertyValue} onChange={setPropertyValue} prefix="$" min={10000} max={10000000} step={5000} showSlider />
      <NumberInput label="Gross Annual Rent" value={grossAnnualRent} onChange={setGrossAnnualRent} prefix="$" min={0} max={500000} step={1000} showSlider />
      <NumberInput label="Vacancy Rate" value={vacancyRate} onChange={setVacancyRate} prefix="%" min={0} max={50} step={1} showSlider />
      <NumberInput label="Annual Operating Expenses" value={annualOperatingExpenses} onChange={setAnnualOperatingExpenses} prefix="$" min={0} max={200000} step={500} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Net Operating Income (NOI)" value={formatCurrency(results.noi)} size="large" />
      <ResultCard label="Cap Rate" value={`${results.capRate.toFixed(2)}%`} size="large" variant={results.capRate > 0 ? "accent" : "danger"} />
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Value at Different Cap Rates</p>
        <div className="grid grid-cols-3 gap-4">
          <ResultCard label="At 5% Cap" value={formatCurrency(results.valueAt5)} size="small" variant="neutral" />
          <ResultCard label="At 7% Cap" value={formatCurrency(results.valueAt7)} size="small" variant="neutral" />
          <ResultCard label="At 10% Cap" value={formatCurrency(results.valueAt10)} size="small" variant="neutral" />
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   3. CashOnCashReturnCalculator
   ═══════════════════════════════════════════════════════════ */

const COC_DEFAULTS = {
  purchasePrice: 350000,
  downPayment: 70000,
  closingCosts: 8000,
  annualPreTaxCashFlow: 7200,
};

export function CashOnCashReturnCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(COC_DEFAULTS.purchasePrice);
  const [downPayment, setDownPayment] = useState(COC_DEFAULTS.downPayment);
  const [closingCosts, setClosingCosts] = useState(COC_DEFAULTS.closingCosts);
  const [annualPreTaxCashFlow, setAnnualPreTaxCashFlow] = useState(COC_DEFAULTS.annualPreTaxCashFlow);

  const results = useMemo(() => {
    const totalCashInvested = downPayment + closingCosts;
    const cashOnCashReturn = totalCashInvested > 0 ? (annualPreTaxCashFlow / totalCashInvested) * 100 : 0;
    const stockMarketAvg = 10;
    const difference = cashOnCashReturn - stockMarketAvg;
    return { totalCashInvested, cashOnCashReturn, stockMarketAvg, difference };
  }, [purchasePrice, downPayment, closingCosts, annualPreTaxCashFlow]);

  function resetDefaults() {
    setPurchasePrice(COC_DEFAULTS.purchasePrice);
    setDownPayment(COC_DEFAULTS.downPayment);
    setClosingCosts(COC_DEFAULTS.closingCosts);
    setAnnualPreTaxCashFlow(COC_DEFAULTS.annualPreTaxCashFlow);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={10000} max={5000000} step={5000} showSlider />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={purchasePrice} step={1000} showSlider />
      <NumberInput label="Closing Costs" value={closingCosts} onChange={setClosingCosts} prefix="$" min={0} max={50000} step={500} />
      <NumberInput label="Annual Pre-Tax Cash Flow" value={annualPreTaxCashFlow} onChange={setAnnualPreTaxCashFlow} prefix="$" min={-50000} max={200000} step={500} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Cash Invested" value={formatCurrency(results.totalCashInvested)} size="large" />
      <ResultCard label="Cash-on-Cash Return" value={`${results.cashOnCashReturn.toFixed(2)}%`} size="large" variant={results.cashOnCashReturn > 0 ? "accent" : "danger"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Stock Market Avg" value={`${results.stockMarketAvg.toFixed(1)}%`} size="small" variant="neutral" />
        <ResultCard label="Difference" value={`${results.difference >= 0 ? "+" : ""}${results.difference.toFixed(2)}%`} size="small" variant={results.difference >= 0 ? "accent" : "danger"} />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   4. RentalYieldCalculator
   ═══════════════════════════════════════════════════════════ */

const RENTAL_YIELD_DEFAULTS = {
  propertyValue: 350000,
  monthlyRent: 2500,
  annualExpenses: 6000,
};

export function RentalYieldCalculator() {
  const [propertyValue, setPropertyValue] = useState(RENTAL_YIELD_DEFAULTS.propertyValue);
  const [monthlyRent, setMonthlyRent] = useState(RENTAL_YIELD_DEFAULTS.monthlyRent);
  const [annualExpenses, setAnnualExpenses] = useState(RENTAL_YIELD_DEFAULTS.annualExpenses);

  const results = useMemo(() => {
    const annualGrossIncome = monthlyRent * 12;
    const annualNetIncome = annualGrossIncome - annualExpenses;
    const grossRentalYield = propertyValue > 0 ? (annualGrossIncome / propertyValue) * 100 : 0;
    const netRentalYield = propertyValue > 0 ? (annualNetIncome / propertyValue) * 100 : 0;
    return { grossRentalYield, netRentalYield, annualGrossIncome, annualNetIncome };
  }, [propertyValue, monthlyRent, annualExpenses]);

  function resetDefaults() {
    setPropertyValue(RENTAL_YIELD_DEFAULTS.propertyValue);
    setMonthlyRent(RENTAL_YIELD_DEFAULTS.monthlyRent);
    setAnnualExpenses(RENTAL_YIELD_DEFAULTS.annualExpenses);
  }

  const inputs = (
    <>
      <NumberInput label="Property Value" value={propertyValue} onChange={setPropertyValue} prefix="$" min={10000} max={5000000} step={5000} showSlider />
      <NumberInput label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} prefix="$" min={0} max={20000} step={50} showSlider />
      <NumberInput label="Annual Expenses" value={annualExpenses} onChange={setAnnualExpenses} prefix="$" min={0} max={100000} step={500} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Gross Rental Yield" value={`${results.grossRentalYield.toFixed(2)}%`} size="large" variant="accent" />
        <ResultCard label="Net Rental Yield" value={`${results.netRentalYield.toFixed(2)}%`} size="large" variant={results.netRentalYield > 0 ? "accent" : "danger"} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Gross Income" value={formatCurrency(results.annualGrossIncome)} size="small" variant="neutral" />
        <ResultCard label="Annual Net Income" value={formatCurrency(results.annualNetIncome)} size="small" variant={results.annualNetIncome >= 0 ? "neutral" : "danger"} />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   5. HouseFlippingCalculator
   ═══════════════════════════════════════════════════════════ */

const FLIP_DEFAULTS = {
  purchasePrice: 200000,
  rehabCosts: 50000,
  holdingCostsPerMonth: 2000,
  holdingPeriodMonths: 4,
  arv: 320000,
  sellingCostsPct: 8,
};

export function HouseFlippingCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(FLIP_DEFAULTS.purchasePrice);
  const [rehabCosts, setRehabCosts] = useState(FLIP_DEFAULTS.rehabCosts);
  const [holdingCostsPerMonth, setHoldingCostsPerMonth] = useState(FLIP_DEFAULTS.holdingCostsPerMonth);
  const [holdingPeriodMonths, setHoldingPeriodMonths] = useState(FLIP_DEFAULTS.holdingPeriodMonths);
  const [arv, setArv] = useState(FLIP_DEFAULTS.arv);
  const [sellingCostsPct, setSellingCostsPct] = useState(FLIP_DEFAULTS.sellingCostsPct);

  const results = useMemo(() => {
    const totalHoldingCosts = holdingCostsPerMonth * holdingPeriodMonths;
    const totalInvestment = purchasePrice + rehabCosts + totalHoldingCosts;
    const sellingCosts = arv * (sellingCostsPct / 100);
    const netSaleProceeds = arv - sellingCosts;
    const profit = netSaleProceeds - totalInvestment;
    const roi = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
    const profitMargin = arv > 0 ? (profit / arv) * 100 : 0;
    return { totalInvestment, profit, roi, profitMargin };
  }, [purchasePrice, rehabCosts, holdingCostsPerMonth, holdingPeriodMonths, arv, sellingCostsPct]);

  function resetDefaults() {
    setPurchasePrice(FLIP_DEFAULTS.purchasePrice);
    setRehabCosts(FLIP_DEFAULTS.rehabCosts);
    setHoldingCostsPerMonth(FLIP_DEFAULTS.holdingCostsPerMonth);
    setHoldingPeriodMonths(FLIP_DEFAULTS.holdingPeriodMonths);
    setArv(FLIP_DEFAULTS.arv);
    setSellingCostsPct(FLIP_DEFAULTS.sellingCostsPct);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={10000} max={2000000} step={5000} showSlider />
      <NumberInput label="Rehab Costs" value={rehabCosts} onChange={setRehabCosts} prefix="$" min={0} max={500000} step={1000} showSlider />
      <NumberInput label="Holding Costs / Month" value={holdingCostsPerMonth} onChange={setHoldingCostsPerMonth} prefix="$" min={0} max={10000} step={100} />
      <NumberInput label="Holding Period (months)" value={holdingPeriodMonths} onChange={setHoldingPeriodMonths} min={1} max={24} step={1} showSlider />
      <NumberInput label="After Repair Value (ARV)" value={arv} onChange={setArv} prefix="$" min={10000} max={5000000} step={5000} showSlider />
      <NumberInput label="Selling Costs %" value={sellingCostsPct} onChange={setSellingCostsPct} prefix="%" min={0} max={15} step={0.5} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Profit" value={formatCurrency(results.profit)} size="large" variant={results.profit >= 0 ? "accent" : "danger"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Investment" value={formatCurrency(results.totalInvestment)} size="small" variant="neutral" />
        <ResultCard label="ROI" value={`${results.roi.toFixed(1)}%`} size="small" variant={results.roi >= 0 ? "accent" : "danger"} />
      </div>
      <ResultCard label="Profit Margin" value={`${results.profitMargin.toFixed(1)}%`} size="small" variant={results.profitMargin >= 0 ? "accent" : "danger"} />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   6. PropertyRoiCalculator
   ═══════════════════════════════════════════════════════════ */

const PROP_ROI_DEFAULTS = {
  purchasePrice: 300000,
  currentValue: 380000,
  totalRentalIncome: 120000,
  totalExpenses: 60000,
  yearsHeld: 5,
};

export function PropertyRoiCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(PROP_ROI_DEFAULTS.purchasePrice);
  const [currentValue, setCurrentValue] = useState(PROP_ROI_DEFAULTS.currentValue);
  const [totalRentalIncome, setTotalRentalIncome] = useState(PROP_ROI_DEFAULTS.totalRentalIncome);
  const [totalExpenses, setTotalExpenses] = useState(PROP_ROI_DEFAULTS.totalExpenses);
  const [yearsHeld, setYearsHeld] = useState(PROP_ROI_DEFAULTS.yearsHeld);

  const results = useMemo(() => {
    const appreciationGain = currentValue - purchasePrice;
    const netRentalIncome = totalRentalIncome - totalExpenses;
    const totalGain = appreciationGain + netRentalIncome;
    const totalROI = purchasePrice > 0 ? (totalGain / purchasePrice) * 100 : 0;
    const annualizedROI = yearsHeld > 0 ? (Math.pow(1 + totalGain / purchasePrice, 1 / yearsHeld) - 1) * 100 : 0;
    return { totalROI, annualizedROI, appreciationGain, netRentalIncome };
  }, [purchasePrice, currentValue, totalRentalIncome, totalExpenses, yearsHeld]);

  function resetDefaults() {
    setPurchasePrice(PROP_ROI_DEFAULTS.purchasePrice);
    setCurrentValue(PROP_ROI_DEFAULTS.currentValue);
    setTotalRentalIncome(PROP_ROI_DEFAULTS.totalRentalIncome);
    setTotalExpenses(PROP_ROI_DEFAULTS.totalExpenses);
    setYearsHeld(PROP_ROI_DEFAULTS.yearsHeld);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={10000} max={5000000} step={5000} showSlider />
      <NumberInput label="Current Value" value={currentValue} onChange={setCurrentValue} prefix="$" min={10000} max={10000000} step={5000} showSlider />
      <NumberInput label="Total Rental Income Received" value={totalRentalIncome} onChange={setTotalRentalIncome} prefix="$" min={0} max={1000000} step={1000} />
      <NumberInput label="Total Expenses Paid" value={totalExpenses} onChange={setTotalExpenses} prefix="$" min={0} max={1000000} step={1000} />
      <NumberInput label="Years Held" value={yearsHeld} onChange={setYearsHeld} min={1} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total ROI" value={`${results.totalROI.toFixed(2)}%`} size="large" variant={results.totalROI >= 0 ? "accent" : "danger"} />
        <ResultCard label="Annualized ROI" value={`${results.annualizedROI.toFixed(2)}%`} size="large" variant={results.annualizedROI >= 0 ? "accent" : "danger"} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Appreciation Gain" value={formatCurrency(results.appreciationGain)} size="small" variant={results.appreciationGain >= 0 ? "neutral" : "danger"} />
        <ResultCard label="Net Rental Income" value={formatCurrency(results.netRentalIncome)} size="small" variant={results.netRentalIncome >= 0 ? "neutral" : "danger"} />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   7. RealEstateCommissionCalculator
   ═══════════════════════════════════════════════════════════ */

const COMMISSION_DEFAULTS = {
  salePrice: 450000,
  listingAgentPct: 3,
  buyerAgentPct: 3,
};

export function RealEstateCommissionCalculator() {
  const [salePrice, setSalePrice] = useState(COMMISSION_DEFAULTS.salePrice);
  const [listingAgentPct, setListingAgentPct] = useState(COMMISSION_DEFAULTS.listingAgentPct);
  const [buyerAgentPct, setBuyerAgentPct] = useState(COMMISSION_DEFAULTS.buyerAgentPct);

  const results = useMemo(() => {
    const listingAgentShare = salePrice * (listingAgentPct / 100);
    const buyerAgentShare = salePrice * (buyerAgentPct / 100);
    const totalCommission = listingAgentShare + buyerAgentShare;
    const sellerNetProceeds = salePrice - totalCommission;
    return { totalCommission, listingAgentShare, buyerAgentShare, sellerNetProceeds };
  }, [salePrice, listingAgentPct, buyerAgentPct]);

  function resetDefaults() {
    setSalePrice(COMMISSION_DEFAULTS.salePrice);
    setListingAgentPct(COMMISSION_DEFAULTS.listingAgentPct);
    setBuyerAgentPct(COMMISSION_DEFAULTS.buyerAgentPct);
  }

  const inputs = (
    <>
      <NumberInput label="Sale Price" value={salePrice} onChange={setSalePrice} prefix="$" min={10000} max={10000000} step={5000} showSlider />
      <NumberInput label="Listing Agent Commission %" value={listingAgentPct} onChange={setListingAgentPct} prefix="%" min={0} max={10} step={0.25} showSlider />
      <NumberInput label="Buyer Agent Commission %" value={buyerAgentPct} onChange={setBuyerAgentPct} prefix="%" min={0} max={10} step={0.25} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Commission" value={formatCurrency(results.totalCommission)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Listing Agent Share" value={formatCurrency(results.listingAgentShare)} size="small" variant="neutral" />
        <ResultCard label="Buyer Agent Share" value={formatCurrency(results.buyerAgentShare)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Seller Net Proceeds" value={formatCurrency(results.sellerNetProceeds)} size="large" variant="accent" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   8. RentAffordabilityCalculator
   ═══════════════════════════════════════════════════════════ */

const RENT_AFFORD_DEFAULTS = {
  monthlyGrossIncome: 6000,
  otherMonthlyDebts: 500,
  maxRentToIncomeRatio: 30,
};

export function RentAffordabilityCalculator() {
  const [monthlyGrossIncome, setMonthlyGrossIncome] = useState(RENT_AFFORD_DEFAULTS.monthlyGrossIncome);
  const [otherMonthlyDebts, setOtherMonthlyDebts] = useState(RENT_AFFORD_DEFAULTS.otherMonthlyDebts);
  const [maxRentToIncomeRatio, setMaxRentToIncomeRatio] = useState(RENT_AFFORD_DEFAULTS.maxRentToIncomeRatio);

  const results = useMemo(() => {
    const maxAffordableRent = monthlyGrossIncome * (maxRentToIncomeRatio / 100);
    const recommendedLow = monthlyGrossIncome * 0.25;
    const recommendedHigh = monthlyGrossIncome * 0.30;
    const leftAfterRentAndDebts = monthlyGrossIncome - maxAffordableRent - otherMonthlyDebts;
    return { maxAffordableRent, recommendedLow, recommendedHigh, leftAfterRentAndDebts };
  }, [monthlyGrossIncome, otherMonthlyDebts, maxRentToIncomeRatio]);

  function resetDefaults() {
    setMonthlyGrossIncome(RENT_AFFORD_DEFAULTS.monthlyGrossIncome);
    setOtherMonthlyDebts(RENT_AFFORD_DEFAULTS.otherMonthlyDebts);
    setMaxRentToIncomeRatio(RENT_AFFORD_DEFAULTS.maxRentToIncomeRatio);
  }

  const inputs = (
    <>
      <NumberInput label="Monthly Gross Income" value={monthlyGrossIncome} onChange={setMonthlyGrossIncome} prefix="$" min={0} max={50000} step={100} showSlider />
      <NumberInput label="Other Monthly Debts" value={otherMonthlyDebts} onChange={setOtherMonthlyDebts} prefix="$" min={0} max={20000} step={50} />
      <NumberInput label="Max Rent-to-Income Ratio" value={maxRentToIncomeRatio} onChange={setMaxRentToIncomeRatio} prefix="%" min={10} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Max Affordable Rent" value={formatCurrency(results.maxAffordableRent)} size="large" variant="accent" />
      <ResultCard label="Recommended Rent Range" value={`${formatCurrency(results.recommendedLow)} – ${formatCurrency(results.recommendedHigh)}`} size="small" variant="neutral" />
      <ResultCard label="Left After Rent & Debts" value={formatCurrency(results.leftAfterRentAndDebts)} size="small" variant={results.leftAfterRentAndDebts >= 0 ? "accent" : "danger"} />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   9. PropertyAppreciationCalculator
   ═══════════════════════════════════════════════════════════ */

const APPRECIATION_DEFAULTS = {
  currentValue: 400000,
  appreciationRate: 3.5,
  yearsToProject: 10,
};

export function PropertyAppreciationCalculator() {
  const [currentValue, setCurrentValue] = useState(APPRECIATION_DEFAULTS.currentValue);
  const [appreciationRate, setAppreciationRate] = useState(APPRECIATION_DEFAULTS.appreciationRate);
  const [yearsToProject, setYearsToProject] = useState(APPRECIATION_DEFAULTS.yearsToProject);

  const results = useMemo(() => {
    const futureValue = fv(currentValue, appreciationRate, yearsToProject);
    const totalAppreciation = futureValue - currentValue;
    const valueAt5 = fv(currentValue, appreciationRate, 5);
    const valueAt10 = fv(currentValue, appreciationRate, 10);
    const valueAt15 = fv(currentValue, appreciationRate, 15);
    const valueAt20 = fv(currentValue, appreciationRate, 20);
    const valueAt30 = fv(currentValue, appreciationRate, 30);
    return { futureValue, totalAppreciation, valueAt5, valueAt10, valueAt15, valueAt20, valueAt30 };
  }, [currentValue, appreciationRate, yearsToProject]);

  function resetDefaults() {
    setCurrentValue(APPRECIATION_DEFAULTS.currentValue);
    setAppreciationRate(APPRECIATION_DEFAULTS.appreciationRate);
    setYearsToProject(APPRECIATION_DEFAULTS.yearsToProject);
  }

  const inputs = (
    <>
      <NumberInput label="Current Value" value={currentValue} onChange={setCurrentValue} prefix="$" min={10000} max={10000000} step={5000} showSlider />
      <NumberInput label="Annual Appreciation Rate" value={appreciationRate} onChange={setAppreciationRate} prefix="%" min={0} max={20} step={0.1} showSlider />
      <NumberInput label="Years to Project" value={yearsToProject} onChange={setYearsToProject} min={1} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label={`Future Value (${yearsToProject} yrs)`} value={formatCurrency(results.futureValue)} size="large" variant="accent" />
      <ResultCard label="Total Appreciation" value={formatCurrency(results.totalAppreciation)} size="small" variant="neutral" />
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Value Over Time</p>
        <div className="grid grid-cols-2 gap-4">
          <ResultCard label="5 Years" value={formatCurrency(results.valueAt5)} size="small" variant="neutral" />
          <ResultCard label="10 Years" value={formatCurrency(results.valueAt10)} size="small" variant="neutral" />
          <ResultCard label="15 Years" value={formatCurrency(results.valueAt15)} size="small" variant="neutral" />
          <ResultCard label="20 Years" value={formatCurrency(results.valueAt20)} size="small" variant="neutral" />
        </div>
        <ResultCard label="30 Years" value={formatCurrency(results.valueAt30)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   10. TenThirtyOneExchangeCalculator
   ═══════════════════════════════════════════════════════════ */

const EXCHANGE_1031_DEFAULTS = {
  salePrice: 500000,
  adjustedBasis: 350000,
  depreciationRecaptured: 60000,
  replacementPropertyPrice: 550000,
};

export function TenThirtyOneExchangeCalculator() {
  const [salePrice, setSalePrice] = useState(EXCHANGE_1031_DEFAULTS.salePrice);
  const [adjustedBasis, setAdjustedBasis] = useState(EXCHANGE_1031_DEFAULTS.adjustedBasis);
  const [depreciationRecaptured, setDepreciationRecaptured] = useState(EXCHANGE_1031_DEFAULTS.depreciationRecaptured);
  const [replacementPropertyPrice, setReplacementPropertyPrice] = useState(EXCHANGE_1031_DEFAULTS.replacementPropertyPrice);

  const results = useMemo(() => {
    const capitalGain = salePrice - adjustedBasis;
    const boot = Math.max(0, salePrice - replacementPropertyPrice);
    const capitalGainDeferred = boot > 0 ? Math.max(0, capitalGain - boot) : capitalGain;
    const depreciationRecaptureDeferred = boot > 0 ? Math.max(0, depreciationRecaptured - Math.max(0, boot - capitalGain)) : depreciationRecaptured;
    const capitalGainsTaxRate = 0.15;
    const recaptureRate = 0.25;
    const taxSavings = capitalGainDeferred * capitalGainsTaxRate + depreciationRecaptureDeferred * recaptureRate;
    return { capitalGain, capitalGainDeferred, depreciationRecaptureDeferred, taxSavings, boot };
  }, [salePrice, adjustedBasis, depreciationRecaptured, replacementPropertyPrice]);

  function resetDefaults() {
    setSalePrice(EXCHANGE_1031_DEFAULTS.salePrice);
    setAdjustedBasis(EXCHANGE_1031_DEFAULTS.adjustedBasis);
    setDepreciationRecaptured(EXCHANGE_1031_DEFAULTS.depreciationRecaptured);
    setReplacementPropertyPrice(EXCHANGE_1031_DEFAULTS.replacementPropertyPrice);
  }

  const inputs = (
    <>
      <NumberInput label="Sale Price (Relinquished Property)" value={salePrice} onChange={setSalePrice} prefix="$" min={10000} max={10000000} step={5000} showSlider />
      <NumberInput label="Adjusted Basis" value={adjustedBasis} onChange={setAdjustedBasis} prefix="$" min={0} max={10000000} step={5000} showSlider />
      <NumberInput label="Depreciation Recaptured" value={depreciationRecaptured} onChange={setDepreciationRecaptured} prefix="$" min={0} max={1000000} step={1000} />
      <NumberInput label="Replacement Property Price" value={replacementPropertyPrice} onChange={setReplacementPropertyPrice} prefix="$" min={10000} max={20000000} step={5000} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Tax Savings Estimate" value={formatCurrency(results.taxSavings)} size="large" variant="accent" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Capital Gain Deferred" value={formatCurrency(results.capitalGainDeferred)} size="small" variant="neutral" />
        <ResultCard label="Depreciation Recapture Deferred" value={formatCurrency(results.depreciationRecaptureDeferred)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Capital Gain" value={formatCurrency(results.capitalGain)} size="small" variant="neutral" />
        <ResultCard label="Boot (Taxable)" value={formatCurrency(results.boot)} size="small" variant={results.boot > 0 ? "danger" : "neutral"} />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   11. RealEstateInvestmentCalculator
   ═══════════════════════════════════════════════════════════ */

const RE_INVEST_DEFAULTS = {
  purchasePrice: 350000,
  downPayment: 70000,
  loanRate: 7.0,
  loanTerm: 30,
  monthlyRent: 2500,
  appreciationRate: 3.5,
  expenseRatio: 35,
  yearsToHold: 10,
};

export function RealEstateInvestmentCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(RE_INVEST_DEFAULTS.purchasePrice);
  const [downPayment, setDownPayment] = useState(RE_INVEST_DEFAULTS.downPayment);
  const [loanRate, setLoanRate] = useState(RE_INVEST_DEFAULTS.loanRate);
  const [loanTerm, setLoanTerm] = useState(RE_INVEST_DEFAULTS.loanTerm);
  const [monthlyRent, setMonthlyRent] = useState(RE_INVEST_DEFAULTS.monthlyRent);
  const [appreciationRate, setAppreciationRate] = useState(RE_INVEST_DEFAULTS.appreciationRate);
  const [expenseRatio, setExpenseRatio] = useState(RE_INVEST_DEFAULTS.expenseRatio);
  const [yearsToHold, setYearsToHold] = useState(RE_INVEST_DEFAULTS.yearsToHold);

  const results = useMemo(() => {
    const loanAmount = purchasePrice - downPayment;
    const monthlyPayment = pmt(loanAmount, loanRate, loanTerm * 12);
    const monthlyExpenses = monthlyRent * (expenseRatio / 100);
    const monthlyCashFlow = monthlyRent - monthlyExpenses - monthlyPayment;
    const totalCashFlow = monthlyCashFlow * 12 * yearsToHold;

    // Appreciation
    const futureValue = fv(purchasePrice, appreciationRate, yearsToHold);
    const appreciationGain = futureValue - purchasePrice;

    // Equity buildup from loan paydown
    const r = loanRate / 100 / 12;
    let balance = loanAmount;
    for (let i = 0; i < yearsToHold * 12; i++) {
      const interestPayment = balance * r;
      const principalPayment = monthlyPayment - interestPayment;
      balance = Math.max(0, balance - principalPayment);
    }
    const equityBuildup = loanAmount - balance;
    const totalEquityAtEnd = downPayment + equityBuildup + appreciationGain;

    const totalReturn = totalCashFlow + appreciationGain + equityBuildup;
    const annualizedReturn = downPayment > 0 && yearsToHold > 0
      ? (Math.pow(1 + totalReturn / downPayment, 1 / yearsToHold) - 1) * 100
      : 0;

    return { totalReturn, annualizedReturn, totalEquityAtEnd, totalCashFlow };
  }, [purchasePrice, downPayment, loanRate, loanTerm, monthlyRent, appreciationRate, expenseRatio, yearsToHold]);

  function resetDefaults() {
    setPurchasePrice(RE_INVEST_DEFAULTS.purchasePrice);
    setDownPayment(RE_INVEST_DEFAULTS.downPayment);
    setLoanRate(RE_INVEST_DEFAULTS.loanRate);
    setLoanTerm(RE_INVEST_DEFAULTS.loanTerm);
    setMonthlyRent(RE_INVEST_DEFAULTS.monthlyRent);
    setAppreciationRate(RE_INVEST_DEFAULTS.appreciationRate);
    setExpenseRatio(RE_INVEST_DEFAULTS.expenseRatio);
    setYearsToHold(RE_INVEST_DEFAULTS.yearsToHold);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={10000} max={5000000} step={5000} showSlider />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={purchasePrice} step={1000} showSlider />
      <NumberInput label="Loan Rate" value={loanRate} onChange={setLoanRate} prefix="%" min={0} max={15} step={0.1} showSlider />
      <NumberInput label="Loan Term (years)" value={loanTerm} onChange={setLoanTerm} min={1} max={30} step={1} showSlider />
      <NumberInput label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} prefix="$" min={0} max={20000} step={50} showSlider />
      <NumberInput label="Appreciation Rate" value={appreciationRate} onChange={setAppreciationRate} prefix="%" min={0} max={15} step={0.1} showSlider />
      <NumberInput label="Expense Ratio" value={expenseRatio} onChange={setExpenseRatio} prefix="%" min={0} max={80} step={1} showSlider />
      <NumberInput label="Years to Hold" value={yearsToHold} onChange={setYearsToHold} min={1} max={40} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Return" value={formatCurrency(results.totalReturn)} size="large" variant={results.totalReturn >= 0 ? "accent" : "danger"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annualized Return" value={`${results.annualizedReturn.toFixed(2)}%`} size="small" variant={results.annualizedReturn >= 0 ? "accent" : "danger"} />
        <ResultCard label="Equity at End" value={formatCurrency(results.totalEquityAtEnd)} size="small" variant="neutral" />
      </div>
      <ResultCard label={`Total Cash Flow (${yearsToHold} yrs)`} value={formatCurrency(results.totalCashFlow)} size="small" variant={results.totalCashFlow >= 0 ? "neutral" : "danger"} />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   12. VacancyRateCalculator
   ═══════════════════════════════════════════════════════════ */

const VACANCY_DEFAULTS = {
  numberOfUnits: 10,
  occupiedUnits: 9,
  daysVacantPerYear: 30,
  monthlyRentPerUnit: 1500,
};

export function VacancyRateCalculator() {
  const [numberOfUnits, setNumberOfUnits] = useState(VACANCY_DEFAULTS.numberOfUnits);
  const [occupiedUnits, setOccupiedUnits] = useState(VACANCY_DEFAULTS.occupiedUnits);
  const [daysVacantPerYear, setDaysVacantPerYear] = useState(VACANCY_DEFAULTS.daysVacantPerYear);
  const [monthlyRentPerUnit, setMonthlyRentPerUnit] = useState(VACANCY_DEFAULTS.monthlyRentPerUnit);

  const results = useMemo(() => {
    const vacancyRateByUnits = numberOfUnits > 0 ? ((numberOfUnits - occupiedUnits) / numberOfUnits) * 100 : 0;
    const vacancyRateByDays = (daysVacantPerYear / 365) * 100;
    const averageVacancyRate = (vacancyRateByUnits + vacancyRateByDays) / 2;
    const grossPotentialIncome = numberOfUnits * monthlyRentPerUnit * 12;
    const vacancyLoss = grossPotentialIncome * (averageVacancyRate / 100);
    const effectiveGrossIncome = grossPotentialIncome - vacancyLoss;
    return { vacancyRateByUnits, vacancyRateByDays, averageVacancyRate, effectiveGrossIncome, vacancyLoss, grossPotentialIncome };
  }, [numberOfUnits, occupiedUnits, daysVacantPerYear, monthlyRentPerUnit]);

  function resetDefaults() {
    setNumberOfUnits(VACANCY_DEFAULTS.numberOfUnits);
    setOccupiedUnits(VACANCY_DEFAULTS.occupiedUnits);
    setDaysVacantPerYear(VACANCY_DEFAULTS.daysVacantPerYear);
    setMonthlyRentPerUnit(VACANCY_DEFAULTS.monthlyRentPerUnit);
  }

  const inputs = (
    <>
      <NumberInput label="Number of Units" value={numberOfUnits} onChange={setNumberOfUnits} min={1} max={500} step={1} showSlider />
      <NumberInput label="Occupied Units" value={occupiedUnits} onChange={setOccupiedUnits} min={0} max={numberOfUnits} step={1} showSlider />
      <NumberInput label="Days Vacant / Year (per unit avg)" value={daysVacantPerYear} onChange={setDaysVacantPerYear} min={0} max={365} step={1} showSlider />
      <NumberInput label="Monthly Rent / Unit" value={monthlyRentPerUnit} onChange={setMonthlyRentPerUnit} prefix="$" min={0} max={10000} step={50} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Vacancy Rate (by units)" value={`${results.vacancyRateByUnits.toFixed(1)}%`} size="small" variant={results.vacancyRateByUnits > 10 ? "danger" : "neutral"} />
        <ResultCard label="Vacancy Rate (by days)" value={`${results.vacancyRateByDays.toFixed(1)}%`} size="small" variant={results.vacancyRateByDays > 10 ? "danger" : "neutral"} />
      </div>
      <ResultCard label="Effective Gross Income" value={formatCurrency(results.effectiveGrossIncome)} size="large" variant="accent" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Income Loss" value={formatCurrency(results.vacancyLoss)} size="small" variant="danger" />
        <ResultCard label="Gross Potential Income" value={formatCurrency(results.grossPotentialIncome)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
