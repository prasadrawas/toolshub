"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Trash2, Shield } from "lucide-react";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(length: number, options: Record<string, boolean>): string {
  let chars = "";
  if (options.uppercase) chars += CHARSETS.uppercase;
  if (options.lowercase) chars += CHARSETS.lowercase;
  if (options.numbers) chars += CHARSETS.numbers;
  if (options.symbols) chars += CHARSETS.symbols;
  if (!chars) chars = CHARSETS.lowercase + CHARSETS.numbers;

  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

function getStrength(password: string): { label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 16) score++;
  if (password.length >= 24) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (score <= 3) return { label: "Fair", color: "bg-yellow-500", width: "w-2/4" };
  if (score <= 4) return { label: "Strong", color: "bg-blue-500", width: "w-3/4" };
  return { label: "Very Strong", color: "bg-green-500", width: "w-full" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setPassword(generatePassword(length, options));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const strength = password ? getStrength(password) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Length: {length}
            <input
              type="range"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-48"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {Object.entries(options).map(([key, value]) => (
            <label key={key} className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="rounded border-gray-300"
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <RefreshCw className="h-4 w-4" /> Generate
          </button>
          <button
            onClick={handleCopy}
            disabled={!password}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => setPassword("")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {password && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <label className="text-sm font-medium text-gray-700 block">Generated Password</label>
          <code className="block text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-4 py-3 break-all select-all">
            {password}
          </code>
          {strength && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Strength: {strength.label}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={cn("h-2 rounded-full transition-all", strength.color, strength.width)} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
