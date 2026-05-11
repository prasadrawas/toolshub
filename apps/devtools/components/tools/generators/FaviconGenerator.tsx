"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Download, Trash2, RefreshCw } from "lucide-react";

export default function FaviconGenerator() {
  const [emoji, setEmoji] = useState("🚀");
  const [bgColor, setBgColor] = useState("#3b82f6");
  const [size, setSize] = useState(64);
  const [shape, setShape] = useState<"square" | "circle" | "rounded">("rounded");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const drawFavicon = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Draw background shape
    ctx.fillStyle = bgColor;
    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === "rounded") {
      const r = size * 0.15;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    // Draw emoji/character
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${size * 0.55}px serif`;
    ctx.fillStyle = "#ffffff";

    // Check if it's an emoji (multi-byte) or a regular character
    const isEmoji = /[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\uFE00-\uFE0F]/.test(emoji);
    if (!isEmoji && emoji.length === 1) {
      ctx.fillStyle = "#ffffff";
    }
    ctx.fillText(emoji.slice(0, 2), size / 2, size / 2 + size * 0.03);

    setGenerated(true);

    // Draw preview sizes
    const preview = previewRef.current;
    if (preview) {
      const pctx = preview.getContext("2d");
      if (pctx) {
        preview.width = 200;
        preview.height = 48;
        pctx.clearRect(0, 0, 200, 48);

        const sizes = [16, 32, 48];
        let x = 0;
        for (const s of sizes) {
          pctx.drawImage(canvas, x, (48 - s) / 2, s, s);
          x += s + 12;
        }
      }
    }
  }, [emoji, bgColor, size, shape]);

  useEffect(() => {
    drawFavicon();
  }, [drawFavicon]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `favicon-${size}x${size}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Emoji or Character</label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              maxLength={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-2xl text-center focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => {
                  if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setBgColor(e.target.value);
                }}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Size: {size}px
            <input
              type="range"
              min={16}
              max={512}
              step={16}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-32"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Shape
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="square">Square</option>
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={drawFavicon}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <RefreshCw className="h-4 w-4" /> Regenerate
          </button>
          <button
            onClick={handleDownload}
            disabled={!generated}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Download PNG
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col items-center gap-4">
        <label className="text-sm font-medium text-gray-700 self-start">Favicon Preview</label>
        <canvas
          ref={canvasRef}
          className="border border-gray-100 rounded-lg"
          style={{ width: Math.min(size, 256), height: Math.min(size, 256), imageRendering: "pixelated" }}
        />
        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block text-center">Size Preview (16, 32, 48px)</label>
          <canvas ref={previewRef} className="border border-gray-100 rounded-lg" style={{ height: 48 }} />
        </div>
      </div>
    </div>
  );
}
