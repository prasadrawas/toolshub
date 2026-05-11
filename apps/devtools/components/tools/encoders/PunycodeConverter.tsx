"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2, Lock, Unlock } from "lucide-react";

// Simple Punycode encoder/decoder (Bootstring RFC 3492)
const BASE = 36;
const TMIN = 1;
const TMAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;
const DELIMITER = "-";

function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  delta = firstTime ? Math.floor(delta / DAMP) : delta >> 1;
  delta += Math.floor(delta / numPoints);
  let k = 0;
  while (delta > ((BASE - TMIN) * TMAX) >> 1) {
    delta = Math.floor(delta / (BASE - TMIN));
    k += BASE;
  }
  return k + Math.floor(((BASE - TMIN + 1) * delta) / (delta + SKEW));
}

function digitToBasic(digit: number): number {
  return digit + 22 + 75 * (digit < 26 ? 1 : 0);
}

function basicToDigit(cp: number): number {
  if (cp >= 48 && cp <= 57) return cp - 22;
  if (cp >= 65 && cp <= 90) return cp - 65;
  if (cp >= 97 && cp <= 122) return cp - 97;
  return BASE;
}

function punycodeEncode(input: string): string {
  const codePoints = Array.from(input).map((c) => c.codePointAt(0)!);
  const basic = codePoints.filter((cp) => cp < 128);
  let output = basic.map((cp) => String.fromCharCode(cp)).join("");
  let handledCPCount = basic.length;
  if (basic.length > 0) output += DELIMITER;
  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;
  while (handledCPCount < codePoints.length) {
    let m = Infinity;
    for (const cp of codePoints) {
      if (cp >= n && cp < m) m = cp;
    }
    delta += (m - n) * (handledCPCount + 1);
    n = m;
    for (const cp of codePoints) {
      if (cp < n) delta++;
      if (cp === n) {
        let q = delta;
        for (let k = BASE; ; k += BASE) {
          const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
          if (q < t) break;
          output += String.fromCharCode(digitToBasic(t + ((q - t) % (BASE - t))));
          q = Math.floor((q - t) / (BASE - t));
        }
        output += String.fromCharCode(digitToBasic(q));
        bias = adapt(delta, handledCPCount + 1, handledCPCount === basic.length);
        delta = 0;
        handledCPCount++;
      }
    }
    delta++;
    n++;
  }
  return output;
}

function punycodeDecode(input: string): string {
  const lastDelim = input.lastIndexOf(DELIMITER);
  let basic = lastDelim > 0 ? input.substring(0, lastDelim) : "";
  const output: number[] = Array.from(basic).map((c) => c.charCodeAt(0));
  let i = 0;
  let n = INITIAL_N;
  let bias = INITIAL_BIAS;
  let pos = lastDelim > 0 ? lastDelim + 1 : 0;
  while (pos < input.length) {
    let oldi = i;
    let w = 1;
    for (let k = BASE; ; k += BASE) {
      if (pos >= input.length) throw new Error("Invalid Punycode");
      const digit = basicToDigit(input.charCodeAt(pos++));
      if (digit >= BASE) throw new Error("Invalid Punycode");
      i += digit * w;
      const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
      if (digit < t) break;
      w *= BASE - t;
    }
    const out = output.length + 1;
    bias = adapt(i - oldi, out, oldi === 0);
    n += Math.floor(i / out);
    i %= out;
    output.splice(i, 0, n);
    i++;
  }
  return String.fromCodePoint(...output);
}

function domainToASCII(domain: string): string {
  return domain
    .split(".")
    .map((label) => {
      if (/^[\x00-\x7F]*$/.test(label)) return label;
      return "xn--" + punycodeEncode(label);
    })
    .join(".");
}

function domainToUnicode(domain: string): string {
  return domain
    .split(".")
    .map((label) => {
      if (label.startsWith("xn--")) {
        return punycodeDecode(label.slice(4));
      }
      return label;
    })
    .join(".");
}

export default function PunycodeConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleEncode = () => {
    setError("");
    try {
      setOutput(domainToASCII(input));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDecode = () => {
    setError("");
    try {
      setOutput(domainToUnicode(input));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => { setInput(""); setOutput(""); setError(""); };
  const handleSwap = () => { setInput(output); setOutput(""); setError(""); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleEncode} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Lock className="h-4 w-4" /> To Punycode
        </button>
        <button onClick={handleDecode} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Unlock className="h-4 w-4" /> From Punycode
        </button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleSwap} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          <ArrowLeftRight className="h-4 w-4" /> Swap
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Enter domain (e.g., muenchen.de or xn--mnchen-3ya.de)..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Result will appear here..." />
        </div>
      </div>
    </div>
  );
}
