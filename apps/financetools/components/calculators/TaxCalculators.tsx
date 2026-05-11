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

/* ───────────────────────── shared helpers ───────────────────────── */

type FilingStatus = "single" | "married_jointly" | "married_separately" | "head_of_household";

const FILING_STATUS_OPTIONS: { value: FilingStatus; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "married_jointly", label: "Married Filing Jointly" },
  { value: "married_separately", label: "Married Filing Separately" },
  { value: "head_of_household", label: "Head of Household" },
];

/* 2026 federal income tax brackets */
const BRACKETS_2026: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  married_jointly: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 },
  ],
  married_separately: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 375800, rate: 0.35 },
    { min: 375800, max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 17000, rate: 0.10 },
    { min: 17000, max: 64850, rate: 0.12 },
    { min: 64850, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTIONS_2026: Record<FilingStatus, number> = {
  single: 15700,
  married_jointly: 31400,
  married_separately: 15700,
  head_of_household: 23500,
};

function computeFederalTax(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = BRACKETS_2026[filingStatus];
  let tax = 0;
  let remaining = Math.max(0, taxableIncome);
  for (const b of brackets) {
    const width = b.max - b.min;
    const taxable = Math.min(remaining, width);
    tax += taxable * b.rate;
    remaining -= taxable;
    if (remaining <= 0) break;
  }
  return tax;
}

function getMarginalRate(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = BRACKETS_2026[filingStatus];
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (taxableIncome > brackets[i].min) return brackets[i].rate;
  }
  return brackets[0].rate;
}

function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

