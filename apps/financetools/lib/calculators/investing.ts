export interface CompoundInterestInput {
  principal: number;
  monthlyContribution: number;
  annualRate: number; // percentage
  years: number;
  compoundFrequency: "daily" | "monthly" | "annually";
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  interestPercentage: number;
  yearByYearData: { year: number; balance: number; contributions: number; interest: number }[];
  milestones: { label: string; year: number }[];
}

function getCompoundingPeriods(frequency: CompoundInterestInput["compoundFrequency"]): number {
  switch (frequency) {
    case "daily":
      return 365;
    case "monthly":
      return 12;
    case "annually":
      return 1;
  }
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, monthlyContribution, annualRate, years, compoundFrequency } = input;

  const n = getCompoundingPeriods(compoundFrequency);
  const rate = annualRate / 100;
  const periodicRate = rate / n;

  const yearByYearData: { year: number; balance: number; contributions: number; interest: number }[] = [];
  const milestones: { label: string; year: number }[] = [];
  const milestoneTargets = [100_000, 250_000, 500_000, 1_000_000, 2_000_000, 5_000_000];
  const milestoneHit = new Set<number>();

  let balance = principal;
  let totalContributions = principal;

  // Year 0
  yearByYearData.push({
    year: 0,
    balance: principal,
    contributions: principal,
    interest: 0,
  });

  for (let year = 1; year <= years; year++) {
    if (compoundFrequency === "monthly") {
      for (let period = 0; period < 12; period++) {
        balance += monthlyContribution;
        totalContributions += monthlyContribution;
        balance *= 1 + periodicRate;
      }
    } else if (compoundFrequency === "daily") {
      for (let month = 0; month < 12; month++) {
        balance += monthlyContribution;
        totalContributions += monthlyContribution;
        const daysInMonth = month === 1 ? 28 : [3, 5, 8, 10].includes(month) ? 30 : 31;
        for (let day = 0; day < daysInMonth; day++) {
          balance *= 1 + periodicRate;
        }
      }
    } else {
      // Annually: add all 12 months of contributions, then compound once
      for (let month = 0; month < 12; month++) {
        balance += monthlyContribution;
        totalContributions += monthlyContribution;
      }
      balance *= 1 + rate;
    }

    const totalInterest = balance - totalContributions;

    yearByYearData.push({
      year,
      balance,
      contributions: totalContributions,
      interest: totalInterest,
    });

    // Check milestones
    for (const target of milestoneTargets) {
      if (!milestoneHit.has(target) && balance >= target) {
        milestoneHit.add(target);
        milestones.push({
          label: `$${(target / 1000).toLocaleString()}k reached`,
          year,
        });
      }
    }
  }

  const finalBalance = balance;
  const totalInterest = finalBalance - totalContributions;
  const interestPercentage = totalContributions > 0 ? (totalInterest / finalBalance) * 100 : 0;

  return {
    finalBalance,
    totalContributions,
    totalInterest,
    interestPercentage,
    yearByYearData,
    milestones,
  };
}
