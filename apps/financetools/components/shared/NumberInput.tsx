"use client";

import React, { useCallback, useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: "$" | "%" | "";
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
  className?: string;
  helpText?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  prefix = "",
  suffix = "",
  min = 0,
  max = 10000000,
  step = 1,
  showSlider = false,
  className,
  helpText,
}: NumberInputProps) {
  const id = useId();
  const [displayValue, setDisplayValue] = useState(() => formatDisplay(value, prefix));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatDisplay(value, prefix));
    }
  }, [value, isFocused, prefix]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.-]/g, "");
      setDisplayValue(raw);
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        const clamped = Math.min(Math.max(parsed, min), max);
        onChange(clamped);
      }
    },
    [onChange, min, max]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setDisplayValue(formatDisplay(value, prefix));
  }, [value, prefix]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setDisplayValue(value.toString());
  }, [value]);

  const handleSliderChange = useCallback(
    (values: number[]) => {
      onChange(values[0]);
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          aria-label={label}
          className={cn(
            "flex h-10 w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
            prefix ? "pl-7 pr-3" : "px-3",
            suffix ? "pr-10" : ""
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
      {showSlider && (
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          aria-label={label}
          className="mt-2"
        />
      )}
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}

function formatDisplay(value: number, prefix: string): string {
  if (prefix === "$") {
    return new Intl.NumberFormat("en-US").format(value);
  }
  if (prefix === "%") {
    return value.toString();
  }
  return new Intl.NumberFormat("en-US").format(value);
}
