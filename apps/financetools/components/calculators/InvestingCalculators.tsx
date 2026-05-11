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
   1. InvestmentReturnCalculator
   ═══════════════════════════════════════════════════════════ */

const INVESTMENT_RETURN_DEFAULTS = {
  initialInvestment: 10000,
  annualContribution: 5000,
  returnRate: 8,
  years: 20,
};

export function InvestmentReturnCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(INVESTMENT_RETURN_DEFAULTS.initialInvestment);
  const [annualContribution, setAnnualContribution] = useState(INVESTMENT_RETURN_DEFAULTS.annualContribution);
  const [returnRate, setReturnRate] = useState(INVESTMENT_RETURN_DEFAULTS.returnRate);
  const [years, setYears] = useState(INVESTMENT_RETURN_DEFAULTS.years);

  const results = useMemo(() => {
    const r = returnRate / 100;
    let balance = initialInvestment;
    for (let i = 0; i < years; i++) {
      balance = balance * (1 + r) + annualContribution;
    }
    const totalInvested = initialInvestment + annualContribution * years;
    const totalReturn = balance - totalInvested;
    const annualizedReturn = years > 0 && totalInvested > 0
      ? (Math.pow(balance / initialInvestment, 1 / years) - 1) * 100
      : 0;
    return { finalValue: balance, totalInvested, totalReturn, annualizedReturn };
  }, [initialInvestment, annualContribution, returnRate, years]);

  function resetDefaults() {
    setInitialInvestment(INVESTMENT_RETURN_DEFAULTS.initialInvestment);
    setAnnualContribution(INVESTMENT_RETURN_DEFAULTS.annualContribution);
    setReturnRate(INVESTMENT_RETURN_DEFAULTS.returnRate);
    setYears(INVESTMENT_RETURN_DEFAULTS.years);
  }

  const inputs = (
    <>
      <NumberInput label="Initial Investment" value={initialInvestment} onChange={setInitialInvestment} prefix="$" min={0} max={10000000} step={1000} showSlider />
      <NumberInput label="Annual Contribution" value={annualContribution} onChange={setAnnualContribution} prefix="$" min={0} max={500000} step={500} showSlider />
      <NumberInput label="Annual Return Rate" value={returnRate} onChange={setReturnRate} prefix="%" min={0} max={30} step={0.5} showSlider />
      <NumberInput label="Investment Period (years)" value={years} onChange={setYears} min={1} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Final Value" value={formatCurrency(results.finalValue)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Invested" value={formatCurrency(results.totalInvested)} size="small" variant="neutral" />
        <ResultCard label="Total Return" value={formatCurrency(results.totalReturn)} size="small" variant="accent" />
      </div>
      <ResultCard label="Annualized Return" value={`${results.annualizedReturn.toFixed(2)}%`} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   2. StockReturnCalculator
   ═══════════════════════════════════════════════════════════ */

const STOCK_RETURN_DEFAULTS = {
  purchasePrice: 50,
  shares: 100,
  salePrice: 75,
  dividends: 500,
  holdingPeriod: 3,
};

export function StockReturnCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(STOCK_RETURN_DEFAULTS.purchasePrice);
  const [shares, setShares] = useState(STOCK_RETURN_DEFAULTS.shares);
  const [salePrice, setSalePrice] = useState(STOCK_RETURN_DEFAULTS.salePrice);
  const [dividends, setDividends] = useState(STOCK_RETURN_DEFAULTS.dividends);
  const [holdingPeriod, setHoldingPeriod] = useState(STOCK_RETURN_DEFAULTS.holdingPeriod);

  const results = useMemo(() => {
    const totalCost = purchasePrice * shares;
    const totalRevenue = salePrice * shares + dividends;
    const totalReturnDollar = totalRevenue - totalCost;
    const totalReturnPct = totalCost > 0 ? (totalReturnDollar / totalCost) * 100 : 0;
    const annualizedReturn = holdingPeriod > 0 && totalCost > 0
      ? (Math.pow(totalRevenue / totalCost, 1 / holdingPeriod) - 1) * 100
      : 0;
    const profit = totalReturnDollar;
    return { totalReturnDollar, totalReturnPct, annualizedReturn, profit };
  }, [purchasePrice, shares, salePrice, dividends, holdingPeriod]);

  function resetDefaults() {
    setPurchasePrice(STOCK_RETURN_DEFAULTS.purchasePrice);
    setShares(STOCK_RETURN_DEFAULTS.shares);
    setSalePrice(STOCK_RETURN_DEFAULTS.salePrice);
    setDividends(STOCK_RETURN_DEFAULTS.dividends);
    setHoldingPeriod(STOCK_RETURN_DEFAULTS.holdingPeriod);
  }

  const inputs = (
    <>
      <NumberInput label="Purchase Price per Share" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={0.01} max={100000} step={1} />
      <NumberInput label="Shares Bought" value={shares} onChange={setShares} min={1} max={100000} step={1} />
      <NumberInput label="Sale Price per Share" value={salePrice} onChange={setSalePrice} prefix="$" min={0.01} max={100000} step={1} />
      <NumberInput label="Dividends Received" value={dividends} onChange={setDividends} prefix="$" min={0} max={1000000} step={50} />
      <NumberInput label="Holding Period (years)" value={holdingPeriod} onChange={setHoldingPeriod} min={0.25} max={50} step={0.25} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Total Return" value={formatCurrency(results.totalReturnDollar)} size="large" variant={results.totalReturnDollar >= 0 ? "accent" : "danger"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Return %" value={`${results.totalReturnPct.toFixed(2)}%`} size="small" variant={results.totalReturnPct >= 0 ? "accent" : "danger"} />
        <ResultCard label="Annualized Return" value={`${results.annualizedReturn.toFixed(2)}%`} size="small" variant="neutral" />
      </div>
      <ResultCard label="Profit" value={formatCurrency(results.profit)} size="small" variant={results.profit >= 0 ? "accent" : "danger"} />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   3. BondYieldCalculator
   ═══════════════════════════════════════════════════════════ */

const BOND_YIELD_DEFAULTS = {
  faceValue: 1000,
  purchasePrice: 950,
  couponRate: 5,
  yearsToMaturity: 10,
};

export function BondYieldCalculator() {
  const [faceValue, setFaceValue] = useState(BOND_YIELD_DEFAULTS.faceValue);
  const [purchasePrice, setPurchasePrice] = useState(BOND_YIELD_DEFAULTS.purchasePrice);
  const [couponRate, setCouponRate] = useState(BOND_YIELD_DEFAULTS.couponRate);
  const [yearsToMaturity, setYearsToMaturity] = useState(BOND_YIELD_DEFAULTS.yearsToMaturity);

  const results = useMemo(() => {
    const annualCoupon = faceValue * (couponRate / 100);
    const currentYield = purchasePrice > 0 ? (annualCoupon / purchasePrice) * 100 : 0;
    // Approximate YTM formula: (C + (F - P) / n) / ((F + P) / 2)
    const ytm = yearsToMaturity > 0
      ? ((annualCoupon + (faceValue - purchasePrice) / yearsToMaturity) / ((faceValue + purchasePrice) / 2)) * 100
      : 0;
    const totalReturnAtMaturity = annualCoupon * yearsToMaturity + (faceValue - purchasePrice);
    return { currentYield, ytm, annualCoupon, totalReturnAtMaturity };
  }, [faceValue, purchasePrice, couponRate, yearsToMaturity]);

  function resetDefaults() {
    setFaceValue(BOND_YIELD_DEFAULTS.faceValue);
    setPurchasePrice(BOND_YIELD_DEFAULTS.purchasePrice);
    setCouponRate(BOND_YIELD_DEFAULTS.couponRate);
    setYearsToMaturity(BOND_YIELD_DEFAULTS.yearsToMaturity);
  }

  const inputs = (
    <>
      <NumberInput label="Face Value" value={faceValue} onChange={setFaceValue} prefix="$" min={100} max={100000} step={100} />
      <NumberInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" min={100} max={100000} step={10} />
      <NumberInput label="Coupon Rate" value={couponRate} onChange={setCouponRate} prefix="%" min={0} max={20} step={0.25} showSlider />
      <NumberInput label="Years to Maturity" value={yearsToMaturity} onChange={setYearsToMaturity} min={1} max={30} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Current Yield" value={`${results.currentYield.toFixed(2)}%`} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Yield to Maturity (approx)" value={`${results.ytm.toFixed(2)}%`} size="small" variant="accent" />
        <ResultCard label="Annual Coupon Payment" value={formatCurrency(results.annualCoupon)} size="small" variant="neutral" />
      </div>
      <ResultCard label="Total Return at Maturity" value={formatCurrency(results.totalReturnAtMaturity)} size="small" variant="accent" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   4. DividendCalculator
   ═══════════════════════════════════════════════════════════ */

const DIVIDEND_DEFAULTS = {
  investmentAmount: 50000,
  dividendYield: 3.5,
  dividendGrowthRate: 5,
  years: 20,
  drip: true,
};

export function DividendCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(DIVIDEND_DEFAULTS.investmentAmount);
  const [dividendYield, setDividendYield] = useState(DIVIDEND_DEFAULTS.dividendYield);
  const [dividendGrowthRate, setDividendGrowthRate] = useState(DIVIDEND_DEFAULTS.dividendGrowthRate);
  const [years, setYears] = useState(DIVIDEND_DEFAULTS.years);
  const [drip, setDrip] = useState(DIVIDEND_DEFAULTS.drip);

  const results = useMemo(() => {
    const annualDividendYear1 = investmentAmount * (dividendYield / 100);
    const projectedDividendYield = dividendYield * Math.pow(1 + dividendGrowthRate / 100, years) / 100;

    // Without DRIP: portfolio value stays same, dividends grow with growth rate
    let totalDividendsNoDrip = 0;
    let currentYieldNoDrip = dividendYield / 100;
    for (let i = 0; i < years; i++) {
      totalDividendsNoDrip += investmentAmount * currentYieldNoDrip;
      currentYieldNoDrip *= (1 + dividendGrowthRate / 100);
    }
    // With DRIP: reinvest dividends, portfolio grows
    let portfolioDrip = investmentAmount;
    let totalDividendsDrip = 0;
    let yieldRate = dividendYield / 100;
    for (let i = 0; i < years; i++) {
      const div = portfolioDrip * yieldRate;
      totalDividendsDrip += div;
      portfolioDrip += div;
      yieldRate *= (1 + dividendGrowthRate / 100);
    }

    const projectedAnnualDividend = investmentAmount * projectedDividendYield;

    return {
      annualDividendYear1,
      projectedAnnualDividend,
      totalDividends: drip ? totalDividendsDrip : totalDividendsNoDrip,
      portfolioWithDrip: portfolioDrip,
      portfolioWithoutDrip: investmentAmount,
    };
  }, [investmentAmount, dividendYield, dividendGrowthRate, years, drip]);

  function resetDefaults() {
    setInvestmentAmount(DIVIDEND_DEFAULTS.investmentAmount);
    setDividendYield(DIVIDEND_DEFAULTS.dividendYield);
    setDividendGrowthRate(DIVIDEND_DEFAULTS.dividendGrowthRate);
    setYears(DIVIDEND_DEFAULTS.years);
    setDrip(DIVIDEND_DEFAULTS.drip);
  }

  const inputs = (
    <>
      <NumberInput label="Investment Amount" value={investmentAmount} onChange={setInvestmentAmount} prefix="$" min={1000} max={10000000} step={1000} showSlider />
      <NumberInput label="Dividend Yield" value={dividendYield} onChange={setDividendYield} prefix="%" min={0.1} max={15} step={0.1} showSlider />
      <NumberInput label="Dividend Growth Rate" value={dividendGrowthRate} onChange={setDividendGrowthRate} prefix="%" min={0} max={20} step={0.5} showSlider />
      <NumberInput label="Years" value={years} onChange={setYears} min={1} max={50} step={1} showSlider />
      <div className="space-y-2">
        <Label className="text-sm font-medium">DRIP (Reinvest Dividends)</Label>
        <Select value={drip ? "yes" : "no"} onValueChange={(v) => setDrip(v === "yes")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes - Reinvest</SelectItem>
            <SelectItem value="no">No - Take Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Annual Dividend (Year 1)" value={formatCurrency(results.annualDividendYear1)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label={`Projected Annual Dividend (Year ${years})`} value={formatCurrency(results.projectedAnnualDividend)} size="small" variant="accent" />
        <ResultCard label="Total Dividends Received" value={formatCurrency(results.totalDividends)} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Portfolio Value (with DRIP)" value={formatCurrency(results.portfolioWithDrip)} size="small" variant="accent" />
        <ResultCard label="Portfolio Value (without DRIP)" value={formatCurrency(results.portfolioWithoutDrip)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   5. DollarCostAveragingCalculator
   ═══════════════════════════════════════════════════════════ */

const DCA_DEFAULTS = {
  monthlyInvestment: 500,
  annualReturn: 8,
  years: 20,
};

export function DollarCostAveragingCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(DCA_DEFAULTS.monthlyInvestment);
  const [annualReturn, setAnnualReturn] = useState(DCA_DEFAULTS.annualReturn);
  const [years, setYears] = useState(DCA_DEFAULTS.years);

  const results = useMemo(() => {
    const totalInvested = monthlyInvestment * 12 * years;
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = years * 12;

    // DCA: invest monthly
    let dcaValue = 0;
    for (let i = 0; i < totalMonths; i++) {
      dcaValue = (dcaValue + monthlyInvestment) * (1 + monthlyRate);
    }

    // Lump sum: invest all upfront
    const lumpSumValue = totalInvested * Math.pow(1 + annualReturn / 100, years);

    const comparison = lumpSumValue - dcaValue;

    return { dcaValue, lumpSumValue, totalInvested, comparison };
  }, [monthlyInvestment, annualReturn, years]);

  function resetDefaults() {
    setMonthlyInvestment(DCA_DEFAULTS.monthlyInvestment);
    setAnnualReturn(DCA_DEFAULTS.annualReturn);
    setYears(DCA_DEFAULTS.years);
  }

  const inputs = (
    <>
      <NumberInput label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} prefix="$" min={50} max={50000} step={50} showSlider />
      <NumberInput label="Annual Return Rate" value={annualReturn} onChange={setAnnualReturn} prefix="%" min={0} max={25} step={0.5} showSlider />
      <NumberInput label="Investment Period (years)" value={years} onChange={setYears} min={1} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="DCA Final Value" value={formatCurrency(results.dcaValue)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Lump Sum Final Value" value={formatCurrency(results.lumpSumValue)} size="small" variant="accent" />
        <ResultCard label="Total Invested" value={formatCurrency(results.totalInvested)} size="small" variant="neutral" />
      </div>
      <ResultCard label={results.comparison >= 0 ? "Lump Sum Advantage" : "DCA Advantage"} value={formatCurrency(Math.abs(results.comparison))} size="small" variant="neutral" />
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   6. PortfolioRebalancingCalculator
   ═══════════════════════════════════════════════════════════ */

const REBALANCE_DEFAULTS = {
  totalValue: 100000,
  currentStocks: 70,
  currentBonds: 20,
  currentCash: 10,
  targetStocks: 60,
  targetBonds: 30,
  targetCash: 10,
};

export function PortfolioRebalancingCalculator() {
  const [totalValue, setTotalValue] = useState(REBALANCE_DEFAULTS.totalValue);
  const [currentStocks, setCurrentStocks] = useState(REBALANCE_DEFAULTS.currentStocks);
  const [currentBonds, setCurrentBonds] = useState(REBALANCE_DEFAULTS.currentBonds);
  const [currentCash, setCurrentCash] = useState(REBALANCE_DEFAULTS.currentCash);
  const [targetStocks, setTargetStocks] = useState(REBALANCE_DEFAULTS.targetStocks);
  const [targetBonds, setTargetBonds] = useState(REBALANCE_DEFAULTS.targetBonds);
  const [targetCash, setTargetCash] = useState(REBALANCE_DEFAULTS.targetCash);

  const results = useMemo(() => {
    const currentStocksDollar = totalValue * (currentStocks / 100);
    const currentBondsDollar = totalValue * (currentBonds / 100);
    const currentCashDollar = totalValue * (currentCash / 100);
    const targetStocksDollar = totalValue * (targetStocks / 100);
    const targetBondsDollar = totalValue * (targetBonds / 100);
    const targetCashDollar = totalValue * (targetCash / 100);
    const stocksChange = targetStocksDollar - currentStocksDollar;
    const bondsChange = targetBondsDollar - currentBondsDollar;
    const cashChange = targetCashDollar - currentCashDollar;
    return {
      currentStocksDollar, currentBondsDollar, currentCashDollar,
      targetStocksDollar, targetBondsDollar, targetCashDollar,
      stocksChange, bondsChange, cashChange,
    };
  }, [totalValue, currentStocks, currentBonds, currentCash, targetStocks, targetBonds, targetCash]);

  function resetDefaults() {
    setTotalValue(REBALANCE_DEFAULTS.totalValue);
    setCurrentStocks(REBALANCE_DEFAULTS.currentStocks);
    setCurrentBonds(REBALANCE_DEFAULTS.currentBonds);
    setCurrentCash(REBALANCE_DEFAULTS.currentCash);
    setTargetStocks(REBALANCE_DEFAULTS.targetStocks);
    setTargetBonds(REBALANCE_DEFAULTS.targetBonds);
    setTargetCash(REBALANCE_DEFAULTS.targetCash);
  }

  function formatChange(v: number) {
    return v >= 0 ? `Buy ${formatCurrency(v)}` : `Sell ${formatCurrency(Math.abs(v))}`;
  }

  const inputs = (
    <>
      <NumberInput label="Total Portfolio Value" value={totalValue} onChange={setTotalValue} prefix="$" min={1000} max={50000000} step={5000} showSlider />
      <p className="text-sm font-medium text-muted-foreground pt-2">Current Allocation</p>
      <NumberInput label="Stocks %" value={currentStocks} onChange={setCurrentStocks} prefix="%" min={0} max={100} step={1} showSlider />
      <NumberInput label="Bonds %" value={currentBonds} onChange={setCurrentBonds} prefix="%" min={0} max={100} step={1} showSlider />
      <NumberInput label="Cash %" value={currentCash} onChange={setCurrentCash} prefix="%" min={0} max={100} step={1} showSlider />
      <p className="text-sm font-medium text-muted-foreground pt-2">Target Allocation</p>
      <NumberInput label="Stocks %" value={targetStocks} onChange={setTargetStocks} prefix="%" min={0} max={100} step={1} showSlider />
      <NumberInput label="Bonds %" value={targetBonds} onChange={setTargetBonds} prefix="%" min={0} max={100} step={1} showSlider />
      <NumberInput label="Cash %" value={targetCash} onChange={setTargetCash} prefix="%" min={0} max={100} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <p className="text-sm font-medium">Rebalancing Actions</p>
      <div className="grid grid-cols-1 gap-4">
        <ResultCard label="Stocks" value={formatChange(results.stocksChange)} size="small" variant={results.stocksChange >= 0 ? "accent" : "danger"} />
        <ResultCard label="Bonds" value={formatChange(results.bondsChange)} size="small" variant={results.bondsChange >= 0 ? "accent" : "danger"} />
        <ResultCard label="Cash" value={formatChange(results.cashChange)} size="small" variant={results.cashChange >= 0 ? "accent" : "danger"} />
      </div>
      <p className="text-sm font-medium pt-2">Current vs Target ($)</p>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Current Stocks" value={formatCurrency(results.currentStocksDollar)} size="small" variant="neutral" />
        <ResultCard label="Target Stocks" value={formatCurrency(results.targetStocksDollar)} size="small" variant="neutral" />
        <ResultCard label="Current Bonds" value={formatCurrency(results.currentBondsDollar)} size="small" variant="neutral" />
        <ResultCard label="Target Bonds" value={formatCurrency(results.targetBondsDollar)} size="small" variant="neutral" />
        <ResultCard label="Current Cash" value={formatCurrency(results.currentCashDollar)} size="small" variant="neutral" />
        <ResultCard label="Target Cash" value={formatCurrency(results.targetCashDollar)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   7. RealReturnCalculator
   ═══════════════════════════════════════════════════════════ */

const REAL_RETURN_DEFAULTS = {
  nominalReturn: 8,
  inflationRate: 3,
};

export function RealReturnCalculator() {
  const [nominalReturn, setNominalReturn] = useState(REAL_RETURN_DEFAULTS.nominalReturn);
  const [inflationRate, setInflationRate] = useState(REAL_RETURN_DEFAULTS.inflationRate);

  const results = useMemo(() => {
    const realReturn = ((1 + nominalReturn / 100) / (1 + inflationRate / 100) - 1) * 100;
    const base = 10000;
    const nominal10 = base * Math.pow(1 + nominalReturn / 100, 10);
    const nominal20 = base * Math.pow(1 + nominalReturn / 100, 20);
    const nominal30 = base * Math.pow(1 + nominalReturn / 100, 30);
    const real10 = base * Math.pow(1 + realReturn / 100, 10);
    const real20 = base * Math.pow(1 + realReturn / 100, 20);
    const real30 = base * Math.pow(1 + realReturn / 100, 30);
    return { realReturn, nominal10, nominal20, nominal30, real10, real20, real30 };
  }, [nominalReturn, inflationRate]);

  function resetDefaults() {
    setNominalReturn(REAL_RETURN_DEFAULTS.nominalReturn);
    setInflationRate(REAL_RETURN_DEFAULTS.inflationRate);
  }

  const inputs = (
    <>
      <NumberInput label="Nominal Return Rate" value={nominalReturn} onChange={setNominalReturn} prefix="%" min={0} max={30} step={0.5} showSlider />
      <NumberInput label="Inflation Rate" value={inflationRate} onChange={setInflationRate} prefix="%" min={0} max={15} step={0.5} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Real Return" value={`${results.realReturn.toFixed(2)}%`} size="large" />
      <p className="text-sm font-medium">$10,000 Growth (Nominal vs Real)</p>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="10yr Nominal" value={formatCurrency(results.nominal10)} size="small" variant="neutral" />
        <ResultCard label="10yr Real" value={formatCurrency(results.real10)} size="small" variant="accent" />
        <ResultCard label="20yr Nominal" value={formatCurrency(results.nominal20)} size="small" variant="neutral" />
        <ResultCard label="20yr Real" value={formatCurrency(results.real20)} size="small" variant="accent" />
        <ResultCard label="30yr Nominal" value={formatCurrency(results.nominal30)} size="small" variant="neutral" />
        <ResultCard label="30yr Real" value={formatCurrency(results.real30)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   8. IndexFundCalculator
   ═══════════════════════════════════════════════════════════ */

const INDEX_FUND_DEFAULTS = {
  initialInvestment: 10000,
  monthlyContribution: 500,
  expectedReturn: 8,
  expenseRatio: 0.2,
  years: 30,
};

export function IndexFundCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(INDEX_FUND_DEFAULTS.initialInvestment);
  const [monthlyContribution, setMonthlyContribution] = useState(INDEX_FUND_DEFAULTS.monthlyContribution);
  const [expectedReturn, setExpectedReturn] = useState(INDEX_FUND_DEFAULTS.expectedReturn);
  const [expenseRatio, setExpenseRatio] = useState(INDEX_FUND_DEFAULTS.expenseRatio);
  const [years, setYears] = useState(INDEX_FUND_DEFAULTS.years);

  const results = useMemo(() => {
    const monthlyRateWithFee = (expectedReturn - expenseRatio) / 100 / 12;
    const monthlyRateNoFee = expectedReturn / 100 / 12;
    const totalMonths = years * 12;

    let balanceWithFee = initialInvestment;
    let balanceNoFee = initialInvestment;
    for (let i = 0; i < totalMonths; i++) {
      balanceWithFee = (balanceWithFee + monthlyContribution) * (1 + monthlyRateWithFee);
      balanceNoFee = (balanceNoFee + monthlyContribution) * (1 + monthlyRateNoFee);
    }

    const feesLost = balanceNoFee - balanceWithFee;

    return { finalValue: balanceWithFee, feesLost, noFeeValue: balanceNoFee };
  }, [initialInvestment, monthlyContribution, expectedReturn, expenseRatio, years]);

  function resetDefaults() {
    setInitialInvestment(INDEX_FUND_DEFAULTS.initialInvestment);
    setMonthlyContribution(INDEX_FUND_DEFAULTS.monthlyContribution);
    setExpectedReturn(INDEX_FUND_DEFAULTS.expectedReturn);
    setExpenseRatio(INDEX_FUND_DEFAULTS.expenseRatio);
    setYears(INDEX_FUND_DEFAULTS.years);
  }

  const inputs = (
    <>
      <NumberInput label="Initial Investment" value={initialInvestment} onChange={setInitialInvestment} prefix="$" min={0} max={10000000} step={1000} showSlider />
      <NumberInput label="Monthly Contribution" value={monthlyContribution} onChange={setMonthlyContribution} prefix="$" min={0} max={50000} step={50} showSlider />
      <NumberInput label="Expected Annual Return" value={expectedReturn} onChange={setExpectedReturn} prefix="%" min={0} max={25} step={0.5} showSlider />
      <NumberInput label="Expense Ratio" value={expenseRatio} onChange={setExpenseRatio} prefix="%" min={0} max={3} step={0.01} showSlider />
      <NumberInput label="Years" value={years} onChange={setYears} min={1} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Final Value (after fees)" value={formatCurrency(results.finalValue)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="$ Lost to Fees" value={formatCurrency(results.feesLost)} size="small" variant="danger" />
        <ResultCard label="Value with 0% Expense Ratio" value={formatCurrency(results.noFeeValue)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   9. EtfExpenseRatioCalculator
   ═══════════════════════════════════════════════════════════ */

const ETF_EXPENSE_DEFAULTS = {
  investmentAmount: 100000,
  expenseRatioA: 0.03,
  expenseRatioB: 0.75,
  expectedReturn: 8,
  years: 30,
};

export function EtfExpenseRatioCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(ETF_EXPENSE_DEFAULTS.investmentAmount);
  const [expenseRatioA, setExpenseRatioA] = useState(ETF_EXPENSE_DEFAULTS.expenseRatioA);
  const [expenseRatioB, setExpenseRatioB] = useState(ETF_EXPENSE_DEFAULTS.expenseRatioB);
  const [expectedReturn, setExpectedReturn] = useState(ETF_EXPENSE_DEFAULTS.expectedReturn);
  const [years, setYears] = useState(ETF_EXPENSE_DEFAULTS.years);

  const results = useMemo(() => {
    const netReturnA = (expectedReturn - expenseRatioA) / 100;
    const netReturnB = (expectedReturn - expenseRatioB) / 100;
    const finalA = investmentAmount * Math.pow(1 + netReturnA, years);
    const finalB = investmentAmount * Math.pow(1 + netReturnB, years);
    const feeDifference = finalA - finalB;
    const annualFeeA = investmentAmount * (expenseRatioA / 100);
    const annualFeeB = investmentAmount * (expenseRatioB / 100);
    return { finalA, finalB, feeDifference, annualFeeA, annualFeeB };
  }, [investmentAmount, expenseRatioA, expenseRatioB, expectedReturn, years]);

  function resetDefaults() {
    setInvestmentAmount(ETF_EXPENSE_DEFAULTS.investmentAmount);
    setExpenseRatioA(ETF_EXPENSE_DEFAULTS.expenseRatioA);
    setExpenseRatioB(ETF_EXPENSE_DEFAULTS.expenseRatioB);
    setExpectedReturn(ETF_EXPENSE_DEFAULTS.expectedReturn);
    setYears(ETF_EXPENSE_DEFAULTS.years);
  }

  const inputs = (
    <>
      <NumberInput label="Investment Amount" value={investmentAmount} onChange={setInvestmentAmount} prefix="$" min={1000} max={10000000} step={5000} showSlider />
      <NumberInput label="Fund A Expense Ratio" value={expenseRatioA} onChange={setExpenseRatioA} prefix="%" min={0} max={3} step={0.01} showSlider />
      <NumberInput label="Fund B Expense Ratio" value={expenseRatioB} onChange={setExpenseRatioB} prefix="%" min={0} max={3} step={0.01} showSlider />
      <NumberInput label="Expected Annual Return" value={expectedReturn} onChange={setExpectedReturn} prefix="%" min={0} max={25} step={0.5} showSlider />
      <NumberInput label="Years" value={years} onChange={setYears} min={1} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Fund A Final Value" value={formatCurrency(results.finalA)} size="large" variant="accent" />
        <ResultCard label="Fund B Final Value" value={formatCurrency(results.finalB)} size="large" variant="neutral" />
      </div>
      <ResultCard label="Fee Difference (A - B)" value={formatCurrency(results.feeDifference)} size="small" variant="accent" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Fund A Annual Fee (Year 1)" value={formatCurrency(results.annualFeeA)} size="small" variant="neutral" />
        <ResultCard label="Fund B Annual Fee (Year 1)" value={formatCurrency(results.annualFeeB)} size="small" variant="neutral" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   10. RuleOf72Calculator
   ═══════════════════════════════════════════════════════════ */

const RULE72_DEFAULTS = {
  interestRate: 8,
  mode: "rate" as "rate" | "years",
  yearsToDouble: 9,
};

export function RuleOf72Calculator() {
  const [interestRate, setInterestRate] = useState(RULE72_DEFAULTS.interestRate);
  const [mode, setMode] = useState<"rate" | "years">(RULE72_DEFAULTS.mode);
  const [yearsToDouble, setYearsToDouble] = useState(RULE72_DEFAULTS.yearsToDouble);

  const results = useMemo(() => {
    if (mode === "rate") {
      const yrs = interestRate > 0 ? 72 / interestRate : 0;
      const x1 = 10000;
      const x2 = x1 * 2;
      const x4 = x1 * 4;
      const x8 = x1 * 8;
      return {
        yearsToDouble: yrs,
        rateNeeded: interestRate,
        doubling: [
          { label: "1x ($10,000)", years: 0, value: x1 },
          { label: "2x ($20,000)", years: yrs, value: x2 },
          { label: "4x ($40,000)", years: yrs * 2, value: x4 },
          { label: "8x ($80,000)", years: yrs * 3, value: x8 },
        ],
      };
    } else {
      const rate = yearsToDouble > 0 ? 72 / yearsToDouble : 0;
      const x1 = 10000;
      return {
        yearsToDouble,
        rateNeeded: rate,
        doubling: [
          { label: "1x ($10,000)", years: 0, value: x1 },
          { label: "2x ($20,000)", years: yearsToDouble, value: x1 * 2 },
          { label: "4x ($40,000)", years: yearsToDouble * 2, value: x1 * 4 },
          { label: "8x ($80,000)", years: yearsToDouble * 3, value: x1 * 8 },
        ],
      };
    }
  }, [interestRate, mode, yearsToDouble]);

  function resetDefaults() {
    setInterestRate(RULE72_DEFAULTS.interestRate);
    setMode(RULE72_DEFAULTS.mode);
    setYearsToDouble(RULE72_DEFAULTS.yearsToDouble);
  }

  const inputs = (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Calculate By</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as "rate" | "years")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rate">I know the interest rate</SelectItem>
            <SelectItem value="years">I know years to double</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {mode === "rate" ? (
        <NumberInput label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="%" min={0.5} max={36} step={0.5} showSlider />
      ) : (
        <NumberInput label="Years to Double" value={yearsToDouble} onChange={setYearsToDouble} min={1} max={72} step={1} showSlider />
      )}
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Years to Double" value={`${results.yearsToDouble.toFixed(1)} years`} size="large" />
        <ResultCard label="Rate Needed" value={`${results.rateNeeded.toFixed(2)}%`} size="large" />
      </div>
      <p className="text-sm font-medium">Doubling Timeline ($10,000 start)</p>
      <div className="grid grid-cols-2 gap-4">
        {results.doubling.map((d) => (
          <ResultCard key={d.label} label={`${d.label} at year ${d.years.toFixed(1)}`} value={formatCurrency(d.value)} size="small" variant="neutral" />
        ))}
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   11. InvestmentGrowthCalculator
   ═══════════════════════════════════════════════════════════ */

const GROWTH_DEFAULTS = {
  startingAmount: 10000,
  monthlyAddition: 500,
  annualReturn: 8,
  years: 20,
};

export function InvestmentGrowthCalculator() {
  const [startingAmount, setStartingAmount] = useState(GROWTH_DEFAULTS.startingAmount);
  const [monthlyAddition, setMonthlyAddition] = useState(GROWTH_DEFAULTS.monthlyAddition);
  const [annualReturn, setAnnualReturn] = useState(GROWTH_DEFAULTS.annualReturn);
  const [years, setYears] = useState(GROWTH_DEFAULTS.years);
  const [showAll, setShowAll] = useState(false);

  const results = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;
    const yearlyData: { year: number; contributions: number; interest: number; balance: number }[] = [];
    let balance = startingAmount;
    let totalContributions = startingAmount;
    let totalInterest = 0;

    for (let y = 1; y <= years; y++) {
      let yearInterest = 0;
      for (let m = 0; m < 12; m++) {
        const interest = balance * monthlyRate;
        yearInterest += interest;
        balance += interest + monthlyAddition;
      }
      totalContributions += monthlyAddition * 12;
      totalInterest += yearInterest;
      yearlyData.push({
        year: y,
        contributions: totalContributions,
        interest: totalInterest,
        balance,
      });
    }

    return { finalBalance: balance, totalContributions, totalInterest, yearlyData };
  }, [startingAmount, monthlyAddition, annualReturn, years]);

  function resetDefaults() {
    setStartingAmount(GROWTH_DEFAULTS.startingAmount);
    setMonthlyAddition(GROWTH_DEFAULTS.monthlyAddition);
    setAnnualReturn(GROWTH_DEFAULTS.annualReturn);
    setYears(GROWTH_DEFAULTS.years);
    setShowAll(false);
  }

  const displayData = showAll ? results.yearlyData : results.yearlyData.slice(0, 10);

  const inputs = (
    <>
      <NumberInput label="Starting Amount" value={startingAmount} onChange={setStartingAmount} prefix="$" min={0} max={10000000} step={1000} showSlider />
      <NumberInput label="Monthly Addition" value={monthlyAddition} onChange={setMonthlyAddition} prefix="$" min={0} max={50000} step={50} showSlider />
      <NumberInput label="Annual Return Rate" value={annualReturn} onChange={setAnnualReturn} prefix="%" min={0} max={25} step={0.5} showSlider />
      <NumberInput label="Years" value={years} onChange={setYears} min={1} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Final Balance" value={formatCurrency(results.finalBalance)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Contributions" value={formatCurrency(results.totalContributions)} size="small" variant="neutral" />
        <ResultCard label="Total Interest" value={formatCurrency(results.totalInterest)} size="small" variant="accent" />
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Year-by-Year Breakdown</p>
        <div className="overflow-auto max-h-64 rounded border">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="text-left p-2">Year</th>
                <th className="text-right p-2">Contributions</th>
                <th className="text-right p-2">Interest</th>
                <th className="text-right p-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row) => (
                <tr key={row.year} className="border-t">
                  <td className="p-2">{row.year}</td>
                  <td className="text-right p-2">{formatCurrency(row.contributions)}</td>
                  <td className="text-right p-2">{formatCurrency(row.interest)}</td>
                  <td className="text-right p-2">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {years > 10 && (
          <Button variant="link" onClick={() => setShowAll(!showAll)} className="text-sm px-0 mt-1">
            {showAll ? "Show first 10 years" : `Show all ${years} years`}
          </Button>
        )}
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   12. StockProfitCalculator
   ═══════════════════════════════════════════════════════════ */

const STOCK_PROFIT_DEFAULTS = {
  buyPrice: 50,
  sellPrice: 75,
  shares: 100,
  commissionPerTrade: 5,
  capitalGainsTaxRate: 15,
};

export function StockProfitCalculator() {
  const [buyPrice, setBuyPrice] = useState(STOCK_PROFIT_DEFAULTS.buyPrice);
  const [sellPrice, setSellPrice] = useState(STOCK_PROFIT_DEFAULTS.sellPrice);
  const [shares, setShares] = useState(STOCK_PROFIT_DEFAULTS.shares);
  const [commissionPerTrade, setCommissionPerTrade] = useState(STOCK_PROFIT_DEFAULTS.commissionPerTrade);
  const [capitalGainsTaxRate, setCapitalGainsTaxRate] = useState(STOCK_PROFIT_DEFAULTS.capitalGainsTaxRate);

  const results = useMemo(() => {
    const totalCost = buyPrice * shares;
    const totalRevenue = sellPrice * shares;
    const grossProfit = totalRevenue - totalCost;
    const totalCommissions = commissionPerTrade * 2; // buy + sell
    const taxableGain = Math.max(0, grossProfit - totalCommissions);
    const tax = taxableGain * (capitalGainsTaxRate / 100);
    const netProfit = grossProfit - totalCommissions - tax;
    const returnPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    return { grossProfit, totalCommissions, tax, netProfit, returnPct };
  }, [buyPrice, sellPrice, shares, commissionPerTrade, capitalGainsTaxRate]);

  function resetDefaults() {
    setBuyPrice(STOCK_PROFIT_DEFAULTS.buyPrice);
    setSellPrice(STOCK_PROFIT_DEFAULTS.sellPrice);
    setShares(STOCK_PROFIT_DEFAULTS.shares);
    setCommissionPerTrade(STOCK_PROFIT_DEFAULTS.commissionPerTrade);
    setCapitalGainsTaxRate(STOCK_PROFIT_DEFAULTS.capitalGainsTaxRate);
  }

  const inputs = (
    <>
      <NumberInput label="Buy Price per Share" value={buyPrice} onChange={setBuyPrice} prefix="$" min={0.01} max={100000} step={1} />
      <NumberInput label="Sell Price per Share" value={sellPrice} onChange={setSellPrice} prefix="$" min={0.01} max={100000} step={1} />
      <NumberInput label="Number of Shares" value={shares} onChange={setShares} min={1} max={100000} step={1} />
      <NumberInput label="Commission per Trade" value={commissionPerTrade} onChange={setCommissionPerTrade} prefix="$" min={0} max={100} step={1} />
      <NumberInput label="Capital Gains Tax Rate" value={capitalGainsTaxRate} onChange={setCapitalGainsTaxRate} prefix="%" min={0} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Net Profit" value={formatCurrency(results.netProfit)} size="large" variant={results.netProfit >= 0 ? "accent" : "danger"} />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Gross Profit" value={formatCurrency(results.grossProfit)} size="small" variant="neutral" />
        <ResultCard label="Return %" value={`${results.returnPct.toFixed(2)}%`} size="small" variant={results.returnPct >= 0 ? "accent" : "danger"} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Commissions" value={formatCurrency(results.totalCommissions)} size="small" variant="danger" />
        <ResultCard label="Tax" value={formatCurrency(results.tax)} size="small" variant="danger" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   13. MutualFundCalculator
   ═══════════════════════════════════════════════════════════ */

const MUTUAL_FUND_DEFAULTS = {
  initialInvestment: 10000,
  monthlyContribution: 500,
  annualReturn: 8,
  expenseRatio: 0.75,
  frontEndLoad: 5,
  years: 20,
};

export function MutualFundCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(MUTUAL_FUND_DEFAULTS.initialInvestment);
  const [monthlyContribution, setMonthlyContribution] = useState(MUTUAL_FUND_DEFAULTS.monthlyContribution);
  const [annualReturn, setAnnualReturn] = useState(MUTUAL_FUND_DEFAULTS.annualReturn);
  const [expenseRatio, setExpenseRatio] = useState(MUTUAL_FUND_DEFAULTS.expenseRatio);
  const [frontEndLoad, setFrontEndLoad] = useState(MUTUAL_FUND_DEFAULTS.frontEndLoad);
  const [years, setYears] = useState(MUTUAL_FUND_DEFAULTS.years);

  const results = useMemo(() => {
    const totalMonths = years * 12;
    const loadFraction = frontEndLoad / 100;
    const monthlyRateWithFee = (annualReturn - expenseRatio) / 100 / 12;
    const monthlyRateNoFee = annualReturn / 100 / 12;

    // With fees: front-end load reduces each contribution
    let balanceWithFees = initialInvestment * (1 - loadFraction);
    let balanceNoFees = initialInvestment;

    for (let i = 0; i < totalMonths; i++) {
      const contrib = monthlyContribution * (1 - loadFraction);
      balanceWithFees = (balanceWithFees + contrib) * (1 + monthlyRateWithFee);
      balanceNoFees = (balanceNoFees + monthlyContribution) * (1 + monthlyRateNoFee);
    }

    const totalFees = balanceNoFees - balanceWithFees;

    return { finalValueAfterFees: balanceWithFees, totalFees, valueWithoutFees: balanceNoFees };
  }, [initialInvestment, monthlyContribution, annualReturn, expenseRatio, frontEndLoad, years]);

  function resetDefaults() {
    setInitialInvestment(MUTUAL_FUND_DEFAULTS.initialInvestment);
    setMonthlyContribution(MUTUAL_FUND_DEFAULTS.monthlyContribution);
    setAnnualReturn(MUTUAL_FUND_DEFAULTS.annualReturn);
    setExpenseRatio(MUTUAL_FUND_DEFAULTS.expenseRatio);
    setFrontEndLoad(MUTUAL_FUND_DEFAULTS.frontEndLoad);
    setYears(MUTUAL_FUND_DEFAULTS.years);
  }

  const inputs = (
    <>
      <NumberInput label="Initial Investment" value={initialInvestment} onChange={setInitialInvestment} prefix="$" min={0} max={10000000} step={1000} showSlider />
      <NumberInput label="Monthly Contribution" value={monthlyContribution} onChange={setMonthlyContribution} prefix="$" min={0} max={50000} step={50} showSlider />
      <NumberInput label="Annual Return" value={annualReturn} onChange={setAnnualReturn} prefix="%" min={0} max={25} step={0.5} showSlider />
      <NumberInput label="Expense Ratio" value={expenseRatio} onChange={setExpenseRatio} prefix="%" min={0} max={3} step={0.01} showSlider />
      <NumberInput label="Front-End Load" value={frontEndLoad} onChange={setFrontEndLoad} prefix="%" min={0} max={10} step={0.25} showSlider />
      <NumberInput label="Years" value={years} onChange={setYears} min={1} max={50} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Final Value (after fees)" value={formatCurrency(results.finalValueAfterFees)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Fees Paid" value={formatCurrency(results.totalFees)} size="small" variant="danger" />
        <ResultCard label="Value Without Fees" value={formatCurrency(results.valueWithoutFees)} size="small" variant="accent" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   14. CdCalculator
   ═══════════════════════════════════════════════════════════ */

const CD_DEFAULTS = {
  deposit: 10000,
  apy: 5,
  termMonths: 12,
  compounding: "daily" as "daily" | "monthly",
};

export function CdCalculator() {
  const [deposit, setDeposit] = useState(CD_DEFAULTS.deposit);
  const [apy, setApy] = useState(CD_DEFAULTS.apy);
  const [termMonths, setTermMonths] = useState(CD_DEFAULTS.termMonths);
  const [compounding, setCompounding] = useState<"daily" | "monthly">(CD_DEFAULTS.compounding);

  const results = useMemo(() => {
    const n = compounding === "daily" ? 365 : 12;
    const t = termMonths / 12;
    // APY to APR: APR = n * ((1 + APY)^(1/n) - 1)
    const apr = n * (Math.pow(1 + apy / 100, 1 / n) - 1) * 100;
    const maturityValue = deposit * Math.pow(1 + apr / 100 / n, n * t);
    const interestEarned = maturityValue - deposit;

    // Early withdrawal penalty: typically 3 months interest for terms <= 12mo, 6 months for longer
    const penaltyMonths = termMonths <= 12 ? 3 : 6;
    const monthlyInterest = interestEarned / termMonths;
    const earlyWithdrawalPenalty = monthlyInterest * penaltyMonths;

    return { interestEarned, maturityValue, apy, apr, earlyWithdrawalPenalty, penaltyMonths };
  }, [deposit, apy, termMonths, compounding]);

  function resetDefaults() {
    setDeposit(CD_DEFAULTS.deposit);
    setApy(CD_DEFAULTS.apy);
    setTermMonths(CD_DEFAULTS.termMonths);
    setCompounding(CD_DEFAULTS.compounding);
  }

  const inputs = (
    <>
      <NumberInput label="Deposit Amount" value={deposit} onChange={setDeposit} prefix="$" min={500} max={10000000} step={500} showSlider />
      <NumberInput label="APY" value={apy} onChange={setApy} prefix="%" min={0.1} max={10} step={0.1} showSlider />
      <div className="space-y-2">
        <Label className="text-sm font-medium">Term</Label>
        <Select value={termMonths.toString()} onValueChange={(v) => setTermMonths(parseInt(v, 10))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 months</SelectItem>
            <SelectItem value="6">6 months</SelectItem>
            <SelectItem value="12">12 months</SelectItem>
            <SelectItem value="24">24 months</SelectItem>
            <SelectItem value="36">36 months</SelectItem>
            <SelectItem value="60">60 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Compounding</Label>
        <Select value={compounding} onValueChange={(v) => setCompounding(v as "daily" | "monthly")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Maturity Value" value={formatCurrency(results.maturityValue)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Interest Earned" value={formatCurrency(results.interestEarned)} size="small" variant="accent" />
        <ResultCard label="APR (equivalent)" value={`${results.apr.toFixed(3)}%`} size="small" variant="neutral" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="APY" value={`${results.apy.toFixed(2)}%`} size="small" variant="neutral" />
        <ResultCard label={`Early Withdrawal Penalty (${results.penaltyMonths}mo interest)`} value={formatCurrency(results.earlyWithdrawalPenalty)} size="small" variant="danger" />
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}

/* ═══════════════════════════════════════════════════════════
   15. SavingsGoalCalculator
   ═══════════════════════════════════════════════════════════ */

const SAVINGS_GOAL_DEFAULTS = {
  goalAmount: 50000,
  currentSavings: 5000,
  returnRate: 5,
  yearsToGoal: 5,
};

export function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState(SAVINGS_GOAL_DEFAULTS.goalAmount);
  const [currentSavings, setCurrentSavings] = useState(SAVINGS_GOAL_DEFAULTS.currentSavings);
  const [returnRate, setReturnRate] = useState(SAVINGS_GOAL_DEFAULTS.returnRate);
  const [yearsToGoal, setYearsToGoal] = useState(SAVINGS_GOAL_DEFAULTS.yearsToGoal);

  const results = useMemo(() => {
    const monthlyRate = returnRate / 100 / 12;
    const totalMonths = yearsToGoal * 12;

    // Future value of current savings
    const fvCurrent = currentSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Remaining amount needed from contributions
    const remaining = goalAmount - fvCurrent;

    // Monthly payment needed: PMT = FV * r / ((1+r)^n - 1)
    let monthlySavingsNeeded: number;
    if (monthlyRate === 0) {
      monthlySavingsNeeded = remaining > 0 ? remaining / totalMonths : 0;
    } else {
      const factor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      monthlySavingsNeeded = remaining > 0 ? remaining / factor : 0;
    }

    const totalContributions = monthlySavingsNeeded * totalMonths + currentSavings;
    const totalInterest = goalAmount - totalContributions;
    const progressPct = goalAmount > 0 ? Math.min((currentSavings / goalAmount) * 100, 100) : 0;

    return { monthlySavingsNeeded, totalContributions, totalInterest, progressPct };
  }, [goalAmount, currentSavings, returnRate, yearsToGoal]);

  function resetDefaults() {
    setGoalAmount(SAVINGS_GOAL_DEFAULTS.goalAmount);
    setCurrentSavings(SAVINGS_GOAL_DEFAULTS.currentSavings);
    setReturnRate(SAVINGS_GOAL_DEFAULTS.returnRate);
    setYearsToGoal(SAVINGS_GOAL_DEFAULTS.yearsToGoal);
  }

  const inputs = (
    <>
      <NumberInput label="Goal Amount" value={goalAmount} onChange={setGoalAmount} prefix="$" min={1000} max={10000000} step={1000} showSlider />
      <NumberInput label="Current Savings" value={currentSavings} onChange={setCurrentSavings} prefix="$" min={0} max={10000000} step={500} showSlider />
      <NumberInput label="Expected Return Rate" value={returnRate} onChange={setReturnRate} prefix="%" min={0} max={15} step={0.5} showSlider />
      <NumberInput label="Years to Goal" value={yearsToGoal} onChange={setYearsToGoal} min={1} max={40} step={1} showSlider />
      <Button variant="link" onClick={resetDefaults} className="text-sm px-0">Reset to defaults</Button>
    </>
  );

  const resultsPanel = (
    <div className="space-y-6">
      <ResultCard label="Monthly Savings Needed" value={formatCurrency(results.monthlySavingsNeeded)} size="large" />
      <div className="grid grid-cols-2 gap-4">
        <ResultCard label="Total Contributions" value={formatCurrency(results.totalContributions)} size="small" variant="neutral" />
        <ResultCard label="Total Interest Earned" value={formatCurrency(results.totalInterest)} size="small" variant="accent" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Progress Toward Goal</p>
        <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${results.progressPct}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(currentSavings)} of {formatCurrency(goalAmount)} ({results.progressPct.toFixed(1)}%)
        </p>
      </div>
    </div>
  );

  return <CalculatorShell inputs={inputs} results={resultsPanel} />;
}
