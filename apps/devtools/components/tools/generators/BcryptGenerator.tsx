"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Hash, Trash2, AlertTriangle } from "lucide-react";

async function sha256WithSalt(text: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(salt + text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateSalt(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function BcryptGenerator() {
  const [input, setInput] = useState("");
  const [salt, setSalt] = useState("");
  const [rounds, setRounds] = useState(1000);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setError("");
    if (!input) {
      setError("Input text is required");
      return;
    }
    try {
      const useSalt = salt || generateSalt(16);
      if (!salt) setSalt(useSalt);

      // Iterative SHA-256 hashing to simulate key stretching
      let hash = useSalt + input;
      for (let i = 0; i < Math.min(rounds, 10000); i++) {
        const data = new TextEncoder().encode(hash);
        const buf = await crypto.subtle.digest("SHA-256", data);
        hash = Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }
      setResult(hash);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleNewSalt = () => {
    setSalt(generateSalt(16));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Note: True bcrypt requires server-side computation</p>
          <p>This tool provides a client-side alternative using iterated SHA-256 with salt (key stretching). For production password hashing, use bcrypt, scrypt, or Argon2 on the server.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input Text</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            placeholder="Enter text to hash..."
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Salt (hex)</label>
            <input
              type="text"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Auto-generated if empty..."
            />
          </div>
          <button
            onClick={handleNewSalt}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            New Salt
          </button>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Iterations: {rounds}
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-48"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <Hash className="h-4 w-4" /> Generate Hash
          </button>
          <button
            onClick={handleCopy}
            disabled={!result}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => { setInput(""); setSalt(""); setResult(""); setError(""); }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Iterated SHA-256 Hash ({rounds} rounds)
          </label>
          <code className="block text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-4 py-3 break-all">{result}</code>
          <p className="text-xs text-gray-500">Salt: {salt}</p>
        </div>
      )}
    </div>
  );
}
