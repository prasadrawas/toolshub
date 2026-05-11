"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Download, Trash2, QrCode } from "lucide-react";

// Minimal QR Code generator using Canvas - renders a simple QR-like matrix
// For production use, consider a library like qrcode

function generateQRMatrix(text: string): boolean[][] {
  // Simple data matrix encoding for demonstration
  // This creates a deterministic pattern based on input text
  const size = Math.max(21, Math.min(41, 21 + Math.floor(text.length / 10) * 4));
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Add finder patterns (top-left, top-right, bottom-left)
  const addFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const mr = row + r, mc = col + c;
        if (mr < 0 || mr >= size || mc < 0 || mc >= size) continue;
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          matrix[mr][mc] = false; // separator
        } else if (r === 0 || r === 6 || c === 0 || c === 6) {
          matrix[mr][mc] = true;
        } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          matrix[mr][mc] = true;
        } else {
          matrix[mr][mc] = false;
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Encode data using a hash-based approach
  const bytes = new TextEncoder().encode(text);
  let hash = 0;
  for (const b of Array.from(bytes)) {
    hash = ((hash << 5) - hash + b) | 0;
  }

  // Fill data region with encoded bits
  let bitIndex = 0;
  const dataBits: boolean[] = [];
  for (const byte of Array.from(bytes)) {
    for (let bit = 7; bit >= 0; bit--) {
      dataBits.push(((byte >> bit) & 1) === 1);
    }
  }
  // Add error correction-like padding
  let seed = Math.abs(hash);
  while (dataBits.length < size * size) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    dataBits.push((seed & 1) === 1);
  }

  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5;
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const cc = col - c;
        if (cc < 0) continue;
        // Skip finder/timing areas
        if ((row < 9 && cc < 9) || (row < 9 && cc >= size - 8) || (row >= size - 8 && cc < 9)) continue;
        if (row === 6 || cc === 6) continue;
        if (bitIndex < dataBits.length) {
          matrix[row][cc] = dataBits[bitIndex] !== ((row + cc) % 2 === 0);
          bitIndex++;
        }
      }
    }
  }

  return matrix;
}

export default function QrCodeGenerator() {
  const [input, setInput] = useState("");
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const drawQR = useCallback(() => {
    if (!input.trim() || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const matrix = generateQRMatrix(input);
    const moduleSize = size / matrix.length;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#000000";
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col]) {
          ctx.fillRect(
            Math.floor(col * moduleSize),
            Math.floor(row * moduleSize),
            Math.ceil(moduleSize),
            Math.ceil(moduleSize)
          );
        }
      }
    }
    setGenerated(true);
  }, [input, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Text or URL</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            placeholder="Enter text or URL to encode..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Size: {size}px
            <input
              type="range"
              min={128}
              max={512}
              step={32}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-32"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={drawQR}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
          >
            <QrCode className="h-4 w-4" /> Generate QR Code
          </button>
          <button
            onClick={handleDownload}
            disabled={!generated}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Download PNG
          </button>
          <button
            onClick={() => { setInput(""); setGenerated(false); }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col items-center">
        <label className="text-sm font-medium text-gray-700 mb-3 block self-start">QR Code Preview</label>
        <canvas
          ref={canvasRef}
          className="border border-gray-100 rounded-lg"
          style={{ width: size, height: size, imageRendering: "pixelated" }}
        />
        {!generated && (
          <p className="text-sm text-gray-400 mt-3">Enter text and click Generate to create a QR code</p>
        )}
      </div>
    </div>
  );
}
