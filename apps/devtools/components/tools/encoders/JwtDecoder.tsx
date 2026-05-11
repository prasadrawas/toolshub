"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Key } from "lucide-react";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function formatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

function getExpiryInfo(payload: string): string {
  try {
    const parsed = JSON.parse(payload);
    if (parsed.exp) {
      const expDate = new Date(parsed.exp * 1000);
      const now = new Date();
      const isExpired = expDate < now;
      return `${isExpired ? "Expired" : "Expires"}: ${expDate.toLocaleString()} (${isExpired ? "expired" : "valid"})`;
    }
    if (parsed.iat) {
      const iatDate = new Date(parsed.iat * 1000);
      return `Issued at: ${iatDate.toLocaleString()}`;
    }
    return "No expiry (exp) claim found";
  } catch {
    return "";
  }
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [expiry, setExpiry] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleDecode = () => {
    setError("");
    setHeader("");
    setPayload("");
    setSignature("");
    setExpiry("");
    try {
      const parts = input.trim().split(".");
      if (parts.length !== 3) {
        setError("Invalid JWT: expected 3 parts separated by dots.");
        return;
      }
      const decodedHeader = base64UrlDecode(parts[0]);
      const decodedPayload = base64UrlDecode(parts[1]);
      setHeader(formatJson(decodedHeader));
      setPayload(formatJson(decodedPayload));
      setSignature(parts[2]);
      setExpiry(getExpiryInfo(decodedPayload));
    } catch (e: any) {
      setError("Failed to decode JWT: " + e.message);
    }
  };

  const handleCopy = () => {
    const result = `Header:\n${header}\n\nPayload:\n${payload}\n\nSignature:\n${signature}`;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setHeader("");
    setPayload("");
    setSignature("");
    setExpiry("");
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleDecode} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Key className="h-4 w-4" /> Decode
        </button>
        <button onClick={handleCopy} disabled={!header} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>
      {expiry && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">{expiry}</div>
      )}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JWT Token</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Paste JWT token here (e.g., eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.xxx)..." spellCheck={false} />
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-red-600 mb-1.5 block">Header</label>
            <textarea value={header} readOnly className="w-full h-20 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Header will appear here..." />
          </div>
          <div>
            <label className="text-sm font-medium text-purple-600 mb-1.5 block">Payload</label>
            <textarea value={payload} readOnly className="w-full h-32 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Payload will appear here..." />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-600 mb-1.5 block">Signature</label>
            <textarea value={signature} readOnly className="w-full h-16 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Signature will appear here..." />
          </div>
        </div>
      </div>
    </div>
  );
}
