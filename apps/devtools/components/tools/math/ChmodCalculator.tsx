"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ShieldCheck } from "lucide-react";

const ROLES = ["Owner", "Group", "Other"] as const;
const PERMS = ["Read", "Write", "Execute"] as const;
const PERM_CHARS = ["r", "w", "x"];
const PERM_VALUES = [4, 2, 1];

type PermGrid = boolean[][];

function gridToNumeric(grid: PermGrid): string {
  return grid.map((role) => role.reduce((sum, on, i) => sum + (on ? PERM_VALUES[i] : 0), 0)).join("");
}

function gridToSymbolic(grid: PermGrid): string {
  return grid.map((role) => role.map((on, i) => (on ? PERM_CHARS[i] : "-")).join("")).join("");
}

function numericToGrid(numeric: string): PermGrid | null {
  const cleaned = numeric.replace(/\s/g, "");
  if (!/^[0-7]{3}$/.test(cleaned)) return null;
  return cleaned.split("").map((digit) => {
    const n = parseInt(digit);
    return [!!(n & 4), !!(n & 2), !!(n & 1)];
  });
}

const PRESETS = [
  { label: "755", desc: "rwxr-xr-x" },
  { label: "644", desc: "rw-r--r--" },
  { label: "777", desc: "rwxrwxrwx" },
  { label: "700", desc: "rwx------" },
  { label: "600", desc: "rw-------" },
  { label: "444", desc: "r--r--r--" },
];

export default function ChmodCalculator() {
  const [grid, setGrid] = useState<PermGrid>([
    [true, true, true],
    [true, false, true],
    [true, false, true],
  ]);
  const [numericInput, setNumericInput] = useState("755");
  const [copied, setCopied] = useState<string | null>(null);

  const numeric = gridToNumeric(grid);
  const symbolic = gridToSymbolic(grid);

  const togglePerm = (role: number, perm: number) => {
    const next = grid.map((r) => [...r]);
    next[role][perm] = !next[role][perm];
    setGrid(next);
    setNumericInput(gridToNumeric(next));
  };

  const handleNumericChange = (value: string) => {
    setNumericInput(value);
    const g = numericToGrid(value);
    if (g) setGrid(g);
  };

  const applyPreset = (val: string) => {
    setNumericInput(val);
    const g = numericToGrid(val);
    if (g) setGrid(g);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.label)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {p.label} <span className="text-gray-400 font-mono">{p.desc}</span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left font-medium text-gray-700 py-2 px-2"></th>
                {PERMS.map((p) => (
                  <th key={p} className="text-center font-medium text-gray-700 py-2 px-4">{p}</th>
                ))}
                <th className="text-center font-medium text-gray-700 py-2 px-4">Value</th>
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role, ri) => (
                <tr key={role} className="border-t border-gray-100">
                  <td className="py-2 px-2 font-medium text-gray-700">{role}</td>
                  {PERMS.map((_, pi) => (
                    <td key={pi} className="text-center py-2 px-4">
                      <input
                        type="checkbox"
                        checked={grid[ri][pi]}
                        onChange={() => togglePerm(ri, pi)}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-400 h-5 w-5 cursor-pointer"
                      />
                    </td>
                  ))}
                  <td className="text-center py-2 px-4 font-mono text-gray-800">
                    {grid[ri].reduce((s, on, i) => s + (on ? PERM_VALUES[i] : 0), 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Numeric</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={numericInput}
                onChange={(e) => handleNumericChange(e.target.value)}
                maxLength={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono text-center focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                placeholder="e.g., 755"
              />
              <button onClick={() => handleCopy(numeric)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
                {copied === numeric ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Symbolic</label>
            <div className="flex gap-2">
              <code className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono text-center text-gray-800">
                {symbolic}
              </code>
              <button onClick={() => handleCopy(symbolic)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
                {copied === symbolic ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
        <label className="text-sm font-medium text-gray-700 block flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> chmod Command
        </label>
        <code className="block text-sm font-mono text-brand-700 bg-brand-50 rounded-lg px-4 py-2">
          chmod {numeric} filename
        </code>
      </div>
    </div>
  );
}
