"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Plus, Trash2, Play, Pause } from "lucide-react";

interface Keyframe {
  offset: number;
  properties: { property: string; value: string }[];
}

const TIMING_FUNCTIONS = ["ease", "ease-in", "ease-out", "ease-in-out", "linear", "cubic-bezier(0.4, 0, 0.2, 1)"];

export default function AnimationGenerator() {
  const [name, setName] = useState("myAnimation");
  const [duration, setDuration] = useState("1s");
  const [timing, setTiming] = useState("ease");
  const [iterations, setIterations] = useState("infinite");
  const [playing, setPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    { offset: 0, properties: [{ property: "transform", value: "translateX(0)" }, { property: "opacity", value: "1" }] },
    { offset: 50, properties: [{ property: "transform", value: "translateX(100px)" }, { property: "opacity", value: "0.5" }] },
    { offset: 100, properties: [{ property: "transform", value: "translateX(0)" }, { property: "opacity", value: "1" }] },
  ]);

  const keyframesCSS = `@keyframes ${name} {\n${keyframes
    .map((kf) => `  ${kf.offset}% {\n${kf.properties.map((p) => `    ${p.property}: ${p.value};`).join("\n")}\n  }`)
    .join("\n")}\n}`;

  const animationCSS = `animation: ${name} ${duration} ${timing} ${iterations};`;
  const fullCSS = `${keyframesCSS}\n\n.element {\n  ${animationCSS}\n}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addKeyframe = () => {
    const newOffset = keyframes.length > 0 ? Math.min(100, keyframes[keyframes.length - 1].offset + 25) : 0;
    setKeyframes([...keyframes, { offset: newOffset, properties: [{ property: "opacity", value: "1" }] }]);
  };

  const removeKeyframe = (i: number) => {
    if (keyframes.length <= 2) return;
    setKeyframes(keyframes.filter((_, idx) => idx !== i));
  };

  const updateOffset = (i: number, offset: number) => {
    const next = [...keyframes];
    next[i].offset = Math.max(0, Math.min(100, offset));
    setKeyframes(next);
  };

  const addProperty = (kfIdx: number) => {
    const next = [...keyframes];
    next[kfIdx].properties.push({ property: "color", value: "#000" });
    setKeyframes(next);
  };

  const removeProperty = (kfIdx: number, pIdx: number) => {
    const next = [...keyframes];
    if (next[kfIdx].properties.length <= 1) return;
    next[kfIdx].properties = next[kfIdx].properties.filter((_, i) => i !== pIdx);
    setKeyframes(next);
  };

  const updateProperty = (kfIdx: number, pIdx: number, field: "property" | "value", val: string) => {
    const next = [...keyframes];
    next[kfIdx].properties[pIdx][field] = val;
    setKeyframes(next);
  };

  const [styleTag, setStyleTag] = useState("");
  useEffect(() => {
    setStyleTag(keyframesCSS);
  }, [keyframesCSS]);

  return (
    <div className="space-y-4">
      <style dangerouslySetInnerHTML={{ __html: styleTag }} />

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value.replace(/\s/g, ""))} className="w-32 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Duration
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Timing
            <select value={timing} onChange={(e) => setTiming(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none">
              {TIMING_FUNCTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Iterations
            <input type="text" value={iterations} onChange={(e) => setIterations(e.target.value)} className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={addKeyframe} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
            <Plus className="h-4 w-4" /> Add Keyframe
          </button>
          <button onClick={() => setPlaying(!playing)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "Pause" : "Play"}
          </button>
          <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg overflow-hidden">
          <div
            className="w-16 h-16 bg-brand-500 rounded-lg"
            style={{
              animation: playing ? `${name} ${duration} ${timing} ${iterations}` : "none",
            }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Keyframes</label>
        <div className="space-y-3">
          {keyframes.map((kf, kfIdx) => (
            <div key={kfIdx} className="rounded-lg border border-gray-100 p-3 space-y-2">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-sm text-gray-600">
                  <input type="number" min="0" max="100" value={kf.offset} onChange={(e) => updateOffset(kfIdx, +e.target.value)} className="w-16 rounded border border-gray-200 px-1.5 py-0.5 text-sm font-mono focus:border-brand-400 focus:outline-none" />
                  <span className="text-xs">%</span>
                </label>
                <button onClick={() => addProperty(kfIdx)} className="text-xs text-brand-600 hover:text-brand-700">+ Property</button>
                <button onClick={() => removeKeyframe(kfIdx)} disabled={keyframes.length <= 2} className="ml-auto rounded p-1 hover:bg-gray-100 disabled:opacity-30">
                  <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
              {kf.properties.map((p, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2 pl-4">
                  <input type="text" value={p.property} onChange={(e) => updateProperty(kfIdx, pIdx, "property", e.target.value)} className="w-28 rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono focus:border-brand-400 focus:outline-none" placeholder="property" />
                  <span className="text-gray-400">:</span>
                  <input type="text" value={p.value} onChange={(e) => updateProperty(kfIdx, pIdx, "value", e.target.value)} className="flex-1 rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono focus:border-brand-400 focus:outline-none" placeholder="value" />
                  <button onClick={() => removeProperty(kfIdx, pIdx)} disabled={kf.properties.length <= 1} className="rounded p-0.5 hover:bg-gray-100 disabled:opacity-30">
                    <Trash2 className="h-3 w-3 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS Code</label>
        <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">{fullCSS}</pre>
      </div>
    </div>
  );
}
