"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeTime(time: number, length: number): string {
  let str = "";
  for (let i = length - 1; i >= 0; i--) {
    const mod = time % 32;
    str = CROCKFORD[mod] + str;
    time = Math.floor(time / 32);
  }
  return str;
}

function encodeRandom(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let str = "";
  for (let i = 0; i < length; i++) {
    str += CROCKFORD[bytes[i] % 32];
  }
  return str;
}

function generateUlid(): string {
  const timestamp = Date.now();
  return encodeTime(timestamp, 10) + encodeRandom(16);
}

export default function UlidGenerator() {
  const [count, setCount] = useState(5);
  const [ulids, setUlids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generateUlid());
    }
    setUlids(results);
  };

  const copyOne = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(ulids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Count
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <RefreshCw className="h-4 w-4" /> Generate
          </button>
          <button
            onClick={copyAll}
            disabled={ulids.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedAll ? "Copied" : "Copy All"}
          </button>
          <button
            onClick={() => setUlids([])}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {ulids.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Generated ULIDs ({ulids.length})</label>
          <p className="text-xs text-gray-500 mb-2">Format: 10 chars timestamp (Crockford Base32) + 16 chars random</p>
          <div className="space-y-1">
            {ulids.map((ulid, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <code className="flex-1 text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-3 py-1.5">
                  <span className="text-brand-600">{ulid.slice(0, 10)}</span>
                  <span className="text-gray-600">{ulid.slice(10)}</span>
                </code>
                <button
                  onClick={() => copyOne(ulid, i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {copiedIndex === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