function FilingStatusSelect({ value, onChange }: { value: FilingStatus; onChange: (v: FilingStatus) => void }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Filing Status</Label>
      <Select value={value} onValueChange={(v) => onChange(v as FilingStatus)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {FILING_STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. CapitalGainsTaxCalculator
   ═══════════════════════════════════════════════════════════ */

const CG_DEFAULTS = {
  purchasePrice: 50000,
  salePrice: 80000,
  holdingPeriod: "long" as "short" | "long",
  filingStatus: "single" as FilingStatus,
  ordinaryIncome: 75000,
};

export function CapitalGainsTaxCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(CG_DEFAULTS.purchasePrice);
  const [salePrice, setSalePrice] = useState(CG_DEFAULTS.salePrice);
  const [holdingPeriod, setHoldingPeriod] = useState(CG_DEFAULTS.holdingPeriod);
  const [filingStatus, setFilingStatus] = useState(CG_DEFAULTS.filingStatus);
  const [ordinaryIncome, setOrdinaryIncome] = useState(CG_DEFAULTS.ordinaryIncome);

  const results = useMemo(() => {
    const gain = Math.max(0, salePrice - purchasePrice);
    let taxRate: number;

    if (holdingPeriod === "short") {
      taxRate = getMarginalRate(ordinaryIncome + gain, filingStatus);
    } else {
      // Long-term capital gains thresholds 2026
      const ltThresholds: Record<FilingStatus, { zero: number; fifteen: number }> = {
        single: { zero: 48350, fifteen: 533400 },
        married_jointly: { zero: 96700, fifteen: 600050 },
        married_separately: { zero: 48350, fifteen: 300025 },
        head_of_household: { zero: 64750, fifteen: 566700 },
      };
      const t = ltThresholds[filingStatus];
      if (ordinaryIncome + gain <= t.zero) taxRate = 0;
      else if (ordinaryIncome + gain <= t.fifteen) taxRate = 0.15;
      else taxRate = 0.20;
    }

    const taxOwed = gain * taxRate;
    const netProceeds = salePrice - taxOwed;
    return { gain, taxRate, taxOwed, netProceeds };
  }, [purchasePrice, salePrice, holdingPeriod, filingStatus, ordinaryIncome]);

  function resetDefaults() {
    setPurchasePrice(CG_DEFAULTS.purchasePrice);
    setSalePrice(CG_DEFAULTS.salePrice);
    setHoldingPeriod(CG_DEFAULTS.holdingPeriod);
    setFilingStatus(CG_DEFAULTS.filingStatus);
    setOrdinaryIncome(CG_DEFAULTS.ordinaryIncome);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={0} max={10000000} step={1000} showSlider />
      <NumberInput label="Sale Price" value={salePrice} onChange={setSalePrice} prefix="$" min={0} max={10000000} step={1000} showSlider />
      <div className="space-y-2">
        <Label className="text-sm font-medium">Holding Period</Label>
        <Select value={holdingPeriod} onValueChange={(v) => setHoldingPeriod(v as "short" | "long")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short-Term (&le; 1 year)</SelectItem>
            <SelectItem value="long">Long-Term (&gt; 1 year)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <FilingStatusSelect value={filingStatus} onChange={setFilingStatus} />
      <NumberInput label="Ordinary Income" value={ordinaryIncome} onChange={setOrdinaryIncome} prefix="$" min={0} max={5000000} step={1000} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Capital Gain" value={formatCurrency(results.gain)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Tax Rate" value={formatPercent(results.taxRate)} size="small" variant="neutral" />
        <ResultCard label="Tax Owed" value={formatCurrency(results.taxOwed)} size="small" variant="danger" />
      </div>
      <ResultCard label="Net Proceeds" value={formatCurrency(results.netProceeds)} size="medium" variant="accent" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   2. SalesTaxCalculator
   ═══════════════════════════════════════════════════════════ */

const STATE_SALES_TAX_RATES: { code: string; name: string; rate: number }[] = [
  { code: "AL", name: "Alabama", rate: 4.00 }, { code: "AK", name: "Alaska", rate: 0.00 },
  { code: "AZ", name: "Arizona", rate: 5.60 }, { code: "AR", name: "Arkansas", rate: 6.50 },
  { code: "CA", name: "California", rate: 7.25 }, { code: "CO", name: "Colorado", rate: 2.90 },
  { code: "CT", name: "Connecticut", rate: 6.35 }, { code: "DE", name: "Delaware", rate: 0.00 },
  { code: "FL", name: "Florida", rate: 6.00 }, { code: "GA", name: "Georgia", rate: 4.00 },
  { code: "HI", name: "Hawaii", rate: 4.00 }, { code: "ID", name: "Idaho", rate: 6.00 },
  { code: "IL", name: "Illinois", rate: 6.25 }, { code: "IN", name: "Indiana", rate: 7.00 },
  { code: "IA", name: "Iowa", rate: 6.00 }, { code: "KS", name: "Kansas", rate: 6.50 },
  { code: "KY", name: "Kentucky", rate: 6.00 }, { code: "LA", name: "Louisiana", rate: 4.45 },
  { code: "ME", name: "Maine", rate: 5.50 }, { code: "MD", name: "Maryland", rate: 6.00 },
  { code: "MA", name: "Massachusetts", rate: 6.25 }, { code: "MI", name: "Michigan", rate: 6.00 },
  { code: "MN", name: "Minnesota", rate: 6.875 }, { code: "MS", name: "Mississippi", rate: 7.00 },
  { code: "MO", name: "Missouri", rate: 4.225 }, { code: "MT", name: "Montana", rate: 0.00 },
  { code: "NE", name: "Nebraska", rate: 5.50 }, { code: "NV", name: "Nevada", rate: 6.85 },
  { code: "NH", name: "New Hampshire", rate: 0.00 }, { code: "NJ", name: "New Jersey", rate: 6.625 },
  { code: "NM", name: "New Mexico", rate: 4.875 }, { code: "NY", name: "New York", rate: 4.00 },
  { code: "NC", name: "North Carolina", rate: 4.75 }, { code: "ND", name: "North Dakota", rate: 5.00 },
  { code: "OH", name: "Ohio", rate: 5.75 }, { code: "OK", name: "Oklahoma", rate: 4.50 },
  { code: "OR", name: "Oregon", rate: 0.00 }, { code: "PA", name: "Pennsylvania", rate: 6.00 },
  { code: "RI", name: "Rhode Island", rate: 7.00 }, { code: "SC", name: "South Carolina", rate: 6.00 },
  { code: "SD", name: "South Dakota", rate: 4.20 }, { code: "TN", name: "Tennessee", rate: 7.00 },
  { code: "TX", name: "Texas", rate: 6.25 }, { code: "UT", name: "Utah", rate: 6.10 },
  { code: "VT", name: "Vermont", rate: 6.00 }, { code: "VA", name: "Virginia", rate: 5.30 },
  { code: "WA", name: "Washington", rate: 6.50 }, { code: "WV", name: "West Virginia", rate: 6.00 },
  { code: "WI", name: "Wisconsin", rate: 5.00 }, { code: "WY", name: "Wyoming", rate: 4.00 },
  { code: "DC", name: "Washington DC", rate: 6.00 },
];

const ST_DEFAULTS = { purchaseAmount: 500, taxRate: 6.25, stateCode: "TX" };

export function SalesTaxCalculator() {
  const [purchaseAmount, setPurchaseAmount] = useState(ST_DEFAULTS.purchaseAmount);
  const [taxRate, setTaxRate] = useState(ST_DEFAULTS.taxRate);
  const [stateCode, setStateCode] = useState(ST_DEFAULTS.stateCode);

  const results = useMemo(() => {
    const taxAmount = purchaseAmount * (taxRate / 100);
    const totalCost = purchaseAmount + taxAmount;
    const effectiveRate = purchaseAmount > 0 ? taxRate : 0;
    return { taxAmount, totalCost, effectiveRate };
  }, [purchaseAmount, taxRate]);

  function handleStateChange(code: string) {
    setStateCode(code);
    const st = STATE_SALES_TAX_RATES.find((s) => s.code === code);
    if (st) setTaxRate(st.rate);
  }

  function resetDefaults() {
    setPurchaseAmount(ST_DEFAULTS.purchaseAmount);
    setTaxRate(ST_DEFAULTS.taxRate);
    setStateCode(ST_DEFAULTS.stateCode);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Amount" value={purchaseAmount} onChange={setPurchaseAmount} prefix="$" min={0} max={1000000} step={10} showSlider />
      <NumberInput label="Sales Tax Rate" value={taxRate} onChange={setTaxRate} prefix="%" min={0} max={15} step={0.05} showSlider />
      <div className="space-y-2">
        <Label className="text-sm font-medium">State (average rate)</Label>
        <Select value={stateCode} onValueChange={handleStateChange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATE_SALES_TAX_RATES.map((s) => (
              <SelectItem key={s.code} value={s.code}>{s.name} ({s.rate}%)</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Tax Amount" value={formatCurrency(results.taxAmount)} size="large" variant="danger" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Cost" value={formatCurrency(results.totalCost)} size="small" variant="primary" />
        <ResultCard label="Effective Rate" value={`${results.effectiveRate.toFixed(2)}%`} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   3. PropertyTaxCalculator
   ═══════════════════════════════════════════════════════════ */

const PT_DEFAULTS = {
  homeValue: 350000,
  assessmentRatio: 100,
  taxRate: 1.1,
  homesteadExemption: 0,
};

export function PropertyTaxCalculator() {
  const [homeValue, setHomeValue] = useState(PT_DEFAULTS.homeValue);
  const [assessmentRatio, setAssessmentRatio] = useState(PT_DEFAULTS.assessmentRatio);
  const [taxRate, setTaxRate] = useState(PT_DEFAULTS.taxRate);
  const [homesteadExemption, setHomesteadExemption] = useState(PT_DEFAULTS.homesteadExemption);

  const results = useMemo(() => {
    const assessedValue = homeValue * (assessmentRatio / 100);
    const taxableValue = Math.max(0, assessedValue - homesteadExemption);
    const annualTax = taxableValue * (taxRate / 100);
    const monthlyTax = annualTax / 12;
    const effectiveRate = homeValue > 0 ? (annualTax / homeValue) * 100 : 0;
    return { annualTax, monthlyTax, effectiveRate };
  }, [homeValue, assessmentRatio, taxRate, homesteadExemption]);

  function resetDefaults() {
    setHomeValue(PT_DEFAULTS.homeValue);
    setAssessmentRatio(PT_DEFAULTS.assessmentRatio);
    setTaxRate(PT_DEFAULTS.taxRate);
    setHomesteadExemption(PT_DEFAULTS.homesteadExemption);
  }

  const inputs = (
    <>
      <NumberInput label="Home Value" value={homeValue} onChange={setHomeValue} prefix="$" min={10000} max={5000000} step={5000} showSlider />
      <NumberInput label="Assessment Ratio" value={assessmentRatio} onChange={setAssessmentRatio} prefix="%" min={1} max={100} step={1} showSlider />
      <NumberInput label="Tax Rate (%)" value={taxRate} onChange={setTaxRate} prefix="%" min={0} max={5} step={0.01} showSlider />
      <NumberInput label="Homestead Exemption" value={homesteadExemption} onChange={setHomesteadExemption} prefix="$" min={0} max={200000} step={1000} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Annual Property Tax" value={formatCurrency(results.annualTax)} size="large" variant="danger" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly" value={formatCurrency(results.monthlyTax)} size="small" variant="primary" />
        <ResultCard label="Effective Rate" value={`${results.effectiveRate.toFixed(3)}%`} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   4. TaxBracketCalculator
   ═══════════════════════════════════════════════════════════ */

const TB_DEFAULTS = {
  taxableIncome: 95000,
  filingStatus: "single" as FilingStatus,
};

export function TaxBracketCalculator() {
  const [taxableIncome, setTaxableIncome] = useState(TB_DEFAULTS.taxableIncome);
  const [filingStatus, setFilingStatus] = useState(TB_DEFAULTS.filingStatus);

  const results = useMemo(() => {
    const brackets = BRACKETS_2026[filingStatus];
    const taxOwed = computeFederalTax(taxableIncome, filingStatus);
    const marginalRate = getMarginalRate(taxableIncome, filingStatus);
    const effectiveRate = taxableIncome > 0 ? taxOwed / taxableIncome : 0;

    const breakdown = brackets.map((b) => {
      const width = Math.min(b.max, taxableIncome) - b.min;
      const taxable = Math.max(0, width);
      const tax = taxable * b.rate;
      return {
        label: `${(b.rate * 100).toFixed(0)}%`,
        rangeLabel: `${formatCurrency(b.min)} - ${b.max === Infinity ? "+" : formatCurrency(b.max)}`,
        taxable,
        tax,
        rate: b.rate,
        active: taxableIncome > b.min,
      };
    }).filter((b) => b.active);

    return { taxOwed, marginalRate, effectiveRate, breakdown };
  }, [taxableIncome, filingStatus]);

  function resetDefaults() {
    setTaxableIncome(TB_DEFAULTS.taxableIncome);
    setFilingStatus(TB_DEFAULTS.filingStatus);
  }

  const BRACKET_COLORS = [
    "bg-emerald-400", "bg-emerald-500", "bg-yellow-400", "bg-yellow-500",
    "bg-orange-400", "bg-orange-500", "bg-red-500",
  ];

  const inputs = (
    <>
      <NumberInput label="Taxable Income" value={taxableIncome} onChange={setTaxableIncome} prefix="$" min={0} max={2000000} step={1000} showSlider />
      <FilingStatusSelect value={filingStatus} onChange={setFilingStatus} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Tax Owed" value={formatCurrency(results.taxOwed)} size="large" variant="danger" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Marginal Rate" value={formatPercent(results.marginalRate)} size="small" variant="primary" />
        <ResultCard label="Effective Rate" value={formatPercent(results.effectiveRate)} size="small" variant="accent" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Bracket Breakdown</p>
        <div className="flex w-full h-6 rounded-md overflow-hidden">
          {results.breakdown.map((b, i) => {
            const pct = taxableIncome > 0 ? (b.taxable / taxableIncome) * 100 : 0;
            return pct > 0 ? (
              <div key={i} className={`${BRACKET_COLORS[i % BRACKET_COLORS.length]} relative group`} style={{ width: `${pct}%` }} title={`${b.label}: ${formatCurrency(b.tax)}`} />
            ) : null;
          })}
        </div>
        <div className="space-y-1">
          {results.breakdown.map((b, i) => (
            <div key={i} className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm inline-block ${BRACKET_COLORS[i % BRACKET_COLORS.length]}`} />
                <span>{b.label} bracket</span>
              </div>
              <span>{formatCurrency(b.tax)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   5. SelfEmploymentTaxCalculator
   ═══════════════════════════════════════════════════════════ */

const SE_DEFAULTS = { netIncome: 120000 };

export function SelfEmploymentTaxCalculator() {
  const [netIncome, setNetIncome] = useState(SE_DEFAULTS.netIncome);

  const results = useMemo(() => {
    const SS_CAP = 168600;
    const taxableBase = netIncome * 0.9235;
    const ssTaxable = Math.min(taxableBase, SS_CAP);
    const ssTax = ssTaxable * 0.124;
    const medicareTax = taxableBase * 0.029;
    const medicareSurtax = taxableBase > 200000 ? (taxableBase - 200000) * 0.009 : 0;
    const totalSeTax = ssTax + medicareTax + medicareSurtax;
    const deductibleHalf = totalSeTax / 2;
    return { taxableBase, ssTax, medicareTax, medicareSurtax, totalSeTax, deductibleHalf };
  }, [netIncome]);

  function resetDefaults() {
    setNetIncome(SE_DEFAULTS.netIncome);
  }

  const inputs = (
    <>
      <NumberInput label="Net Self-Employment Income" value={netIncome} onChange={setNetIncome} prefix="$" min={0} max={2000000} step={1000} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total SE Tax" value={formatCurrency(results.totalSeTax)} size="large" variant="danger" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Social Security Tax" value={formatCurrency(results.ssTax)} size="small" variant="neutral" />
        <ResultCard label="Medicare Tax" value={formatCurrency(results.medicareTax)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Medicare Surtax" value={formatCurrency(results.medicareSurtax)} size="small" variant={results.medicareSurtax > 0 ? "danger" : "neutral"} />
        <ResultCard label="Deductible Half" value={formatCurrency(results.deductibleHalf)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   6. EstateTaxCalculator
   ═══════════════════════════════════════════════════════════ */

const ET_DEFAULTS = {
  grossEstate: 15000000,
  deductions: 500000,
  exemption: 13610000,
};

export function EstateTaxCalculator() {
  const [grossEstate, setGrossEstate] = useState(ET_DEFAULTS.grossEstate);
  const [deductions, setDeductions] = useState(ET_DEFAULTS.deductions);
  const [exemption, setExemption] = useState(ET_DEFAULTS.exemption);

  const results = useMemo(() => {
    const netEstate = Math.max(0, grossEstate - deductions);
    const taxableEstate = Math.max(0, netEstate - exemption);
    const estateTax = taxableEstate * 0.40;
    const effectiveRate = netEstate > 0 ? (estateTax / netEstate) * 100 : 0;
    const netToHeirs = grossEstate - deductions - estateTax;
    return { taxableEstate, estateTax, effectiveRate, netToHeirs };
  }, [grossEstate, deductions, exemption]);

  function resetDefaults() {
    setGrossEstate(ET_DEFAULTS.grossEstate);
    setDeductions(ET_DEFAULTS.deductions);
    setExemption(ET_DEFAULTS.exemption);
  }

  const inputs = (
    <>
      <NumberInput label="Gross Estate Value" value={grossEstate} onChange={setGrossEstate} prefix="$" min={0} max={100000000} step={50000} showSlider />
      <NumberInput label="Deductions" value={deductions} onChange={setDeductions} prefix="$" min={0} max={50000000} step={10000} showSlider />
      <NumberInput label="Exemption" value={exemption} onChange={setExemption} prefix="$" min={0} max={30000000} step={10000} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estate Tax" value={formatCurrency(results.estateTax)} size="large" variant="danger" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Taxable Estate" value={formatCurrency(results.taxableEstate)} size="small" variant="neutral" />
        <ResultCard label="Effective Rate" value={`${results.effectiveRate.toFixed(2)}%`} size="small" variant="neutral" />
      </div>
      <ResultCard label="Net to Heirs" value={formatCurrency(results.netToHeirs)} size="medium" variant="accent" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   7. GiftTaxCalculator
   ═══════════════════════════════════════════════════════════ */

const GT_DEFAULTS = {
  giftAmount: 25000,
  annualExclusion: 18000,
  lifetimeExemptionUsed: 0,
};

export function GiftTaxCalculator() {
  const [giftAmount, setGiftAmount] = useState(GT_DEFAULTS.giftAmount);
  const [annualExclusion, setAnnualExclusion] = useState(GT_DEFAULTS.annualExclusion);
  const [lifetimeExemptionUsed, setLifetimeExemptionUsed] = useState(GT_DEFAULTS.lifetimeExemptionUsed);

  const results = useMemo(() => {
    const LIFETIME_EXEMPTION = 13610000;
    const annualExclusionCovers = giftAmount <= annualExclusion;
    const taxableGift = Math.max(0, giftAmount - annualExclusion);
    const lifetimeRemaining = Math.max(0, LIFETIME_EXEMPTION - lifetimeExemptionUsed - taxableGift);
    const taxableAfterLifetime = Math.max(0, taxableGift - (LIFETIME_EXEMPTION - lifetimeExemptionUsed));
    const giftTax = taxableAfterLifetime * 0.40;
    return { taxableGift, annualExclusionCovers, lifetimeRemaining, giftTax };
  }, [giftAmount, annualExclusion, lifetimeExemptionUsed]);

  function resetDefaults() {
    setGiftAmount(GT_DEFAULTS.giftAmount);
    setAnnualExclusion(GT_DEFAULTS.annualExclusion);
    setLifetimeExemptionUsed(GT_DEFAULTS.lifetimeExemptionUsed);
  }

  const inputs = (
    <>
      <NumberInput label="Gift Amount" value={giftAmount} onChange={setGiftAmount} prefix="$" min={0} max={50000000} step={1000} showSlider />
      <NumberInput label="Annual Exclusion" value={annualExclusion} onChange={setAnnualExclusion} prefix="$" min={0} max={50000} step={1000} />
      <NumberInput label="Lifetime Exemption Already Used" value={lifetimeExemptionUsed} onChange={setLifetimeExemptionUsed} prefix="$" min={0} max={13610000} step={10000} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Taxable Gift" value={formatCurrency(results.taxableGift)} size="large" variant={results.taxableGift > 0 ? "danger" : "accent"} />
      <ResultCard label="Annual Exclusion Covers Gift?" value={results.annualExclusionCovers ? "Yes" : "No"} size="medium" variant={results.annualExclusionCovers ? "accent" : "danger"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Lifetime Exemption Remaining" value={formatCurrency(results.lifetimeRemaining)} size="small" variant="neutral" />
        <ResultCard label="Gift Tax Due" value={formatCurrency(results.giftTax)} size="small" variant={results.giftTax > 0 ? "danger" : "accent"} />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   8. TaxWithholdingCalculator
   ═══════════════════════════════════════════════════════════ */

type PayFrequency = "weekly" | "biweekly" | "semi_monthly" | "monthly";

const PAY_PERIODS: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semi_monthly: 24,
  monthly: 12,
};

const TW_DEFAULTS = {
  annualSalary: 85000,
  payFrequency: "biweekly" as PayFrequency,
  filingStatus: "single" as FilingStatus,
  extraWithholding: 0,
  preTaxDeductions: 6000,
};

export function TaxWithholdingCalculator() {
  const [annualSalary, setAnnualSalary] = useState(TW_DEFAULTS.annualSalary);
  const [payFrequency, setPayFrequency] = useState(TW_DEFAULTS.payFrequency);
  const [filingStatus, setFilingStatus] = useState(TW_DEFAULTS.filingStatus);
  const [extraWithholding, setExtraWithholding] = useState(TW_DEFAULTS.extraWithholding);
  const [preTaxDeductions, setPreTaxDeductions] = useState(TW_DEFAULTS.preTaxDeductions);

  const results = useMemo(() => {
    const periods = PAY_PERIODS[payFrequency];
    const adjustedIncome = Math.max(0, annualSalary - preTaxDeductions);
    const standardDeduction = STANDARD_DEDUCTIONS_2026[filingStatus];
    const taxableIncome = Math.max(0, adjustedIncome - standardDeduction);
    const annualTax = computeFederalTax(taxableIncome, filingStatus);
    const perPaycheckWithholding = annualTax / periods + extraWithholding;
    const annualTotal = perPaycheckWithholding * periods;
    const grossPerPaycheck = annualSalary / periods;
    const preTaxPerPaycheck = preTaxDeductions / periods;
    const takeHome = grossPerPaycheck - preTaxPerPaycheck - perPaycheckWithholding;
    return { perPaycheckWithholding, annualTotal, takeHome };
  }, [annualSalary, payFrequency, filingStatus, extraWithholding, preTaxDeductions]);

  function resetDefaults() {
    setAnnualSalary(TW_DEFAULTS.annualSalary);
    setPayFrequency(TW_DEFAULTS.payFrequency);
    setFilingStatus(TW_DEFAULTS.filingStatus);
    setExtraWithholding(TW_DEFAULTS.extraWithholding);
    setPreTaxDeductions(TW_DEFAULTS.preTaxDeductions);
  }

  const inputs = (
    <>
      <NumberInput label="Annual Salary" value={annualSalary} onChange={setAnnualSalary} prefix="$" min={0} max={1000000} step={1000} showSlider />
      <div className="space-y-2">
        <Label className="text-sm font-medium">Pay Frequency</Label>
        <Select value={payFrequency} onValueChange={(v) => setPayFrequency(v as PayFrequency)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-Weekly</SelectItem>
            <SelectItem value="semi_monthly">Semi-Monthly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <FilingStatusSelect value={filingStatus} onChange={setFilingStatus} />
      <NumberInput label="Pre-Tax Deductions (annual)" value={preTaxDeductions} onChange={setPreTaxDeductions} prefix="$" min={0} max={100000} step={500} showSlider />
      <NumberInput label="Extra Withholding (per paycheck)" value={extraWithholding} onChange={setExtraWithholding} prefix="$" min={0} max={5000} step={10} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Est. Federal Withholding per Paycheck" value={formatCurrency(results.perPaycheckWithholding)} size="large" variant="danger" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Total Withholding" value={formatCurrency(results.annualTotal)} size="small" variant="neutral" />
        <ResultCard label="Take-Home per Paycheck" value={formatCurrency(results.takeHome)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   9. QuarterlyTaxCalculator
   ═══════════════════════════════════════════════════════════ */

const QT_DEFAULTS = {
  estimatedIncome: 150000,
  estimatedDeductions: 15700,
  taxCredits: 0,
  filingStatus: "single" as FilingStatus,
};

export function QuarterlyTaxCalculator() {
  const [estimatedIncome, setEstimatedIncome] = useState(QT_DEFAULTS.estimatedIncome);
  const [estimatedDeductions, setEstimatedDeductions] = useState(QT_DEFAULTS.estimatedDeductions);
  const [taxCredits, setTaxCredits] = useState(QT_DEFAULTS.taxCredits);
  const [filingStatus, setFilingStatus] = useState(QT_DEFAULTS.filingStatus);

  const results = useMemo(() => {
    const taxableIncome = Math.max(0, estimatedIncome - estimatedDeductions);
    const annualTax = Math.max(0, computeFederalTax(taxableIncome, filingStatus) - taxCredits);
    const quarterlyPayment = annualTax / 4;
    const dueDates = ["Apr 15, 2026", "Jun 15, 2026", "Sep 15, 2026", "Jan 15, 2027"];
    return { annualTax, quarterlyPayment, dueDates };
  }, [estimatedIncome, estimatedDeductions, taxCredits, filingStatus]);

  function resetDefaults() {
    setEstimatedIncome(QT_DEFAULTS.estimatedIncome);
    setEstimatedDeductions(QT_DEFAULTS.estimatedDeductions);
    setTaxCredits(QT_DEFAULTS.taxCredits);
    setFilingStatus(QT_DEFAULTS.filingStatus);
  }

  const inputs = (
    <>
      <NumberInput label="Estimated Annual Income" value={estimatedIncome} onChange={setEstimatedIncome} prefix="$" min={0} max={2000000} step={1000} showSlider />
      <NumberInput label="Estimated Deductions" value={estimatedDeductions} onChange={setEstimatedDeductions} prefix="$" min={0} max={500000} step={500} showSlider />
      <NumberInput label="Tax Credits" value={taxCredits} onChange={setTaxCredits} prefix="$" min={0} max={50000} step={100} />
      <FilingStatusSelect value={filingStatus} onChange={setFilingStatus} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Annual Tax" value={formatCurrency(results.annualTax)} size="large" variant="danger" />
      <ResultCard label="Quarterly Payment" value={formatCurrency(results.quarterlyPayment)} size="medium" variant="primary" />
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Due Dates</p>
        <div className="space-y-1">
          {results.dueDates.map((date, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Q{i + 1}</span>
              <span className="font-medium">{date}</span>
              <span className="text-muted-foreground">{formatCurrency(results.quarterlyPayment)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   10. TaxRefundCalculator
   ═══════════════════════════════════════════════════════════ */

const TR_DEFAULTS = {
  totalIncome: 85000,
  totalWithheld: 14000,
  filingStatus: "single" as FilingStatus,
  deductionType: "standard" as "standard" | "itemized",
  itemizedDeductions: 0,
  credits: 0,
};

export function TaxRefundCalculator() {
  const [totalIncome, setTotalIncome] = useState(TR_DEFAULTS.totalIncome);
  const [totalWithheld, setTotalWithheld] = useState(TR_DEFAULTS.totalWithheld);
  const [filingStatus, setFilingStatus] = useState(TR_DEFAULTS.filingStatus);
  const [deductionType, setDeductionType] = useState(TR_DEFAULTS.deductionType);
  const [itemizedDeductions, setItemizedDeductions] = useState(TR_DEFAULTS.itemizedDeductions);
  const [credits, setCredits] = useState(TR_DEFAULTS.credits);

  const results = useMemo(() => {
    const deduction = deductionType === "standard"
      ? STANDARD_DEDUCTIONS_2026[filingStatus]
      : itemizedDeductions;
    const taxableIncome = Math.max(0, totalIncome - deduction);
    const taxOwed = Math.max(0, computeFederalTax(taxableIncome, filingStatus) - credits);
    const refundOrDue = totalWithheld - taxOwed;
    const effectiveRate = totalIncome > 0 ? (taxOwed / totalIncome) * 100 : 0;
    return { taxOwed, refundOrDue, effectiveRate };
  }, [totalIncome, totalWithheld, filingStatus, deductionType, itemizedDeductions, credits]);

  function resetDefaults() {
    setTotalIncome(TR_DEFAULTS.totalIncome);
    setTotalWithheld(TR_DEFAULTS.totalWithheld);
    setFilingStatus(TR_DEFAULTS.filingStatus);
    setDeductionType(TR_DEFAULTS.deductionType);
    setItemizedDeductions(TR_DEFAULTS.itemizedDeductions);
    setCredits(TR_DEFAULTS.credits);
  }

  const inputs = (
    <>
      <NumberInput label="Total Income" value={totalIncome} onChange={setTotalIncome} prefix="$" min={0} max={2000000} step={1000} showSlider />
      <NumberInput label="Total Federal Tax Withheld" value={totalWithheld} onChange={setTotalWithheld} prefix="$" min={0} max={500000} step={500} showSlider />
      <FilingStatusSelect value={filingStatus} onChange={setFilingStatus} />
      <div className="space-y-2">
        <Label className="text-sm font-medium">Deduction Type</Label>
        <Select value={deductionType} onValueChange={(v) => setDeductionType(v as "standard" | "itemized")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard ({formatCurrency(STANDARD_DEDUCTIONS_2026[filingStatus])})</SelectItem>
            <SelectItem value="itemized">Itemized</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {deductionType === "itemized" && (
        <NumberInput label="Itemized Deductions" value={itemizedDeductions} onChange={setItemizedDeductions} prefix="$" min={0} max={500000} step={500} showSlider />
      )}
      <NumberInput label="Tax Credits" value={credits} onChange={setCredits} prefix="$" min={0} max={50000} step={100} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard
        label={results.refundOrDue >= 0 ? "Estimated Refund" : "Amount Due"}
        value={formatCurrency(Math.abs(results.refundOrDue))}
        size="large"
        variant={results.refundOrDue >= 0 ? "accent" : "danger"}
      />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Estimated Tax Owed" value={formatCurrency(results.taxOwed)} size="small" variant="neutral" />
        <ResultCard label="Effective Tax Rate" value={`${results.effectiveRate.toFixed(2)}%`} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   11. AmtCalculator
   ═══════════════════════════════════════════════════════════ */

const AMT_DEFAULTS = {
  regularTaxableIncome: 250000,
  isoExercise: 50000,
  saltDeduction: 10000,
  miscPreferences: 0,
  filingStatus: "single" as FilingStatus,
};

export function AmtCalculator() {
  const [regularTaxableIncome, setRegularTaxableIncome] = useState(AMT_DEFAULTS.regularTaxableIncome);
  const [isoExercise, setIsoExercise] = useState(AMT_DEFAULTS.isoExercise);
  const [saltDeduction, setSaltDeduction] = useState(AMT_DEFAULTS.saltDeduction);
  const [miscPreferences, setMiscPreferences] = useState(AMT_DEFAULTS.miscPreferences);
  const [filingStatus, setFilingStatus] = useState(AMT_DEFAULTS.filingStatus);

  const results = useMemo(() => {
    const exemptions: Record<FilingStatus, number> = {
      single: 85700,
      married_jointly: 133300,
      married_separately: 66650,
      head_of_household: 85700,
    };
    const phaseoutStarts: Record<FilingStatus, number> = {
      single: 609350,
      married_jointly: 1218700,
      married_separately: 609350,
      head_of_household: 609350,
    };

    const totalPreferences = isoExercise + saltDeduction + miscPreferences;
    const amti = regularTaxableIncome + totalPreferences;

    let exemption = exemptions[filingStatus];
    const phaseout = phaseoutStarts[filingStatus];
    if (amti > phaseout) {
      const reduction = (amti - phaseout) * 0.25;
      exemption = Math.max(0, exemption - reduction);
    }

    const amtBase = Math.max(0, amti - exemption);
    // 26% on first $232,600 (single), 28% on rest
    const amtBreakpoint = filingStatus === "married_separately" ? 116300 : 232600;
    const tentativeMinTax = amtBase <= amtBreakpoint
      ? amtBase * 0.26
      : amtBreakpoint * 0.26 + (amtBase - amtBreakpoint) * 0.28;

    const regularTax = computeFederalTax(regularTaxableIncome, filingStatus);
    const amtOwed = Math.max(0, tentativeMinTax - regularTax);

    return { amti, tentativeMinTax, regularTax, amtOwed, totalPreferences };
  }, [regularTaxableIncome, isoExercise, saltDeduction, miscPreferences, filingStatus]);

  function resetDefaults() {
    setRegularTaxableIncome(AMT_DEFAULTS.regularTaxableIncome);
    setIsoExercise(AMT_DEFAULTS.isoExercise);
    setSaltDeduction(AMT_DEFAULTS.saltDeduction);
    setMiscPreferences(AMT_DEFAULTS.miscPreferences);
    setFilingStatus(AMT_DEFAULTS.filingStatus);
  }

  const inputs = (
    <>
      <NumberInput label="Regular Taxable Income" value={regularTaxableIncome} onChange={setRegularTaxableIncome} prefix="$" min={0} max={5000000} step={1000} showSlider />
      <NumberInput label="ISO Exercise Spread" value={isoExercise} onChange={setIsoExercise} prefix="$" min={0} max={5000000} step={1000} showSlider />
      <NumberInput label="State/Local Tax Deduction" value={saltDeduction} onChange={setSaltDeduction} prefix="$" min={0} max={100000} step={500} showSlider />
      <NumberInput label="Other AMT Preference Items" value={miscPreferences} onChange={setMiscPreferences} prefix="$" min={0} max={1000000} step={1000} />
      <FilingStatusSelect value={filingStatus} onChange={setFilingStatus} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard
        label="AMT Owed"
        value={formatCurrency(results.amtOwed)}
        size="large"
        variant={results.amtOwed > 0 ? "danger" : "accent"}
      />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Tentative Minimum Tax" value={formatCurrency(results.tentativeMinTax)} size="small" variant="neutral" />
        <ResultCard label="Regular Tax" value={formatCurrency(results.regularTax)} size="small" variant="neutral" />
      </div>
      <ResultCard label="AMT Preference Items Total" value={formatCurrency(results.totalPreferences)} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   12. TaxDeductionCalculator
   ═══════════════════════════════════════════════════════════ */

const TD_DEFAULTS = {
  filingStatus: "single" as FilingStatus,
  agi: 100000,
  mortgageInterest: 8000,
  saltPaid: 12000,
  charitable: 3000,
  medicalExpenses: 5000,
};

export function TaxDeductionCalculator() {
  const [filingStatus, setFilingStatus] = useState(TD_DEFAULTS.filingStatus);
  const [agi, setAgi] = useState(TD_DEFAULTS.agi);
  const [mortgageInterest, setMortgageInterest] = useState(TD_DEFAULTS.mortgageInterest);
  const [saltPaid, setSaltPaid] = useState(TD_DEFAULTS.saltPaid);
  const [charitable, setCharitable] = useState(TD_DEFAULTS.charitable);
  const [medicalExpenses, setMedicalExpenses] = useState(TD_DEFAULTS.medicalExpenses);

  const results = useMemo(() => {
    const standardDeduction = STANDARD_DEDUCTIONS_2026[filingStatus];
    const saltCapped = Math.min(saltPaid, 10000);
    const medicalAboveThreshold = Math.max(0, medicalExpenses - agi * 0.075);
    const totalItemized = mortgageInterest + saltCapped + charitable + medicalAboveThreshold;
    const betterChoice = totalItemized > standardDeduction ? "Itemized" : "Standard";
    const deductionUsed = Math.max(totalItemized, standardDeduction);
    const marginalRate = getMarginalRate(Math.max(0, agi - deductionUsed), filingStatus);
    const taxSavings = deductionUsed * marginalRate;

    return { standardDeduction, totalItemized, betterChoice, taxSavings, saltCapped, medicalAboveThreshold };
  }, [filingStatus, agi, mortgageInterest, saltPaid, charitable, medicalExpenses]);

  function resetDefaults() {
    setFilingStatus(TD_DEFAULTS.filingStatus);
    setAgi(TD_DEFAULTS.agi);
    setMortgageInterest(TD_DEFAULTS.mortgageInterest);
    setSaltPaid(TD_DEFAULTS.saltPaid);
    setCharitable(TD_DEFAULTS.charitable);
    setMedicalExpenses(TD_DEFAULTS.medicalExpenses);
  }

  const inputs = (
    <>
      <FilingStatusSelect value={filingStatus} onChange={setFilingStatus} />
      <NumberInput label="Adjusted Gross Income (AGI)" value={agi} onChange={setAgi} prefix="$" min={0} max={2000000} step={1000} showSlider />
      <NumberInput label="Mortgage Interest" value={mortgageInterest} onChange={setMortgageInterest} prefix="$" min={0} max={100000} step={500} showSlider />
      <NumberInput label="State & Local Taxes Paid" value={saltPaid} onChange={setSaltPaid} prefix="$" min={0} max={200000} step={500} showSlider helpText="Capped at $10,000" />
      <NumberInput label="Charitable Contributions" value={charitable} onChange={setCharitable} prefix="$" min={0} max={500000} step={100} showSlider />
      <NumberInput label="Medical Expenses" value={medicalExpenses} onChange={setMedicalExpenses} prefix="$" min={0} max={500000} step={100} showSlider helpText="Only amount above 7.5% of AGI is deductible" />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard
        label="Better Choice"
        value={results.betterChoice}
        size="large"
        variant="primary"
      />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Standard Deduction" value={formatCurrency(results.standardDeduction)} size="small" variant={results.betterChoice === "Standard" ? "accent" : "neutral"} />
        <ResultCard label="Total Itemized" value={formatCurrency(results.totalItemized)} size="small" variant={results.betterChoice === "Itemized" ? "accent" : "neutral"} />
      </div>
      <ResultCard label="Est. Tax Savings from Deductions" value={formatCurrency(results.taxSavings)} size="medium" variant="accent" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="SALT (capped)" value={formatCurrency(results.saltCapped)} size="small" variant="neutral" />
        <ResultCard label="Medical (above 7.5% AGI)" value={formatCurrency(results.medicalAboveThreshold)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   13. EarnedIncomeCalculator
   ═══════════════════════════════════════════════════════════ */

const EITC_DEFAULTS = {
  earnedIncome: 30000,
  filingStatus: "single" as FilingStatus,
  numChildren: 2,
  investmentIncome: 500,
};

export function EarnedIncomeCalculator() {
  const [earnedIncome, setEarnedIncome] = useState(EITC_DEFAULTS.earnedIncome);
  const [filingStatus, setFilingStatus] = useState(EITC_DEFAULTS.filingStatus);
  const [numChildren, setNumChildren] = useState(EITC_DEFAULTS.numChildren);
  const [investmentIncome, setInvestmentIncome] = useState(EITC_DEFAULTS.investmentIncome);

  const results = useMemo(() => {
    const INVESTMENT_INCOME_LIMIT = 11600;
    if (investmentIncome > INVESTMENT_INCOME_LIMIT) {
      return { eitcAmount: 0, phaseOutStatus: "Ineligible: investment income exceeds limit", maxCredit: 0 };
    }

    const isJoint = filingStatus === "married_jointly";

    // 2026 EITC parameters (estimated, indexed)
    const eitcParams: Record<number, { rate: number; maxEarned: number; maxCredit: number; phaseOutStart: number; phaseOutStartJoint: number; phaseOutRate: number }> = {
      0: { rate: 0.0765, maxEarned: 7840, maxCredit: 600, phaseOutStart: 9800, phaseOutStartJoint: 16370, phaseOutRate: 0.0765 },
      1: { rate: 0.34, maxEarned: 11750, maxCredit: 3995, phaseOutStart: 21370, phaseOutStartJoint: 27940, phaseOutRate: 0.1598 },
      2: { rate: 0.40, maxEarned: 16510, maxCredit: 6604, phaseOutStart: 21370, phaseOutStartJoint: 27940, phaseOutRate: 0.2106 },
      3: { rate: 0.45, maxEarned: 16510, maxCredit: 7430, phaseOutStart: 21370, phaseOutStartJoint: 27940, phaseOutRate: 0.2106 },
    };

    const kids = Math.min(numChildren, 3);
    const p = eitcParams[kids];
    const phaseOutStart = isJoint ? p.phaseOutStartJoint : p.phaseOutStart;

    // Phase-in: credit increases as income rises
    const phaseInCredit = Math.min(earnedIncome * p.rate, p.maxCredit);

    // Phase-out: credit decreases
    let phaseOutReduction = 0;
    if (earnedIncome > phaseOutStart) {
      phaseOutReduction = (earnedIncome - phaseOutStart) * p.phaseOutRate;
    }

    const eitcAmount = Math.max(0, Math.min(phaseInCredit, p.maxCredit - phaseOutReduction));

    let phaseOutStatus: string;
    if (earnedIncome <= p.maxEarned) {
      phaseOutStatus = "Phase-in range";
    } else if (earnedIncome <= phaseOutStart) {
      phaseOutStatus = "Maximum credit range";
    } else if (eitcAmount > 0) {
      phaseOutStatus = "Phase-out range";
    } else {
      phaseOutStatus = "Income exceeds EITC limit";
    }

    // Income limits for ineligibility (approximate)
    if (filingStatus === "married_separately") {
      return { eitcAmount: 0, phaseOutStatus: "Ineligible: Married Filing Separately", maxCredit: p.maxCredit };
    }

    return { eitcAmount, phaseOutStatus, maxCredit: p.maxCredit };
  }, [earnedIncome, filingStatus, numChildren, investmentIncome]);

  function resetDefaults() {
    setEarnedIncome(EITC_DEFAULTS.earnedIncome);
    setFilingStatus(EITC_DEFAULTS.filingStatus);
    setNumChildren(EITC_DEFAULTS.numChildren);
    setInvestmentIncome(EITC_DEFAULTS.investmentIncome);
  }

  const inputs = (
    <>
      <NumberInput label="Earned Income" value={earnedIncome} onChange={setEarnedIncome} prefix="$" min={0} max={200000} step={500} showSlider />
      <FilingStatusSelect value={filingStatus} onChange={setFilingStatus} />
      <div className="space-y-2">
        <Label className="text-sm font-medium">Qualifying Children</Label>
        <Select value={numChildren.toString()} onValueChange={(v) => setNumChildren(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Investment Income" value={investmentIncome} onChange={setInvestmentIncome} prefix="$" min={0} max={50000} step={100} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated EITC" value={formatCurrency(results.eitcAmount)} size="large" variant={results.eitcAmount > 0 ? "accent" : "neutral"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Phase-Out Status" value={results.phaseOutStatus} size="small" variant="neutral" />
        <ResultCard label="Max Possible Credit" value={formatCurrency(results.maxCredit)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
