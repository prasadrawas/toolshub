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

/** Standard loan payment: M = P[r(1+r)^n]/[(1+r)^n-1] */
function pmt(principal: number, annualRate: number, totalMonths: number): number {
  if (totalMonths <= 0) return 0;
  if (annualRate === 0) return principal / totalMonths;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
}

/** Months to pay off a balance with a fixed payment */
function monthsToPayoff(balance: number, annualRate: number, monthlyPayment: number): number {
  if (balance <= 0) return 0;
  if (annualRate === 0) return Math.ceil(balance / monthlyPayment);
  const r = annualRate / 100 / 12;
  const minPayment = balance * r;
  if (monthlyPayment <= minPayment) return Infinity;
  return Math.ceil(-Math.log(1 - (balance * r) / monthlyPayment) / Math.log(1 + r));
}

/** Total interest paid over the life of a loan */
function totalInterest(balance: number, annualRate: number, monthlyPayment: number, months: number): number {
  if (months === Infinity || months <= 0) return Infinity;
  let totalInt = 0;
  let b = balance;
  const r = annualRate / 100 / 12;
  for (let i = 0; i < months && b > 0; i++) {
    const interest = b * r;
    totalInt += interest;
    b = b + interest - monthlyPayment;
  }
  return totalInt;
}

