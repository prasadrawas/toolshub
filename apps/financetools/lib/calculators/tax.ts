export type FilingStatus = "single" | "mfj" | "mfs" | "hoh";

export interface TaxInput {
  filingStatus: FilingStatus;
  grossIncome: number;
  retirement401k: number;
  otherPreTaxDeductions: number;
  state: string; // state code like "CA", "TX"
}

export interface TaxResult {
  federalTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  stateTax: number;
  ficaTax: number;
  totalTax: number;
  takeHomePay: number;
  monthlyTakeHome: number;
  taxableIncome: number;
  standardDeduction: number;
  brackets: TaxBracketBreakdown[];
}

export interface TaxBracketBreakdown {
  rate: number;
  min: number;
  max: number | null;
  taxableInThisBracket: number;
  taxInThisBracket: number;
}

interface Bracket {
  rate: number;
  min: number;
  max: number | null;
}

// 2026 projected federal tax brackets
const FEDERAL_BRACKETS: Record<FilingStatus, Bracket[]> = {
  single: [
    { rate: 0.10, min: 0, max: 11925 },
    { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 626350 },
    { rate: 0.37, min: 626350, max: null },
  ],
  mfj: [
    { rate: 0.10, min: 0, max: 23850 },
    { rate: 0.12, min: 23850, max: 96950 },
    { rate: 0.22, min: 96950, max: 206700 },
    { rate: 0.24, min: 206700, max: 394600 },
    { rate: 0.32, min: 394600, max: 501050 },
    { rate: 0.35, min: 501050, max: 1252700 },
    { rate: 0.37, min: 1252700, max: null },
  ],
  mfs: [
    { rate: 0.10, min: 0, max: 11925 },
    { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 626350 },
    { rate: 0.37, min: 626350, max: null },
  ],
  hoh: [
    { rate: 0.10, min: 0, max: 17000 },
    { rate: 0.12, min: 17000, max: 64850 },
    { rate: 0.22, min: 64850, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250500 },
    { rate: 0.35, min: 250500, max: 626350 },
    { rate: 0.37, min: 626350, max: null },
  ],
};

// 2026 standard deductions
const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 15000,
  mfj: 30000,
  mfs: 15000,
  hoh: 22500,
};

// FICA constants
const SS_RATE = 0.062;
const SS_WAGE_BASE = 168600;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD = 200000; // single threshold

// State tax brackets (simplified)
const STATE_TAX_CONFIG: Record<string, { type: "none" | "flat" | "progressive"; rate?: number; brackets?: Bracket[] }> = {
  TX: { type: "none" },
  FL: { type: "none" },
  PA: { type: "flat", rate: 0.0307 },
  IL: { type: "flat", rate: 0.0495 },
  NC: { type: "flat", rate: 0.045 },
  MI: { type: "flat", rate: 0.0405 },
  CA: {
    type: "progressive",
    brackets: [
      { rate: 0.01, min: 0, max: 10412 },
      { rate: 0.02, min: 10412, max: 24684 },
      { rate: 0.04, min: 24684, max: 38959 },
      { rate: 0.06, min: 38959, max: 54081 },
      { rate: 0.08, min: 54081, max: 68350 },
      { rate: 0.093, min: 68350, max: 349137 },
      { rate: 0.103, min: 349137, max: 418961 },
      { rate: 0.113, min: 418961, max: 698271 },
      { rate: 0.123, min: 698271, max: 1000000 },
      { rate: 0.133, min: 1000000, max: null },
    ],
  },
  NY: {
    type: "progressive",
    brackets: [
      { rate: 0.04, min: 0, max: 8500 },
      { rate: 0.045, min: 8500, max: 11700 },
      { rate: 0.0525, min: 11700, max: 13900 },
      { rate: 0.0585, min: 13900, max: 80650 },
      { rate: 0.0625, min: 80650, max: 215400 },
      { rate: 0.0685, min: 215400, max: 1077550 },
      { rate: 0.0965, min: 1077550, max: 5000000 },
      { rate: 0.103, min: 5000000, max: 25000000 },
      { rate: 0.109, min: 25000000, max: null },
    ],
  },
  OH: {
    type: "progressive",
    brackets: [
      { rate: 0.0, min: 0, max: 26050 },
      { rate: 0.0275, min: 26050, max: 100000 },
      { rate: 0.035, min: 100000, max: 115300 },
      { rate: 0.0375, min: 115300, max: null },
    ],
  },
  GA: {
    type: "progressive",
    brackets: [
      { rate: 0.01, min: 0, max: 750 },
      { rate: 0.02, min: 750, max: 2250 },
      { rate: 0.03, min: 2250, max: 3750 },
      { rate: 0.04, min: 3750, max: 5250 },
      { rate: 0.05, min: 5250, max: 7000 },
      { rate: 0.0549, min: 7000, max: null },
    ],
  },
};

