"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Upload, Trash2 } from "lucide-react";

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}

function quantize(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function extractColors(imageData: ImageData, count: number): string[] {
  const { data, width, height } = imageData;
  const step = 32;
  const sampleStep = Math.max(1, Math.floor((width * height) / 10000));
  const colorMap = new Map<string, number>();

  for (let i = 0; i < data.length; i += 4 * sampleStep) {
    const r = quantize(data[i], step);
    const g = quantize(data[i + 1], step);
    const b = quantize(data[i + 2], step);
    const a = data[i + 3];
    if (a < 128) continue;
    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  const sorted = Array.from(colorMap.entries()).sort((a, b) => b[1] - a[1]);
  const result: string[] = [];
  for (const [key] of sorted) {
    const [r, g, b] = key.split(",").map(Number);
    const hex = rgbToHex(r, g, b);
    const isDuplicate = result.some((existing) => {
      const [er, eg, eb] = [parseInt(existing.slice(1, 3), 16), parseInt(existing.slice(3, 5), 16), parseInt(existing.slice(5, 7), 16)];
      return Math.sqrt((r - er) ** 2 + (g - eg) ** 2 + (b - eb) ** 2) < 50;
    });
    if (!isDuplicate) result.push(hex);
    if (result.length >= count) break;
  }
  return result;
}

export default function ImageColorExtractor() {
  const [colors, setColors] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxSize = 300;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setColors(extractColors(imageData, 8));
    };
    img.src = url;
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(colors.join("\n"));
    setCopiedKey("all");
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleClear = () => {
    setColors([]);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 cursor-pointer">
          <Upload className="h-4 w-4" /> Upload Image
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        {colors.length > 0 && (
          <button onClick={handleCopyAll} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {copiedKey === "all" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedKey === "all" ? "Copied" : "Copy All"}
          </button>
        )}
        {previewUrl && (
          <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {previewUrl && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Image Preview</label>
          <img src={previewUrl} alt="Uploaded" className="max-h-64 rounded-lg border border-gray-100 object-contain" />
        </div>
      )}

      {colors.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Extracted Palette</label>
          <div className="flex rounded-xl overflow-hidden h-16 mb-4">
            {colors.map((c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {colors.map((c, i) => (
              <button key={i} onClick={() => handleCopy(c, c)} className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-3 hover:border-gray-300 transition-colors">
                <div className="w-full aspect-square rounded-lg border border-gray-100 shadow-sm" style={{ backgroundColor: c }} />
                <span className="font-mono text-xs text-gray-700">{copiedKey === c ? "Copied!" : c}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!previewUrl && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-500">
          Upload an image to extract its dominant colors.
        </div>
      )}
    </div>
  );
}
