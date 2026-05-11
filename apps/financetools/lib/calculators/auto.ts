export interface CarLoanInput {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  interestRate: number; // annual percentage
  loanTermMonths: number;
  salesTaxRate: number; // percentage
}

export interface CarLoanResult {
  monthlyPayment: number;
  totalInterestPaid: number;
  totalCost: number;
  loanAmount: number;
  amortizationSchedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export function calculateCarLoan(input: CarLoanInput): CarLoanResult {
  const {
    vehiclePrice,
    downPayment,
    tradeInValue,
    interestRate,
    loanTermMonths,
    salesTaxRate,
  } = input;

  // Sales tax is applied to the vehicle price minus trade-in (in most states)
  const taxableAmount = Math.max(0, vehiclePrice - tradeInValue);
  const salesTax = taxableAmount * (salesTaxRate / 100);

  // Loan amount = vehicle price + sales tax - down payment - trade-in value
  const loanAmount = Math.max(0, vehiclePrice + salesTax - downPayment - tradeInValue);

  const monthlyRate = interestRate / 100 / 12;

  // Monthly payment using standard amortization formula
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / loanTermMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, loanTermMonths);
    monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1);
  }

  // Build amortization schedule
  const amortizationSchedule: CarLoanResult["amortizationSchedule"] = [];
  let balance = loanAmount;
  let totalInterestPaid = 0;

  for (let month = 1; month <= loanTermMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    totalInterestPaid += interestPayment;

    amortizationSchedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance,
    });
  }

  // Total cost includes everything: down payment, trade-in, all loan payments
  const totalCost = downPayment + tradeInValue + monthlyPayment * loanTermMonths;

  return {
    monthlyPayment,
    totalInterestPaid,
    totalCost,
    loanAmount,
    amortizationSchedule,
  };
}
