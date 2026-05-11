"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw } from "lucide-react";

function randomHex(len: number): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateULA(): { full: string; shortened: string } {
  const globalId = randomHex(5);
  const subnetId = randomHex(2);
  const interfaceId = randomHex(8);

  const full = `fd${globalId.slice(0, 2)}:${globalId.slice(2, 6)}:${globalId.slice(6, 10).padEnd(4, "0").slice(0, 4)}:${subnetId.padEnd(4, "0").slice(0, 4)}:${interfaceId.slice(0, 4)}:${interfaceId.slice(4, 8)}:${interfaceId.slice(8, 12).padEnd(4, "0").slice(0, 4)}:${interfaceId.slice(12, 16).padEnd(4, "0").slice(0, 4)}`;

  // Build properly
  const g = globalId.padEnd(10, "0");
  const s = subnetId.padEnd(4, "0");
  const iface = interfaceId.padEnd(16, "0");

  const fullAddr = `fd${g.slice(0, 2)}:${g.slice(2, 6)}:${g.slice(6, 10)}:${s.slice(0, 4)}:${iface.slice(0, 4)}:${iface.slice(4, 8)}:${iface.slice(8, 12)}:${iface.slice(12, 16)}`;

  // Shorten: remove leading zeros, collapse longest :: group
  const groups = fullAddr.split(":");
  const shortened = groups
    .map((g) => g.replace(/^0+/, "") || "0")
    .join(":");

  return { full: fullAddr, shortened };
}

export default function Ipv6UlaGenerator() {
  const [addresses, setAddresses] = useState<{ full: string; shortened: string }[]>([]);
  const [copied, setCopied] = useState("");

  const generate = () => {
    const results: { full: string; shortened: string }[] = [];
    for (let i = 0; i < 5; i++) results.push(generateULA());
    setAddresses(results);
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={generate}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <RefreshCw className="h-4 w-4" /> Generate ULA Addresses
        </button>
      </div>

      <p className="text-xs text-gray-500">Generates random IPv6 Unique Local Addresses (fd00::/8) for private network use.</p>

      {addresses.length > 0 && (
        <div className="space-y-2">
          {addresses.map((addr, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
              <div className="flex items-center justify-between group">
                <div>
                  <div className="text-xs text-gray-500">Full</div>
                  <code className="text-sm font-mono text-gray-800">{addr.full}</code>
                </div>
                <button onClick={() => copyValue(addr.full)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied === addr.full ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                </button>
              </div>
              <div className="flex items-center justify-between group">
                <div>
                  <div className="text-xs text-gray-500">Shortened</div>
                  <code className="text-sm font-mono text-gray-800">{addr.shortened}</code>
                </div>
                <button onClick={() => copyValue(addr.shortened)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied === addr.shortened ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
