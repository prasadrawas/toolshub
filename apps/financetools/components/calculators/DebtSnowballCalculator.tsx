"use client";

import React, { useMemo, useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NumberInput } from "@/components/shared/NumberInput";
import { ResultCard } from "@/components/shared/ResultCard";
import { calculateDebtPayoff, type Debt, type PayoffPlan } from "@/lib/calculators/debt";
import { formatCurrency } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type DebtEntry = Debt;

const DEFAULT_DEBTS: DebtEntry[] = [
  { id: "1", name: "Credit Card", balance: 5000, minimumPayment: 150, interestRate: 22 },
  { id: "2", name: "Car Loan", balance: 15000, minimumPayment: 350, interestRate: 5.5 },
  { id: "3", name: "Student Loan", balance: 25000, minimumPayment: 300, interestRate: 4.5 },
];

const MAX_DEBTS = 10;

function PayoffResults({ plan, label }: { plan: PayoffPlan; label: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard
          label="Total Months to Payoff"
          value={`${plan.payoffMonths} months`}
          variant="primary"
        />
        <ResultCard
          label="Total Interest Paid"
          value={formatCurrency(plan.totalInterestPaid)}
          variant={label === "snowball" ? "danger" : "primary"}
        />
        <ResultCard
          label="Interest Saved vs. Minimum Only"
          value={formatCurrency(plan.interestSavedVsMinimum)}
          variant="accent"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Debt Payoff Order</h4>
        <ol className="space-y-2">
          {plan.debtPayoffOrder.map((debt, index) => (
            <li key={debt.debtId} className="flex items-center gap-3 text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </span>
              <span className="text-gray-700">
                <span className="font-medium">{debt.debtName}</span>
                {" "}— paid off in month {debt.payoffMonth} ({formatCurrency(debt.interestPaid)} interest)
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function DebtSnowballCalculator() {
  const idCounter = useRef(4);
  const [debts, setDebts] = useState<DebtEntry[]>(DEFAULT_DEBTS);
  const [extraPayment, setExtraPayment] = useState(200);

  const updateDebt = useCallback((id: string, field: keyof DebtEntry, value: string | number) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }, []);

  const removeDebt = useCallback((id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const addDebt = useCallback(() => {
    setDebts((prev) => {
      if (prev.length >= MAX_DEBTS) return prev;
      const newId = String(idCounter.current++);
      return [
        ...prev,
        { id: newId, name: "", balance: 0, minimumPayment: 0, interestRate: 0 },
      ];
    });
  }, []);

  const validDebts = useMemo(
    () => debts.filter((d) => d.balance > 0 && d.minimumPayment > 0),
    [debts]
  );

  const result = useMemo(() => {
    if (validDebts.length === 0) return null;
    return calculateDebtPayoff({ debts: validDebts, extraMonthlyPayment: extraPayment });
  }, [validDebts, extraPayment]);

  const comparisonMessage = useMemo(() => {
    if (!result) return null;
    const diff = Math.abs(result.snowball.totalInterestPaid - result.avalanche.totalInterestPaid);
    if (diff < 0.01) return "Both methods cost the same in interest.";
    const winner =
      result.avalanche.totalInterestPaid < result.snowball.totalInterestPaid
        ? "avalanche"
        : "snowball";
    return `The ${winner} method saves you ${formatCurrency(diff)} in interest.`;
  }, [result]);

  return (
    <div className="space-y-8">
      {/* Debt Inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {debts.map((debt) => (
            <Card key={debt.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <Label>Debt Name</Label>
                    <Input
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                      placeholder="e.g. Credit Card"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-6 text-gray-400 hover:text-danger"
                    onClick={() => removeDebt(debt.id)}
                    disabled={debts.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <NumberInput
                  label="Balance"
                  value={debt.balance}
                  onChange={(v) => updateDebt(debt.id, "balance", v)}
                  prefix="$"
                  min={0}
                  max={10000000}
                  step={100}
                />
                <NumberInput
                  label="Minimum Payment"
                  value={debt.minimumPayment}
                  onChange={(v) => updateDebt(debt.id, "minimumPayment", v)}
                  prefix="$"
                  min={0}
                  max={100000}
                  step={10}
                />
                <NumberInput
                  label="Interest Rate"
                  value={debt.interestRate}
                  onChange={(v) => updateDebt(debt.id, "interestRate", v)}
                  suffix="%"
                  min={0}
                  max={100}
                  step={0.1}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addDebt}
          disabled={debts.length >= MAX_DEBTS}
        >
          + Add Debt
        </Button>

        <NumberInput
          label="Extra Monthly Payment"
          value={extraPayment}
          onChange={setExtraPayment}
          prefix="$"
          min={0}
          max={100000}
          step={50}
          helpText="Additional amount applied each month beyond minimum payments"
        />
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <Tabs defaultValue="snowball">
            <TabsList>
              <TabsTrigger value="snowball">Snowball Method</TabsTrigger>
              <TabsTrigger value="avalanche">Avalanche Method</TabsTrigger>
            </TabsList>

            <TabsContent value="snowball">
              <PayoffResults plan={result.snowball} label="snowball" />
            </TabsContent>

            <TabsContent value="avalanche">
              <PayoffResults plan={result.avalanche} label="avalanche" />
            </TabsContent>
          </Tabs>

          {comparisonMessage && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-700">{comparisonMessage}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
