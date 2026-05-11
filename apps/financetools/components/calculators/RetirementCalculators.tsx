"use client";

import React, { useState, useMemo } from "react";
import { CalculatorShell } from "@/components/shared/CalculatorShell";
import { ResultCard } from "@/components/shared/ResultCard";
import { NumberInput } from "@/components/shared/NumberInput";
import { formatCurrency } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────────
   Shared helpers
   ────────────────────────────────────────────────────────────────────────────── */

/** Future value of a present amount + recurring contributions */
function fv(pv: number, pmt: number, r: number, n: number): number {
  if (r === 0) return pv + pmt * n;
  const g = Math.pow(1 + r, n);
  return pv * g + pmt * ((g - 1) / r);
}

/** Present value of an annuity */
function pvAnnuity(pmt: number, r: number, n: number): number {
  if (r === 0) return pmt * n;
  return pmt * ((1 - Math.pow(1 + r, -n)) / r);
}

/** PMT – periodic payment for a given PV */
function pmt(pvVal: number, r: number, n: number): number {
  if (r === 0) return pvVal / n;
  return (pvVal * r) / (1 - Math.pow(1 + r, -n));
}

function formatPercent(v: number): string {
  return `${v.toFixed(1)}%`;
}

function formatYears(v: number): string {
  if (!isFinite(v) || v < 0) return "N/A";
  if (v > 100) return "100+ years";
  return `${v.toFixed(1)} years`;
}

function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      Reset to Defaults
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   1. FourOhOneKCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_401K = {
  currentAge: 30,
  retirementAge: 65,
  salary: 75000,
  contributionPct: 10,
  employerMatchPct: 50,
  matchLimitPct: 6,
  currentBalance: 25000,
  annualReturn: 7,
};

