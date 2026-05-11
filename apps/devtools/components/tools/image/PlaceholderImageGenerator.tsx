"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Download, RefreshCw } from "lucide-react";

export default function PlaceholderImageGenerator() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState("#cccccc");
  const [textColor, setTextColor] = useState("#666666");
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const displayText = text || `${width} x ${height}`;

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    const fontSize = Math.max(12, Math.min(width, height) / 8);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, width / 2, height / 2);
  };

  useEffect(() => {
    draw();
  }, [width, height, bgColor, textColor, text]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `placeholder-${width}x${height}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Width
            <input
              type="number"
              min={1}
              max={2000}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Height
            <input
              type="number"
              min={1}
              max={2000}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            BG
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Text
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
            />
          </label>
        </div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Custom Text
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`${width} x ${height}`}
            className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={download}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Download className="h-4 w-4" /> Download PNG
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 flex justify-center overflow-auto">
        <canvas
          ref={canvasRef}
          className="rounded-lg"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
