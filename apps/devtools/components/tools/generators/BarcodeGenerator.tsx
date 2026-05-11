"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Download, Trash2, BarChart3 } from "lucide-react";

// Code 128B encoding
const CODE128_START_B = 104;
const CODE128_STOP = 106;

const CODE128_PATTERNS: string[] = [
  "11011001100","11001101100","11001100110","10010011000","10010001100",
  "10001001100","10011001000","10011000100","10001100100","11001001000",
  "11001000100","11000100100","10110011100","10011011100","10011001110",
  "10111001100","10011101100","10011100110","11001110010","11001011100",
  "11001001110","11011100100","11001110100","11100101100","11100100110",
  "11101100100","11100110100","11100110010","11011011000","11011000110",
  "11000110110","10100011000","10001011000","10001000110","10110001000",
  "10001101000","10001100010","11010001000","11000101000","11000100010",
  "10110111000","10110001110","10001101110","10111011000","10111000110",
  "10001110110","11101110110","11010001110","11000101110","11011101000",
  "11011100010","11011101110","11101011000","11101000110","11100010110",
  "11101101000","11101100010","11100011010","11101111010","11001000010",
  "11110001010","10100110000","10100001100","10010110000","10010000110",
  "10000101100","10000100110","10110010000","10110000100","10011010000",
  "10011000010","10000110100","10000110010","11000010010","11001010000",
  "11110111010","11000010100","10001111010","10100111100","10010111100",
  "10010011110","10111100100","10011110100","10011110010","11110100100",
  "11110010100","11110010010","11011011110","11011110110","11110110110",
  "10101111000","10100011110","10001011110","10111101000","10111100010",
  "11110101000","11110100010","10111011110","10111101110","11101011110",
  "11110101110","11010000100","11010010000","11010011100","1100011101011",
];

function encodeCode128(text: string): string[] {
  const bars: string[] = [];
  bars.push(CODE128_PATTERNS[CODE128_START_B]);

  let checksum = CODE128_START_B;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    if (code < 0 || code > 95) continue;
    bars.push(CODE128_PATTERNS[code]);
    checksum += code * (i + 1);
  }

  bars.push(CODE128_PATTERNS[checksum % 103]);
  bars.push(CODE128_PATTERNS[CODE128_STOP]);

  return bars;
}

export default function BarcodeGenerator() {
  const [input, setInput] = useState("");
  const [barHeight, setBarHeight] = useState(80);
  const [barWidth, setBarWidth] = useState(2);
  const [copied, setCopied] = useState(false);

  const bars = input.trim() ? encodeCode128(input) : [];
  const binaryString = bars.join("");

  const svgWidth = binaryString.length * barWidth + 20;
  const svgHeight = barHeight + 30;

  const handleDownload = () => {
    const svgEl = document.getElementById("barcode-svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "barcode.svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySvg = () => {
    const svgEl = document.getElementById("barcode-svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    navigator.clipboard.writeText(svgData);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input Text</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            placeholder="Enter text to encode as Code 128 barcode..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Bar Height: {barHeight}px
            <input type="range" min={40} max={200} value={barHeight} onChange={(e) => setBarHeight(Number(e.target.value))} className="w-32" />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Bar Width: {barWidth}px
            <input type="range" min={1} max={5} value={barWidth} onChange={(e) => setBarWidth(Number(e.target.value))} className="w-24" />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySvg}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy SVG"}
          </button>
          <button
            onClick={handleDownload}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Download SVG
          </button>
          <button
            onClick={() => setInput("")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col items-center">
        <label className="text-sm font-medium text-gray-700 mb-3 block self-start">Barcode Preview (Code 128)</label>
        {input.trim() ? (
          <div className="overflow-x-auto w-full flex justify-center">
            <svg id="barcode-svg" width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
              <rect width={svgWidth} height={svgHeight} fill="white" />
              {binaryString.split("").map((bit, i) => (
                bit === "1" ? (
                  <rect key={i} x={10 + i * barWidth} y={5} width={barWidth} height={barHeight} fill="black" />
                ) : null
              ))}
              <text x={svgWidth / 2} y={barHeight + 20} textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#333">
                {input}
              </text>
            </svg>
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-8">Enter text to generate a barcode</p>
        )}
      </div>
    </div>
  );
}