/** Format a future date given months from now */
function payoffDate(months: number): string {
  if (months === Infinity || months <= 0) return "Never";
  const now = new Date();
  const future = new Date(now.getFullYear(), now.getMonth() + months, 1);
  return future.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/* ═══════════════════════════════════════════════════════════
   1. DebtPayoffCalculator
   ═══════════════════════════════════════════════════════════ */

const DEBT_PAYOFF_DEFAULTS = {
  balance: 15000,
  interestRate: 18.0,
  monthlyPayment: 400,
};

export function DebtPayoffCalculator() {
  const [balance, setBalance] = useState(DEBT_PAYOFF_DEFAULTS.balance);
  const [interestRate, setInterestRate] = useState(DEBT_PAYOFF_DEFAULTS.interestRate);
  const [monthlyPayment, setMonthlyPayment] = useState(DEBT_PAYOFF_DEFAULTS.monthlyPayment);

  const results = useMemo(() => {
    const months = monthsToPayoff(balance, interestRate, monthlyPayment);
    const totalInt = totalInterest(balance, interestRate, monthlyPayment, months);
    const totalPaid = months === Infinity ? Infinity : totalInt + balance;
    const date = payoffDate(months);
    return { months, totalInt, totalPaid, date };
  }, [balance, interestRate, monthlyPayment]);

  function resetDefaults() {
    setBalance(DEBT_PAYOFF_DEFAULTS.balance);
    setInterestRate(DEBT_PAYOFF_DEFAULTS.interestRate);
    setMonthlyPayment(DEBT_PAYOFF_DEFAULTS.monthlyPayment);
  }

  const inputs = (
    <>
      <NumberInput label="Current Balance" value={balance} onChange={setBalance} prefix="$" min={100} max={100000} step={500} showSlider />
      <NumberInput label="Interest Rate (APR)" value={interestRate} onChange={setInterestRate} prefix="%" min={0} max={30} step={0.1} showSlider />
      <NumberInput label="Monthly Payment" value={monthlyPayment} onChange={setMonthlyPayment} prefix="$" min={25} max={10000} step={25} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Months to Payoff" value={results.months === Infinity ? "Never" : `${results.months} months`} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest" value={results.totalInt === Infinity ? "N/A" : formatCurrency(results.totalInt)} size="small" variant="danger" />
        <ResultCard label="Total Paid" value={results.totalPaid === Infinity ? "N/A" : formatCurrency(results.totalPaid)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Payoff Date" value={results.date} size="medium" variant="accent" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   2. CreditCardPayoffCalculator
   ═══════════════════════════════════════════════════════════ */

const CREDIT_CARD_DEFAULTS = {
  balance: 8000,
  apr: 22.0,
  minPaymentPct: 2,
  fixedPayment: 300,
};

export function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState(CREDIT_CARD_DEFAULTS.balance);
  const [apr, setApr] = useState(CREDIT_CARD_DEFAULTS.apr);
  const [minPaymentPct, setMinPaymentPct] = useState(CREDIT_CARD_DEFAULTS.minPaymentPct);
  const [fixedPayment, setFixedPayment] = useState(CREDIT_CARD_DEFAULTS.fixedPayment);

  const results = useMemo(() => {
    const r = apr / 100 / 12;
    // Minimum payment simulation (payment = max(balance * minPct/100, 25))
    let balMin = balance;
    let totalIntMin = 0;
    let monthsMin = 0;
    const maxIter = 1200; // 100 years cap
    while (balMin > 0.01 && monthsMin < maxIter) {
      const interest = balMin * r;
      const payment = Math.max(balMin * (minPaymentPct / 100), 25);
      if (payment <= interest) { monthsMin = Infinity; totalIntMin = Infinity; break; }
      totalIntMin += interest;
      balMin = balMin + interest - payment;
      monthsMin++;
    }
    const totalPaidMin = monthsMin === Infinity ? Infinity : totalIntMin + balance;

    // Fixed payment simulation
    const monthsFixed = monthsToPayoff(balance, apr, fixedPayment);
    const totalIntFixed = totalInterest(balance, apr, fixedPayment, monthsFixed);
    const totalPaidFixed = monthsFixed === Infinity ? Infinity : totalIntFixed + balance;

    const interestSaved = totalIntMin === Infinity || totalIntFixed === Infinity ? Infinity : totalIntMin - totalIntFixed;

    return { monthsMin, totalIntMin, totalPaidMin, monthsFixed, totalIntFixed, totalPaidFixed, interestSaved };
  }, [balance, apr, minPaymentPct, fixedPayment]);

  function resetDefaults() {
    setBalance(CREDIT_CARD_DEFAULTS.balance);
    setApr(CREDIT_CARD_DEFAULTS.apr);
    setMinPaymentPct(CREDIT_CARD_DEFAULTS.minPaymentPct);
    setFixedPayment(CREDIT_CARD_DEFAULTS.fixedPayment);
  }

  const fmt = (v: number) => (v === Infinity ? "N/A" : formatCurrency(v));
  const fmtMo = (v: number) => (v === Infinity ? "Never" : `${v} months`);

  const inputs = (
    <>
      <NumberInput label="Credit Card Balance" value={balance} onChange={setBalance} prefix="$" min={100} max={50000} step={250} showSlider />
      <NumberInput label="APR" value={apr} onChange={setApr} prefix="%" min={0} max={35} step={0.1} showSlider />
      <NumberInput label="Minimum Payment %" value={minPaymentPct} onChange={setMinPaymentPct} prefix="%" min={1} max={5} step={0.25} showSlider />
      <NumberInput label="Fixed Monthly Payment" value={fixedPayment} onChange={setFixedPayment} prefix="$" min={25} max={5000} step={25} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Months (Minimums)" value={fmtMo(results.monthsMin)} size="medium" variant="danger" />
        <ResultCard label="Months (Fixed)" value={fmtMo(results.monthsFixed)} size="medium" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Interest (Minimums)" value={fmt(results.totalIntMin)} size="small" variant="danger" />
        <ResultCard label="Interest (Fixed)" value={fmt(results.totalIntFixed)} size="small" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Paid (Minimums)" value={fmt(results.totalPaidMin)} size="small" variant="neutral" />
        <ResultCard label="Total Paid (Fixed)" value={fmt(results.totalPaidFixed)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Interest Saved with Fixed Payment" value={fmt(results.interestSaved)} size="large" variant="accent" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   3. DebtConsolidationCalculator
   ═══════════════════════════════════════════════════════════ */

interface DebtEntry {
  id: number;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

const CONSOLIDATION_DEFAULTS = {
  consolidationRate: 8.0,
  consolidationTerm: 60,
};

let debtIdCounter = 0;
function makeDebt(name: string, balance: number, rate: number, minPayment: number): DebtEntry {
  return { id: debtIdCounter++, name, balance, rate, minPayment };
}

const DEFAULT_DEBTS: DebtEntry[] = [
  makeDebt("Credit Card 1", 5000, 22, 150),
  makeDebt("Credit Card 2", 3000, 19, 90),
  makeDebt("Personal Loan", 10000, 12, 250),
];

export function DebtConsolidationCalculator() {
  const [debts, setDebts] = useState<DebtEntry[]>(() => DEFAULT_DEBTS.map(d => ({ ...d })));
  const [consolidationRate, setConsolidationRate] = useState(CONSOLIDATION_DEFAULTS.consolidationRate);
  const [consolidationTerm, setConsolidationTerm] = useState(CONSOLIDATION_DEFAULTS.consolidationTerm);

  const results = useMemo(() => {
    const currentTotalMonthly = debts.reduce((s, d) => s + d.minPayment, 0);
    const totalBalance = debts.reduce((s, d) => s + d.balance, 0);

    // Total interest if paying minimums on each debt
    let totalIntBefore = 0;
    for (const d of debts) {
      const m = monthsToPayoff(d.balance, d.rate, d.minPayment);
      totalIntBefore += totalInterest(d.balance, d.rate, d.minPayment, m);
    }

    const newMonthly = pmt(totalBalance, consolidationRate, consolidationTerm);
    const totalIntAfter = newMonthly * consolidationTerm - totalBalance;
    const monthlySavings = currentTotalMonthly - newMonthly;

    return { currentTotalMonthly, newMonthly, monthlySavings, totalIntBefore, totalIntAfter, totalBalance };
  }, [debts, consolidationRate, consolidationTerm]);

  function addDebt() {
    setDebts([...debts, makeDebt(`Debt ${debts.length + 1}`, 2000, 15, 60)]);
  }

  function removeDebt(id: number) {
    if (debts.length > 1) setDebts(debts.filter(d => d.id !== id));
  }

  function updateDebt(id: number, field: keyof DebtEntry, value: number | string) {
    setDebts(debts.map(d => (d.id === id ? { ...d, [field]: value } : d)));
  }

  function resetDefaults() {
    debtIdCounter = 0;
    setDebts(DEFAULT_DEBTS.map(d => ({ ...d, id: debtIdCounter++ })));
    setConsolidationRate(CONSOLIDATION_DEFAULTS.consolidationRate);
    setConsolidationTerm(CONSOLIDATION_DEFAULTS.consolidationTerm);
  }

  const inputs = (
    <>
      {debts.map((d, i) => (
        <div key={d.id} className="space-y-3 p-3 border rounded-lg">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Debt {i + 1}</Label>
            {debts.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeDebt(d.id)} className="text-red-500 h-6 text-xs">Remove</Button>
            )}
          </div>
          <NumberInput label="Balance" value={d.balance} onChange={(v) => updateDebt(d.id, "balance", v)} prefix="$" min={100} max={100000} step={250} />
          <NumberInput label="Interest Rate" value={d.rate} onChange={(v) => updateDebt(d.id, "rate", v)} prefix="%" min={0} max={35} step={0.1} />
          <NumberInput label="Min Payment" value={d.minPayment} onChange={(v) => updateDebt(d.id, "minPayment", v)} prefix="$" min={10} max={5000} step={10} />
        </div>
      ))}
      <Button variant="outline" onClick={addDebt} className="w-full">+ Add Debt</Button>
      <NumberInput label="Consolidation Loan Rate" value={consolidationRate} onChange={setConsolidationRate} prefix="%" min={1} max={25} step={0.1} showSlider />
      <NumberInput label="Consolidation Term (months)" value={consolidationTerm} onChange={setConsolidationTerm} min={12} max={120} step={6} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Current Total Monthly" value={formatCurrency(results.currentTotalMonthly)} size="medium" variant="danger" />
        <ResultCard label="New Monthly Payment" value={formatCurrency(results.newMonthly)} size="medium" variant="accent" />
      </div>
      <ResultCard label="Monthly Savings" value={formatCurrency(results.monthlySavings)} size="large" variant={results.monthlySavings > 0 ? "accent" : "danger"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest (Before)" value={results.totalIntBefore === Infinity ? "N/A" : formatCurrency(results.totalIntBefore)} size="small" variant="danger" />
        <ResultCard label="Total Interest (After)" value={formatCurrency(results.totalIntAfter)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   4. DebtAvalancheCalculator
   ═══════════════════════════════════════════════════════════ */

const AVALANCHE_DEFAULT_DEBTS: DebtEntry[] = [
  makeDebt("Credit Card", 6000, 24, 120),
  makeDebt("Car Loan", 15000, 6, 300),
  makeDebt("Student Loan", 20000, 5, 220),
];

const AVALANCHE_DEFAULTS = {
  extraPayment: 200,
};

export function DebtAvalancheCalculator() {
  const [debts, setDebts] = useState<DebtEntry[]>(() => AVALANCHE_DEFAULT_DEBTS.map(d => ({ ...d })));
  const [extraPayment, setExtraPayment] = useState(AVALANCHE_DEFAULTS.extraPayment);

  const results = useMemo(() => {
    // Sort by rate descending (avalanche method)
    const sorted = [...debts].sort((a, b) => b.rate - a.rate);
    const payoffOrder = sorted.map(d => d.name);

    // Simulate avalanche
    const balances = sorted.map(d => d.balance);
    const rates = sorted.map(d => d.rate / 100 / 12);
    const minPays = sorted.map(d => d.minPayment);
    let totalInt = 0;
    let months = 0;
    const maxMonths = 1200;

    while (balances.some(b => b > 0.01) && months < maxMonths) {
      months++;
      let extra = extraPayment;
      for (let i = 0; i < balances.length; i++) {
        if (balances[i] <= 0) continue;
        const interest = balances[i] * rates[i];
        totalInt += interest;
        let payment = minPays[i];
        // Apply extra to highest-rate debt with remaining balance
        if (i === balances.findIndex(b => b > 0.01)) {
          payment += extra;
          extra = 0;
        }
        balances[i] = Math.max(0, balances[i] + interest - payment);
      }
    }

    const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
    return { payoffOrder, totalInt, months, totalPaid: totalBalance + totalInt };
  }, [debts, extraPayment]);

  function addDebt() {
    setDebts([...debts, makeDebt(`Debt ${debts.length + 1}`, 3000, 15, 90)]);
  }

  function removeDebt(id: number) {
    if (debts.length > 1) setDebts(debts.filter(d => d.id !== id));
  }

  function updateDebt(id: number, field: keyof DebtEntry, value: number | string) {
    setDebts(debts.map(d => (d.id === id ? { ...d, [field]: value } : d)));
  }

  function resetDefaults() {
    debtIdCounter = 0;
    setDebts(AVALANCHE_DEFAULT_DEBTS.map(d => ({ ...d, id: debtIdCounter++ })));
    setExtraPayment(AVALANCHE_DEFAULTS.extraPayment);
  }

  const inputs = (
    <>
      {debts.map((d, i) => (
        <div key={d.id} className="space-y-3 p-3 border rounded-lg">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Debt {i + 1}: {d.name}</Label>
            {debts.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeDebt(d.id)} className="text-red-500 h-6 text-xs">Remove</Button>
            )}
          </div>
          <NumberInput label="Balance" value={d.balance} onChange={(v) => updateDebt(d.id, "balance", v)} prefix="$" min={100} max={100000} step={250} />
          <NumberInput label="Interest Rate" value={d.rate} onChange={(v) => updateDebt(d.id, "rate", v)} prefix="%" min={0} max={35} step={0.1} />
          <NumberInput label="Min Payment" value={d.minPayment} onChange={(v) => updateDebt(d.id, "minPayment", v)} prefix="$" min={10} max={5000} step={10} />
        </div>
      ))}
      <Button variant="outline" onClick={addDebt} className="w-full">+ Add Debt</Button>
      <NumberInput label="Extra Monthly Payment" value={extraPayment} onChange={setExtraPayment} prefix="$" min={0} max={5000} step={25} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Months to Payoff" value={results.months >= 1200 ? "100+ years" : `${results.months} months`} size="large" />
      <ResultCard label="Total Interest Paid" value={formatCurrency(results.totalInt)} size="medium" variant="danger" />
      <ResultCard label="Total Paid" value={formatCurrency(results.totalPaid)} size="medium" variant="neutral" />
      <div className="p-3 border rounded-lg space-y-1">
        <Label className="font-semibold text-sm">Payoff Order (Highest Rate First)</Label>
        {results.payoffOrder.map((name, i) => (
          <p key={i} className="text-sm text-muted-foreground">{i + 1}. {name}</p>
        ))}
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   5. PersonalLoanCalculator
   ═══════════════════════════════════════════════════════════ */

const PERSONAL_LOAN_DEFAULTS = {
  loanAmount: 20000,
  interestRate: 10.0,
  term: 60,
  originationFee: 3,
};

export function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(PERSONAL_LOAN_DEFAULTS.loanAmount);
  const [interestRate, setInterestRate] = useState(PERSONAL_LOAN_DEFAULTS.interestRate);
  const [term, setTerm] = useState(PERSONAL_LOAN_DEFAULTS.term);
  const [originationFee, setOriginationFee] = useState(PERSONAL_LOAN_DEFAULTS.originationFee);

  const results = useMemo(() => {
    const monthlyPayment = pmt(loanAmount, interestRate, term);
    const totalPaid = monthlyPayment * term;
    const totalInt = totalPaid - loanAmount;
    const feeAmount = loanAmount * (originationFee / 100);
    const totalCost = totalPaid + feeAmount;

    // APR including fees: find rate where pmt(loanAmount - fee, APR, term) = monthlyPayment
    // Newton's method approximation
    let aprWithFees = interestRate;
    const netProceeds = loanAmount - feeAmount;
    if (netProceeds > 0) {
      for (let iter = 0; iter < 100; iter++) {
        const p = pmt(netProceeds, aprWithFees, term);
        const pPlus = pmt(netProceeds, aprWithFees + 0.01, term);
        const diff = p - monthlyPayment;
        const deriv = (pPlus - p) / 0.01;
        if (Math.abs(deriv) < 1e-10) break;
        aprWithFees = aprWithFees - diff / deriv;
        if (Math.abs(diff) < 0.001) break;
      }
    }

    return { monthlyPayment, totalInt, totalCost, feeAmount, aprWithFees };
  }, [loanAmount, interestRate, term, originationFee]);

  function resetDefaults() {
    setLoanAmount(PERSONAL_LOAN_DEFAULTS.loanAmount);
    setInterestRate(PERSONAL_LOAN_DEFAULTS.interestRate);
    setTerm(PERSONAL_LOAN_DEFAULTS.term);
    setOriginationFee(PERSONAL_LOAN_DEFAULTS.originationFee);
  }

  const inputs = (
    <>
      <NumberInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} prefix="$" min={1000} max={100000} step={500} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={36} step={0.1} showSlider />
      <NumberInput label="Loan Term (months)" value={term} onChange={setTerm} min={6} max={84} step={6} showSlider />
      <NumberInput label="Origination Fee %" value={originationFee} onChange={setOriginationFee} prefix="%" min={0} max={10} step={0.5} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest" value={formatCurrency(results.totalInt)} size="small" variant="danger" />
        <ResultCard label="Origination Fee" value={formatCurrency(results.feeAmount)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Cost (incl. fees)" value={formatCurrency(results.totalCost)} size="small" variant="neutral" />
        <ResultCard label="Effective APR" value={`${results.aprWithFees.toFixed(2)}%`} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   6. StudentLoanCalculator
   ═══════════════════════════════════════════════════════════ */

const STUDENT_LOAN_DEFAULTS = {
  balance: 35000,
  interestRate: 5.5,
  loanTerm: 10,
  repaymentPlan: "standard" as string,
};

export function StudentLoanCalculator() {
  const [balance, setBalance] = useState(STUDENT_LOAN_DEFAULTS.balance);
  const [interestRate, setInterestRate] = useState(STUDENT_LOAN_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(STUDENT_LOAN_DEFAULTS.loanTerm);
  const [repaymentPlan, setRepaymentPlan] = useState(STUDENT_LOAN_DEFAULTS.repaymentPlan);

  const results = useMemo(() => {
    const totalMonths = loanTerm * 12;

    if (repaymentPlan === "standard") {
      const monthly = pmt(balance, interestRate, totalMonths);
      const totalPaid = monthly * totalMonths;
      const totalInt = totalPaid - balance;
      return { monthlyPayment: monthly, monthlyPaymentEnd: monthly, totalInt, totalPaid };
    }

    if (repaymentPlan === "graduated") {
      // Graduated: starts low, increases every 2 years. Approximate: starts at 60% of standard, ends at 140%
      const standardPmt = pmt(balance, interestRate, totalMonths);
      const r = interestRate / 100 / 12;
      // Simulate: start at 60% standard, increase linearly to pay off
      const startPmt = standardPmt * 0.6;
      let endPmt = standardPmt * 1.4;

      // Verify via simulation and adjust
      let bal = balance;
      let totalInt = 0;
      let totalPaid = 0;
      for (let m = 0; m < totalMonths && bal > 0.01; m++) {
        const progress = m / totalMonths;
        const payment = startPmt + (endPmt - startPmt) * progress;
        const interest = bal * r;
        totalInt += interest;
        totalPaid += Math.min(payment, bal + interest);
        bal = Math.max(0, bal + interest - payment);
      }
      // If balance remains, adjust
      if (bal > 0.01) {
        endPmt = standardPmt * 1.6;
        bal = balance;
        totalInt = 0;
        totalPaid = 0;
        for (let m = 0; m < totalMonths && bal > 0.01; m++) {
          const progress = m / totalMonths;
          const payment = startPmt + (endPmt - startPmt) * progress;
          const interest = bal * r;
          totalInt += interest;
          totalPaid += Math.min(payment, bal + interest);
          bal = Math.max(0, bal + interest - payment);
        }
      }

      return { monthlyPayment: startPmt, monthlyPaymentEnd: endPmt, totalInt, totalPaid };
    }

    // Extended: lower payment over longer period (use 25yr term)
    const extendedMonths = 25 * 12;
    const monthly = pmt(balance, interestRate, extendedMonths);
    const totalPaid = monthly * extendedMonths;
    const totalInt = totalPaid - balance;
    return { monthlyPayment: monthly, monthlyPaymentEnd: monthly, totalInt, totalPaid };
  }, [balance, interestRate, loanTerm, repaymentPlan]);

  function resetDefaults() {
    setBalance(STUDENT_LOAN_DEFAULTS.balance);
    setInterestRate(STUDENT_LOAN_DEFAULTS.interestRate);
    setLoanTerm(STUDENT_LOAN_DEFAULTS.loanTerm);
    setRepaymentPlan(STUDENT_LOAN_DEFAULTS.repaymentPlan);
  }

  const inputs = (
    <>
      <NumberInput label="Loan Balance" value={balance} onChange={setBalance} prefix="$" min={1000} max={200000} step={1000} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={12} step={0.1} showSlider />
      <div className="space-y-2">
        <Label className="text-sm font-medium">Loan Term</Label>
        <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 years</SelectItem>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
            <SelectItem value="25">25 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Repayment Plan</Label>
        <Select value={repaymentPlan} onValueChange={setRepaymentPlan}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="graduated">Graduated</SelectItem>
            <SelectItem value="extended">Extended (25 yr)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label={repaymentPlan === "graduated" ? "Starting Monthly Payment" : "Monthly Payment"} value={formatCurrency(results.monthlyPayment)} size="large" />
      {repaymentPlan === "graduated" && (
        <ResultCard label="Final Monthly Payment" value={formatCurrency(results.monthlyPaymentEnd)} size="medium" variant="neutral" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest" value={formatCurrency(results.totalInt)} size="small" variant="danger" />
        <ResultCard label="Total Paid" value={formatCurrency(results.totalPaid)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   7. StudentLoanRefinanceCalculator
   ═══════════════════════════════════════════════════════════ */

const STUDENT_REFI_DEFAULTS = {
  currentBalance: 40000,
  currentRate: 6.8,
  currentRemainingTerm: 15,
  newRate: 4.5,
  newTerm: 10,
};

export function StudentLoanRefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState(STUDENT_REFI_DEFAULTS.currentBalance);
  const [currentRate, setCurrentRate] = useState(STUDENT_REFI_DEFAULTS.currentRate);
  const [currentRemainingTerm, setCurrentRemainingTerm] = useState(STUDENT_REFI_DEFAULTS.currentRemainingTerm);
  const [newRate, setNewRate] = useState(STUDENT_REFI_DEFAULTS.newRate);
  const [newTerm, setNewTerm] = useState(STUDENT_REFI_DEFAULTS.newTerm);

  const results = useMemo(() => {
    const currentMonthly = pmt(currentBalance, currentRate, currentRemainingTerm * 12);
    const newMonthly = pmt(currentBalance, newRate, newTerm * 12);
    const monthlySavings = currentMonthly - newMonthly;

    const totalCurrentCost = currentMonthly * currentRemainingTerm * 12;
    const totalNewCost = newMonthly * newTerm * 12;
    const totalSavings = totalCurrentCost - totalNewCost;

    const breakEvenMonths = monthlySavings > 0 ? 0 : Math.ceil(-totalSavings / (monthlySavings || 1));

    return { currentMonthly, newMonthly, monthlySavings, totalSavings, breakEvenMonths };
  }, [currentBalance, currentRate, currentRemainingTerm, newRate, newTerm]);

  function resetDefaults() {
    setCurrentBalance(STUDENT_REFI_DEFAULTS.currentBalance);
    setCurrentRate(STUDENT_REFI_DEFAULTS.currentRate);
    setCurrentRemainingTerm(STUDENT_REFI_DEFAULTS.currentRemainingTerm);
    setNewRate(STUDENT_REFI_DEFAULTS.newRate);
    setNewTerm(STUDENT_REFI_DEFAULTS.newTerm);
  }

  const inputs = (
    <>
      <NumberInput label="Current Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={5000} max={200000} step={1000} showSlider />
      <NumberInput label="Current Interest Rate" value={currentRate} onChange={setCurrentRate} prefix="%" min={1} max={12} step={0.1} showSlider />
      <NumberInput label="Current Remaining Term (years)" value={currentRemainingTerm} onChange={setCurrentRemainingTerm} min={1} max={30} step={1} showSlider />
      <NumberInput label="New Interest Rate" value={newRate} onChange={setNewRate} prefix="%" min={1} max={12} step={0.1} showSlider />
      <div className="space-y-2">
        <Label className="text-sm font-medium">New Loan Term</Label>
        <Select value={newTerm.toString()} onValueChange={(v) => setNewTerm(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 years</SelectItem>
            <SelectItem value="7">7 years</SelectItem>
            <SelectItem value="10">10 years</SelectItem>
            <SelectItem value="15">15 years</SelectItem>
            <SelectItem value="20">20 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="New Monthly Payment" value={formatCurrency(results.newMonthly)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Monthly Savings" value={formatCurrency(results.monthlySavings)} size="small" variant={results.monthlySavings > 0 ? "accent" : "danger"} />
        <ResultCard label="Total Savings" value={formatCurrency(results.totalSavings)} size="small" variant={results.totalSavings > 0 ? "accent" : "danger"} />
      </div>
      <ResultCard label="Break-Even" value={results.monthlySavings > 0 ? "Immediate" : results.breakEvenMonths > 0 ? `${results.breakEvenMonths} months` : "No savings"} size="medium" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   8. DebtToIncomeCalculator
   ═══════════════════════════════════════════════════════════ */

const DTI_DEFAULTS = {
  monthlyGrossIncome: 7500,
  housingPayment: 1800,
  carPayment: 400,
  studentLoans: 350,
  creditCardMinimums: 150,
  otherDebts: 100,
};

export function DebtToIncomeCalculator() {
  const [monthlyGrossIncome, setMonthlyGrossIncome] = useState(DTI_DEFAULTS.monthlyGrossIncome);
  const [housingPayment, setHousingPayment] = useState(DTI_DEFAULTS.housingPayment);
  const [carPayment, setCarPayment] = useState(DTI_DEFAULTS.carPayment);
  const [studentLoans, setStudentLoans] = useState(DTI_DEFAULTS.studentLoans);
  const [creditCardMinimums, setCreditCardMinimums] = useState(DTI_DEFAULTS.creditCardMinimums);
  const [otherDebts, setOtherDebts] = useState(DTI_DEFAULTS.otherDebts);

  const results = useMemo(() => {
    const income = Math.max(monthlyGrossIncome, 1);
    const frontEnd = (housingPayment / income) * 100;
    const totalDebt = housingPayment + carPayment + studentLoans + creditCardMinimums + otherDebts;
    const backEnd = (totalDebt / income) * 100;
    const maxMortgage = income * 0.28; // 28% front-end guideline

    let color: "accent" | "primary" | "danger" = "accent";
    if (backEnd >= 43) color = "danger";
    else if (backEnd >= 36) color = "primary";

    return { frontEnd, backEnd, color, maxMortgage, totalDebt };
  }, [monthlyGrossIncome, housingPayment, carPayment, studentLoans, creditCardMinimums, otherDebts]);

  function resetDefaults() {
    setMonthlyGrossIncome(DTI_DEFAULTS.monthlyGrossIncome);
    setHousingPayment(DTI_DEFAULTS.housingPayment);
    setCarPayment(DTI_DEFAULTS.carPayment);
    setStudentLoans(DTI_DEFAULTS.studentLoans);
    setCreditCardMinimums(DTI_DEFAULTS.creditCardMinimums);
    setOtherDebts(DTI_DEFAULTS.otherDebts);
  }

  const dtiLabel = results.backEnd < 36 ? "Good" : results.backEnd < 43 ? "Caution" : "High Risk";

  const inputs = (
    <>
      <NumberInput label="Monthly Gross Income" value={monthlyGrossIncome} onChange={setMonthlyGrossIncome} prefix="$" min={1000} max={50000} step={250} showSlider />
      <NumberInput label="Housing Payment (Mortgage/Rent)" value={housingPayment} onChange={setHousingPayment} prefix="$" min={0} max={10000} step={50} showSlider />
      <NumberInput label="Car Payment" value={carPayment} onChange={setCarPayment} prefix="$" min={0} max={3000} step={25} />
      <NumberInput label="Student Loans" value={studentLoans} onChange={setStudentLoans} prefix="$" min={0} max={3000} step={25} />
      <NumberInput label="Credit Card Minimums" value={creditCardMinimums} onChange={setCreditCardMinimums} prefix="$" min={0} max={3000} step={25} />
      <NumberInput label="Other Debts" value={otherDebts} onChange={setOtherDebts} prefix="$" min={0} max={5000} step={25} />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Front-End DTI" value={`${results.frontEnd.toFixed(1)}%`} size="medium" variant="neutral" />
        <ResultCard label="Back-End DTI" value={`${results.backEnd.toFixed(1)}%`} size="medium" variant={results.color} />
      </div>
      <div className={`p-4 rounded-lg text-center font-semibold text-lg ${
        results.backEnd < 36 ? "bg-green-100 text-green-800" :
        results.backEnd < 43 ? "bg-yellow-100 text-yellow-800" :
        "bg-red-100 text-red-800"
      }`}>
        {dtiLabel} ({results.backEnd.toFixed(1)}%)
      </div>
      <ResultCard label="Max Recommended Mortgage Payment" value={formatCurrency(results.maxMortgage)} size="medium" variant="accent" />
      <ResultCard label="Total Monthly Debt" value={formatCurrency(results.totalDebt)} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   9. LineOfCreditCalculator
   ═══════════════════════════════════════════════════════════ */

const LOC_DEFAULTS = {
  creditLimit: 25000,
  amountDrawn: 10000,
  interestRate: 9.5,
  monthlyPayment: 300,
};

export function LineOfCreditCalculator() {
  const [creditLimit, setCreditLimit] = useState(LOC_DEFAULTS.creditLimit);
  const [amountDrawn, setAmountDrawn] = useState(LOC_DEFAULTS.amountDrawn);
  const [interestRate, setInterestRate] = useState(LOC_DEFAULTS.interestRate);
  const [monthlyPayment, setMonthlyPayment] = useState(LOC_DEFAULTS.monthlyPayment);

  const results = useMemo(() => {
    const months = monthsToPayoff(amountDrawn, interestRate, monthlyPayment);
    const totalInt = totalInterest(amountDrawn, interestRate, monthlyPayment, months);
    const availableCredit = creditLimit - amountDrawn;
    return { months, totalInt, availableCredit };
  }, [creditLimit, amountDrawn, interestRate, monthlyPayment]);

  function resetDefaults() {
    setCreditLimit(LOC_DEFAULTS.creditLimit);
    setAmountDrawn(LOC_DEFAULTS.amountDrawn);
    setInterestRate(LOC_DEFAULTS.interestRate);
    setMonthlyPayment(LOC_DEFAULTS.monthlyPayment);
  }

  const inputs = (
    <>
      <NumberInput label="Credit Limit" value={creditLimit} onChange={setCreditLimit} prefix="$" min={1000} max={100000} step={1000} showSlider />
      <NumberInput label="Amount Drawn" value={amountDrawn} onChange={setAmountDrawn} prefix="$" min={0} max={creditLimit} step={500} showSlider />
      <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={1} max={25} step={0.1} showSlider />
      <NumberInput label="Monthly Payment" value={monthlyPayment} onChange={setMonthlyPayment} prefix="$" min={25} max={10000} step={25} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Months to Payoff" value={results.months === Infinity ? "Never" : `${results.months} months`} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Interest" value={results.totalInt === Infinity ? "N/A" : formatCurrency(results.totalInt)} size="small" variant="danger" />
        <ResultCard label="Available Credit" value={formatCurrency(results.availableCredit)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   10. BalanceTransferCalculator
   ═══════════════════════════════════════════════════════════ */

const BALANCE_TRANSFER_DEFAULTS = {
  currentBalance: 8000,
  currentAPR: 22.0,
  transferFee: 3,
  introAPR: 0,
  introPeriod: 18,
  regularAPR: 17.0,
  monthlyPayment: 400,
};

export function BalanceTransferCalculator() {
  const [currentBalance, setCurrentBalance] = useState(BALANCE_TRANSFER_DEFAULTS.currentBalance);
  const [currentAPR, setCurrentAPR] = useState(BALANCE_TRANSFER_DEFAULTS.currentAPR);
  const [transferFee, setTransferFee] = useState(BALANCE_TRANSFER_DEFAULTS.transferFee);
  const [introAPR, setIntroAPR] = useState(BALANCE_TRANSFER_DEFAULTS.introAPR);
  const [introPeriod, setIntroPeriod] = useState(BALANCE_TRANSFER_DEFAULTS.introPeriod);
  const [regularAPR, setRegularAPR] = useState(BALANCE_TRANSFER_DEFAULTS.regularAPR);
  const [monthlyPayment, setMonthlyPayment] = useState(BALANCE_TRANSFER_DEFAULTS.monthlyPayment);

  const results = useMemo(() => {
    // Without transfer: pay off at current APR
    const monthsWithout = monthsToPayoff(currentBalance, currentAPR, monthlyPayment);
    const intWithout = totalInterest(currentBalance, currentAPR, monthlyPayment, monthsWithout);
    const totalWithout = monthsWithout === Infinity ? Infinity : intWithout + currentBalance;

    // With transfer: fee + intro period at intro APR + remaining at regular APR
    const fee = currentBalance * (transferFee / 100);
    const introR = introAPR / 100 / 12;
    const regR = regularAPR / 100 / 12;

    let bal = currentBalance;
    let totalIntTransfer = 0;
    let monthsTransfer = 0;
    const maxIter = 1200;

    // Intro period
    for (let m = 0; m < introPeriod && bal > 0.01 && monthsTransfer < maxIter; m++) {
      const interest = bal * introR;
      totalIntTransfer += interest;
      bal = Math.max(0, bal + interest - monthlyPayment);
      monthsTransfer++;
    }

    // Post-intro period
    while (bal > 0.01 && monthsTransfer < maxIter) {
      const interest = bal * regR;
      totalIntTransfer += interest;
      bal = Math.max(0, bal + interest - monthlyPayment);
      monthsTransfer++;
    }

    const totalWithTransfer = totalIntTransfer + currentBalance + fee;
    const savings = totalWithout === Infinity ? Infinity : totalWithout - totalWithTransfer;

    return {
      totalWithout, totalWithTransfer, savings, fee,
      monthsWithout: monthsWithout === Infinity ? Infinity : monthsWithout,
      monthsTransfer: monthsTransfer >= maxIter ? Infinity : monthsTransfer,
    };
  }, [currentBalance, currentAPR, transferFee, introAPR, introPeriod, regularAPR, monthlyPayment]);

  function resetDefaults() {
    setCurrentBalance(BALANCE_TRANSFER_DEFAULTS.currentBalance);
    setCurrentAPR(BALANCE_TRANSFER_DEFAULTS.currentAPR);
    setTransferFee(BALANCE_TRANSFER_DEFAULTS.transferFee);
    setIntroAPR(BALANCE_TRANSFER_DEFAULTS.introAPR);
    setIntroPeriod(BALANCE_TRANSFER_DEFAULTS.introPeriod);
    setRegularAPR(BALANCE_TRANSFER_DEFAULTS.regularAPR);
    setMonthlyPayment(BALANCE_TRANSFER_DEFAULTS.monthlyPayment);
  }

  const fmt = (v: number) => (v === Infinity ? "N/A" : formatCurrency(v));
  const fmtMo = (v: number) => (v === Infinity ? "Never" : `${v} months`);

  const inputs = (
    <>
      <NumberInput label="Current Balance" value={currentBalance} onChange={setCurrentBalance} prefix="$" min={500} max={50000} step={250} showSlider />
      <NumberInput label="Current APR" value={currentAPR} onChange={setCurrentAPR} prefix="%" min={0} max={35} step={0.1} showSlider />
      <NumberInput label="Transfer Fee %" value={transferFee} onChange={setTransferFee} prefix="%" min={0} max={5} step={0.5} showSlider />
      <NumberInput label="Intro APR" value={introAPR} onChange={setIntroAPR} prefix="%" min={0} max={15} step={0.1} showSlider />
      <NumberInput label="Intro Period (months)" value={introPeriod} onChange={setIntroPeriod} min={3} max={24} step={1} showSlider />
      <NumberInput label="Regular APR After Intro" value={regularAPR} onChange={setRegularAPR} prefix="%" min={5} max={35} step={0.1} showSlider />
      <NumberInput label="Monthly Payment" value={monthlyPayment} onChange={setMonthlyPayment} prefix="$" min={50} max={5000} step={25} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Without Transfer" value={fmt(results.totalWithout)} size="medium" variant="danger" />
        <ResultCard label="Total With Transfer" value={fmt(results.totalWithTransfer)} size="medium" variant="accent" />
      </div>
      <ResultCard label="Savings with Transfer" value={fmt(results.savings)} size="large" variant={results.savings > 0 ? "accent" : "danger"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Payoff (No Transfer)" value={fmtMo(results.monthsWithout)} size="small" variant="neutral" />
        <ResultCard label="Payoff (With Transfer)" value={fmtMo(results.monthsTransfer)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Transfer Fee" value={formatCurrency(results.fee)} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   11. DebtManagementCalculator
   ═══════════════════════════════════════════════════════════ */

const DMP_DEFAULTS = {
  totalDebt: 30000,
  averageRate: 20.0,
  monthlyPayment: 600,
  dmpReducedRate: 8.0,
};

export function DebtManagementCalculator() {
  const [totalDebt, setTotalDebt] = useState(DMP_DEFAULTS.totalDebt);
  const [averageRate, setAverageRate] = useState(DMP_DEFAULTS.averageRate);
  const [monthlyPayment, setMonthlyPayment] = useState(DMP_DEFAULTS.monthlyPayment);
  const [dmpReducedRate, setDmpReducedRate] = useState(DMP_DEFAULTS.dmpReducedRate);

  const results = useMemo(() => {
    const monthsCurrent = monthsToPayoff(totalDebt, averageRate, monthlyPayment);
    const intCurrent = totalInterest(totalDebt, averageRate, monthlyPayment, monthsCurrent);
    const totalPaidCurrent = monthsCurrent === Infinity ? Infinity : intCurrent + totalDebt;

    const monthsDMP = monthsToPayoff(totalDebt, dmpReducedRate, monthlyPayment);
    const intDMP = totalInterest(totalDebt, dmpReducedRate, monthlyPayment, monthsDMP);
    const totalPaidDMP = monthsDMP === Infinity ? Infinity : intDMP + totalDebt;

    const monthsSaved = monthsCurrent === Infinity || monthsDMP === Infinity ? Infinity : monthsCurrent - monthsDMP;
    const interestSaved = intCurrent === Infinity || intDMP === Infinity ? Infinity : intCurrent - intDMP;

    return { monthsCurrent, monthsDMP, intCurrent, intDMP, totalPaidCurrent, totalPaidDMP, monthsSaved, interestSaved };
  }, [totalDebt, averageRate, monthlyPayment, dmpReducedRate]);

  function resetDefaults() {
    setTotalDebt(DMP_DEFAULTS.totalDebt);
    setAverageRate(DMP_DEFAULTS.averageRate);
    setMonthlyPayment(DMP_DEFAULTS.monthlyPayment);
    setDmpReducedRate(DMP_DEFAULTS.dmpReducedRate);
  }

  const fmt = (v: number) => (v === Infinity ? "N/A" : formatCurrency(v));
  const fmtMo = (v: number) => (v === Infinity ? "Never" : `${v} months`);

  const inputs = (
    <>
      <NumberInput label="Total Debt" value={totalDebt} onChange={setTotalDebt} prefix="$" min={1000} max={100000} step={500} showSlider />
      <NumberInput label="Average Interest Rate" value={averageRate} onChange={setAverageRate} prefix="%" min={5} max={35} step={0.5} showSlider />
      <NumberInput label="Monthly Payment Available" value={monthlyPayment} onChange={setMonthlyPayment} prefix="$" min={50} max={5000} step={25} showSlider />
      <NumberInput label="DMP Reduced Rate %" value={dmpReducedRate} onChange={setDmpReducedRate} prefix="%" min={0} max={15} step={0.5} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Months (Current Rate)" value={fmtMo(results.monthsCurrent)} size="medium" variant="danger" />
        <ResultCard label="Months (DMP Rate)" value={fmtMo(results.monthsDMP)} size="medium" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Interest (Current)" value={fmt(results.intCurrent)} size="small" variant="danger" />
        <ResultCard label="Interest (DMP)" value={fmt(results.intDMP)} size="small" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Months Saved" value={results.monthsSaved === Infinity ? "N/A" : `${results.monthsSaved}`} size="small" variant="accent" />
        <ResultCard label="Interest Saved" value={fmt(results.interestSaved)} size="small" variant="accent" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Paid (Current)" value={fmt(results.totalPaidCurrent)} size="small" variant="neutral" />
        <ResultCard label="Total Paid (DMP)" value={fmt(results.totalPaidDMP)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   12. LoanComparisonCalculator
   ═══════════════════════════════════════════════════════════ */

const LOAN_COMPARE_DEFAULTS = {
  loanAmount: 25000,
  rateA: 7.5,
  termA: 60,
  rateB: 6.0,
  termB: 48,
};

export function LoanComparisonCalculator() {
  const [loanAmount, setLoanAmount] = useState(LOAN_COMPARE_DEFAULTS.loanAmount);
  const [rateA, setRateA] = useState(LOAN_COMPARE_DEFAULTS.rateA);
  const [termA, setTermA] = useState(LOAN_COMPARE_DEFAULTS.termA);
  const [rateB, setRateB] = useState(LOAN_COMPARE_DEFAULTS.rateB);
  const [termB, setTermB] = useState(LOAN_COMPARE_DEFAULTS.termB);

  const results = useMemo(() => {
    const monthlyA = pmt(loanAmount, rateA, termA);
    const totalPaidA = monthlyA * termA;
    const totalIntA = totalPaidA - loanAmount;

    const monthlyB = pmt(loanAmount, rateB, termB);
    const totalPaidB = monthlyB * termB;
    const totalIntB = totalPaidB - loanAmount;

    return { monthlyA, totalIntA, totalPaidA, monthlyB, totalIntB, totalPaidB };
  }, [loanAmount, rateA, termA, rateB, termB]);

  function resetDefaults() {
    setLoanAmount(LOAN_COMPARE_DEFAULTS.loanAmount);
    setRateA(LOAN_COMPARE_DEFAULTS.rateA);
    setTermA(LOAN_COMPARE_DEFAULTS.termA);
    setRateB(LOAN_COMPARE_DEFAULTS.rateB);
    setTermB(LOAN_COMPARE_DEFAULTS.termB);
  }

  const inputs = (
    <>
      <NumberInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} prefix="$" min={1000} max={500000} step={1000} showSlider />
      <div className="p-3 border rounded-lg space-y-3">
        <Label className="font-semibold">Loan A</Label>
        <NumberInput label="Interest Rate" value={rateA} onChange={setRateA} prefix="%" min={1} max={30} step={0.1} showSlider />
        <NumberInput label="Term (months)" value={termA} onChange={setTermA} min={6} max={360} step={6} showSlider />
      </div>
      <div className="p-3 border rounded-lg space-y-3">
        <Label className="font-semibold">Loan B</Label>
        <NumberInput label="Interest Rate" value={rateB} onChange={setRateB} prefix="%" min={1} max={30} step={0.1} showSlider />
        <NumberInput label="Term (months)" value={termB} onChange={setTermB} min={6} max={360} step={6} showSlider />
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label className="font-semibold text-center block">Loan A</Label>
          <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyA)} size="medium" />
          <ResultCard label="Total Interest" value={formatCurrency(results.totalIntA)} size="small" variant="danger" />
          <ResultCard label="Total Paid" value={formatCurrency(results.totalPaidA)} size="small" variant="neutral" />
        </div>
        <div className="space-y-3">
          <Label className="font-semibold text-center block">Loan B</Label>
          <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyB)} size="medium" />
          <ResultCard label="Total Interest" value={formatCurrency(results.totalIntB)} size="small" variant="danger" />
          <ResultCard label="Total Paid" value={formatCurrency(results.totalPaidB)} size="small" variant="neutral" />
        </div>
      </div>
      <ResultCard
        label={results.totalPaidA < results.totalPaidB ? "Loan A saves you" : "Loan B saves you"}
        value={formatCurrency(Math.abs(results.totalPaidA - results.totalPaidB))}
        size="large"
        variant="accent"
      />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   13. PayoffDateCalculator
   ═══════════════════════════════════════════════════════════ */

const PAYOFF_DATE_DEFAULTS = {
  balance: 12000,
  interestRate: 15.0,
  monthlyPayment: 350,
};

export function PayoffDateCalculator() {
  const [balance, setBalance] = useState(PAYOFF_DATE_DEFAULTS.balance);
  const [interestRate, setInterestRate] = useState(PAYOFF_DATE_DEFAULTS.interestRate);
  const [monthlyPayment, setMonthlyPayment] = useState(PAYOFF_DATE_DEFAULTS.monthlyPayment);

  const results = useMemo(() => {
    const months = monthsToPayoff(balance, interestRate, monthlyPayment);
    const totalInt = totalInterest(balance, interestRate, monthlyPayment, months);
    const totalPaid = months === Infinity ? Infinity : totalInt + balance;
    const date = payoffDate(months);

    // Also compute years and months for display
    const years = months === Infinity ? 0 : Math.floor(months / 12);
    const remainingMonths = months === Infinity ? 0 : months % 12;

    return { months, totalInt, totalPaid, date, years, remainingMonths };
  }, [balance, interestRate, monthlyPayment]);

  function resetDefaults() {
    setBalance(PAYOFF_DATE_DEFAULTS.balance);
    setInterestRate(PAYOFF_DATE_DEFAULTS.interestRate);
    setMonthlyPayment(PAYOFF_DATE_DEFAULTS.monthlyPayment);
  }

  const inputs = (
    <>
      <NumberInput label="Current Balance" value={balance} onChange={setBalance} prefix="$" min={100} max={100000} step={500} showSlider />
      <NumberInput label="Interest Rate (APR)" value={interestRate} onChange={setInterestRate} prefix="%" min={0} max={30} step={0.1} showSlider />
      <NumberInput label="Monthly Payment" value={monthlyPayment} onChange={setMonthlyPayment} prefix="$" min={25} max={10000} step={25} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const fmtDuration = results.months === Infinity
    ? "Never"
    : results.years > 0
    ? `${results.years} yr ${results.remainingMonths} mo`
    : `${results.remainingMonths} mo`;

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Payoff Date" value={results.date} size="large" variant="accent" />
      <ResultCard label="Time to Payoff" value={fmtDuration} size="medium" variant="neutral" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Months" value={results.months === Infinity ? "N/A" : `${results.months}`} size="small" variant="neutral" />
        <ResultCard label="Total Interest" value={results.totalInt === Infinity ? "N/A" : formatCurrency(results.totalInt)} size="small" variant="danger" />
      </div>
      <ResultCard label="Total Paid" value={results.totalPaid === Infinity ? "N/A" : formatCurrency(results.totalPaid)} size="medium" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
