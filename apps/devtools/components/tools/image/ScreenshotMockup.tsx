"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, Trash2, Monitor, Smartphone, Tablet, Image } from "lucide-react";

type FrameType = "browser" | "phone" | "tablet";

export default function ScreenshotMockup() {
  const [imageSrc, setImageSrc] = useState("");
  const [frame, setFrame] = useState<FrameType>("browser");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setImageSrc("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const frames: { type: FrameType; label: string; icon: typeof Monitor }[] = [
    { type: "browser", label: "Browser", icon: Monitor },
    { type: "phone", label: "Phone", icon: Smartphone },
    { type: "tablet", label: "Tablet", icon: Tablet },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Upload className="h-4 w-4" /> Upload Screenshot
        </button>
        <button
          onClick={clear}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Frame Style</label>
        <div className="flex gap-2">
          {frames.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setFrame(type)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium",
                frame === type
                  ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      {imageSrc ? (
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-8 flex justify-center">
          {frame === "browser" && (
            <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl bg-white">
              <div className="bg-gray-200 px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center">
                  https://example.com
                </div>
              </div>
              <img src={imageSrc} alt="Screenshot" className="w-full" />
            </div>
          )}

          {frame === "phone" && (
            <div className="w-72 rounded-[2.5rem] overflow-hidden shadow-2xl bg-black p-2">
              <div className="bg-black rounded-t-[2rem] pt-6 pb-1 flex justify-center">
                <div className="w-20 h-5 bg-black rounded-full" />
              </div>
              <div className="rounded-[1.5rem] overflow-hidden">
                <img src={imageSrc} alt="Screenshot" className="w-full" />
              </div>
              <div className="bg-black py-3 flex justify-center">
                <div className="w-28 h-1 bg-gray-600 rounded-full" />
              </div>
            </div>
          )}

          {frame === "tablet" && (
            <div className="w-full max-w-lg rounded-[1.5rem] overflow-hidden shadow-2xl bg-black p-3">
              <div className="bg-black pt-2 pb-1 flex justify-center">
                <div className="w-2 h-2 rounded-full bg-gray-700" />
              </div>
              <div className="rounded-lg overflow-hidden">
                <img src={imageSrc} alt="Screenshot" className="w-full" />
              </div>
              <div className="bg-black py-2 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-gray-700" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <Image className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Upload a screenshot to preview in a device frame</p>
        </div>
      )}
    </div>
  );
}
