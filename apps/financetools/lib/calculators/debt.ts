export interface Debt {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  interestRate: number; // annual percentage
}

export interface DebtPayoffInput {
  debts: Debt[];
  extraMonthlyPayment: number;
}

export interface DebtPayoffResult {
  snowball: PayoffPlan;
  avalanche: PayoffPlan;
}

export interface PayoffPlan {
  method: "snowball" | "avalanche";
  totalInterestPaid: number;
  totalAmountPaid: number;
  payoffMonths: number;
  debtPayoffOrder: { debtId: string; debtName: string; payoffMonth: number; interestPaid: number }[];
  monthlySchedule: MonthlyDebtStatus[];
  interestSavedVsMinimum: number;
}

export interface MonthlyDebtStatus {
  month: number;
  debts: { debtId: string; balance: number; payment: number }[];
  totalBalance: number;
}

function simulatePayoff(
  debts: Debt[],
  extraMonthlyPayment: number,
  method: "snowball" | "avalanche"
): PayoffPlan {
  // Sort debts based on method
  const sortedDebts = [...debts].sort((a, b) => {
    if (method === "snowball") {
      return a.balance - b.balance; // lowest balance first
    } else {
      return b.interestRate - a.interestRate; // highest rate first
    }
  });

  // Track current balances and interest paid per debt
  const balances = new Map<string, number>();
  const interestPaid = new Map<string, number>();
  for (const debt of sortedDebts) {
    balances.set(debt.id, debt.balance);
    interestPaid.set(debt.id, 0);
  }

  const debtPayoffOrder: PayoffPlan["debtPayoffOrder"] = [];
  const monthlySchedule: MonthlyDebtStatus[] = [];
  let month = 0;
  const maxMonths = 1200; // 100 year safety cap

  while (month < maxMonths) {
    const totalBalance = Array.from(balances.values()).reduce((sum, b) => sum + b, 0);
    if (totalBalance <= 0.01) break;

    month++;

    // Apply interest to all debts
    for (const debt of sortedDebts) {
      const bal = balances.get(debt.id)!;
      if (bal <= 0) continue;
      const monthlyInterest = bal * (debt.interestRate / 100 / 12);
      balances.set(debt.id, bal + monthlyInterest);
      interestPaid.set(debt.id, interestPaid.get(debt.id)! + monthlyInterest);
    }

    // Pay minimums on all debts
    let extraAvailable = extraMonthlyPayment;
    const monthDebts: MonthlyDebtStatus["debts"] = [];

    for (const debt of sortedDebts) {
      const bal = balances.get(debt.id)!;
      if (bal <= 0) {
        monthDebts.push({ debtId: debt.id, balance: 0, payment: 0 });
        continue;
      }
      const minPayment = Math.min(debt.minimumPayment, bal);
      balances.set(debt.id, bal - minPayment);
      monthDebts.push({ debtId: debt.id, balance: bal - minPayment, payment: minPayment });

      // If a debt is paid off with minimum, freed-up minimum rolls into extra
      if (bal - minPayment <= 0.01) {
        balances.set(debt.id, 0);
      }
    }

    // Apply extra payment to the target debt (first non-zero balance in sorted order)
    for (const debt of sortedDebts) {
      if (extraAvailable <= 0) break;
      const bal = balances.get(debt.id)!;
      if (bal <= 0) continue;

      const payment = Math.min(extraAvailable, bal);
      balances.set(debt.id, bal - payment);
      extraAvailable -= payment;

      // Update the month's record for this debt
      const record = monthDebts.find((d) => d.debtId === debt.id)!;
      record.payment += payment;
      record.balance = balances.get(debt.id)!;

      if (balances.get(debt.id)! <= 0.01) {
        balances.set(debt.id, 0);
        record.balance = 0;
      }
    }

    const newTotalBalance = Array.from(balances.values()).reduce((sum, b) => sum + b, 0);

    monthlySchedule.push({
      month,
      debts: monthDebts,
      totalBalance: newTotalBalance,
    });

    // Check for newly paid off debts
    for (const debt of sortedDebts) {
      if (
        balances.get(debt.id) === 0 &&
        !debtPayoffOrder.find((d) => d.debtId === debt.id)
      ) {
        debtPayoffOrder.push({
          debtId: debt.id,
          debtName: debt.name,
          payoffMonth: month,
          interestPaid: interestPaid.get(debt.id)!,
        });
      }
    }
  }

  const totalInterestPaid = Array.from(interestPaid.values()).reduce((sum, i) => sum + i, 0);
  const totalOriginalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalAmountPaid = totalOriginalBalance + totalInterestPaid;

  return {
    method,
    totalInterestPaid,
    totalAmountPaid,
    payoffMonths: month,
    debtPayoffOrder,
    monthlySchedule,
    interestSavedVsMinimum: 0, // will be calculated after
  };
}

function simulateMinimumOnly(debts: Debt[]): number {
  const balances = new Map<string, number>();
  for (const debt of debts) {
    balances.set(debt.id, debt.balance);
  }

  let totalInterest = 0;
  let month = 0;
  const maxMonths = 1200;

  while (month < maxMonths) {
    const totalBalance = Array.from(balances.values()).reduce((sum, b) => sum + b, 0);
    if (totalBalance <= 0.01) break;
    month++;

    for (const debt of debts) {
      const bal = balances.get(debt.id)!;
      if (bal <= 0) continue;
      const monthlyInterest = bal * (debt.interestRate / 100 / 12);
      totalInterest += monthlyInterest;
      const newBal = bal + monthlyInterest;
      const payment = Math.min(debt.minimumPayment, newBal);
      balances.set(debt.id, Math.max(0, newBal - payment));
    }
  }

  return totalInterest;
}

export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const { debts, extraMonthlyPayment } = input;

  const snowball = simulatePayoff(debts, extraMonthlyPayment, "snowball");
  const avalanche = simulatePayoff(debts, extraMonthlyPayment, "avalanche");

  // Calculate interest saved vs minimum-only payments
  const minimumOnlyInterest = simulateMinimumOnly(debts);
  snowball.interestSavedVsMinimum = minimumOnlyInterest - snowball.totalInterestPaid;
  avalanche.interestSavedVsMinimum = minimumOnlyInterest - avalanche.totalInterestPaid;

  return { snowball, avalanche };
}
