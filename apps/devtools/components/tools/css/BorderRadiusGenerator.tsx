"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Link, Unlink } from "lucide-react";

export default function BorderRadiusGenerator() {
  const [linked, setLinked] = useState(true);
  const [all, setAll] = useState(16);
  const [tl, setTl] = useState(16);
  const [tr, setTr] = useState(16);
  const [br, setBr] = useState(16);
  const [bl, setBl] = useState(16);
  const [useSlash, setUseSlash] = useState(false);
  const [vAll, setVAll] = useState(16);
  const [vTl, setVTl] = useState(16);
  const [vTr, setVTr] = useState(16);
  const [vBr, setVBr] = useState(16);
  const [vBl, setVBl] = useState(16);
  const [copied, setCopied] = useState(false);

  const h = linked ? [all, all, all, all] : [tl, tr, br, bl];
  const v = linked ? [vAll, vAll, vAll, vAll] : [vTl, vTr, vBr, vBl];

  let css: string;
  if (useSlash) {
    css = `border-radius: ${h.map((v) => v + "px").join(" ")} / ${v.map((v) => v + "px").join(" ")};`;
  } else {
    const allSame = h.every((v) => v === h[0]);
    css = allSame ? `border-radius: ${h[0]}px;` : `border-radius: ${h.map((v) => v + "px").join(" ")};`;
  }

  const borderRadiusStyle = useSlash
    ? `${h[0]}px ${h[1]}px ${h[2]}px ${h[3]}px / ${v[0]}px ${v[1]}px ${v[2]}px ${v[3]}px`
    : `${h[0]}px ${h[1]}px ${h[2]}px ${h[3]}px`;

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLinkedChange = (val: number) => {
    setAll(val);
    setTl(val); setTr(val); setBr(val); setBl(val);
  };

  const handleVLinkedChange = (val: number) => {
    setVAll(val);
    setVTl(val); setVTr(val); setVBr(val); setVBl(val);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => setLinked(!linked)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {linked ? <Link className="h-4 w-4" /> : <Unlink className="h-4 w-4" />} {linked ? "Linked" : "Individual"}
          </button>
          <label className="flex items-center gap-1.5 text-sm text-gray-600">
            <input type="checkbox" checked={useSlash} onChange={(e) => setUseSlash(e.target.checked)} className="rounded" />
            Slash notation (h / v)
          </label>
          <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>

        {linked ? (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-20">All Corners</span>
              <input type="range" min="0" max="100" value={all} onChange={(e) => handleLinkedChange(+e.target.value)} className="flex-1" />
              <span className="w-12 font-mono text-xs text-right">{all}px</span>
            </label>
            {useSlash && (
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-20">Vertical</span>
                <input type="range" min="0" max="100" value={vAll} onChange={(e) => handleVLinkedChange(+e.target.value)} className="flex-1" />
                <span className="w-12 font-mono text-xs text-right">{vAll}px</span>
              </label>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {([
              ["Top Left", tl, setTl, vTl, setVTl],
              ["Top Right", tr, setTr, vTr, setVTr],
              ["Bottom Right", br, setBr, vBr, setVBr],
              ["Bottom Left", bl, setBl, vBl, setVBl],
            ] as const).map(([label, hVal, hSet, vVal, vSet]) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-20">{label}</span>
                <input type="range" min="0" max="100" value={hVal} onChange={(e) => (hSet as (v: number) => void)(+e.target.value)} className="flex-1" />
                <span className="w-10 font-mono text-xs text-right">{hVal}px</span>
                {useSlash && (
                  <>
                    <span className="text-gray-400">/</span>
                    <input type="range" min="0" max="100" value={vVal} onChange={(e) => (vSet as (v: number) => void)(+e.target.value)} className="flex-1" />
                    <span className="w-10 font-mono text-xs text-right">{vVal}px</span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="w-48 h-48 bg-brand-500" style={{ borderRadius: borderRadiusStyle }} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS Code</label>
        <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800">{css}</pre>
      </div>
    </div>
  );
}
