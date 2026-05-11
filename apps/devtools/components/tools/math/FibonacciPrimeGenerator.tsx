"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Hash, Search } from "lucide-react";

function generateFibonacci(n: number): string[] {
  if (n <= 0) return [];
  if (n === 1) return ["0"];
  const seq: string[] = ["0", "1"];
  // Use string-based addition for large numbers
  const addBig = (a: string, b: string): string => {
    let carry = 0;
    let result = "";
    const la = a.length;
    const lb = b.length;
    const maxLen = Math.max(la, lb);
    for (let i = 0; i < maxLen || carry; i++) {
      const da = i < la ? parseInt(a[la - 1 - i]) : 0;
      const db = i < lb ? parseInt(b[lb - 1 - i]) : 0;
      const sum = da + db + carry;
      carry = Math.floor(sum / 10);
      result = (sum % 10) + result;
    }
    return result;
  };
  for (let i = 2; i < n; i++) {
    seq.push(addBig(seq[i - 1], seq[i - 2]));
  }
  return seq;
}

function sieveOfEratosthenes(count: number): number[] {
  if (count <= 0) return [];
  const primes: number[] = [];
  const limit = Math.max(100, count * Math.ceil(Math.log(count) * 1.3 + 6));
  const sieve = new Uint8Array(limit + 1);
  for (let i = 2; i <= limit && primes.length < count; i++) {
    if (!sieve[i]) {
      primes.push(i);
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = 1;
      }
    }
  }
  return primes.slice(0, count);
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export default function FibonacciPrimeGenerator() {
  const [tab, setTab] = useState<"fibonacci" | "prime">("fibonacci");
  const [count, setCount] = useState("20");
  const [checkNum, setCheckNum] = useState("");
  const [copied, setCopied] = useState(false);

  const n = Math.max(1, Math.min(1000, parseInt(count) || 0));

  const fibonacci = useMemo(() => (tab === "fibonacci" ? generateFibonacci(n) : []), [tab, n]);
  const primes = useMemo(() => (tab === "prime" ? sieveOfEratosthenes(n) : []), [tab, n]);

  const primeCheck = useMemo(() => {
    if (!checkNum.trim()) return null;
    const num = parseInt(checkNum);
    if (isNaN(num) || num < 0) return null;
    return { num, isPrime: isPrime(num) };
  }, [checkNum]);

  const resultText = tab === "fibonacci"
    ? fibonacci.map(String).join(", ")
    : primes.join(", ");

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTab("fibonacci")}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", tab === "fibonacci" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            Fibonacci
          </button>
          <button
            onClick={() => setTab("prime")}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", tab === "prime" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            Primes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Count (1-1000)
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
          {tab === "prime" && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Check if prime</label>
              <input
                type="number"
                value={checkNum}
                onChange={(e) => setCheckNum(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                placeholder="e.g., 97"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy All"}
          </button>
          <button onClick={() => { setCount("20"); setCheckNum(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Trash2 className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>

      {tab === "prime" && primeCheck && (
        <div className={cn("rounded-xl border p-3 text-sm", primeCheck.isPrime ? "border-green-200 bg-green-50 text-green-700" : "border-yellow-200 bg-yellow-50 text-yellow-700")}>
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {primeCheck.num} is {primeCheck.isPrime ? "" : "not "}a prime number.
          </span>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
          <Hash className="h-4 w-4" /> {tab === "fibonacci" ? `First ${n} Fibonacci Numbers` : `First ${n} Prime Numbers`}
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-96 overflow-y-auto">
          {(tab === "fibonacci" ? fibonacci.map(String) : primes.map(String)).map((num, i) => (
            <span key={i} className="inline-block rounded bg-gray-50 px-2 py-0.5 text-xs font-mono text-gray-700 border border-gray-100">
              <span className="text-gray-400 mr-1">{i + 1}.</span>{num}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
