export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  interestRate: number; // annual percentage
  loanTermYears: number;
  propertyTaxPerYear: number;
  homeInsurancePerYear: number;
  hoaPerMonth: number;
  pmiRate: number; // annual percentage, applies if down payment < 20%
}

export interface MortgageResult {
  monthlyPayment: number; // total PITI + HOA + PMI
  principalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  monthlyPMI: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  loanAmount: number;
  amortizationSchedule: AmortizationRow[];
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const {
    homePrice,
    downPayment,
    interestRate,
    loanTermYears,
    propertyTaxPerYear,
    homeInsurancePerYear,
    hoaPerMonth,
    pmiRate,
  } = input;

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;

  // Calculate principal & interest using M = P[r(1+r)^n]/[(1+r)^n-1]
  let principalAndInterest: number;
  if (monthlyRate === 0) {
    principalAndInterest = loanAmount / totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    principalAndInterest = loanAmount * (monthlyRate * factor) / (factor - 1);
  }

  const monthlyPropertyTax = propertyTaxPerYear / 12;
  const monthlyInsurance = homeInsurancePerYear / 12;
  const monthlyHOA = hoaPerMonth;

  // PMI applies when down payment < 20% of home price
  const downPaymentPercent = downPayment / homePrice;
  const monthlyPMI = downPaymentPercent < 0.2
    ? (loanAmount * (pmiRate / 100)) / 12
    : 0;

  const monthlyPayment =
    principalAndInterest +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyHOA +
    monthlyPMI;

  // Build amortization schedule
  const amortizationSchedule: AmortizationRow[] = [];
  let balance = loanAmount;
  let cumulativeInterest = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = principalAndInterest - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    cumulativeInterest += interestPayment;

    amortizationSchedule.push({
      month,
      payment: principalAndInterest,
      principal: principalPayment,
      interest: interestPayment,
      balance,
      totalInterest: cumulativeInterest,
    });
  }

  const totalInterestPaid = cumulativeInterest;
  const totalAmountPaid = monthlyPayment * totalMonths;

  return {
    monthlyPayment,
    principalAndInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHOA,
    monthlyPMI,
    totalInterestPaid,
    totalAmountPaid,
    loanAmount,
    amortizationSchedule,
  };
}
