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

/* ═══════════════════════════════════════════════════════════
   1. LifeInsuranceCalculator
   ═══════════════════════════════════════════════════════════ */

const LIFE_DEFAULTS = {
  annualIncome: 75000,
  yearsToReplace: 10,
  outstandingDebts: 20000,
  mortgageBalance: 250000,
  educationCosts: 100000,
  existingSavings: 50000,
  funeralCosts: 15000,
};

export function LifeInsuranceCalculator() {
  const [annualIncome, setAnnualIncome] = useState(LIFE_DEFAULTS.annualIncome);
  const [yearsToReplace, setYearsToReplace] = useState(LIFE_DEFAULTS.yearsToReplace);
  const [outstandingDebts, setOutstandingDebts] = useState(LIFE_DEFAULTS.outstandingDebts);
  const [mortgageBalance, setMortgageBalance] = useState(LIFE_DEFAULTS.mortgageBalance);
  const [educationCosts, setEducationCosts] = useState(LIFE_DEFAULTS.educationCosts);
  const [existingSavings, setExistingSavings] = useState(LIFE_DEFAULTS.existingSavings);
  const [funeralCosts, setFuneralCosts] = useState(LIFE_DEFAULTS.funeralCosts);

  const results = useMemo(() => {
    const incomeNeeded = annualIncome * yearsToReplace;
    const totalNeeded = incomeNeeded + outstandingDebts + mortgageBalance + educationCosts + funeralCosts;
    const coverageGap = totalNeeded - existingSavings;
    return { totalNeeded, coverageGap, incomeNeeded };
  }, [annualIncome, yearsToReplace, outstandingDebts, mortgageBalance, educationCosts, existingSavings, funeralCosts]);

  function resetDefaults() {
    setAnnualIncome(LIFE_DEFAULTS.annualIncome);
    setYearsToReplace(LIFE_DEFAULTS.yearsToReplace);
    setOutstandingDebts(LIFE_DEFAULTS.outstandingDebts);
    setMortgageBalance(LIFE_DEFAULTS.mortgageBalance);
    setEducationCosts(LIFE_DEFAULTS.educationCosts);
    setExistingSavings(LIFE_DEFAULTS.existingSavings);
    setFuneralCosts(LIFE_DEFAULTS.funeralCosts);
  }

  const inputs = (
    <>
      <NumberInput label="Annual Income" value={annualIncome} onChange={setAnnualIncome} prefix="$" min={0} max={1000000} step={5000} showSlider />
      <NumberInput label="Years of Income to Replace" value={yearsToReplace} onChange={setYearsToReplace} min={1} max={40} step={1} showSlider />
      <NumberInput label="Outstanding Debts" value={outstandingDebts} onChange={setOutstandingDebts} prefix="$" min={0} max={500000} step={1000} />
      <NumberInput label="Mortgage Balance" value={mortgageBalance} onChange={setMortgageBalance} prefix="$" min={0} max={2000000} step={5000} showSlider />
      <NumberInput label="Future Education Costs" value={educationCosts} onChange={setEducationCosts} prefix="$" min={0} max={500000} step={5000} />
      <NumberInput label="Existing Savings / Insurance" value={existingSavings} onChange={setExistingSavings} prefix="$" min={0} max={2000000} step={5000} />
      <NumberInput label="Funeral Costs" value={funeralCosts} onChange={setFuneralCosts} prefix="$" min={0} max={50000} step={1000} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Coverage Needed" value={formatCurrency(results.totalNeeded)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Coverage Gap" value={formatCurrency(results.coverageGap)} size="small" variant={results.coverageGap > 0 ? "danger" : "accent"} />
        <ResultCard label="Income Replacement" value={formatCurrency(results.incomeNeeded)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   2. TermLifeInsuranceCalculator
   ═══════════════════════════════════════════════════════════ */

const TERM_LIFE_DEFAULTS = {
  coverageAmount: 500000,
  term: 20,
  age: 35,
  gender: "male",
  smoker: false,
};

export function TermLifeInsuranceCalculator() {
  const [coverageAmount, setCoverageAmount] = useState(TERM_LIFE_DEFAULTS.coverageAmount);
  const [term, setTerm] = useState(TERM_LIFE_DEFAULTS.term);
  const [age, setAge] = useState(TERM_LIFE_DEFAULTS.age);
  const [gender, setGender] = useState(TERM_LIFE_DEFAULTS.gender);
  const [smoker, setSmoker] = useState(TERM_LIFE_DEFAULTS.smoker);

  const results = useMemo(() => {
    // Base rate per $1000 of coverage per month
    const baseRate = 0.05;
    const ageFactor = 1 + (age - 25) * 0.03;
    const smokerFactor = smoker ? 2.5 : 1.0;
    const genderFactor = gender === "male" ? 1.1 : 1.0;
    const termFactor = term <= 10 ? 0.8 : term <= 15 ? 0.9 : term <= 20 ? 1.0 : 1.2;

    const monthlyPremium = (coverageAmount / 1000) * baseRate * ageFactor * smokerFactor * genderFactor * termFactor;
    const annualPremium = monthlyPremium * 12;
    const totalPremiums = annualPremium * term;

    return { monthlyPremium, annualPremium, totalPremiums };
  }, [coverageAmount, term, age, gender, smoker]);

  function resetDefaults() {
    setCoverageAmount(TERM_LIFE_DEFAULTS.coverageAmount);
    setTerm(TERM_LIFE_DEFAULTS.term);
    setAge(TERM_LIFE_DEFAULTS.age);
    setGender(TERM_LIFE_DEFAULTS.gender);
    setSmoker(TERM_LIFE_DEFAULTS.smoker);
  }

  const inputs = (
    <>
      <NumberInput label="Coverage Amount" value={coverageAmount} onChange={setCoverageAmount} prefix="$" min={50000} max={5000000} step={25000} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Term Length</label>
        <Select value={term.toString()} onValueChange={(v) => setTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 years</SelectItem>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Age" value={age} onChange={setAge} min={18} max={80} step={1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Gender</label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="smoker" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        <Label htmlFor="smoker">Smoker</Label>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Monthly Premium" value={formatCurrency(results.monthlyPremium)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Premium" value={formatCurrency(results.annualPremium)} size="small" variant="neutral" />
        <ResultCard label="Total Premiums Over Term" value={formatCurrency(results.totalPremiums)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   3. HealthInsuranceCalculator
   ═══════════════════════════════════════════════════════════ */

const HEALTH_DEFAULTS = {
  monthlyPremium: 450,
  annualDeductible: 2000,
  copayPerVisit: 30,
  coinsurancePct: 20,
  outOfPocketMax: 8000,
  expectedVisits: 6,
  expectedPrescriptions: 12,
};

export function HealthInsuranceCalculator() {
  const [monthlyPremium, setMonthlyPremium] = useState(HEALTH_DEFAULTS.monthlyPremium);
  const [annualDeductible, setAnnualDeductible] = useState(HEALTH_DEFAULTS.annualDeductible);
  const [copayPerVisit, setCopayPerVisit] = useState(HEALTH_DEFAULTS.copayPerVisit);
  const [coinsurancePct, setCoinsurancePct] = useState(HEALTH_DEFAULTS.coinsurancePct);
  const [outOfPocketMax, setOutOfPocketMax] = useState(HEALTH_DEFAULTS.outOfPocketMax);
  const [expectedVisits, setExpectedVisits] = useState(HEALTH_DEFAULTS.expectedVisits);
  const [expectedPrescriptions, setExpectedPrescriptions] = useState(HEALTH_DEFAULTS.expectedPrescriptions);

  const results = useMemo(() => {
    const annualPremiums = monthlyPremium * 12;
    const avgVisitCost = 250; // average cost per doctor visit
    const avgRxCost = 50;

    const totalMedicalCosts = expectedVisits * avgVisitCost + expectedPrescriptions * avgRxCost;
    const copays = expectedVisits * copayPerVisit;

    // After deductible, coinsurance applies
    const afterDeductible = Math.max(0, totalMedicalCosts - annualDeductible);
    const coinsuranceCost = afterDeductible * (coinsurancePct / 100);
    const outOfPocket = Math.min(copays + Math.min(annualDeductible, totalMedicalCosts) + coinsuranceCost, outOfPocketMax);

    const totalAnnualCost = annualPremiums + outOfPocket;
    const costPerMonth = totalAnnualCost / 12;
    const payingOutOfPocket = totalMedicalCosts;

    return { totalAnnualCost, costPerMonth, payingOutOfPocket, annualPremiums, outOfPocket };
  }, [monthlyPremium, annualDeductible, copayPerVisit, coinsurancePct, outOfPocketMax, expectedVisits, expectedPrescriptions]);

  function resetDefaults() {
    setMonthlyPremium(HEALTH_DEFAULTS.monthlyPremium);
    setAnnualDeductible(HEALTH_DEFAULTS.annualDeductible);
    setCopayPerVisit(HEALTH_DEFAULTS.copayPerVisit);
    setCoinsurancePct(HEALTH_DEFAULTS.coinsurancePct);
    setOutOfPocketMax(HEALTH_DEFAULTS.outOfPocketMax);
    setExpectedVisits(HEALTH_DEFAULTS.expectedVisits);
    setExpectedPrescriptions(HEALTH_DEFAULTS.expectedPrescriptions);
  }

  const inputs = (
    <>
      <NumberInput label="Monthly Premium" value={monthlyPremium} onChange={setMonthlyPremium} prefix="$" min={0} max={3000} step={25} showSlider />
      <NumberInput label="Annual Deductible" value={annualDeductible} onChange={setAnnualDeductible} prefix="$" min={0} max={15000} step={250} showSlider />
      <NumberInput label="Copay per Visit" value={copayPerVisit} onChange={setCopayPerVisit} prefix="$" min={0} max={100} step={5} />
      <NumberInput label="Coinsurance %" value={coinsurancePct} onChange={setCoinsurancePct} prefix="%" min={0} max={50} step={5} showSlider />
      <NumberInput label="Out-of-Pocket Max" value={outOfPocketMax} onChange={setOutOfPocketMax} prefix="$" min={0} max={20000} step={500} />
      <NumberInput label="Expected Doctor Visits / Year" value={expectedVisits} onChange={setExpectedVisits} min={0} max={52} step={1} showSlider />
      <NumberInput label="Expected Prescriptions / Year" value={expectedPrescriptions} onChange={setExpectedPrescriptions} min={0} max={52} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Annual Cost" value={formatCurrency(results.totalAnnualCost)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Cost per Month" value={formatCurrency(results.costPerMonth)} size="small" variant="neutral" />
        <ResultCard label="Out-of-Pocket Costs" value={formatCurrency(results.outOfPocket)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Premiums" value={formatCurrency(results.annualPremiums)} size="small" variant="neutral" />
        <ResultCard label="Paying Out of Pocket" value={formatCurrency(results.payingOutOfPocket)} size="small" variant={results.payingOutOfPocket < results.totalAnnualCost ? "accent" : "danger"} />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   4. HomeInsuranceCalculator
   ═══════════════════════════════════════════════════════════ */

const HOME_INS_DEFAULTS = {
  homeValue: 350000,
  coverageRatio: 80,
  deductible: 1000,
  locationRisk: 1,
  claimsFreeDiscount: 10,
};

export function HomeInsuranceCalculator() {
  const [homeValue, setHomeValue] = useState(HOME_INS_DEFAULTS.homeValue);
  const [coverageRatio, setCoverageRatio] = useState(HOME_INS_DEFAULTS.coverageRatio);
  const [deductible, setDeductible] = useState(HOME_INS_DEFAULTS.deductible);
  const [locationRisk, setLocationRisk] = useState(HOME_INS_DEFAULTS.locationRisk);
  const [claimsFreeDiscount, setClaimsFreeDiscount] = useState(HOME_INS_DEFAULTS.claimsFreeDiscount);

  const results = useMemo(() => {
    const coverageAmount = homeValue * (coverageRatio / 100);
    const baseAnnual = homeValue * 0.003;
    const riskAdjusted = baseAnnual * locationRisk;
    const deductibleFactor = deductible >= 2500 ? 0.85 : deductible >= 1000 ? 0.95 : 1.0;
    const discountFactor = 1 - claimsFreeDiscount / 100;
    const annualPremium = riskAdjusted * deductibleFactor * discountFactor;
    const monthlyPremium = annualPremium / 12;

    return { annualPremium, monthlyPremium, coverageAmount };
  }, [homeValue, coverageRatio, deductible, locationRisk, claimsFreeDiscount]);

  function resetDefaults() {
    setHomeValue(HOME_INS_DEFAULTS.homeValue);
    setCoverageRatio(HOME_INS_DEFAULTS.coverageRatio);
    setDeductible(HOME_INS_DEFAULTS.deductible);
    setLocationRisk(HOME_INS_DEFAULTS.locationRisk);
    setClaimsFreeDiscount(HOME_INS_DEFAULTS.claimsFreeDiscount);
  }

  const inputs = (
    <>
      <NumberInput label="Home Value" value={homeValue} onChange={setHomeValue} prefix="$" min={50000} max={2000000} step={10000} showSlider />
      <NumberInput label="Coverage Ratio (%)" value={coverageRatio} onChange={setCoverageRatio} prefix="%" min={80} max={100} step={5} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Deductible</label>
        <Select value={deductible.toString()} onValueChange={(v) => setDeductible(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="500">$500</SelectItem>
            <SelectItem value="1000">$1,000</SelectItem>
            <SelectItem value="1500">$1,500</SelectItem>
            <SelectItem value="2000">$2,000</SelectItem>
            <SelectItem value="2500">$2,500</SelectItem>
            <SelectItem value="5000">$5,000</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Location Risk Factor</label>
        <Select value={locationRisk.toString()} onValueChange={(v) => setLocationRisk(parseFloat(v))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Low Risk (1x)</SelectItem>
            <SelectItem value="1.5">Moderate Risk (1.5x)</SelectItem>
            <SelectItem value="2">High Risk (2x)</SelectItem>
            <SelectItem value="2.5">Very High Risk (2.5x)</SelectItem>
            <SelectItem value="3">Extreme Risk (3x)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Claims-Free Discount (%)" value={claimsFreeDiscount} onChange={setClaimsFreeDiscount} prefix="%" min={0} max={30} step={5} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Annual Premium" value={formatCurrency(results.annualPremium)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Premium" value={formatCurrency(results.monthlyPremium)} size="small" variant="neutral" />
        <ResultCard label="Coverage Amount" value={formatCurrency(results.coverageAmount)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   5. DisabilityInsuranceCalculator
   ═══════════════════════════════════════════════════════════ */

const DISABILITY_DEFAULTS = {
  monthlyIncome: 6000,
  benefitPct: 60,
  eliminationPeriod: 90,
  benefitPeriod: "5",
};

export function DisabilityInsuranceCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(DISABILITY_DEFAULTS.monthlyIncome);
  const [benefitPct, setBenefitPct] = useState(DISABILITY_DEFAULTS.benefitPct);
  const [eliminationPeriod, setEliminationPeriod] = useState(DISABILITY_DEFAULTS.eliminationPeriod);
  const [benefitPeriod, setBenefitPeriod] = useState(DISABILITY_DEFAULTS.benefitPeriod);

  const results = useMemo(() => {
    const monthlyBenefit = monthlyIncome * (benefitPct / 100);
    const incomeGap = monthlyIncome - monthlyBenefit;

    // Premium estimate: roughly 1-3% of annual income
    const basePremiumRate = 0.02;
    const eliminationFactor = eliminationPeriod <= 30 ? 1.3 : eliminationPeriod <= 60 ? 1.15 : eliminationPeriod <= 90 ? 1.0 : 0.85;
    const periodYears = benefitPeriod === "65" ? 30 : parseInt(benefitPeriod, 10);
    const periodFactor = periodYears <= 2 ? 0.7 : periodYears <= 5 ? 1.0 : periodYears <= 10 ? 1.3 : 1.6;

    const annualPremium = monthlyIncome * 12 * basePremiumRate * eliminationFactor * periodFactor;

    return { monthlyBenefit, annualPremium, incomeGap };
  }, [monthlyIncome, benefitPct, eliminationPeriod, benefitPeriod]);

  function resetDefaults() {
    setMonthlyIncome(DISABILITY_DEFAULTS.monthlyIncome);
    setBenefitPct(DISABILITY_DEFAULTS.benefitPct);
    setEliminationPeriod(DISABILITY_DEFAULTS.eliminationPeriod);
    setBenefitPeriod(DISABILITY_DEFAULTS.benefitPeriod);
  }

  const inputs = (
    <>
      <NumberInput label="Monthly Income" value={monthlyIncome} onChange={setMonthlyIncome} prefix="$" min={1000} max={50000} step={500} showSlider />
      <NumberInput label="Benefit Percentage (%)" value={benefitPct} onChange={setBenefitPct} prefix="%" min={60} max={70} step={5} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Elimination Period</label>
        <Select value={eliminationPeriod.toString()} onValueChange={(v) => setEliminationPeriod(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="60">60 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="180">180 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Benefit Period</label>
        <Select value={benefitPeriod} onValueChange={setBenefitPeriod}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 years</SelectItem>
            <SelectItem value="5">5 years</SelectItem>
            <SelectItem value="10">10 years</SelectItem>
            <SelectItem value="65">To age 65</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Benefit" value={formatCurrency(results.monthlyBenefit)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Estimated Annual Premium" value={formatCurrency(results.annualPremium)} size="small" variant="neutral" />
        <ResultCard label="Monthly Income Gap" value={formatCurrency(results.incomeGap)} size="small" variant="danger" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   6. UmbrellaInsuranceCalculator
   ═══════════════════════════════════════════════════════════ */

const UMBRELLA_DEFAULTS = {
  netWorth: 500000,
  numDrivers: 2,
  rentalProperties: 0,
  hasPoolOrTrampoline: false,
  desiredCoverage: 1000000,
};

export function UmbrellaInsuranceCalculator() {
  const [netWorth, setNetWorth] = useState(UMBRELLA_DEFAULTS.netWorth);
  const [numDrivers, setNumDrivers] = useState(UMBRELLA_DEFAULTS.numDrivers);
  const [rentalProperties, setRentalProperties] = useState(UMBRELLA_DEFAULTS.rentalProperties);
  const [hasPoolOrTrampoline, setHasPoolOrTrampoline] = useState(UMBRELLA_DEFAULTS.hasPoolOrTrampoline);
  const [desiredCoverage, setDesiredCoverage] = useState(UMBRELLA_DEFAULTS.desiredCoverage);

  const results = useMemo(() => {
    // Recommended coverage at least matches net worth
    const recommendedCoverage = Math.max(netWorth, 1000000);

    // Base premium: $150-$300 per $1M
    const millionsOfCoverage = desiredCoverage / 1000000;
    const basePremiumPerMillion = 200;
    let annualPremium = millionsOfCoverage * basePremiumPerMillion;

    // Adjustments
    annualPremium += (numDrivers - 1) * 50;
    annualPremium += rentalProperties * 75;
    if (hasPoolOrTrampoline) annualPremium += 100;

    const monthlyPremium = annualPremium / 12;

    return { recommendedCoverage, annualPremium, monthlyPremium };
  }, [netWorth, numDrivers, rentalProperties, hasPoolOrTrampoline, desiredCoverage]);

  function resetDefaults() {
    setNetWorth(UMBRELLA_DEFAULTS.netWorth);
    setNumDrivers(UMBRELLA_DEFAULTS.numDrivers);
    setRentalProperties(UMBRELLA_DEFAULTS.rentalProperties);
    setHasPoolOrTrampoline(UMBRELLA_DEFAULTS.hasPoolOrTrampoline);
    setDesiredCoverage(UMBRELLA_DEFAULTS.desiredCoverage);
  }

  const inputs = (
    <>
      <NumberInput label="Net Worth" value={netWorth} onChange={setNetWorth} prefix="$" min={0} max={10000000} step={50000} showSlider />
      <NumberInput label="Number of Drivers" value={numDrivers} onChange={setNumDrivers} min={1} max={10} step={1} />
      <NumberInput label="Rental Properties" value={rentalProperties} onChange={setRentalProperties} min={0} max={20} step={1} />
      <div className="flex items-center gap-2">
        <input type="checkbox" id="pool-trampoline" checked={hasPoolOrTrampoline} onChange={(e) => setHasPoolOrTrampoline(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        <Label htmlFor="pool-trampoline">Pool or Trampoline</Label>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Desired Coverage</label>
        <Select value={desiredCoverage.toString()} onValueChange={(v) => setDesiredCoverage(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1000000">$1,000,000</SelectItem>
            <SelectItem value="2000000">$2,000,000</SelectItem>
            <SelectItem value="3000000">$3,000,000</SelectItem>
            <SelectItem value="4000000">$4,000,000</SelectItem>
            <SelectItem value="5000000">$5,000,000</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Recommended Coverage" value={formatCurrency(results.recommendedCoverage)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Estimated Annual Premium" value={formatCurrency(results.annualPremium)} size="small" variant="neutral" />
        <ResultCard label="Cost per Month" value={formatCurrency(results.monthlyPremium)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   7. LongTermCareCalculator
   ═══════════════════════════════════════════════════════════ */

const LTC_DEFAULTS = {
  currentAge: 55,
  dailyBenefit: 250,
  benefitPeriod: 3,
  inflationProtection: 3,
  currentCareCostPerYear: 100000,
};

export function LongTermCareCalculator() {
  const [currentAge, setCurrentAge] = useState(LTC_DEFAULTS.currentAge);
  const [dailyBenefit, setDailyBenefit] = useState(LTC_DEFAULTS.dailyBenefit);
  const [benefitPeriod, setBenefitPeriod] = useState(LTC_DEFAULTS.benefitPeriod);
  const [inflationProtection, setInflationProtection] = useState(LTC_DEFAULTS.inflationProtection);
  const [currentCareCostPerYear, setCurrentCareCostPerYear] = useState(LTC_DEFAULTS.currentCareCostPerYear);

  const results = useMemo(() => {
    // Premium estimate based on age and benefit
    const ageFactor = currentAge <= 50 ? 0.7 : currentAge <= 55 ? 1.0 : currentAge <= 60 ? 1.4 : currentAge <= 65 ? 2.0 : 3.0;
    const benefitFactor = dailyBenefit / 150;
    const periodFactor = benefitPeriod / 3;
    const inflationFactor = 1 + (inflationProtection - 3) * 0.15;

    const annualPremium = 1500 * ageFactor * benefitFactor * periodFactor * inflationFactor;
    const yearsTo85 = Math.max(0, 85 - currentAge);
    const totalPremiumsTo85 = annualPremium * yearsTo85;

    // Projected cost of care at age 80 with inflation
    const yearsTo80 = Math.max(0, 80 - currentAge);
    const projectedCostAt80 = currentCareCostPerYear * Math.pow(1 + inflationProtection / 100, yearsTo80);

    // Coverage gap: projected annual cost vs daily benefit annualized
    const annualBenefit = dailyBenefit * 365;
    const coverageGap = projectedCostAt80 - annualBenefit;

    return { annualPremium, totalPremiumsTo85, projectedCostAt80, coverageGap };
  }, [currentAge, dailyBenefit, benefitPeriod, inflationProtection, currentCareCostPerYear]);

  function resetDefaults() {
    setCurrentAge(LTC_DEFAULTS.currentAge);
    setDailyBenefit(LTC_DEFAULTS.dailyBenefit);
    setBenefitPeriod(LTC_DEFAULTS.benefitPeriod);
    setInflationProtection(LTC_DEFAULTS.inflationProtection);
    setCurrentCareCostPerYear(LTC_DEFAULTS.currentCareCostPerYear);
  }

  const inputs = (
    <>
      <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={40} max={80} step={1} showSlider />
      <NumberInput label="Desired Daily Benefit" value={dailyBenefit} onChange={setDailyBenefit} prefix="$" min={150} max={400} step={25} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Benefit Period</label>
        <Select value={benefitPeriod.toString()} onValueChange={(v) => setBenefitPeriod(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 years</SelectItem>
            <SelectItem value="3">3 years</SelectItem>
            <SelectItem value="4">4 years</SelectItem>
            <SelectItem value="5">5 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Inflation Protection (%)" value={inflationProtection} onChange={setInflationProtection} prefix="%" min={3} max={5} step={0.5} showSlider />
      <NumberInput label="Current Care Cost in Area (per year)" value={currentCareCostPerYear} onChange={setCurrentCareCostPerYear} prefix="$" min={30000} max={300000} step={5000} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Annual Premium" value={formatCurrency(results.annualPremium)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Premiums to Age 85" value={formatCurrency(results.totalPremiumsTo85)} size="small" variant="neutral" />
        <ResultCard label="Projected Cost at Age 80" value={formatCurrency(results.projectedCostAt80)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Coverage Gap (Annual)" value={formatCurrency(results.coverageGap)} size="small" variant={results.coverageGap > 0 ? "danger" : "accent"} />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   8. InsuranceNeedsCalculator
   ═══════════════════════════════════════════════════════════ */

const NEEDS_DEFAULTS = {
  annualIncome: 80000,
  spouseIncome: 40000,
  yearsUntilIndependent: 15,
  mortgageBalance: 250000,
  otherDebts: 25000,
  collegeFund: 120000,
  existingLifeInsurance: 100000,
  savings: 50000,
};

export function InsuranceNeedsCalculator() {
  const [annualIncome, setAnnualIncome] = useState(NEEDS_DEFAULTS.annualIncome);
  const [spouseIncome, setSpouseIncome] = useState(NEEDS_DEFAULTS.spouseIncome);
  const [yearsUntilIndependent, setYearsUntilIndependent] = useState(NEEDS_DEFAULTS.yearsUntilIndependent);
  const [mortgageBalance, setMortgageBalance] = useState(NEEDS_DEFAULTS.mortgageBalance);
  const [otherDebts, setOtherDebts] = useState(NEEDS_DEFAULTS.otherDebts);
  const [collegeFund, setCollegeFund] = useState(NEEDS_DEFAULTS.collegeFund);
  const [existingLifeInsurance, setExistingLifeInsurance] = useState(NEEDS_DEFAULTS.existingLifeInsurance);
  const [savings, setSavings] = useState(NEEDS_DEFAULTS.savings);

  const results = useMemo(() => {
    // DIME method
    const debt = otherDebts;
    const income = (annualIncome - spouseIncome) * yearsUntilIndependent;
    const mortgage = mortgageBalance;
    const education = collegeFund;

    const dimeTotal = debt + income + mortgage + education;
    const totalNeeds = dimeTotal;
    const existingResources = existingLifeInsurance + savings;
    const coverageGap = totalNeeds - existingResources;
    const recommendedCoverage = Math.max(0, coverageGap);

    return { dimeTotal, totalNeeds, coverageGap, recommendedCoverage, debt, income, mortgage, education };
  }, [annualIncome, spouseIncome, yearsUntilIndependent, mortgageBalance, otherDebts, collegeFund, existingLifeInsurance, savings]);

  function resetDefaults() {
    setAnnualIncome(NEEDS_DEFAULTS.annualIncome);
    setSpouseIncome(NEEDS_DEFAULTS.spouseIncome);
    setYearsUntilIndependent(NEEDS_DEFAULTS.yearsUntilIndependent);
    setMortgageBalance(NEEDS_DEFAULTS.mortgageBalance);
    setOtherDebts(NEEDS_DEFAULTS.otherDebts);
    setCollegeFund(NEEDS_DEFAULTS.collegeFund);
    setExistingLifeInsurance(NEEDS_DEFAULTS.existingLifeInsurance);
    setSavings(NEEDS_DEFAULTS.savings);
  }

  const inputs = (
    <>
      <NumberInput label="Annual Income" value={annualIncome} onChange={setAnnualIncome} prefix="$" min={0} max={500000} step={5000} showSlider />
      <NumberInput label="Spouse Income" value={spouseIncome} onChange={setSpouseIncome} prefix="$" min={0} max={500000} step={5000} />
      <NumberInput label="Years Until Youngest Child Independent" value={yearsUntilIndependent} onChange={setYearsUntilIndependent} min={0} max={30} step={1} showSlider />
      <NumberInput label="Mortgage Balance" value={mortgageBalance} onChange={setMortgageBalance} prefix="$" min={0} max={2000000} step={5000} showSlider />
      <NumberInput label="Other Debts" value={otherDebts} onChange={setOtherDebts} prefix="$" min={0} max={500000} step={1000} />
      <NumberInput label="College Fund Needed" value={collegeFund} onChange={setCollegeFund} prefix="$" min={0} max={500000} step={5000} />
      <NumberInput label="Existing Life Insurance" value={existingLifeInsurance} onChange={setExistingLifeInsurance} prefix="$" min={0} max={5000000} step={10000} />
      <NumberInput label="Savings" value={savings} onChange={setSavings} prefix="$" min={0} max={5000000} step={5000} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="DIME Total Needs" value={formatCurrency(results.dimeTotal)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Debt (D)" value={formatCurrency(results.debt)} size="small" variant="neutral" />
        <ResultCard label="Income (I)" value={formatCurrency(results.income)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Mortgage (M)" value={formatCurrency(results.mortgage)} size="small" variant="neutral" />
        <ResultCard label="Education (E)" value={formatCurrency(results.education)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Coverage Gap" value={formatCurrency(results.coverageGap)} size="small" variant={results.coverageGap > 0 ? "danger" : "accent"} />
        <ResultCard label="Recommended Coverage" value={formatCurrency(results.recommendedCoverage)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   9. WholeLifeVsTermCalculator
   ═══════════════════════════════════════════════════════════ */

const WL_VS_TERM_DEFAULTS = {
  coverageAmount: 500000,
  age: 35,
  termLength: 20,
  termMonthlyPremium: 35,
  wholeLifeMonthlyPremium: 350,
  investmentReturn: 7,
};

export function WholeLifeVsTermCalculator() {
  const [coverageAmount, setCoverageAmount] = useState(WL_VS_TERM_DEFAULTS.coverageAmount);
  const [age, setAge] = useState(WL_VS_TERM_DEFAULTS.age);
  const [termLength, setTermLength] = useState(WL_VS_TERM_DEFAULTS.termLength);
  const [termMonthlyPremium, setTermMonthlyPremium] = useState(WL_VS_TERM_DEFAULTS.termMonthlyPremium);
  const [wholeLifeMonthlyPremium, setWholeLifeMonthlyPremium] = useState(WL_VS_TERM_DEFAULTS.wholeLifeMonthlyPremium);
  const [investmentReturn, setInvestmentReturn] = useState(WL_VS_TERM_DEFAULTS.investmentReturn);

  const results = useMemo(() => {
    const totalCostTerm = termMonthlyPremium * 12 * termLength;
    const totalCostWholeLife = wholeLifeMonthlyPremium * 12 * termLength;

    // Buy term and invest the difference
    const monthlyDifference = wholeLifeMonthlyPremium - termMonthlyPremium;
    const monthlyRate = investmentReturn / 100 / 12;
    const months = termLength * 12;
    let portfolioValue = 0;
    if (monthlyRate > 0 && monthlyDifference > 0) {
      portfolioValue = monthlyDifference * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
      portfolioValue = monthlyDifference * months;
    }

    // Rough cash value estimate for whole life (typically 60-70% of premiums paid after 20+ years)
    const cashValueRatio = termLength <= 10 ? 0.3 : termLength <= 20 ? 0.5 : 0.65;
    const cashValueEstimate = totalCostWholeLife * cashValueRatio;

    return { totalCostTerm, totalCostWholeLife, portfolioValue, cashValueEstimate };
  }, [coverageAmount, age, termLength, termMonthlyPremium, wholeLifeMonthlyPremium, investmentReturn]);

  function resetDefaults() {
    setCoverageAmount(WL_VS_TERM_DEFAULTS.coverageAmount);
    setAge(WL_VS_TERM_DEFAULTS.age);
    setTermLength(WL_VS_TERM_DEFAULTS.termLength);
    setTermMonthlyPremium(WL_VS_TERM_DEFAULTS.termMonthlyPremium);
    setWholeLifeMonthlyPremium(WL_VS_TERM_DEFAULTS.wholeLifeMonthlyPremium);
    setInvestmentReturn(WL_VS_TERM_DEFAULTS.investmentReturn);
  }

  const inputs = (
    <>
      <NumberInput label="Coverage Amount" value={coverageAmount} onChange={setCoverageAmount} prefix="$" min={50000} max={5000000} step={25000} showSlider />
      <NumberInput label="Age" value={age} onChange={setAge} min={18} max={70} step={1} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Term Length (for Term Policy)</label>
        <Select value={termLength.toString()} onValueChange={(v) => setTermLength(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 years</SelectItem>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
            <SelectItem value="30">30 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NumberInput label="Term Monthly Premium" value={termMonthlyPremium} onChange={setTermMonthlyPremium} prefix="$" min={5} max={500} step={5} showSlider />
      <NumberInput label="Whole Life Monthly Premium" value={wholeLifeMonthlyPremium} onChange={setWholeLifeMonthlyPremium} prefix="$" min={50} max={2000} step={25} showSlider />
      <NumberInput label="Investment Return (if Investing Difference)" value={investmentReturn} onChange={setInvestmentReturn} prefix="%" min={0} max={15} step={0.5} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Cost - Term" value={formatCurrency(results.totalCostTerm)} size="large" />
      <ResultCard label="Total Cost - Whole Life" value={formatCurrency(results.totalCostWholeLife)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Buy Term, Invest the Rest Portfolio" value={formatCurrency(results.portfolioValue)} size="small" variant="accent" />
        <ResultCard label="Whole Life Cash Value Estimate" value={formatCurrency(results.cashValueEstimate)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   10. RentersInsuranceCalculator
   ═══════════════════════════════════════════════════════════ */

const RENTERS_DEFAULTS = {
  personalPropertyValue: 25000,
  deductible: 500,
  liabilityCoverage: 100000,
  location: "suburban",
};

export function RentersInsuranceCalculator() {
  const [personalPropertyValue, setPersonalPropertyValue] = useState(RENTERS_DEFAULTS.personalPropertyValue);
  const [deductible, setDeductible] = useState(RENTERS_DEFAULTS.deductible);
  const [liabilityCoverage, setLiabilityCoverage] = useState(RENTERS_DEFAULTS.liabilityCoverage);
  const [location, setLocation] = useState(RENTERS_DEFAULTS.location);

  const results = useMemo(() => {
    const locationFactor = location === "urban" ? 1.3 : location === "suburban" ? 1.0 : 0.85;
    const deductibleFactor = deductible >= 2000 ? 0.8 : deductible >= 1000 ? 0.9 : 1.0;
    const liabilityAddon = (liabilityCoverage - 100000) / 100000 * 20; // ~$20 per extra $100K

    const basePremium = personalPropertyValue * 0.01;
    const annualPremium = Math.max(0, basePremium * locationFactor * deductibleFactor + liabilityAddon);
    const monthlyPremium = annualPremium / 12;

    return { annualPremium, monthlyPremium, personalPropertyValue, liabilityCoverage };
  }, [personalPropertyValue, deductible, liabilityCoverage, location]);

  function resetDefaults() {
    setPersonalPropertyValue(RENTERS_DEFAULTS.personalPropertyValue);
    setDeductible(RENTERS_DEFAULTS.deductible);
    setLiabilityCoverage(RENTERS_DEFAULTS.liabilityCoverage);
    setLocation(RENTERS_DEFAULTS.location);
  }

  const inputs = (
    <>
      <NumberInput label="Personal Property Value" value={personalPropertyValue} onChange={setPersonalPropertyValue} prefix="$" min={5000} max={200000} step={1000} showSlider />
      <div className="space-y-2">
        <label className="text-sm font-medium">Deductible</label>
        <Select value={deductible.toString()} onValueChange={(v) => setDeductible(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="500">$500</SelectItem>
            <SelectItem value="1000">$1,000</SelectItem>
            <SelectItem value="1500">$1,500</SelectItem>
            <SelectItem value="2000">$2,000</SelectItem>
            <SelectItem value="2500">$2,500</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Liability Coverage</label>
        <Select value={liabilityCoverage.toString()} onValueChange={(v) => setLiabilityCoverage(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="100000">$100,000</SelectItem>
            <SelectItem value="200000">$200,000</SelectItem>
            <SelectItem value="300000">$300,000</SelectItem>
            <SelectItem value="500000">$500,000</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rural">Rural</SelectItem>
            <SelectItem value="suburban">Suburban</SelectItem>
            <SelectItem value="urban">Urban</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Annual Premium" value={formatCurrency(results.annualPremium)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Premium" value={formatCurrency(results.monthlyPremium)} size="small" variant="neutral" />
        <ResultCard label="Property Coverage" value={formatCurrency(results.personalPropertyValue)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Liability Coverage" value={formatCurrency(results.liabilityCoverage)} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
