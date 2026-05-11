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

function pmt(principal: number, annualRate: number, totalMonths: number): number {
  if (annualRate === 0) return principal / totalMonths;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
}

/* ═══════════════════════════════════════════════════════════
   1. AutoLeaseCalculator
   ═══════════════════════════════════════════════════════════ */

const LEASE_DEFAULTS = {
  msrp: 35000,
  negotiatedPrice: 32000,
  residualPct: 55,
  moneyFactor: 0.0025,
  termMonths: 36,
  downPayment: 2000,
  fees: 1200,
};

export function AutoLeaseCalculator() {
  const [msrp, setMsrp] = useState(LEASE_DEFAULTS.msrp);
  const [negotiatedPrice, setNegotiatedPrice] = useState(LEASE_DEFAULTS.negotiatedPrice);
  const [residualPct, setResidualPct] = useState(LEASE_DEFAULTS.residualPct);
  const [moneyFactor, setMoneyFactor] = useState(LEASE_DEFAULTS.moneyFactor);
  const [termMonths, setTermMonths] = useState(LEASE_DEFAULTS.termMonths);
  const [downPayment, setDownPayment] = useState(LEASE_DEFAULTS.downPayment);
  const [fees, setFees] = useState(LEASE_DEFAULTS.fees);

  const results = useMemo(() => {
    const residualValue = msrp * (residualPct / 100);
    const capCost = negotiatedPrice + fees - downPayment;
    const depreciation = (capCost - residualValue) / termMonths;
    const financeCharge = (capCost + residualValue) * moneyFactor;
    const monthlyPayment = depreciation + financeCharge;
    const totalLeaseCost = monthlyPayment * termMonths + downPayment;
    const estimatedMilesPerYear = 12000;
    const totalMiles = (estimatedMilesPerYear * termMonths) / 12;
    const costPerMile = totalLeaseCost / totalMiles;
    return { monthlyPayment, totalLeaseCost, costPerMile };
  }, [msrp, negotiatedPrice, residualPct, moneyFactor, termMonths, downPayment, fees]);

  function resetDefaults() {
    setMsrp(LEASE_DEFAULTS.msrp);
    setNegotiatedPrice(LEASE_DEFAULTS.negotiatedPrice);
    setResidualPct(LEASE_DEFAULTS.residualPct);
    setMoneyFactor(LEASE_DEFAULTS.moneyFactor);
    setTermMonths(LEASE_DEFAULTS.termMonths);
    setDownPayment(LEASE_DEFAULTS.downPayment);
    setFees(LEASE_DEFAULTS.fees);
  }

  const inputs = (
    <>
      <NumberInput label="Vehicle MSRP" value={msrp} onChange={setMsrp} prefix="$" min={10000} max={200000} step={1000} showSlider />
      <NumberInput label="Negotiated Price" value={negotiatedPrice} onChange={setNegotiatedPrice} prefix="$" min={5000} max={200000} step={500} showSlider />
      <NumberInput label="Residual Value %" value={residualPct} onChange={setResidualPct} prefix="%" min={20} max={80} step={1} showSlider />
      <NumberInput label="Money Factor" value={moneyFactor} onChange={setMoneyFactor} min={0.0001} max={0.01} step={0.0001} />
      <div className="space-y-2">
        <label className="text-sm font-medium">Term (Months)</label>
        <Select value={termMonths.toString()} onValueChange={(v) => setTermMonths(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="24">24 months</SelectItem>
            <SelectItem value="36">36 months</SelectItem>
            <SelectItem value="48">48 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={50000} step={500} />
      <NumberInput label="Fees (Acquisition, Doc, etc.)" value={fees} onChange={setFees} prefix="$" min={0} max={10000} step={100} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Lease Payment" value={formatCurrency(results.monthlyPayment)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Lease Cost" value={formatCurrency(results.totalLeaseCost)} size="small" variant="neutral" />
        <ResultCard label="Cost Per Mile (est.)" value={`$${results.costPerMile.toFixed(2)}`} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   2. CarAffordabilityCalculator
   ═══════════════════════════════════════════════════════════ */

const AFFORD_DEFAULTS = {
  monthlyBudget: 600,
  downPayment: 5000,
  interestRate: 6.5,
  loanTerm: 60,
  insurancePerMonth: 150,
  gasPerMonth: 120,
};

export function CarAffordabilityCalculator() {
  const [monthlyBudget, setMonthlyBudget] = useState(AFFORD_DEFAULTS.monthlyBudget);
  const [downPayment, setDownPayment] = useState(AFFORD_DEFAULTS.downPayment);
  const [interestRate, setInterestRate] = useState(AFFORD_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(AFFORD_DEFAULTS.loanTerm);
  const [insurancePerMonth, setInsurancePerMonth] = useState(AFFORD_DEFAULTS.insurancePerMonth);
  const [gasPerMonth, setGasPerMonth] = useState(AFFORD_DEFAULTS.gasPerMonth);

  const results = useMemo(() => {
    const availableForPayment = monthlyBudget - insurancePerMonth - gasPerMonth;
    let maxLoan = 0;
    if (availableForPayment > 0) {
      if (interestRate === 0) {
        maxLoan = availableForPayment * loanTerm;
      } else {
        const r = interestRate / 100 / 12;
        maxLoan = availableForPayment * (Math.pow(1 + r, loanTerm) - 1) / (r * Math.pow(1 + r, loanTerm));
      }
    }
    const maxVehiclePrice = maxLoan + downPayment;
    const totalMonthlyCosts = monthlyBudget;
    return { maxVehiclePrice, maxLoan, totalMonthlyCosts, availableForPayment };
  }, [monthlyBudget, downPayment, interestRate, loanTerm, insurancePerMonth, gasPerMonth]);

  function resetDefaults() {
    setMonthlyBudget(AFFORD_DEFAULTS.monthlyBudget);
    setDownPayment(AFFORD_DEFAULTS.downPayment);
    setInterestRate(AFFORD_DEFAULTS.interestRate);
    setLoanTerm(AFFORD_DEFAULTS.loanTerm);
    setInsurancePerMonth(AFFORD_DEFAULTS.insurancePerMonth);
    setGasPerMonth(AFFORD_DEFAULTS.gasPerMonth);
  }

  const inputs = (
    <>
      <NumberInput label="Monthly Budget for Car" value={monthlyBudget} onChange={setMonthlyBudget} prefix="$" min={100} max={5000} step={50} showSlider />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={100000} step={500} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={0} max={20} step={0.1} showSlider />
      <NumberInput label="Loan Term (months)" value={loanTerm} onChange={setLoanTerm} min={12} max={84} step={6} showSlider />
      <NumberInput label="Insurance / month" value={insurancePerMonth} onChange={setInsurancePerMonth} prefix="$" min={0} max={1000} step={10} />
      <NumberInput label="Gas / month" value={gasPerMonth} onChange={setGasPerMonth} prefix="$" min={0} max={500} step={10} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Max Vehicle Price" value={formatCurrency(results.maxVehiclePrice)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Max Loan Amount" value={formatCurrency(results.maxLoan)} size="small" variant="neutral" />
        <ResultCard label="Total Monthly Costs" value={formatCurrency(results.totalMonthlyCosts)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   3. VehicleDepreciationCalculator
   ═══════════════════════════════════════════════════════════ */

const DEPRECIATION_DEFAULTS = {
  purchasePrice: 35000,
  vehicleAge: 0,
  depRateYear1: 15,
  depRateYear2_3: 15,
  depRateYear4_5: 10,
};

export function VehicleDepreciationCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(DEPRECIATION_DEFAULTS.purchasePrice);
  const [vehicleAge, setVehicleAge] = useState(DEPRECIATION_DEFAULTS.vehicleAge);
  const [depRateYear1, setDepRateYear1] = useState(DEPRECIATION_DEFAULTS.depRateYear1);
  const [depRateYear2_3, setDepRateYear2_3] = useState(DEPRECIATION_DEFAULTS.depRateYear2_3);
  const [depRateYear4_5, setDepRateYear4_5] = useState(DEPRECIATION_DEFAULTS.depRateYear4_5);

  const results = useMemo(() => {
    function valueAtYear(year: number): number {
      let val = purchasePrice;
      for (let y = 1; y <= year; y++) {
        let rate: number;
        if (y === 1) rate = depRateYear1 / 100;
        else if (y <= 3) rate = depRateYear2_3 / 100;
        else rate = depRateYear4_5 / 100;
        val *= 1 - rate;
      }
      return val;
    }

    const currentValue = valueAtYear(vehicleAge);
    const valueIn1 = valueAtYear(vehicleAge + 1);
    const valueIn3 = valueAtYear(vehicleAge + 3);
    const valueIn5 = valueAtYear(vehicleAge + 5);
    const totalDepreciation = purchasePrice - currentValue;

    const table: { year: number; value: number; depFromNew: number }[] = [];
    for (let y = 0; y <= Math.min(vehicleAge + 5, 10); y++) {
      const v = valueAtYear(y);
      table.push({ year: y, value: v, depFromNew: purchasePrice - v });
    }

    return { currentValue, valueIn1, valueIn3, valueIn5, totalDepreciation, table };
  }, [purchasePrice, vehicleAge, depRateYear1, depRateYear2_3, depRateYear4_5]);

  function resetDefaults() {
    setPurchasePrice(DEPRECIATION_DEFAULTS.purchasePrice);
    setVehicleAge(DEPRECIATION_DEFAULTS.vehicleAge);
    setDepRateYear1(DEPRECIATION_DEFAULTS.depRateYear1);
    setDepRateYear2_3(DEPRECIATION_DEFAULTS.depRateYear2_3);
    setDepRateYear4_5(DEPRECIATION_DEFAULTS.depRateYear4_5);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={5000} max={200000} step={1000} showSlider />
      <NumberInput label="Vehicle Age (years)" value={vehicleAge} onChange={setVehicleAge} min={0} max={20} step={1} showSlider />
      <NumberInput label="Depreciation Rate Year 1 (%)" value={depRateYear1} onChange={setDepRateYear1} prefix="%" min={0} max={50} step={1} showSlider />
      <NumberInput label="Depreciation Rate Year 2-3 (%)" value={depRateYear2_3} onChange={setDepRateYear2_3} prefix="%" min={0} max={50} step={1} showSlider />
      <NumberInput label="Depreciation Rate Year 4-5 (%)" value={depRateYear4_5} onChange={setDepRateYear4_5} prefix="%" min={0} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Current Value" value={formatCurrency(results.currentValue)} size="large" />
      <div className="grid grid-cols-3 gap-4">
        <ResultCard label="Value in 1 Year" value={formatCurrency(results.valueIn1)} size="small" variant="neutral" />
        <ResultCard label="Value in 3 Years" value={formatCurrency(results.valueIn3)} size="small" variant="neutral" />
        <ResultCard label="Value in 5 Years" value={formatCurrency(results.valueIn5)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Total Depreciation" value={formatCurrency(results.totalDepreciation)} size="small" variant="danger" />

      <div className="mt-4">
        <Label className="text-sm font-medium mb-2 block">Depreciation Table</Label>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2">Year</th>
                <th className="text-right p-2">Value</th>
                <th className="text-right p-2">Dep. from New</th>
              </tr>
            </thead>
            <tbody>
              {results.table.map((row) => (
                <tr key={row.year} className="border-t">
                  <td className="p-2">{row.year}</td>
                  <td className="p-2 text-right">{formatCurrency(row.value)}</td>
                  <td className="p-2 text-right">{formatCurrency(row.depFromNew)}</td>
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
   4. GasMileageCalculator
   ═══════════════════════════════════════════════════════════ */

const GAS_DEFAULTS = {
  milesPerMonth: 1000,
  mpg: 28,
  gasPricePerGallon: 3.50,
};

export function GasMileageCalculator() {
  const [milesPerMonth, setMilesPerMonth] = useState(GAS_DEFAULTS.milesPerMonth);
  const [mpg, setMpg] = useState(GAS_DEFAULTS.mpg);
  const [gasPricePerGallon, setGasPricePerGallon] = useState(GAS_DEFAULTS.gasPricePerGallon);

  const results = useMemo(() => {
    const gallonsPerMonth = milesPerMonth / mpg;
    const monthlyGasCost = gallonsPerMonth * gasPricePerGallon;
    const annualGasCost = monthlyGasCost * 12;
    const costPerMile = gasPricePerGallon / mpg;
    return { monthlyGasCost, annualGasCost, costPerMile, gallonsPerMonth };
  }, [milesPerMonth, mpg, gasPricePerGallon]);

  function resetDefaults() {
    setMilesPerMonth(GAS_DEFAULTS.milesPerMonth);
    setMpg(GAS_DEFAULTS.mpg);
    setGasPricePerGallon(GAS_DEFAULTS.gasPricePerGallon);
  }

  const inputs = (
    <>
      <NumberInput label="Miles Driven / Month" value={milesPerMonth} onChange={setMilesPerMonth} min={100} max={5000} step={50} showSlider />
      <NumberInput label="Miles Per Gallon (MPG)" value={mpg} onChange={setMpg} min={5} max={60} step={1} showSlider />
      <NumberInput label="Gas Price / Gallon" value={gasPricePerGallon} onChange={setGasPricePerGallon} prefix="$" min={1} max={10} step={0.1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Gas Cost" value={formatCurrency(results.monthlyGasCost)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Gas Cost" value={formatCurrency(results.annualGasCost)} size="small" variant="neutral" />
        <ResultCard label="Cost Per Mile" value={`$${results.costPerMile.toFixed(3)}`} size="small" variant="neutral" />
      </div>
      <ResultCard label="Gallons Used / Month" value={results.gallonsPerMonth.toFixed(1)} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   5. EvSavingsCalculator
   ═══════════════════════════════════════════════════════════ */

const EV_DEFAULTS = {
  currentMpg: 28,
  gasPrice: 3.50,
  milesPerYear: 12000,
  evEfficiency: 30,
  electricityRate: 0.13,
  evPrice: 40000,
  gasCarPrice: 30000,
};

export function EvSavingsCalculator() {
  const [currentMpg, setCurrentMpg] = useState(EV_DEFAULTS.currentMpg);
  const [gasPrice, setGasPrice] = useState(EV_DEFAULTS.gasPrice);
  const [milesPerYear, setMilesPerYear] = useState(EV_DEFAULTS.milesPerYear);
  const [evEfficiency, setEvEfficiency] = useState(EV_DEFAULTS.evEfficiency);
  const [electricityRate, setElectricityRate] = useState(EV_DEFAULTS.electricityRate);
  const [evPrice, setEvPrice] = useState(EV_DEFAULTS.evPrice);
  const [gasCarPrice, setGasCarPrice] = useState(EV_DEFAULTS.gasCarPrice);

  const results = useMemo(() => {
    const annualGasCost = (milesPerYear / currentMpg) * gasPrice;
    const annualElectricityCost = (milesPerYear / 100) * evEfficiency * electricityRate;
    const annualFuelSavings = annualGasCost - annualElectricityCost;
    const priceDifference = evPrice - gasCarPrice;
    const yearsToBreakEven = annualFuelSavings > 0 ? priceDifference / annualFuelSavings : Infinity;
    return { annualGasCost, annualElectricityCost, annualFuelSavings, yearsToBreakEven };
  }, [currentMpg, gasPrice, milesPerYear, evEfficiency, electricityRate, evPrice, gasCarPrice]);

  function resetDefaults() {
    setCurrentMpg(EV_DEFAULTS.currentMpg);
    setGasPrice(EV_DEFAULTS.gasPrice);
    setMilesPerYear(EV_DEFAULTS.milesPerYear);
    setEvEfficiency(EV_DEFAULTS.evEfficiency);
    setElectricityRate(EV_DEFAULTS.electricityRate);
    setEvPrice(EV_DEFAULTS.evPrice);
    setGasCarPrice(EV_DEFAULTS.gasCarPrice);
  }

  const inputs = (
    <>
      <NumberInput label="Current MPG" value={currentMpg} onChange={setCurrentMpg} min={10} max={60} step={1} showSlider />
      <NumberInput label="Gas Price / Gallon" value={gasPrice} onChange={setGasPrice} prefix="$" min={1} max={10} step={0.1} showSlider />
      <NumberInput label="Miles / Year" value={milesPerYear} onChange={setMilesPerYear} min={1000} max={50000} step={1000} showSlider />
      <NumberInput label="EV Efficiency (kWh/100mi)" value={evEfficiency} onChange={setEvEfficiency} min={15} max={60} step={1} showSlider />
      <NumberInput label="Electricity Rate ($/kWh)" value={electricityRate} onChange={setElectricityRate} prefix="$" min={0.05} max={0.50} step={0.01} showSlider />
      <NumberInput label="EV Price" value={evPrice} onChange={setEvPrice} prefix="$" min={15000} max={150000} step={1000} showSlider />
      <NumberInput label="Gas Car Price" value={gasCarPrice} onChange={setGasCarPrice} prefix="$" min={10000} max={100000} step={1000} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Gas Cost" value={formatCurrency(results.annualGasCost)} size="small" variant="danger" />
        <ResultCard label="Annual Electricity Cost" value={formatCurrency(results.annualElectricityCost)} size="small" variant="accent" />
      </div>
      <ResultCard label="Annual Fuel Savings" value={formatCurrency(results.annualFuelSavings)} size="large" />
      <ResultCard label="Years to Break Even" value={results.yearsToBreakEven === Infinity ? "N/A" : `${results.yearsToBreakEven.toFixed(1)} years`} size="small" variant={results.yearsToBreakEven <= 5 ? "accent" : "neutral"} />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   6. CarInsuranceEstimator
   ═══════════════════════════════════════════════════════════ */

const INSURANCE_DEFAULTS = {
  vehicleValue: 30000,
  driverAge: 35,
  coverageType: "comprehensive" as string,
  deductible: 500,
  cleanRecord: true,
};

export function CarInsuranceEstimator() {
  const [vehicleValue, setVehicleValue] = useState(INSURANCE_DEFAULTS.vehicleValue);
  const [driverAge, setDriverAge] = useState(INSURANCE_DEFAULTS.driverAge);
  const [coverageType, setCoverageType] = useState(INSURANCE_DEFAULTS.coverageType);
  const [deductible, setDeductible] = useState(INSURANCE_DEFAULTS.deductible);
  const [cleanRecord, setCleanRecord] = useState(INSURANCE_DEFAULTS.cleanRecord);

  const results = useMemo(() => {
    // Base rate as percentage of vehicle value
    let baseRate = 0.04; // 4% of vehicle value
    if (coverageType === "liability") baseRate = 0.02;
    else if (coverageType === "collision") baseRate = 0.03;

    // Age factor
    let ageFactor = 1.0;
    if (driverAge < 25) ageFactor = 1.6;
    else if (driverAge < 30) ageFactor = 1.2;
    else if (driverAge > 65) ageFactor = 1.15;

    // Deductible factor (higher deductible = lower premium)
    const deductibleFactor = 1 - (deductible - 250) * 0.0003;

    // Clean record discount
    const recordFactor = cleanRecord ? 0.85 : 1.15;

    const annualPremium = vehicleValue * baseRate * ageFactor * deductibleFactor * recordFactor;
    const monthlyPremium = annualPremium / 12;

    return { annualPremium, monthlyPremium };
  }, [vehicleValue, driverAge, coverageType, deductible, cleanRecord]);

  function resetDefaults() {
    setVehicleValue(INSURANCE_DEFAULTS.vehicleValue);
    setDriverAge(INSURANCE_DEFAULTS.driverAge);
    setCoverageType(INSURANCE_DEFAULTS.coverageType);
    setDeductible(INSURANCE_DEFAULTS.deductible);
    setCleanRecord(INSURANCE_DEFAULTS.cleanRecord);
  }

  const inputs = (
    <>
      <NumberInput label="Vehicle Value" value={vehicleValue} onChange={setVehicleValue} prefix="$" min={5000} max={200000} step={1000} showSlider />
      <NumberInput label="Driver Age" value={driverAge} onChange={setDriverAge} min={16} max={90} step={1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Coverage Type</label>
        <Select value={coverageType} onValueChange={setCoverageType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="liability">Liability Only</SelectItem>
            <SelectItem value="collision">Collision</SelectItem>
            <SelectItem value="comprehensive">Comprehensive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Deductible" value={deductible} onChange={setDeductible} prefix="$" min={250} max={5000} step={250} showSlider />
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="clean-record" checked={cleanRecord} onChange={(e) => setCleanRecord(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        <label htmlFor="clean-record" className="text-sm font-medium">Clean Driving Record</label>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Annual Premium" value={formatCurrency(results.annualPremium)} size="large" />
      <ResultCard label="Monthly Premium" value={formatCurrency(results.monthlyPremium)} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   7. UsedCarValueCalculator
   ═══════════════════════════════════════════════════════════ */

const USEDCAR_DEFAULTS = {
  originalMsrp: 35000,
  currentAge: 3,
  mileage: 36000,
  condition: "good" as string,
};

export function UsedCarValueCalculator() {
  const [originalMsrp, setOriginalMsrp] = useState(USEDCAR_DEFAULTS.originalMsrp);
  const [currentAge, setCurrentAge] = useState(USEDCAR_DEFAULTS.currentAge);
  const [mileage, setMileage] = useState(USEDCAR_DEFAULTS.mileage);
  const [condition, setCondition] = useState(USEDCAR_DEFAULTS.condition);

  const results = useMemo(() => {
    // Depreciation curve: aggressive first year, then gradually less
    let value = originalMsrp;
    for (let y = 1; y <= currentAge; y++) {
      if (y === 1) value *= 0.80; // 20% year 1
      else if (y <= 3) value *= 0.85; // 15% years 2-3
      else if (y <= 5) value *= 0.90; // 10% years 4-5
      else value *= 0.93; // 7% year 6+
    }

    // Mileage adjustment: ~$0.05 per mile above/below average (12k/yr)
    const averageMileage = currentAge * 12000;
    const mileageDiff = mileage - averageMileage;
    value -= mileageDiff * 0.05;

    // Condition factor
    const conditionFactors: Record<string, number> = {
      excellent: 1.10,
      good: 1.00,
      fair: 0.90,
      poor: 0.75,
    };
    value *= conditionFactors[condition] ?? 1.0;

    const estimatedValue = Math.max(value, 0);
    const depreciationFromNew = originalMsrp - estimatedValue;
    const valueAsPct = (estimatedValue / originalMsrp) * 100;

    return { estimatedValue, depreciationFromNew, valueAsPct };
  }, [originalMsrp, currentAge, mileage, condition]);

  function resetDefaults() {
    setOriginalMsrp(USEDCAR_DEFAULTS.originalMsrp);
    setCurrentAge(USEDCAR_DEFAULTS.currentAge);
    setMileage(USEDCAR_DEFAULTS.mileage);
    setCondition(USEDCAR_DEFAULTS.condition);
  }

  const inputs = (
    <>
      <NumberInput label="Original MSRP" value={originalMsrp} onChange={setOriginalMsrp} prefix="$" min={5000} max={200000} step={1000} showSlider />
      <NumberInput label="Current Age (years)" value={currentAge} onChange={setCurrentAge} min={0} max={20} step={1} showSlider />
      <NumberInput label="Mileage" value={mileage} onChange={setMileage} min={0} max={300000} step={1000} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Condition</label>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Current Value" value={formatCurrency(results.estimatedValue)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Depreciation from New" value={formatCurrency(results.depreciationFromNew)} size="small" variant="danger" />
        <ResultCard label="Value as % of Original" value={`${results.valueAsPct.toFixed(1)}%`} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   8. CarPaymentCalculator
   ═══════════════════════════════════════════════════════════ */

const PAYMENT_DEFAULTS = {
  vehiclePrice: 35000,
  downPayment: 5000,
  tradeIn: 0,
  interestRate: 6.5,
  term: 60,
};

export function CarPaymentCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState(PAYMENT_DEFAULTS.vehiclePrice);
  const [downPayment, setDownPayment] = useState(PAYMENT_DEFAULTS.downPayment);
  const [tradeIn, setTradeIn] = useState(PAYMENT_DEFAULTS.tradeIn);
  const [interestRate, setInterestRate] = useState(PAYMENT_DEFAULTS.interestRate);
  const [term, setTerm] = useState(PAYMENT_DEFAULTS.term);

  const results = useMemo(() => {
    const loanAmount = vehiclePrice - downPayment - tradeIn;
    const monthlyPayment = pmt(loanAmount, interestRate, term);
    const totalCost = monthlyPayment * term + downPayment + tradeIn;
    const totalInterest = monthlyPayment * term - loanAmount;
    return { monthlyPayment, totalInterest, totalCost, loanAmount };
  }, [vehiclePrice, downPayment, tradeIn, interestRate, term]);

  function resetDefaults() {
    setVehiclePrice(PAYMENT_DEFAULTS.vehiclePrice);
    setDownPayment(PAYMENT_DEFAULTS.downPayment);
    setTradeIn(PAYMENT_DEFAULTS.tradeIn);
    setInterestRate(PAYMENT_DEFAULTS.interestRate);
    setTerm(PAYMENT_DEFAULTS.term);
  }

  const inputs = (
    <>
      <NumberInput label="Vehicle Price" value={vehiclePrice} onChange={setVehiclePrice} prefix="$" min={5000} max={200000} step={1000} showSlider />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={100000} step={500} showSlider />
      <NumberInput label="Trade-In Value" value={tradeIn} onChange={setTradeIn} prefix="$" min={0} max={50000} step={500} />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={0} max={25} step={0.1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Loan Term</label>
        <Select value={term.toString()} onValueChange={(v) => setTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="36">36 months</SelectItem>
            <SelectItem value="48">48 months</SelectItem>
            <SelectItem value="60">60 months</SelectItem>
            <SelectItem value="72">72 months</SelectItem>
            <SelectItem value="84">84 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest" value={formatCurrency(results.totalInterest)} size="small" variant="danger" />
        <ResultCard label="Total Cost" value={formatCurrency(results.totalCost)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Loan Amount" value={formatCurrency(results.loanAmount)} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   9. AutoRefinanceCalculator
   ═══════════════════════════════════════════════════════════ */

const REFI_DEFAULTS = {
  currentBalance: 20000,
  currentRate: 8.0,
  currentRemainingMonths: 48,
  newRate: 5.5,
  newTerm: 48,
};

export function AutoRefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState(REFI_DEFAULTS.currentBalance);
  const [currentRate, setCurrentRate] = useState(REFI_DEFAULTS.currentRate);
  const [currentRemainingMonths, setCurrentRemainingMonths] = useState(REFI_DEFAULTS.currentRemainingMonths);
  const [newRate, setNewRate] = useState(REFI_DEFAULTS.newRate);
  const [newTerm, setNewTerm] = useState(REFI_DEFAULTS.newTerm);

  const results = useMemo(() => {
    const currentPayment = pmt(currentBalance, currentRate, currentRemainingMonths);
    const newPayment = pmt(currentBalance, newRate, newTerm);
    const monthlySavings = currentPayment - newPayment;
    const totalCurrentCost = currentPayment * currentRemainingMonths;
    const totalNewCost = newPayment * newTerm;
    const totalSavings = totalCurrentCost - totalNewCost;
    // Break-even is immediate since there are no refinance fees modeled here
    return { newPayment, monthlySavings, totalSavings, breakEvenMonth: monthlySavings > 0 ? 1 : Infinity };
  }, [currentBalance, currentRate, currentRemainingMonths, newRate, newTerm]);

  function resetDefaults() {
    setCurrentBalance(REFI_DEFAULTS.currentBalance);
    setCurrentRate(REFI_DEFAULTS.currentRate);
    setCurrentRemainingMonths(REFI_DEFAULTS.currentRemainingMonths);
    setNewRate(REFI_DEFAULTS.newRate);
    setNewTerm(REFI_DEFAULTS.newTerm);
  }

  const inputs = (
    <>
      <NumberInput label="Current Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={1000} max={100000} step={500} showSlider />
      <NumberInput label="Current Interest Rate" value={currentRate} onChange={setCurrentRate} prefix="%" min={1} max={25} step={0.1} showSlider />
      <NumberInput label="Current Remaining Months" value={currentRemainingMonths} onChange={setCurrentRemainingMonths} min={6} max={84} step={1} showSlider />
      <NumberInput label="New Interest Rate" value={newRate} onChange={setNewRate} prefix="%" min={1} max={25} step={0.1} showSlider />
      <NumberInput label="New Term (months)" value={newTerm} onChange={setNewTerm} min={12} max={84} step={6} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="New Monthly Payment" value={formatCurrency(results.newPayment)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Savings" value={formatCurrency(results.monthlySavings)} size="small" variant={results.monthlySavings > 0 ? "accent" : "danger"} />
        <ResultCard label="Total Savings" value={formatCurrency(results.totalSavings)} size="small" variant={results.totalSavings > 0 ? "accent" : "danger"} />
      </div>
      <ResultCard label="Break-Even Month" value={results.breakEvenMonth === Infinity ? "Never" : `Month ${results.breakEvenMonth}`} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   10. TotalCostOfOwnershipCalculator
   ═══════════════════════════════════════════════════════════ */

const TCO_DEFAULTS = {
  purchasePrice: 35000,
  downPayment: 5000,
  loanRate: 6.5,
  loanTerm: 60,
  annualInsurance: 1500,
  annualMaintenance: 800,
  annualFuelCost: 1800,
  depreciationRate: 15,
  yearsToOwn: 5,
};

export function TotalCostOfOwnershipCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(TCO_DEFAULTS.purchasePrice);
  const [downPayment, setDownPayment] = useState(TCO_DEFAULTS.downPayment);
  const [loanRate, setLoanRate] = useState(TCO_DEFAULTS.loanRate);
  const [loanTerm, setLoanTerm] = useState(TCO_DEFAULTS.loanTerm);
  const [annualInsurance, setAnnualInsurance] = useState(TCO_DEFAULTS.annualInsurance);
  const [annualMaintenance, setAnnualMaintenance] = useState(TCO_DEFAULTS.annualMaintenance);
  const [annualFuelCost, setAnnualFuelCost] = useState(TCO_DEFAULTS.annualFuelCost);
  const [depreciationRate, setDepreciationRate] = useState(TCO_DEFAULTS.depreciationRate);
  const [yearsToOwn, setYearsToOwn] = useState(TCO_DEFAULTS.yearsToOwn);

  const results = useMemo(() => {
    const loanAmount = purchasePrice - downPayment;
    const monthlyPayment = pmt(loanAmount, loanRate, loanTerm);
    const loanMonths = Math.min(loanTerm, yearsToOwn * 12);
    const totalLoanPayments = monthlyPayment * loanMonths + downPayment;

    const totalInsurance = annualInsurance * yearsToOwn;
    const totalMaintenance = annualMaintenance * yearsToOwn;
    const totalFuel = annualFuelCost * yearsToOwn;

    // Depreciation over ownership period
    let valueAtEnd = purchasePrice;
    for (let y = 0; y < yearsToOwn; y++) {
      valueAtEnd *= 1 - depreciationRate / 100;
    }
    const totalDepreciation = purchasePrice - valueAtEnd;

    // Total out-of-pocket = loan payments + insurance + maintenance + fuel
    const totalOutOfPocket = totalLoanPayments + totalInsurance + totalMaintenance + totalFuel;
    const costPerYear = totalOutOfPocket / yearsToOwn;
    const costPerMonth = costPerYear / 12;

    return {
      totalOutOfPocket,
      costPerYear,
      costPerMonth,
      totalLoanPayments,
      totalInsurance,
      totalMaintenance,
      totalFuel,
      totalDepreciation,
    };
  }, [purchasePrice, downPayment, loanRate, loanTerm, annualInsurance, annualMaintenance, annualFuelCost, depreciationRate, yearsToOwn]);

  function resetDefaults() {
    setPurchasePrice(TCO_DEFAULTS.purchasePrice);
    setDownPayment(TCO_DEFAULTS.downPayment);
    setLoanRate(TCO_DEFAULTS.loanRate);
    setLoanTerm(TCO_DEFAULTS.loanTerm);
    setAnnualInsurance(TCO_DEFAULTS.annualInsurance);
    setAnnualMaintenance(TCO_DEFAULTS.annualMaintenance);
    setAnnualFuelCost(TCO_DEFAULTS.annualFuelCost);
    setDepreciationRate(TCO_DEFAULTS.depreciationRate);
    setYearsToOwn(TCO_DEFAULTS.yearsToOwn);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={5000} max={200000} step={1000} showSlider />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} max={100000} step={500} showSlider />
      <NumberInput label="Loan Rate" value={loanRate} onChange={setLoanRate} prefix="%" min={0} max={25} step={0.1} showSlider />
      <NumberInput label="Loan Term (months)" value={loanTerm} onChange={setLoanTerm} min={12} max={84} step={6} showSlider />
      <NumberInput label="Annual Insurance" value={annualInsurance} onChange={setAnnualInsurance} prefix="$" min={0} max={10000} step={100} />
      <NumberInput label="Annual Maintenance" value={annualMaintenance} onChange={setAnnualMaintenance} prefix="$" min={0} max={10000} step={100} />
      <NumberInput label="Annual Fuel Cost" value={annualFuelCost} onChange={setAnnualFuelCost} prefix="$" min={0} max={10000} step={100} />
      <NumberInput label="Depreciation Rate % / Year" value={depreciationRate} onChange={setDepreciationRate} prefix="%" min={5} max={30} step={1} showSlider />
      <NumberInput label="Years to Own" value={yearsToOwn} onChange={setYearsToOwn} min={1} max={15} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Cost to Own" value={formatCurrency(results.totalOutOfPocket)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Cost Per Year" value={formatCurrency(results.costPerYear)} size="small" variant="neutral" />
        <ResultCard label="Cost Per Month" value={formatCurrency(results.costPerMonth)} size="small" variant="neutral" />
      </div>
      <div className="mt-4">
        <Label className="text-sm font-medium mb-2 block">Cost Breakdown</Label>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2">Category</th>
                <th className="text-right p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">Loan Payments (incl. down)</td>
                <td className="p-2 text-right">{formatCurrency(results.totalLoanPayments)}</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Insurance</td>
                <td className="p-2 text-right">{formatCurrency(results.totalInsurance)}</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Maintenance</td>
                <td className="p-2 text-right">{formatCurrency(results.totalMaintenance)}</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Fuel</td>
                <td className="p-2 text-right">{formatCurrency(results.totalFuel)}</td>
              </tr>
              <tr className="border-t font-medium">
                <td className="p-2">Depreciation (value loss)</td>
                <td className="p-2 text-right">{formatCurrency(results.totalDepreciation)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   11. TradeInValueCalculator
   ═══════════════════════════════════════════════════════════ */

const TRADEIN_DEFAULTS = {
  originalMsrp: 35000,
  vehicleYear: 2021,
  mileage: 45000,
  condition: "good" as string,
};

export function TradeInValueCalculator() {
  const [originalMsrp, setOriginalMsrp] = useState(TRADEIN_DEFAULTS.originalMsrp);
  const [vehicleYear, setVehicleYear] = useState(TRADEIN_DEFAULTS.vehicleYear);
  const [mileage, setMileage] = useState(TRADEIN_DEFAULTS.mileage);
  const [condition, setCondition] = useState(TRADEIN_DEFAULTS.condition);

  const results = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const age = Math.max(currentYear - vehicleYear, 0);

    // Depreciation curve for private party value
    let ppValue = originalMsrp;
    for (let y = 1; y <= age; y++) {
      if (y === 1) ppValue *= 0.80;
      else if (y <= 3) ppValue *= 0.85;
      else if (y <= 5) ppValue *= 0.90;
      else ppValue *= 0.93;
    }

    // Mileage adjustment
    const averageMileage = age * 12000;
    const mileageDiff = mileage - averageMileage;
    ppValue -= mileageDiff * 0.05;

    // Condition factor
    const conditionFactors: Record<string, number> = {
      excellent: 1.10,
      good: 1.00,
      fair: 0.88,
      poor: 0.72,
    };
    ppValue *= conditionFactors[condition] ?? 1.0;
    ppValue = Math.max(ppValue, 500);

    // Trade-in is typically 70-85% of private party, depending on condition
    const tradeInPct: Record<string, number> = {
      excellent: 0.85,
      good: 0.80,
      fair: 0.75,
      poor: 0.70,
    };
    const tradeInValue = ppValue * (tradeInPct[condition] ?? 0.78);

    // Dealer retail is typically 115-130% of private party
    const dealerRetail = ppValue * 1.20;
    const difference = dealerRetail - tradeInValue;

    return { tradeInValue, ppValue, dealerRetail, difference };
  }, [originalMsrp, vehicleYear, mileage, condition]);

  function resetDefaults() {
    setOriginalMsrp(TRADEIN_DEFAULTS.originalMsrp);
    setVehicleYear(TRADEIN_DEFAULTS.vehicleYear);
    setMileage(TRADEIN_DEFAULTS.mileage);
    setCondition(TRADEIN_DEFAULTS.condition);
  }

  const inputs = (
    <>
      <NumberInput label="Original MSRP" value={originalMsrp} onChange={setOriginalMsrp} prefix="$" min={5000} max={200000} step={1000} showSlider />
      <NumberInput label="Vehicle Year" value={vehicleYear} onChange={setVehicleYear} min={2000} max={2026} step={1} showSlider />
      <NumberInput label="Mileage" value={mileage} onChange={setMileage} min={0} max={300000} step={1000} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Condition</label>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Trade-In Value" value={formatCurrency(results.tradeInValue)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Private Party Value" value={formatCurrency(results.ppValue)} size="small" variant="accent" />
        <ResultCard label="Dealer Retail Estimate" value={formatCurrency(results.dealerRetail)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Dealer vs Trade-In Difference" value={formatCurrency(results.difference)} size="small" variant="danger" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