function calculateBracketTax(
  taxableIncome: number,
  brackets: Bracket[]
): { tax: number; breakdown: TaxBracketBreakdown[]; marginalRate: number } {
  let tax = 0;
  let marginalRate = brackets[0].rate;
  const breakdown: TaxBracketBreakdown[] = [];

  for (const bracket of brackets) {
    const bracketMax = bracket.max ?? Infinity;
    if (taxableIncome <= bracket.min) {
      breakdown.push({
        rate: bracket.rate * 100,
        min: bracket.min,
        max: bracket.max,
        taxableInThisBracket: 0,
        taxInThisBracket: 0,
      });
      continue;
    }

    const taxableInBracket = Math.min(taxableIncome, bracketMax) - bracket.min;
    const taxInBracket = taxableInBracket * bracket.rate;
    tax += taxInBracket;
    marginalRate = bracket.rate;

    breakdown.push({
      rate: bracket.rate * 100,
      min: bracket.min,
      max: bracket.max,
      taxableInThisBracket: taxableInBracket,
      taxInThisBracket: taxInBracket,
    });
  }

  return { tax, breakdown, marginalRate };
}

function calculateStateTax(taxableIncome: number, stateCode: string): number {
  const config = STATE_TAX_CONFIG[stateCode.toUpperCase()];
  if (!config) return 0; // Unknown state, return 0

  switch (config.type) {
    case "none":
      return 0;
    case "flat":
      return taxableIncome * (config.rate ?? 0);
    case "progressive": {
      const { tax } = calculateBracketTax(taxableIncome, config.brackets!);
      return tax;
    }
  }
}

function calculateFICA(grossIncome: number): number {
  // Social Security
  const ssWages = Math.min(grossIncome, SS_WAGE_BASE);
  const socialSecurity = ssWages * SS_RATE;

  // Medicare
  const medicare = grossIncome * MEDICARE_RATE;

  // Additional Medicare
  const additionalMedicare =
    grossIncome > ADDITIONAL_MEDICARE_THRESHOLD
      ? (grossIncome - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE
      : 0;

  return socialSecurity + medicare + additionalMedicare;
}

export function calculateTax(input: TaxInput): TaxResult {
  const { filingStatus, grossIncome, retirement401k, otherPreTaxDeductions, state } = input;

  const standardDeduction = STANDARD_DEDUCTIONS[filingStatus];

  // AGI = gross income - pre-tax deductions (401k, etc.)
  const agi = Math.max(0, grossIncome - retirement401k - otherPreTaxDeductions);

  // Taxable income = AGI - standard deduction
  const taxableIncome = Math.max(0, agi - standardDeduction);

  // Federal tax
  const brackets = FEDERAL_BRACKETS[filingStatus];
  const { tax: federalTax, breakdown, marginalRate } = calculateBracketTax(taxableIncome, brackets);

  // State tax (applied on AGI minus a state-level deduction approximation; simplified to use taxable income)
  const stateTax = calculateStateTax(taxableIncome, state);

  // FICA is on gross income (not reduced by 401k for employee portion of SS/Medicare)
  // Actually, 401k reduces federal income tax but not FICA
  const ficaTax = calculateFICA(grossIncome);

  const totalTax = federalTax + stateTax + ficaTax;
  const takeHomePay = grossIncome - totalTax - retirement401k - otherPreTaxDeductions;
  const monthlyTakeHome = takeHomePay / 12;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const marginalTaxRate = marginalRate * 100;

  return {
    federalTax,
    effectiveTaxRate,
    marginalTaxRate,
    stateTax,
    ficaTax,
    totalTax,
    takeHomePay,
    monthlyTakeHome,
    taxableIncome,
    standardDeduction,
    brackets: breakdown,
  };
}
