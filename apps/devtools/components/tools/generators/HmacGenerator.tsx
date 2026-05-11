"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Hash, Trash2 } from "lucide-react";

async function generateHmac(algo: string, message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: algo },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HmacGenerator() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setError("");
    if (!secret) {
      setError("Secret key is required");
      return;
    }
    try {
      const hmac = await generateHmac(algorithm, message, secret);
      setResult(hmac);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-24 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Enter message to sign..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Secret Key</label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            placeholder="Enter secret key..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Algorithm
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <Hash className="h-4 w-4" /> Generate HMAC
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
            onClick={() => { setMessage(""); setSecret(""); setResult(""); setError(""); }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">HMAC-{algorithm}</label>
          </div>
          <code className="block text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-4 py-3 break-all">{result}</code>
        </div>
      )}
    </div>
  );
}
