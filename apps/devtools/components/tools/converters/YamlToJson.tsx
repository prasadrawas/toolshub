"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2 } from "lucide-react";

function parseYaml(yaml: string): any {
  const lines = yaml.split("\n").filter((l) => l.trim() !== "" && !l.trim().startsWith("#"));
  if (lines.length === 0) return {};

  function getIndent(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  function parseValue(val: string): any {
    const trimmed = val.trim();
    if (trimmed === "" || trimmed === "~" || trimmed === "null") return null;
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (trimmed === "[]") return [];
    if (trimmed === "{}") return {};
    if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
    if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'")))
      return trimmed.slice(1, -1);
    return trimmed;
  }

  function parseBlock(startIdx: number, baseIndent: number): [any, number] {
    const result: any = {};
    let isArray = false;
    const arr: any[] = [];
    let i = startIdx;

    while (i < lines.length) {
      const line = lines[i];
      const indent = getIndent(line);
      if (indent < baseIndent) break;
      if (indent > baseIndent) { i++; continue; }

      const trimmed = line.trim();

      if (trimmed.startsWith("- ")) {
        isArray = true;
        const itemVal = trimmed.slice(2).trim();
        if (itemVal.includes(": ")) {
          const colonIdx = itemVal.indexOf(": ");
          const key = itemVal.slice(0, colonIdx);
          const val = itemVal.slice(colonIdx + 2);
          const obj: any = { [key]: parseValue(val) };
          i++;
          while (i < lines.length && getIndent(lines[i]) > baseIndent) {
            const subTrimmed = lines[i].trim();
            if (subTrimmed.includes(": ")) {
              const ci = subTrimmed.indexOf(": ");
              obj[subTrimmed.slice(0, ci)] = parseValue(subTrimmed.slice(ci + 2));
            }
            i++;
          }
          arr.push(obj);
        } else {
          arr.push(parseValue(itemVal));
          i++;
        }
        continue;
      }

      const colonIdx = trimmed.indexOf(":");
      if (colonIdx === -1) { i++; continue; }

      const key = trimmed.slice(0, colonIdx).trim();
      const valPart = trimmed.slice(colonIdx + 1).trim();

      if (valPart === "") {
        const nextIndent = i + 1 < lines.length ? getIndent(lines[i + 1]) : baseIndent;
        if (nextIndent > baseIndent) {
          const [nested, nextI] = parseBlock(i + 1, nextIndent);
          result[key] = nested;
          i = nextI;
        } else {
          result[key] = null;
          i++;
        }
      } else {
        result[key] = parseValue(valPart);
        i++;
      }
    }

    return [isArray ? arr : result, i];
  }

  const [parsed] = parseBlock(0, getIndent(lines[0]));
  return parsed;
}

export default function YamlToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    try {
      const parsed = parseYaml(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setError(e.message);
      setOutput("");
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
        <button onClick={handleConvert} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">Convert</button>
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
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">YAML Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Paste YAML here..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSON Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="JSON output will appear here..." />
        </div>
      </div>
    </div>
  );
}
