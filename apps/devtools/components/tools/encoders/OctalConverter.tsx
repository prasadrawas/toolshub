"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, RefreshCw } from "lucide-react";

type Base = "decimal" | "hex" | "binary" | "octal";

function convert(value: string, from: Base): Record<Base, string> {
  let num: number;
  const cleaned = value.trim();
  if (!cleaned) return { decimal: "", hex: "", binary: "", octal: "" };

  switch (from) {
    case "decimal":
      num = parseInt(cleaned, 10);
      break;
    case "hex":
      num = parseInt(cleaned.replace(/^0x/i, ""), 16);
      break;
    case "binary":
      num = parseInt(cleaned.replace(/^0b/i, ""), 2);
      break;
    case "octal":
      num = parseInt(cleaned.replace(/^0o/i, ""), 8);
      break;
  }

  if (isNaN(num!)) throw new Error(`Invalid ${from} number.`);

  return {
    decimal: num!.toString(10),
    hex: num!.toString(16).toUpperCase(),
    binary: num!.toString(2),
    octal: num!.toString(8),
  };
}

const LABELS: Record<Base, string> = {
  decimal: "Decimal",
  hex: "Hexadecimal",
  binary: "Binary",
  octal: "Octal",
};

export default function OctalConverter() {
  const [values, setValues] = useState<Record<Base, string>>({ decimal: "", hex: "", binary: "", octal: "" });
  const [activeBase, setActiveBase] = useState<Base>("decimal");
  const [copied, setCopied] = useState<Base | null>(null);
  const [error, setError] = useState("");

  const handleChange = (base: Base, value: string) => {
    setActiveBase(base);
    setValues((prev) => ({ ...prev, [base]: value }));
  };

  const handleConvert = () => {
    setError("");
    try {
      const result = convert(values[activeBase], activeBase);
      setValues(result);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = (base: Base) => {
    navigator.clipboard.writeText(values[base]);
    setCopied(base);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleClear = () => {
    setValues({ decimal: "", hex: "", binary: "", octal: "" });
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleConvert} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <RefreshCw className="h-4 w-4" /> Convert
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        <span className="text-sm text-gray-500">Type in any field and click Convert</span>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(["decimal", "hex", "binary", "octal"] as Base[]).map((base) => (
          <div key={base}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700">{LABELS[base]}</label>
              <button
                onClick={() => handleCopy(base)}
                disabled={!values[base]}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {copied === base ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied === base ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              value={values[base]}
              onChange={(e) => handleChange(base, e.target.value)}
              className={cn(
                "w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none",
                activeBase === base && "border-brand-300"
              )}
              placeholder={`Enter ${LABELS[base].toLowerCase()} value...`}
              spellCheck={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
