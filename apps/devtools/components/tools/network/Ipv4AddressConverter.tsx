"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw } from "lucide-react";

function ipToFormats(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return null;

  const integer = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  const hex = parts.map((p) => p.toString(16).padStart(2, "0")).join(".");
  const hexFull = "0x" + integer.toString(16).padStart(8, "0");
  const binary = parts.map((p) => p.toString(2).padStart(8, "0")).join(".");

  return { decimal: ip, hex, hexFull, binary, integer };
}

function integerToIp(int: number): string {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join(".");
}

export default function Ipv4AddressConverter() {
  const [mode, setMode] = useState<"ipToFormats" | "intToIp">("ipToFormats");
  const [ipInput, setIpInput] = useState("192.168.1.1");
  const [intInput, setIntInput] = useState("");
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [copied, setCopied] = useState("");

  const convert = () => {
    if (mode === "ipToFormats") {
      const r = ipToFormats(ipInput);
      if (!r) { setResult({ Error: "Invalid IP address" }); return; }
      setResult({
        Decimal: r.decimal,
        "Hex (dotted)": r.hex,
        "Hex (full)": r.hexFull,
        Binary: r.binary,
        Integer: String(r.integer),
      });
    } else {
      const int = Number(intInput);
      if (isNaN(int) || int < 0 || int > 4294967295) { setResult({ Error: "Invalid integer (0-4294967295)" }); return; }
      const ip = integerToIp(int);
      const r = ipToFormats(ip);
      if (!r) return;
      setResult({
        "IP Address": ip,
        "Hex (dotted)": r.hex,
        "Hex (full)": r.hexFull,
        Binary: r.binary,
        Integer: String(r.integer),
      });
    }
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("ipToFormats"); setResult(null); }}
            className={cn("rounded-lg px-4 py-2 text-sm font-medium", mode === "ipToFormats" ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            IP to Formats
          </button>
          <button
            onClick={() => { setMode("intToIp"); setResult(null); }}
            className={cn("rounded-lg px-4 py-2 text-sm font-medium", mode === "intToIp" ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            Integer to IP
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {mode === "ipToFormats" ? "IPv4 Address" : "Integer"}
          </label>
          <input
            type="text"
            value={mode === "ipToFormats" ? ipInput : intInput}
            onChange={(e) => mode === "ipToFormats" ? setIpInput(e.target.value) : setIntInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && convert()}
            placeholder={mode === "ipToFormats" ? "192.168.1.1" : "3232235777"}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>

        <button
          onClick={convert}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <RefreshCw className="h-4 w-4" /> Convert
        </button>
      </div>

      {result && (
        <div className="space-y-2">
          {Object.entries(result).map(([label, value]) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-3 flex items-center justify-between group">
              <div>
                <div className="text-xs text-gray-500">{label}</div>
                <code className="text-sm font-mono text-gray-800">{value}</code>
              </div>
              <button
                onClick={() => copyValue(value)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === value ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
