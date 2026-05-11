"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calculator, Copy, Check } from "lucide-react";

function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

function intToIp(int: number): string {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join(".");
}

function intToBinary(int: number): string {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255]
    .map((o) => o.toString(2).padStart(8, "0"))
    .join(".");
}

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  subnetMask: string;
  wildcardMask: string;
  cidr: number;
  binary: string;
}

function calculate(ip: string, cidr: number): SubnetResult | null {
  const ipInt = ipToInt(ip);
  if (isNaN(ipInt)) return null;
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
  const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;
  const totalHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;

  return {
    networkAddress: intToIp(network),
    broadcastAddress: intToIp(broadcast),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    totalHosts,
    subnetMask: intToIp(mask),
    wildcardMask: intToIp(~mask >>> 0),
    cidr,
    binary: intToBinary(mask),
  };
}

export default function Ipv4SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [copied, setCopied] = useState("");

  const handleCalculate = () => {
    setResult(calculate(ip, cidr));
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">IP Address</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              placeholder="192.168.1.0"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
          <div className="w-24">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">CIDR</label>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">/</span>
              <input
                type="number"
                min={0}
                max={32}
                value={cidr}
                onChange={(e) => setCidr(Number(e.target.value))}
                className="w-16 rounded-lg border border-gray-200 px-2 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <Calculator className="h-4 w-4" /> Calculate
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Network Address", value: result.networkAddress },
            { label: "Broadcast Address", value: result.broadcastAddress },
            { label: "First Host", value: result.firstHost },
            { label: "Last Host", value: result.lastHost },
            { label: "Total Hosts", value: result.totalHosts.toLocaleString() },
            { label: "Subnet Mask", value: result.subnetMask },
            { label: "Wildcard Mask", value: result.wildcardMask },
            { label: "CIDR Notation", value: `/${result.cidr}` },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3 flex items-center justify-between group">
              <div>
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="text-sm font-semibold text-gray-800 font-mono">{item.value}</div>
              </div>
              <button
                onClick={() => copyValue(String(item.value))}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === String(item.value) ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
