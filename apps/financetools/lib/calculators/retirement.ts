export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number; // percentage
  inflationRate: number; // percentage
}

export interface RetirementResult {
  projectedSavings: number;
  monthlyRetirementIncome: number; // using 4% rule
  isOnTrack: boolean; // vs 10x salary benchmark
  yearByYearData: YearData[];
  additionalMonthlySavingsNeeded: number;
  totalContributions: number;
  totalGrowth: number;
}

export interface YearData {
  age: number;
  year: number;
  balance: number;
  contributions: number;
  growth: number;
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
  } = input;

  const yearsToRetirement = retirementAge - currentAge;
  const monthlyReturn = annualReturn / 100 / 12;
  const currentYear = new Date().getFullYear();

  const yearByYearData: YearData[] = [];
  let balance = currentSavings;
  let totalContributions = currentSavings;

  for (let year = 0; year <= yearsToRetirement; year++) {
    if (year === 0) {
      yearByYearData.push({
        age: currentAge,
        year: currentYear,
        balance,
        contributions: currentSavings,
        growth: 0,
      });
      continue;
    }

    let yearContributions = 0;
    for (let month = 0; month < 12; month++) {
      balance += monthlyContribution;
      yearContributions += monthlyContribution;
      balance *= 1 + monthlyReturn;
    }

    totalContributions += yearContributions;
    yearByYearData.push({
      age: currentAge + year,
      year: currentYear + year,
      balance,
      contributions: totalContributions,
      growth: balance - totalContributions,
    });
  }

  const projectedSavings = balance;
  const totalGrowth = projectedSavings - totalContributions;

  // 4% rule: annual withdrawal = 4% of savings, divided by 12 for monthly
  const monthlyRetirementIncome = (projectedSavings * 0.04) / 12;

  // 10x salary benchmark: assume annual salary = monthly contribution * 12 / savings rate
  // Use a rough estimate: annual income = monthlyContribution * 12 * 5 (assuming ~20% savings rate)
  const estimatedAnnualIncome = monthlyContribution * 12 * 5;
  const targetSavings = estimatedAnnualIncome * 10;
  const isOnTrack = projectedSavings >= targetSavings;

  // Calculate additional monthly savings needed to reach 10x salary target
  let additionalMonthlySavingsNeeded = 0;
  if (!isOnTrack) {
    // FV = PV(1+r)^n + PMT[((1+r)^n - 1)/r]
    // We need to find additional PMT such that total FV = targetSavings
    const totalMonths = yearsToRetirement * 12;
    if (monthlyReturn === 0) {
      const shortfall = targetSavings - (currentSavings + monthlyContribution * totalMonths);
      additionalMonthlySavingsNeeded = Math.max(0, shortfall / totalMonths);
    } else {
      const fvPV = currentSavings * Math.pow(1 + monthlyReturn, totalMonths);
      const fvAnnuityFactor = (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn;
      const fvCurrentContributions = monthlyContribution * fvAnnuityFactor;
      const shortfall = targetSavings - fvPV - fvCurrentContributions;
      additionalMonthlySavingsNeeded = Math.max(0, shortfall / fvAnnuityFactor);
    }
  }

  return {
    projectedSavings,
    monthlyRetirementIncome,
    isOnTrack,
    yearByYearData,
    additionalMonthlySavingsNeeded,
    totalContributions,
    totalGrowth,
  };
}