export function FourOhOneKCalculator() {
  const [currentAge, setCurrentAge] = useState(DEFAULTS_401K.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS_401K.retirementAge);
  const [salary, setSalary] = useState(DEFAULTS_401K.salary);
  const [contributionPct, setContributionPct] = useState(DEFAULTS_401K.contributionPct);
  const [employerMatchPct, setEmployerMatchPct] = useState(DEFAULTS_401K.employerMatchPct);
  const [matchLimitPct, setMatchLimitPct] = useState(DEFAULTS_401K.matchLimitPct);
  const [currentBalance, setCurrentBalance] = useState(DEFAULTS_401K.currentBalance);
  const [annualReturn, setAnnualReturn] = useState(DEFAULTS_401K.annualReturn);

  const reset = () => {
    setCurrentAge(DEFAULTS_401K.currentAge);
    setRetirementAge(DEFAULTS_401K.retirementAge);
    setSalary(DEFAULTS_401K.salary);
    setContributionPct(DEFAULTS_401K.contributionPct);
    setEmployerMatchPct(DEFAULTS_401K.employerMatchPct);
    setMatchLimitPct(DEFAULTS_401K.matchLimitPct);
    setCurrentBalance(DEFAULTS_401K.currentBalance);
    setAnnualReturn(DEFAULTS_401K.annualReturn);
  };

  const results = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 0);
    const maxContrib = currentAge >= 50 ? 30500 : 23000;
    const rawContrib = salary * (contributionPct / 100);
    const annualContrib = Math.min(rawContrib, maxContrib);
    const matchableContrib = Math.min(salary * (matchLimitPct / 100), rawContrib);
    const employerAnnual = matchableContrib * (employerMatchPct / 100);
    const totalAnnualContrib = annualContrib + employerAnnual;
    const r = annualReturn / 100;
    const projectedBalance = fv(currentBalance, totalAnnualContrib, r, years);
    const totalContributions = annualContrib * years;
    const totalEmployer = employerAnnual * years;
    const totalGrowth = projectedBalance - currentBalance - totalContributions - totalEmployer;
    const monthlyIncome = (projectedBalance * 0.04) / 12;
    return { projectedBalance, totalContributions, totalEmployer, totalGrowth, monthlyIncome, maxContrib };
  }, [currentAge, retirementAge, salary, contributionPct, employerMatchPct, matchLimitPct, currentBalance, annualReturn]);

  const inputs = (
    <>
      <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={80} step={1} suffix="years" />
      <NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={currentAge + 1} max={100} step={1} suffix="years" />
      <NumberInput label="Annual Salary" value={salary} onChange={setSalary} prefix="$" min={0} max={1000000} step={1000} />
      <NumberInput label="Your Contribution %" value={contributionPct} onChange={setContributionPct} prefix="%" min={0} max={100} step={0.5} helpText={`Annual max: ${formatCurrency(results.maxContrib)}`} />
      <NumberInput label="Employer Match %" value={employerMatchPct} onChange={setEmployerMatchPct} prefix="%" min={0} max={100} step={1} helpText="% of your contribution matched" />
      <NumberInput label="Match Limit (% of salary)" value={matchLimitPct} onChange={setMatchLimitPct} prefix="%" min={0} max={100} step={0.5} />
      <NumberInput label="Current Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={0} max={10000000} step={1000} />
      <NumberInput label="Annual Return" value={annualReturn} onChange={setAnnualReturn} prefix="%" min={0} max={15} step={0.1} showSlider />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Projected Balance at Retirement" value={formatCurrency(results.projectedBalance)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Contributions" value={formatCurrency(results.totalContributions)} size="small" variant="neutral" />
        <ResultCard label="Employer Contributions" value={formatCurrency(results.totalEmployer)} size="small" variant="accent" />
        <ResultCard label="Investment Growth" value={formatCurrency(results.totalGrowth)} size="small" variant="neutral" />
        <ResultCard label="Monthly Income (4% Rule)" value={formatCurrency(results.monthlyIncome)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   2. RothIraCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_ROTH = {
  currentAge: 30,
  retirementAge: 65,
  currentBalance: 10000,
  annualContribution: 7000,
  annualReturn: 7,
};

export function RothIraCalculator() {
  const [currentAge, setCurrentAge] = useState(DEFAULTS_ROTH.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS_ROTH.retirementAge);
  const [currentBalance, setCurrentBalance] = useState(DEFAULTS_ROTH.currentBalance);
  const [annualContribution, setAnnualContribution] = useState(DEFAULTS_ROTH.annualContribution);
  const [annualReturn, setAnnualReturn] = useState(DEFAULTS_ROTH.annualReturn);

  const reset = () => {
    setCurrentAge(DEFAULTS_ROTH.currentAge);
    setRetirementAge(DEFAULTS_ROTH.retirementAge);
    setCurrentBalance(DEFAULTS_ROTH.currentBalance);
    setAnnualContribution(DEFAULTS_ROTH.annualContribution);
    setAnnualReturn(DEFAULTS_ROTH.annualReturn);
  };

  const results = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 0);
    const maxContrib = currentAge >= 50 ? 8000 : 7000;
    const contrib = Math.min(annualContribution, maxContrib);
    const r = annualReturn / 100;
    const projectedBalance = fv(currentBalance, contrib, r, years);
    const totalContributions = contrib * years;
    const totalGrowth = projectedBalance - currentBalance - totalContributions;
    const monthlyIncome = (projectedBalance * 0.04) / 12;
    return { projectedBalance, totalContributions, totalGrowth, monthlyIncome, maxContrib };
  }, [currentAge, retirementAge, currentBalance, annualContribution, annualReturn]);

  const inputs = (
    <>
      <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={80} step={1} suffix="years" />
      <NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={currentAge + 1} max={100} step={1} suffix="years" />
      <NumberInput label="Current Roth IRA Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={0} max={10000000} step={500} />
      <NumberInput label="Annual Contribution" value={annualContribution} onChange={setAnnualContribution} prefix="$" min={0} max={8000} step={100} helpText={`Max: ${formatCurrency(results.maxContrib)}/yr`} />
      <NumberInput label="Annual Return" value={annualReturn} onChange={setAnnualReturn} prefix="%" min={0} max={15} step={0.1} showSlider />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Projected Balance at Retirement" value={formatCurrency(results.projectedBalance)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Contributions" value={formatCurrency(results.totalContributions)} size="small" variant="neutral" />
        <ResultCard label="Total Growth" value={formatCurrency(results.totalGrowth)} size="small" variant="neutral" />
        <ResultCard label="Tax-Free Monthly Income" value={formatCurrency(results.monthlyIncome)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   3. TraditionalIraCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_TRAD_IRA = {
  currentAge: 30,
  retirementAge: 65,
  currentBalance: 10000,
  annualContribution: 7000,
  annualReturn: 7,
  taxRate: 24,
};

export function TraditionalIraCalculator() {
  const [currentAge, setCurrentAge] = useState(DEFAULTS_TRAD_IRA.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS_TRAD_IRA.retirementAge);
  const [currentBalance, setCurrentBalance] = useState(DEFAULTS_TRAD_IRA.currentBalance);
  const [annualContribution, setAnnualContribution] = useState(DEFAULTS_TRAD_IRA.annualContribution);
  const [annualReturn, setAnnualReturn] = useState(DEFAULTS_TRAD_IRA.annualReturn);
  const [taxRate, setTaxRate] = useState(DEFAULTS_TRAD_IRA.taxRate);

  const reset = () => {
    setCurrentAge(DEFAULTS_TRAD_IRA.currentAge);
    setRetirementAge(DEFAULTS_TRAD_IRA.retirementAge);
    setCurrentBalance(DEFAULTS_TRAD_IRA.currentBalance);
    setAnnualContribution(DEFAULTS_TRAD_IRA.annualContribution);
    setAnnualReturn(DEFAULTS_TRAD_IRA.annualReturn);
    setTaxRate(DEFAULTS_TRAD_IRA.taxRate);
  };

  const results = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 0);
    const maxContrib = currentAge >= 50 ? 8000 : 7000;
    const contrib = Math.min(annualContribution, maxContrib);
    const r = annualReturn / 100;
    const projectedBalance = fv(currentBalance, contrib, r, years);
    const totalContributions = contrib * years;
    const totalGrowth = projectedBalance - currentBalance - totalContributions;
    const taxDeductionPerYear = contrib * (taxRate / 100);
    const monthlyIncome = (projectedBalance * 0.04) / 12;
    const taxableWithdrawal = monthlyIncome; // all withdrawals are taxable
    const afterTaxMonthly = monthlyIncome * (1 - taxRate / 100);
    return { projectedBalance, totalContributions, totalGrowth, taxDeductionPerYear, monthlyIncome, taxableWithdrawal, afterTaxMonthly, maxContrib };
  }, [currentAge, retirementAge, currentBalance, annualContribution, annualReturn, taxRate]);

  const inputs = (
    <>
      <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={80} step={1} suffix="years" />
      <NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={currentAge + 1} max={100} step={1} suffix="years" />
      <NumberInput label="Current Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={0} max={10000000} step={500} />
      <NumberInput label="Annual Contribution" value={annualContribution} onChange={setAnnualContribution} prefix="$" min={0} max={8000} step={100} helpText={`Max: ${formatCurrency(results.maxContrib)}/yr`} />
      <NumberInput label="Annual Return" value={annualReturn} onChange={setAnnualReturn} prefix="%" min={0} max={15} step={0.1} showSlider />
      <NumberInput label="Marginal Tax Rate" value={taxRate} onChange={setTaxRate} prefix="%" min={0} max={50} step={1} showSlider />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Projected Balance at Retirement" value={formatCurrency(results.projectedBalance)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Contributions" value={formatCurrency(results.totalContributions)} size="small" variant="neutral" />
        <ResultCard label="Total Growth" value={formatCurrency(results.totalGrowth)} size="small" variant="neutral" />
        <ResultCard label="Tax Deduction / Year" value={formatCurrency(results.taxDeductionPerYear)} size="small" variant="accent" />
        <ResultCard label="Monthly Income (Pre-Tax)" value={formatCurrency(results.monthlyIncome)} size="small" variant="neutral" />
        <ResultCard label="Monthly Income (After-Tax)" value={formatCurrency(results.afterTaxMonthly)} size="small" variant="accent" />
      </div>
      <div className="rounded-lg border p-3">
        <p className="text-sm text-gray-600">All withdrawals from a Traditional IRA are taxed as ordinary income at your marginal rate.</p>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   4. SocialSecurityCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_SS = {
  birthYear: 1965,
  aime: 5000,
  claimingAge: 67,
};

export function SocialSecurityCalculator() {
  const [birthYear, setBirthYear] = useState(DEFAULTS_SS.birthYear);
  const [aime, setAime] = useState(DEFAULTS_SS.aime);
  const [claimingAge, setClaimingAge] = useState(DEFAULTS_SS.claimingAge);

  const reset = () => {
    setBirthYear(DEFAULTS_SS.birthYear);
    setAime(DEFAULTS_SS.aime);
    setClaimingAge(DEFAULTS_SS.claimingAge);
  };

  const results = useMemo(() => {
    // PIA using 2024 bend points
    const bp1 = 1174;
    const bp2 = 7078;
    let pia = 0;
    if (aime <= bp1) {
      pia = aime * 0.9;
    } else if (aime <= bp2) {
      pia = bp1 * 0.9 + (aime - bp1) * 0.32;
    } else {
      pia = bp1 * 0.9 + (bp2 - bp1) * 0.32 + (aime - bp2) * 0.15;
    }

    // Full retirement age (FRA)
    let fra = 67;
    if (birthYear <= 1937) fra = 65;
    else if (birthYear <= 1942) fra = 65 + (birthYear - 1937) * (2 / 12);
    else if (birthYear <= 1954) fra = 66;
    else if (birthYear <= 1959) fra = 66 + (birthYear - 1954) * (2 / 12);

    // Adjustment for claiming age
    let monthlyBenefit = pia;
    const monthsDiff = (claimingAge - fra) * 12;
    if (claimingAge < fra) {
      // Reduction: 5/9 of 1% per month for first 36 months, then 5/12 of 1% per month
      const earlyMonths = Math.abs(monthsDiff);
      const first36 = Math.min(earlyMonths, 36);
      const beyond36 = Math.max(earlyMonths - 36, 0);
      const reductionPct = (first36 * 5 / 9 / 100) + (beyond36 * 5 / 12 / 100);
      monthlyBenefit = pia * (1 - reductionPct);
    } else if (claimingAge > fra) {
      // Delayed retirement credits: 8% per year = 2/3% per month
      const delayMonths = monthsDiff;
      const increasePct = delayMonths * (2 / 3 / 100);
      monthlyBenefit = pia * (1 + increasePct);
    }

    // Lifetime comparison (assume life expectancy 85)
    const lifeExpectancy = 85;
    const calcLifetime = (age: number) => {
      let adj = pia;
      const md = (age - fra) * 12;
      if (age < fra) {
        const em = Math.abs(md);
        const f36 = Math.min(em, 36);
        const b36 = Math.max(em - 36, 0);
        adj = pia * (1 - (f36 * 5 / 9 / 100) - (b36 * 5 / 12 / 100));
      } else if (age > fra) {
        adj = pia * (1 + md * (2 / 3 / 100));
      }
      return adj * 12 * Math.max(lifeExpectancy - age, 0);
    };

    const lifetime62 = calcLifetime(62);
    const lifetime67 = calcLifetime(67);
    const lifetime70 = calcLifetime(70);
    const adjustmentPct = monthsDiff > 0 ? (monthlyBenefit / pia - 1) * 100 : monthsDiff < 0 ? (1 - monthlyBenefit / pia) * -100 : 0;

    return { pia, monthlyBenefit, adjustmentPct, lifetime62, lifetime67, lifetime70, fra };
  }, [birthYear, aime, claimingAge]);

  const inputs = (
    <>
      <NumberInput label="Birth Year" value={birthYear} onChange={setBirthYear} min={1940} max={2000} step={1} />
      <NumberInput label="Average Indexed Monthly Earnings" value={aime} onChange={setAime} prefix="$" min={0} max={20000} step={100} helpText="AIME from SSA statement" />
      <NumberInput label="Claiming Age" value={claimingAge} onChange={setClaimingAge} min={62} max={70} step={1} suffix="years" />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Estimated Monthly Benefit" value={formatCurrency(results.monthlyBenefit)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Primary Insurance Amount (PIA)" value={formatCurrency(results.pia)} size="small" variant="neutral" />
        <ResultCard label={claimingAge < results.fra ? "Early Claiming Reduction" : "Delayed Credit"} value={formatPercent(results.adjustmentPct)} size="small" variant={claimingAge < results.fra ? "danger" : "accent"} />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Lifetime Benefits Comparison (to age 85)</h3>
        <div className="grid grid-cols-3 gap-3">
          <ResultCard label="Claim at 62" value={formatCurrency(results.lifetime62)} size="small" variant="neutral" />
          <ResultCard label="Claim at 67" value={formatCurrency(results.lifetime67)} size="small" variant="neutral" />
          <ResultCard label="Claim at 70" value={formatCurrency(results.lifetime70)} size="small" variant="neutral" />
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   5. RmdCalculator
   ────────────────────────────────────────────────────────────────────────────── */

// IRS Uniform Lifetime Table (age -> divisor), simplified for 73-100
const UNIFORM_LIFETIME_TABLE: Record<number, number> = {
  73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
  80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2,
  87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1,
  94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4,
};

const DEFAULTS_RMD = {
  accountBalance: 500000,
  age: 75,
};

export function RmdCalculator() {
  const [accountBalance, setAccountBalance] = useState(DEFAULTS_RMD.accountBalance);
  const [age, setAge] = useState(DEFAULTS_RMD.age);

  const reset = () => {
    setAccountBalance(DEFAULTS_RMD.accountBalance);
    setAge(DEFAULTS_RMD.age);
  };

  const results = useMemo(() => {
    const divisor = UNIFORM_LIFETIME_TABLE[Math.min(age, 100)] ?? 6.4;
    const rmd = accountBalance / divisor;
    const monthlyEquiv = rmd / 12;

    // 10-year projection
    const projection: { year: number; age: number; balance: number; rmd: number }[] = [];
    let bal = accountBalance;
    for (let i = 0; i < 10; i++) {
      const a = age + i;
      const d = UNIFORM_LIFETIME_TABLE[Math.min(a, 100)] ?? 6.4;
      const r = bal / d;
      projection.push({ year: i + 1, age: a, balance: Math.round(bal), rmd: Math.round(r) });
      bal = (bal - r) * 1.05; // assume 5% growth on remainder
    }

    return { rmd, monthlyEquiv, divisor, projection };
  }, [accountBalance, age]);

  const inputs = (
    <>
      <NumberInput label="Account Balance" value={accountBalance} onChange={setAccountBalance} prefix="$" min={0} max={50000000} step={10000} />
      <NumberInput label="Your Age" value={age} onChange={setAge} min={73} max={100} step={1} suffix="years" helpText="RMDs start at age 73" />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="This Year's RMD" value={formatCurrency(results.rmd)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Equivalent" value={formatCurrency(results.monthlyEquiv)} size="small" variant="accent" />
        <ResultCard label="IRS Divisor" value={results.divisor.toFixed(1)} size="small" variant="neutral" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">10-Year RMD Projection (5% growth assumed)</h3>
        <div className="max-h-48 overflow-y-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">Age</th>
                <th className="px-3 py-1.5 text-right font-medium text-gray-600">Balance</th>
                <th className="px-3 py-1.5 text-right font-medium text-gray-600">RMD</th>
              </tr>
            </thead>
            <tbody>
              {results.projection.map((row) => (
                <tr key={row.year} className="border-t">
                  <td className="px-3 py-1.5 text-gray-700">{row.age}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{formatCurrency(row.balance)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums font-medium">{formatCurrency(row.rmd)}</td>
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

/* ──────────────────────────────────────────────────────────────────────────────
   6. PensionCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_PENSION = {
  yearsOfService: 25,
  finalAvgSalary: 80000,
  benefitMultiplier: 2.0,
  retirementAge: 62,
  colaRate: 2.0,
};

export function PensionCalculator() {
  const [yearsOfService, setYearsOfService] = useState(DEFAULTS_PENSION.yearsOfService);
  const [finalAvgSalary, setFinalAvgSalary] = useState(DEFAULTS_PENSION.finalAvgSalary);
  const [benefitMultiplier, setBenefitMultiplier] = useState(DEFAULTS_PENSION.benefitMultiplier);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS_PENSION.retirementAge);
  const [colaRate, setColaRate] = useState(DEFAULTS_PENSION.colaRate);

  const reset = () => {
    setYearsOfService(DEFAULTS_PENSION.yearsOfService);
    setFinalAvgSalary(DEFAULTS_PENSION.finalAvgSalary);
    setBenefitMultiplier(DEFAULTS_PENSION.benefitMultiplier);
    setRetirementAge(DEFAULTS_PENSION.retirementAge);
    setColaRate(DEFAULTS_PENSION.colaRate);
  };

  const results = useMemo(() => {
    const annualPension = yearsOfService * finalAvgSalary * (benefitMultiplier / 100);
    const monthlyPension = annualPension / 12;
    const lifeExpectancy = 85;
    const yearsInRetirement = Math.max(lifeExpectancy - retirementAge, 0);
    const totalLifetimePension = annualPension * yearsInRetirement;
    const cola10 = annualPension * Math.pow(1 + colaRate / 100, 10);
    const cola20 = annualPension * Math.pow(1 + colaRate / 100, 20);
    return { annualPension, monthlyPension, totalLifetimePension, cola10, cola20, yearsInRetirement };
  }, [yearsOfService, finalAvgSalary, benefitMultiplier, retirementAge, colaRate]);

  const inputs = (
    <>
      <NumberInput label="Years of Service" value={yearsOfService} onChange={setYearsOfService} min={1} max={50} step={1} suffix="years" />
      <NumberInput label="Final Average Salary" value={finalAvgSalary} onChange={setFinalAvgSalary} prefix="$" min={0} max={500000} step={1000} />
      <NumberInput label="Benefit Multiplier" value={benefitMultiplier} onChange={setBenefitMultiplier} prefix="%" min={0.5} max={3.0} step={0.1} showSlider helpText="Typically 1.0% - 2.5%" />
      <NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={50} max={75} step={1} suffix="years" />
      <NumberInput label="COLA Rate" value={colaRate} onChange={setColaRate} prefix="%" min={0} max={5} step={0.1} showSlider helpText="Annual cost-of-living adjustment" />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Annual Pension" value={formatCurrency(results.annualPension)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Pension" value={formatCurrency(results.monthlyPension)} size="small" variant="accent" />
        <ResultCard label={`Lifetime Pension (${results.yearsInRetirement} yrs)`} value={formatCurrency(results.totalLifetimePension)} size="small" variant="neutral" />
        <ResultCard label="COLA-Adjusted (10 yrs)" value={formatCurrency(results.cola10)} size="small" variant="neutral" />
        <ResultCard label="COLA-Adjusted (20 yrs)" value={formatCurrency(results.cola20)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   7. EarlyRetirementCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_EARLY = {
  currentAge: 30,
  retirementAge: 45,
  currentSavings: 100000,
  annualExpenses: 50000,
  annualSavings: 40000,
  returnRate: 7,
  withdrawalRate: 3.5,
};

export function EarlyRetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(DEFAULTS_EARLY.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS_EARLY.retirementAge);
  const [currentSavings, setCurrentSavings] = useState(DEFAULTS_EARLY.currentSavings);
  const [annualExpenses, setAnnualExpenses] = useState(DEFAULTS_EARLY.annualExpenses);
  const [annualSavings, setAnnualSavings] = useState(DEFAULTS_EARLY.annualSavings);
  const [returnRate, setReturnRate] = useState(DEFAULTS_EARLY.returnRate);
  const [withdrawalRate, setWithdrawalRate] = useState(DEFAULTS_EARLY.withdrawalRate);

  const reset = () => {
    setCurrentAge(DEFAULTS_EARLY.currentAge);
    setRetirementAge(DEFAULTS_EARLY.retirementAge);
    setCurrentSavings(DEFAULTS_EARLY.currentSavings);
    setAnnualExpenses(DEFAULTS_EARLY.annualExpenses);
    setAnnualSavings(DEFAULTS_EARLY.annualSavings);
    setReturnRate(DEFAULTS_EARLY.returnRate);
    setWithdrawalRate(DEFAULTS_EARLY.withdrawalRate);
  };

  const results = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 0);
    const r = returnRate / 100;
    const savingsAtRetirement = fv(currentSavings, annualSavings, r, years);
    const sustainableIncome = savingsAtRetirement * (withdrawalRate / 100);
    const fireTarget = annualExpenses * 25;
    const fireMet = savingsAtRetirement >= fireTarget;
    const additionalNeeded = fireMet ? 0 : fireTarget - savingsAtRetirement;
    return { savingsAtRetirement, yearsOfExpensesCovered: savingsAtRetirement / annualExpenses, fireMet, fireTarget, additionalNeeded, sustainableIncome };
  }, [currentAge, retirementAge, currentSavings, annualExpenses, annualSavings, returnRate, withdrawalRate]);

  const inputs = (
    <>
      <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={60} step={1} suffix="years" />
      <NumberInput label="Desired Retirement Age" value={retirementAge} onChange={setRetirementAge} min={currentAge + 1} max={65} step={1} suffix="years" />
      <NumberInput label="Current Savings" value={currentSavings} onChange={setCurrentSavings} prefix="$" min={0} max={10000000} step={5000} />
      <NumberInput label="Annual Expenses" value={annualExpenses} onChange={setAnnualExpenses} prefix="$" min={1000} max={500000} step={1000} />
      <NumberInput label="Annual Savings" value={annualSavings} onChange={setAnnualSavings} prefix="$" min={0} max={500000} step={1000} />
      <NumberInput label="Annual Return" value={returnRate} onChange={setReturnRate} prefix="%" min={0} max={15} step={0.1} showSlider />
      <NumberInput label="Withdrawal Rate" value={withdrawalRate} onChange={setWithdrawalRate} prefix="%" min={1} max={6} step={0.1} showSlider helpText="3.5% recommended for early retirement" />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Savings at Retirement" value={formatCurrency(results.savingsAtRetirement)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Years of Expenses Covered" value={formatYears(results.yearsOfExpensesCovered)} size="small" variant="neutral" />
        <ResultCard label="FIRE Target (25x Expenses)" value={formatCurrency(results.fireTarget)} size="small" variant="neutral" />
        <ResultCard label="Sustainable Annual Income" value={formatCurrency(results.sustainableIncome)} size="small" variant="accent" />
        {!results.fireMet && <ResultCard label="Additional Savings Needed" value={formatCurrency(results.additionalNeeded)} size="small" variant="danger" />}
      </div>
      <div className="flex items-center gap-2 rounded-lg border p-3">
        {results.fireMet ? (
          <span className="text-sm font-medium text-green-700">FIRE target met! You can retire early.</span>
        ) : (
          <span className="text-sm font-medium text-red-700">FIRE target not yet met. Keep saving!</span>
        )}
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   8. RetirementIncomeCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_INCOME = {
  retirementSavings: 800000,
  socialSecurityMonthly: 2000,
  pensionMonthly: 1000,
  otherIncomeMonthly: 500,
  annualExpenses: 60000,
  inflationRate: 3,
};

export function RetirementIncomeCalculator() {
  const [retirementSavings, setRetirementSavings] = useState(DEFAULTS_INCOME.retirementSavings);
  const [socialSecurityMonthly, setSocialSecurityMonthly] = useState(DEFAULTS_INCOME.socialSecurityMonthly);
  const [pensionMonthly, setPensionMonthly] = useState(DEFAULTS_INCOME.pensionMonthly);
  const [otherIncomeMonthly, setOtherIncomeMonthly] = useState(DEFAULTS_INCOME.otherIncomeMonthly);
  const [annualExpenses, setAnnualExpenses] = useState(DEFAULTS_INCOME.annualExpenses);
  const [inflationRate, setInflationRate] = useState(DEFAULTS_INCOME.inflationRate);

  const reset = () => {
    setRetirementSavings(DEFAULTS_INCOME.retirementSavings);
    setSocialSecurityMonthly(DEFAULTS_INCOME.socialSecurityMonthly);
    setPensionMonthly(DEFAULTS_INCOME.pensionMonthly);
    setOtherIncomeMonthly(DEFAULTS_INCOME.otherIncomeMonthly);
    setAnnualExpenses(DEFAULTS_INCOME.annualExpenses);
    setInflationRate(DEFAULTS_INCOME.inflationRate);
  };

  const results = useMemo(() => {
    const savingsMonthly = (retirementSavings * 0.04) / 12;
    const totalMonthly = savingsMonthly + socialSecurityMonthly + pensionMonthly + otherIncomeMonthly;
    const monthlyExpenses = annualExpenses / 12;
    const gap = totalMonthly - monthlyExpenses;

    // How many years will savings last?
    // Withdrawals = annualExpenses - (ss + pension + other)*12 annually from savings
    const annualFixedIncome = (socialSecurityMonthly + pensionMonthly + otherIncomeMonthly) * 12;
    const annualFromSavings = Math.max(annualExpenses - annualFixedIncome, 0);
    let yearsLast = 0;
    if (annualFromSavings === 0) {
      yearsLast = 999; // savings not needed
    } else {
      // Simulate with inflation and modest growth
      let bal = retirementSavings;
      const growthRate = 0.04; // conservative during retirement
      let withdrawal = annualFromSavings;
      while (bal > 0 && yearsLast < 100) {
        bal = bal * (1 + growthRate) - withdrawal;
        withdrawal *= (1 + inflationRate / 100);
        yearsLast++;
      }
    }

    const savingsPct = totalMonthly > 0 ? (savingsMonthly / totalMonthly) * 100 : 0;
    const ssPct = totalMonthly > 0 ? (socialSecurityMonthly / totalMonthly) * 100 : 0;
    const pensionPct = totalMonthly > 0 ? (pensionMonthly / totalMonthly) * 100 : 0;
    const otherPct = totalMonthly > 0 ? (otherIncomeMonthly / totalMonthly) * 100 : 0;

    return { totalMonthly, monthlyExpenses, gap, yearsLast, savingsPct, ssPct, pensionPct, otherPct };
  }, [retirementSavings, socialSecurityMonthly, pensionMonthly, otherIncomeMonthly, annualExpenses, inflationRate]);

  const inputs = (
    <>
      <NumberInput label="Retirement Savings" value={retirementSavings} onChange={setRetirementSavings} prefix="$" min={0} max={20000000} step={10000} />
      <NumberInput label="Social Security (Monthly)" value={socialSecurityMonthly} onChange={setSocialSecurityMonthly} prefix="$" min={0} max={10000} step={100} />
      <NumberInput label="Pension (Monthly)" value={pensionMonthly} onChange={setPensionMonthly} prefix="$" min={0} max={20000} step={100} />
      <NumberInput label="Other Income (Monthly)" value={otherIncomeMonthly} onChange={setOtherIncomeMonthly} prefix="$" min={0} max={20000} step={100} />
      <NumberInput label="Annual Expenses" value={annualExpenses} onChange={setAnnualExpenses} prefix="$" min={0} max={500000} step={1000} />
      <NumberInput label="Inflation Rate" value={inflationRate} onChange={setInflationRate} prefix="%" min={0} max={8} step={0.1} showSlider />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Monthly Income" value={formatCurrency(results.totalMonthly)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Expenses" value={formatCurrency(results.monthlyExpenses)} size="small" variant="neutral" />
        <ResultCard label="Monthly Surplus / Gap" value={formatCurrency(results.gap)} size="small" variant={results.gap >= 0 ? "accent" : "danger"} />
        <ResultCard label="Years Savings Will Last" value={results.yearsLast >= 100 ? "100+ years" : formatYears(results.yearsLast)} size="small" variant="neutral" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Income Breakdown</h3>
        <div className="space-y-1.5">
          {[
            { label: "Savings (4% rule)", pct: results.savingsPct },
            { label: "Social Security", pct: results.ssPct },
            { label: "Pension", pct: results.pensionPct },
            { label: "Other Income", pct: results.otherPct },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <div className="w-28 text-gray-600">{item.label}</div>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
              <div className="w-12 text-right tabular-nums text-gray-700">{item.pct.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   9. CatchUpContributionCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_CATCHUP = {
  currentAge: 52,
  current401kBalance: 200000,
  annualSalary: 100000,
  contributionPct: 10,
  returnRate: 7,
  retirementAge: 65,
};

export function CatchUpContributionCalculator() {
  const [currentAge, setCurrentAge] = useState(DEFAULTS_CATCHUP.currentAge);
  const [current401kBalance, setCurrent401kBalance] = useState(DEFAULTS_CATCHUP.current401kBalance);
  const [annualSalary, setAnnualSalary] = useState(DEFAULTS_CATCHUP.annualSalary);
  const [contributionPct, setContributionPct] = useState(DEFAULTS_CATCHUP.contributionPct);
  const [returnRate, setReturnRate] = useState(DEFAULTS_CATCHUP.returnRate);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS_CATCHUP.retirementAge);

  const reset = () => {
    setCurrentAge(DEFAULTS_CATCHUP.currentAge);
    setCurrent401kBalance(DEFAULTS_CATCHUP.current401kBalance);
    setAnnualSalary(DEFAULTS_CATCHUP.annualSalary);
    setContributionPct(DEFAULTS_CATCHUP.contributionPct);
    setReturnRate(DEFAULTS_CATCHUP.returnRate);
    setRetirementAge(DEFAULTS_CATCHUP.retirementAge);
  };

  const results = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 0);
    const r = returnRate / 100;
    const baseContrib = Math.min(annualSalary * (contributionPct / 100), 23000);

    // Without catch-up
    const balanceWithout = fv(current401kBalance, baseContrib, r, years);

    // With catch-up (401k: $7,500 extra if 50+, IRA: $1,000 extra if 50+)
    const catchUp401k = currentAge >= 50 ? 7500 : 0;
    const catchUpIRA = currentAge >= 50 ? 1000 : 0;
    const totalCatchUp = catchUp401k + catchUpIRA;
    const balanceWith = fv(current401kBalance, baseContrib + totalCatchUp, r, years);

    const additionalSavings = balanceWith - balanceWithout;

    return { balanceWithout, balanceWith, additionalSavings, catchUp401k, catchUpIRA, totalCatchUp };
  }, [currentAge, current401kBalance, annualSalary, contributionPct, returnRate, retirementAge]);

  const inputs = (
    <>
      <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={80} step={1} suffix="years" />
      <NumberInput label="Current 401(k) Balance" value={current401kBalance} onChange={setCurrent401kBalance} prefix="$" min={0} max={10000000} step={5000} />
      <NumberInput label="Annual Salary" value={annualSalary} onChange={setAnnualSalary} prefix="$" min={0} max={1000000} step={1000} />
      <NumberInput label="Current Contribution %" value={contributionPct} onChange={setContributionPct} prefix="%" min={0} max={100} step={0.5} />
      <NumberInput label="Annual Return" value={returnRate} onChange={setReturnRate} prefix="%" min={0} max={15} step={0.1} showSlider />
      <NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={currentAge + 1} max={100} step={1} suffix="years" />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Balance WITH Catch-Up" value={formatCurrency(results.balanceWith)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Balance WITHOUT Catch-Up" value={formatCurrency(results.balanceWithout)} size="small" variant="neutral" />
        <ResultCard label="Additional from Catch-Up" value={formatCurrency(results.additionalSavings)} size="small" variant="accent" />
      </div>
      <div className="rounded-lg border p-3 space-y-1">
        <h3 className="text-sm font-medium text-gray-700">Catch-Up Limits (Age 50+)</h3>
        <p className="text-sm text-gray-600">401(k) extra: {formatCurrency(results.catchUp401k)}/yr</p>
        <p className="text-sm text-gray-600">IRA extra: {formatCurrency(results.catchUpIRA)}/yr</p>
        <p className="text-sm font-medium text-gray-700">Total extra: {formatCurrency(results.totalCatchUp)}/yr</p>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   10. AnnuityCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_ANNUITY = {
  lumpSum: 500000,
  annualReturn: 5,
  payoutPeriod: 25,
  desiredMonthlyPayout: 2500,
};

export function AnnuityCalculator() {
  const [lumpSum, setLumpSum] = useState(DEFAULTS_ANNUITY.lumpSum);
  const [annualReturn, setAnnualReturn] = useState(DEFAULTS_ANNUITY.annualReturn);
  const [payoutPeriod, setPayoutPeriod] = useState(DEFAULTS_ANNUITY.payoutPeriod);
  const [desiredMonthlyPayout, setDesiredMonthlyPayout] = useState(DEFAULTS_ANNUITY.desiredMonthlyPayout);

  const reset = () => {
    setLumpSum(DEFAULTS_ANNUITY.lumpSum);
    setAnnualReturn(DEFAULTS_ANNUITY.annualReturn);
    setPayoutPeriod(DEFAULTS_ANNUITY.payoutPeriod);
    setDesiredMonthlyPayout(DEFAULTS_ANNUITY.desiredMonthlyPayout);
  };

  const results = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = payoutPeriod * 12;

    // Monthly payout from lump sum
    const monthlyFromLump = pmt(lumpSum, monthlyRate, totalMonths);
    const totalPayoutsFromLump = monthlyFromLump * totalMonths;
    const totalReturnFromLump = totalPayoutsFromLump - lumpSum;

    // Lump sum needed for desired payout
    const lumpNeeded = pvAnnuity(desiredMonthlyPayout, monthlyRate, totalMonths);
    const totalPayoutsDesired = desiredMonthlyPayout * totalMonths;
    const totalReturnDesired = totalPayoutsDesired - lumpNeeded;

    return { monthlyFromLump, totalPayoutsFromLump, totalReturnFromLump, lumpNeeded, totalPayoutsDesired, totalReturnDesired };
  }, [lumpSum, annualReturn, payoutPeriod, desiredMonthlyPayout]);

  const inputs = (
    <>
      <NumberInput label="Lump Sum Investment" value={lumpSum} onChange={setLumpSum} prefix="$" min={0} max={20000000} step={10000} />
      <NumberInput label="Annual Return" value={annualReturn} onChange={setAnnualReturn} prefix="%" min={0} max={12} step={0.1} showSlider />
      <NumberInput label="Payout Period" value={payoutPeriod} onChange={setPayoutPeriod} min={1} max={50} step={1} suffix="years" />
      <NumberInput label="Desired Monthly Payout" value={desiredMonthlyPayout} onChange={setDesiredMonthlyPayout} prefix="$" min={0} max={50000} step={100} helpText="For reverse calculation" />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">From Your Lump Sum</h3>
        <ResultCard label="Monthly Payout" value={formatCurrency(results.monthlyFromLump)} size="large" />
        <div className="grid grid-cols-2 gap-4">
          <ResultCard label="Total Payouts" value={formatCurrency(results.totalPayoutsFromLump)} size="small" variant="neutral" />
          <ResultCard label="Total Return" value={formatCurrency(results.totalReturnFromLump)} size="small" variant="accent" />
        </div>
      </div>
      <hr className="border-gray-200" />
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">For Desired Monthly Payout</h3>
        <ResultCard label="Lump Sum Needed" value={formatCurrency(results.lumpNeeded)} size="large" />
        <div className="grid grid-cols-2 gap-4">
          <ResultCard label="Total Payouts" value={formatCurrency(results.totalPayoutsDesired)} size="small" variant="neutral" />
          <ResultCard label="Total Return" value={formatCurrency(results.totalReturnDesired)} size="small" variant="accent" />
        </div>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   11. FourOhThreeBCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_403B = {
  currentAge: 30,
  retirementAge: 65,
  salary: 65000,
  contributionPct: 10,
  employerMatchPct: 50,
  matchLimitPct: 5,
  currentBalance: 15000,
  annualReturn: 7,
};

export function FourOhThreeBCalculator() {
  const [currentAge, setCurrentAge] = useState(DEFAULTS_403B.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS_403B.retirementAge);
  const [salary, setSalary] = useState(DEFAULTS_403B.salary);
  const [contributionPct, setContributionPct] = useState(DEFAULTS_403B.contributionPct);
  const [employerMatchPct, setEmployerMatchPct] = useState(DEFAULTS_403B.employerMatchPct);
  const [matchLimitPct, setMatchLimitPct] = useState(DEFAULTS_403B.matchLimitPct);
  const [currentBalance, setCurrentBalance] = useState(DEFAULTS_403B.currentBalance);
  const [annualReturn, setAnnualReturn] = useState(DEFAULTS_403B.annualReturn);

  const reset = () => {
    setCurrentAge(DEFAULTS_403B.currentAge);
    setRetirementAge(DEFAULTS_403B.retirementAge);
    setSalary(DEFAULTS_403B.salary);
    setContributionPct(DEFAULTS_403B.contributionPct);
    setEmployerMatchPct(DEFAULTS_403B.employerMatchPct);
    setMatchLimitPct(DEFAULTS_403B.matchLimitPct);
    setCurrentBalance(DEFAULTS_403B.currentBalance);
    setAnnualReturn(DEFAULTS_403B.annualReturn);
  };

  const results = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 0);
    const maxContrib = currentAge >= 50 ? 30500 : 23000;
    const rawContrib = salary * (contributionPct / 100);
    const annualContrib = Math.min(rawContrib, maxContrib);
    const matchableContrib = Math.min(salary * (matchLimitPct / 100), rawContrib);
    const employerAnnual = matchableContrib * (employerMatchPct / 100);
    const totalAnnualContrib = annualContrib + employerAnnual;
    const r = annualReturn / 100;
    const projectedBalance = fv(currentBalance, totalAnnualContrib, r, years);
    const totalContributions = annualContrib * years;
    const totalEmployer = employerAnnual * years;
    const totalGrowth = projectedBalance - currentBalance - totalContributions - totalEmployer;
    const monthlyIncome = (projectedBalance * 0.04) / 12;
    return { projectedBalance, totalContributions, totalEmployer, totalGrowth, monthlyIncome, maxContrib };
  }, [currentAge, retirementAge, salary, contributionPct, employerMatchPct, matchLimitPct, currentBalance, annualReturn]);

  const inputs = (
    <>
      <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={80} step={1} suffix="years" />
      <NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={currentAge + 1} max={100} step={1} suffix="years" />
      <NumberInput label="Annual Salary" value={salary} onChange={setSalary} prefix="$" min={0} max={1000000} step={1000} />
      <NumberInput label="Your Contribution %" value={contributionPct} onChange={setContributionPct} prefix="%" min={0} max={100} step={0.5} helpText={`Annual max: ${formatCurrency(results.maxContrib)}`} />
      <NumberInput label="Employer Match %" value={employerMatchPct} onChange={setEmployerMatchPct} prefix="%" min={0} max={100} step={1} />
      <NumberInput label="Match Limit (% of salary)" value={matchLimitPct} onChange={setMatchLimitPct} prefix="%" min={0} max={100} step={0.5} />
      <NumberInput label="Current Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={0} max={10000000} step={1000} />
      <NumberInput label="Annual Return" value={annualReturn} onChange={setAnnualReturn} prefix="%" min={0} max={15} step={0.1} showSlider />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Projected Balance at Retirement" value={formatCurrency(results.projectedBalance)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Contributions" value={formatCurrency(results.totalContributions)} size="small" variant="neutral" />
        <ResultCard label="Employer Contributions" value={formatCurrency(results.totalEmployer)} size="small" variant="accent" />
        <ResultCard label="Investment Growth" value={formatCurrency(results.totalGrowth)} size="small" variant="neutral" />
        <ResultCard label="Monthly Income (4% Rule)" value={formatCurrency(results.monthlyIncome)} size="small" variant="accent" />
      </div>
      <div className="rounded-lg border p-3">
        <p className="text-sm text-gray-600">403(b) plans are available for non-profit and education employees. Same contribution limits as 401(k).</p>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   12. SepIraCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_SEP = {
  netSelfEmploymentIncome: 120000,
  contributionRate: 25,
  currentBalance: 50000,
  returnRate: 7,
  yearsToRetirement: 20,
};

export function SepIraCalculator() {
  const [netIncome, setNetIncome] = useState(DEFAULTS_SEP.netSelfEmploymentIncome);
  const [contributionRate, setContributionRate] = useState(DEFAULTS_SEP.contributionRate);
  const [currentBalance, setCurrentBalance] = useState(DEFAULTS_SEP.currentBalance);
  const [returnRate, setReturnRate] = useState(DEFAULTS_SEP.returnRate);
  const [yearsToRetirement, setYearsToRetirement] = useState(DEFAULTS_SEP.yearsToRetirement);

  const reset = () => {
    setNetIncome(DEFAULTS_SEP.netSelfEmploymentIncome);
    setContributionRate(DEFAULTS_SEP.contributionRate);
    setCurrentBalance(DEFAULTS_SEP.currentBalance);
    setReturnRate(DEFAULTS_SEP.returnRate);
    setYearsToRetirement(DEFAULTS_SEP.yearsToRetirement);
  };

  const results = useMemo(() => {
    const maxAnnualContrib = 69000;
    const rawContrib = netIncome * (contributionRate / 100);
    const annualContrib = Math.min(rawContrib, maxAnnualContrib);
    const r = returnRate / 100;
    const projectedBalance = fv(currentBalance, annualContrib, r, yearsToRetirement);
    const totalContributions = annualContrib * yearsToRetirement;
    const totalGrowth = projectedBalance - currentBalance - totalContributions;
    return { annualContrib, maxAnnualContrib, projectedBalance, totalContributions, totalGrowth };
  }, [netIncome, contributionRate, currentBalance, returnRate, yearsToRetirement]);

  const inputs = (
    <>
      <NumberInput label="Net Self-Employment Income" value={netIncome} onChange={setNetIncome} prefix="$" min={0} max={2000000} step={1000} />
      <NumberInput label="Contribution Rate" value={contributionRate} onChange={setContributionRate} prefix="%" min={0} max={25} step={0.5} showSlider helpText="Max 25% of net SE income" />
      <NumberInput label="Current SEP IRA Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={0} max={10000000} step={5000} />
      <NumberInput label="Annual Return" value={returnRate} onChange={setReturnRate} prefix="%" min={0} max={15} step={0.1} showSlider />
      <NumberInput label="Years to Retirement" value={yearsToRetirement} onChange={setYearsToRetirement} min={1} max={50} step={1} suffix="years" />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Max Annual Contribution" value={formatCurrency(results.annualContrib)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Limit" value={formatCurrency(results.maxAnnualContrib)} size="small" variant="neutral" />
        <ResultCard label="Projected Balance" value={formatCurrency(results.projectedBalance)} size="small" variant="accent" />
        <ResultCard label="Total Contributions" value={formatCurrency(results.totalContributions)} size="small" variant="neutral" />
        <ResultCard label="Total Growth" value={formatCurrency(results.totalGrowth)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   13. SimpleIraCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_SIMPLE = {
  salary: 60000,
  employeeContribution: 6000,
  employerMatchPct: 3,
  currentBalance: 20000,
  returnRate: 7,
  yearsToRetirement: 25,
};

export function SimpleIraCalculator() {
  const [salary, setSalary] = useState(DEFAULTS_SIMPLE.salary);
  const [employeeContribution, setEmployeeContribution] = useState(DEFAULTS_SIMPLE.employeeContribution);
  const [employerMatchPct, setEmployerMatchPct] = useState(DEFAULTS_SIMPLE.employerMatchPct);
  const [currentBalance, setCurrentBalance] = useState(DEFAULTS_SIMPLE.currentBalance);
  const [returnRate, setReturnRate] = useState(DEFAULTS_SIMPLE.returnRate);
  const [yearsToRetirement, setYearsToRetirement] = useState(DEFAULTS_SIMPLE.yearsToRetirement);

  const reset = () => {
    setSalary(DEFAULTS_SIMPLE.salary);
    setEmployeeContribution(DEFAULTS_SIMPLE.employeeContribution);
    setEmployerMatchPct(DEFAULTS_SIMPLE.employerMatchPct);
    setCurrentBalance(DEFAULTS_SIMPLE.currentBalance);
    setReturnRate(DEFAULTS_SIMPLE.returnRate);
    setYearsToRetirement(DEFAULTS_SIMPLE.yearsToRetirement);
  };

  const results = useMemo(() => {
    const maxEmployeeContrib = 16000;
    const empContrib = Math.min(employeeContribution, maxEmployeeContrib);
    const employerMatch = salary * (employerMatchPct / 100);
    const totalAnnual = empContrib + employerMatch;
    const r = returnRate / 100;
    const projectedBalance = fv(currentBalance, totalAnnual, r, yearsToRetirement);
    const totalContributions = empContrib * yearsToRetirement;
    const totalEmployerMatch = employerMatch * yearsToRetirement;
    const totalGrowth = projectedBalance - currentBalance - totalContributions - totalEmployerMatch;
    return { empContrib, employerMatch, totalAnnual, projectedBalance, totalContributions, totalEmployerMatch, totalGrowth };
  }, [salary, employeeContribution, employerMatchPct, currentBalance, returnRate, yearsToRetirement]);

  const inputs = (
    <>
      <NumberInput label="Annual Salary" value={salary} onChange={setSalary} prefix="$" min={0} max={500000} step={1000} />
      <NumberInput label="Employee Contribution" value={employeeContribution} onChange={setEmployeeContribution} prefix="$" min={0} max={16000} step={500} helpText="Max $16,000/yr" />
      <NumberInput label="Employer Match %" value={employerMatchPct} onChange={setEmployerMatchPct} prefix="%" min={0} max={10} step={0.5} showSlider helpText="Typically 3% of salary" />
      <NumberInput label="Current Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={0} max={5000000} step={1000} />
      <NumberInput label="Annual Return" value={returnRate} onChange={setReturnRate} prefix="%" min={0} max={15} step={0.1} showSlider />
      <NumberInput label="Years to Retirement" value={yearsToRetirement} onChange={setYearsToRetirement} min={1} max={50} step={1} suffix="years" />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Projected Balance at Retirement" value={formatCurrency(results.projectedBalance)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Annual Contributions (You)" value={formatCurrency(results.empContrib)} size="small" variant="neutral" />
        <ResultCard label="Annual Employer Match" value={formatCurrency(results.employerMatch)} size="small" variant="accent" />
        <ResultCard label="Total Your Contributions" value={formatCurrency(results.totalContributions)} size="small" variant="neutral" />
        <ResultCard label="Total Employer Match" value={formatCurrency(results.totalEmployerMatch)} size="small" variant="accent" />
        <ResultCard label="Total Growth" value={formatCurrency(results.totalGrowth)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ──────────────────────────────────────────────────────────────────────────────
   14. RetirementWithdrawalCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_WITHDRAWAL = {
  retirementSavings: 1000000,
  annualWithdrawal: 40000,
  returnRate: 5,
  inflationRate: 3,
};

export function RetirementWithdrawalCalculator() {
  const [retirementSavings, setRetirementSavings] = useState(DEFAULTS_WITHDRAWAL.retirementSavings);
  const [annualWithdrawal, setAnnualWithdrawal] = useState(DEFAULTS_WITHDRAWAL.annualWithdrawal);
  const [returnRate, setReturnRate] = useState(DEFAULTS_WITHDRAWAL.returnRate);
  const [inflationRate, setInflationRate] = useState(DEFAULTS_WITHDRAWAL.inflationRate);

  const reset = () => {
    setRetirementSavings(DEFAULTS_WITHDRAWAL.retirementSavings);
    setAnnualWithdrawal(DEFAULTS_WITHDRAWAL.annualWithdrawal);
    setReturnRate(DEFAULTS_WITHDRAWAL.returnRate);
    setInflationRate(DEFAULTS_WITHDRAWAL.inflationRate);
  };

  const results = useMemo(() => {
    const r = returnRate / 100;
    const inf = inflationRate / 100;

    // Simulate year by year
    const yearData: { year: number; balance: number; withdrawal: number }[] = [];
    let balance = retirementSavings;
    let withdrawal = annualWithdrawal;
    let yearsLast = 0;

    for (let y = 1; y <= 50 && balance > 0; y++) {
      const w = Math.min(withdrawal, balance);
      balance = (balance - w) * (1 + r);
      withdrawal *= (1 + inf);
      yearData.push({ year: y, balance: Math.max(Math.round(balance), 0), withdrawal: Math.round(w) });
      if (balance > 0) yearsLast = y;
      else { yearsLast = y; break; }
    }

    // Sustainable withdrawal rate (where savings last 30 years)
    // Binary search
    let lo = 0, hi = 20;
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      let b = retirementSavings;
      let w = retirementSavings * (mid / 100);
      let lasted = true;
      for (let y = 0; y < 30; y++) {
        b = (b - w) * (1 + r);
        w *= (1 + inf);
        if (b <= 0) { lasted = false; break; }
      }
      if (lasted) lo = mid; else hi = mid;
    }
    const sustainableRate = lo;

    return { yearsLast, yearData, sustainableRate, withdrawalRate: (annualWithdrawal / retirementSavings) * 100 };
  }, [retirementSavings, annualWithdrawal, returnRate, inflationRate]);

  const inputs = (
    <>
      <NumberInput label="Retirement Savings" value={retirementSavings} onChange={setRetirementSavings} prefix="$" min={0} max={20000000} step={10000} />
      <NumberInput label="Annual Withdrawal" value={annualWithdrawal} onChange={setAnnualWithdrawal} prefix="$" min={0} max={500000} step={1000} />
      <NumberInput label="Return During Retirement" value={returnRate} onChange={setReturnRate} prefix="%" min={0} max={12} step={0.1} showSlider />
      <NumberInput label="Inflation Rate" value={inflationRate} onChange={setInflationRate} prefix="%" min={0} max={8} step={0.1} showSlider />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Years Savings Will Last" value={results.yearsLast >= 50 ? "50+ years" : formatYears(results.yearsLast)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Your Withdrawal Rate" value={formatPercent(results.withdrawalRate)} size="small" variant={results.withdrawalRate <= 4 ? "accent" : "danger"} />
        <ResultCard label="Sustainable Rate (30 yrs)" value={formatPercent(results.sustainableRate)} size="small" variant="accent" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Balance by Year</h3>
        <div className="max-h-48 overflow-y-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">Year</th>
                <th className="px-3 py-1.5 text-right font-medium text-gray-600">Withdrawal</th>
                <th className="px-3 py-1.5 text-right font-medium text-gray-600">End Balance</th>
              </tr>
            </thead>
            <tbody>
              {results.yearData.map((row) => (
                <tr key={row.year} className="border-t">
                  <td className="px-3 py-1.5 text-gray-700">{row.year}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{formatCurrency(row.withdrawal)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums font-medium">{formatCurrency(row.balance)}</td>
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

/* ──────────────────────────────────────────────────────────────────────────────
   15. NestEggCalculator
   ────────────────────────────────────────────────────────────────────────────── */

const DEFAULTS_NESTEGG = {
  desiredAnnualIncome: 60000,
  yearsInRetirement: 30,
  returnDuringRetirement: 5,
  inflationRate: 3,
  yearsToRetirement: 25,
};

export function NestEggCalculator() {
  const [desiredIncome, setDesiredIncome] = useState(DEFAULTS_NESTEGG.desiredAnnualIncome);
  const [yearsInRetirement, setYearsInRetirement] = useState(DEFAULTS_NESTEGG.yearsInRetirement);
  const [returnRate, setReturnRate] = useState(DEFAULTS_NESTEGG.returnDuringRetirement);
  const [inflationRate, setInflationRate] = useState(DEFAULTS_NESTEGG.inflationRate);
  const [yearsToRetirement, setYearsToRetirement] = useState(DEFAULTS_NESTEGG.yearsToRetirement);

  const reset = () => {
    setDesiredIncome(DEFAULTS_NESTEGG.desiredAnnualIncome);
    setYearsInRetirement(DEFAULTS_NESTEGG.yearsInRetirement);
    setReturnRate(DEFAULTS_NESTEGG.returnDuringRetirement);
    setInflationRate(DEFAULTS_NESTEGG.inflationRate);
    setYearsToRetirement(DEFAULTS_NESTEGG.yearsToRetirement);
  };

  const results = useMemo(() => {
    const r = returnRate / 100;
    const inf = inflationRate / 100;

    // Inflation-adjusted income at retirement
    const incomeAtRetirement = desiredIncome * Math.pow(1 + inf, yearsToRetirement);

    // Nest egg needed: PV of inflation-adjusted annuity during retirement
    // Each year withdrawal grows by inflation; real rate = (1+r)/(1+inf) - 1
    const realRate = (1 + r) / (1 + inf) - 1;
    const nestEggNeeded = realRate === 0
      ? incomeAtRetirement * yearsInRetirement
      : incomeAtRetirement * ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate);

    // In today's dollars
    const nestEggToday = nestEggNeeded / Math.pow(1 + inf, yearsToRetirement);

    // Monthly savings needed to reach nest egg (assuming 7% pre-retirement return)
    const preReturnMonthly = 0.07 / 12;
    const totalSavingMonths = yearsToRetirement * 12;
    let monthlySavings = 0;
    if (totalSavingMonths > 0) {
      if (preReturnMonthly === 0) {
        monthlySavings = nestEggNeeded / totalSavingMonths;
      } else {
        monthlySavings = nestEggNeeded * preReturnMonthly / (Math.pow(1 + preReturnMonthly, totalSavingMonths) - 1);
      }
    }

    return { nestEggNeeded, nestEggToday, monthlySavings, incomeAtRetirement };
  }, [desiredIncome, yearsInRetirement, returnRate, inflationRate, yearsToRetirement]);

  const inputs = (
    <>
      <NumberInput label="Desired Annual Income" value={desiredIncome} onChange={setDesiredIncome} prefix="$" min={0} max={500000} step={1000} helpText="In today's dollars" />
      <NumberInput label="Years in Retirement" value={yearsInRetirement} onChange={setYearsInRetirement} min={1} max={50} step={1} suffix="years" />
      <NumberInput label="Return During Retirement" value={returnRate} onChange={setReturnRate} prefix="%" min={0} max={12} step={0.1} showSlider />
      <NumberInput label="Inflation Rate" value={inflationRate} onChange={setInflationRate} prefix="%" min={0} max={8} step={0.1} showSlider />
      <NumberInput label="Years to Retirement" value={yearsToRetirement} onChange={setYearsToRetirement} min={1} max={50} step={1} suffix="years" helpText="For monthly savings calculation" />
      <ResetButton onReset={reset} />
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Nest Egg Needed" value={formatCurrency(results.nestEggNeeded)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="In Today's Dollars" value={formatCurrency(results.nestEggToday)} size="small" variant="neutral" />
        <ResultCard label="Income at Retirement (Inflated)" value={formatCurrency(results.incomeAtRetirement)} size="small" variant="neutral" />
        <ResultCard label="Monthly Savings Needed" value={formatCurrency(results.monthlySavings)} size="small" variant="accent" />
      </div>
      <div className="rounded-lg border p-3">
        <p className="text-sm text-gray-600">Monthly savings assumes 7% annual return during accumulation phase. Nest egg calculation accounts for inflation-adjusted withdrawals during retirement.</p>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
