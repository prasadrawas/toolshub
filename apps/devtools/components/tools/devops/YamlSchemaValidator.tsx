"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Trash2, Play } from "lucide-react";

interface ValidationError {
  path: string;
  message: string;
}

// Simple YAML parser that handles common cases
function parseYaml(yaml: string): unknown {
  const lines = yaml.split("\n");
  const result: Record<string, unknown> = {};
  const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: result, indent: -1 }];
  let currentKey = "";
  let inArray = false;
  let arrayKey = "";
  let arrayItems: unknown[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimEnd();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const indent = line.length - line.trimStart().length;
    const content = trimmed.trimStart();

    // Pop stack for lower indentation
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      if (inArray && arrayKey) {
        stack[stack.length - 1].obj[arrayKey] = arrayItems;
        inArray = false;
        arrayItems = [];
        arrayKey = "";
      }
      stack.pop();
    }

    // Array item
    if (content.startsWith("- ")) {
      const val = content.slice(2).trim();
      if (!inArray) {
        inArray = true;
        arrayKey = currentKey;
        arrayItems = [];
      }
      arrayItems.push(parseYamlValue(val));
      continue;
    }

    // Finish any pending array
    if (inArray && arrayKey) {
      const target = stack[stack.length - 1].obj;
      target[arrayKey] = arrayItems;
      inArray = false;
      arrayItems = [];
      arrayKey = "";
    }

    const colonIdx = content.indexOf(":");
    if (colonIdx === -1) continue;

    const key = content.slice(0, colonIdx).trim();
    const rawVal = content.slice(colonIdx + 1).trim();
    currentKey = key;

    const current = stack[stack.length - 1].obj;

    if (!rawVal) {
      // Nested object
      const nested: Record<string, unknown> = {};
      current[key] = nested;
      stack.push({ obj: nested, indent });
    } else {
      current[key] = parseYamlValue(rawVal);
    }
  }

  // Flush any remaining array
  if (inArray && arrayKey) {
    stack[stack.length - 1].obj[arrayKey] = arrayItems;
  }

  return result;
}

function parseYamlValue(val: string): unknown {
  if (val === "true" || val === "True" || val === "TRUE") return true;
  if (val === "false" || val === "False" || val === "FALSE") return false;
  if (val === "null" || val === "~" || val === "Null" || val === "NULL") return null;
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  // Strip quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  // Inline array
  if (val.startsWith("[") && val.endsWith("]")) {
    try { return JSON.parse(val); } catch {}
    return val.slice(1, -1).split(",").map((s) => parseYamlValue(s.trim()));
  }
  return val;
}

function validateAgainstSchema(data: unknown, schema: Record<string, unknown>, path: string = ""): ValidationError[] {
  const errors: ValidationError[] = [];
  const currentPath = path || "$";

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actualType = data === null ? "null" : Array.isArray(data) ? "array" : typeof data;
    const typeMatch = types.some((t) => {
      if (t === "integer") return typeof data === "number" && Number.isInteger(data);
      if (t === "array") return Array.isArray(data);
      if (t === "null") return data === null;
      return actualType === t;
    });
    if (!typeMatch) {
      errors.push({ path: currentPath, message: `Expected type "${types.join(" | ")}" but got "${actualType}"` });
      return errors;
    }
  }

  if (typeof data === "string") {
    if (typeof schema.minLength === "number" && data.length < schema.minLength)
      errors.push({ path: currentPath, message: `String length ${data.length} < minLength ${schema.minLength}` });
    if (typeof schema.maxLength === "number" && data.length > schema.maxLength)
      errors.push({ path: currentPath, message: `String length ${data.length} > maxLength ${schema.maxLength}` });
  }

  if (typeof data === "number") {
    if (typeof schema.minimum === "number" && data < schema.minimum)
      errors.push({ path: currentPath, message: `Value ${data} < minimum ${schema.minimum}` });
    if (typeof schema.maximum === "number" && data > schema.maximum)
      errors.push({ path: currentPath, message: `Value ${data} > maximum ${schema.maximum}` });
  }

  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(schema.required)) {
      for (const key of schema.required as string[]) {
        if (!(key in obj)) errors.push({ path: `${currentPath}.${key}`, message: `Missing required property "${key}"` });
      }
    }
    if (schema.properties && typeof schema.properties === "object") {
      const props = schema.properties as Record<string, Record<string, unknown>>;
      for (const [key, propSchema] of Object.entries(props)) {
        if (key in obj) errors.push(...validateAgainstSchema(obj[key], propSchema, `${currentPath}.${key}`));
      }
    }
  }

  if (Array.isArray(data)) {
    if (typeof schema.minItems === "number" && data.length < schema.minItems)
      errors.push({ path: currentPath, message: `Array has ${data.length} items, minItems is ${schema.minItems}` });
    if (schema.items && typeof schema.items === "object") {
      data.forEach((item, i) => {
        errors.push(...validateAgainstSchema(item, schema.items as Record<string, unknown>, `${currentPath}[${i}]`));
      });
    }
  }

  return errors;
}

const EXAMPLE_SCHEMA = `{
  "type": "object",
  "required": ["name", "version"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "version": { "type": "string" },
    "dependencies": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}`;

const EXAMPLE_YAML = `name: my-app
version: "1.0.0"
dependencies:
  - express
  - lodash
  - react`;

export default function YamlSchemaValidator() {
  const [schema, setSchema] = useState(EXAMPLE_SCHEMA);
  const [yaml, setYaml] = useState(EXAMPLE_YAML);
  const [result, setResult] = useState<{ valid: boolean; errors: ValidationError[]; parsed?: unknown } | null>(null);
  const [parseError, setParseError] = useState("");

  const validate = () => {
    setParseError("");
    setResult(null);
    let parsedSchema: Record<string, unknown>;
    try {
      parsedSchema = JSON.parse(schema);
    } catch {
      setParseError("Invalid JSON schema. Check for syntax errors.");
      return;
    }
    try {
      const parsedData = parseYaml(yaml);
      const errors = validateAgainstSchema(parsedData, parsedSchema);
      setResult({ valid: errors.length === 0, errors, parsed: parsedData });
    } catch (e: any) {
      setParseError(`Failed to parse YAML: ${e.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={validate} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Play className="h-4 w-4" /> Validate
        </button>
        <button onClick={() => { setSchema(EXAMPLE_SCHEMA); setYaml(EXAMPLE_YAML); setResult(null); setParseError(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          Load Example
        </button>
        <button onClick={() => { setSchema(""); setYaml(""); setResult(null); setParseError(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      {parseError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{parseError}</div>
      )}

      {result && (
        <div className={cn("rounded-xl border p-3 text-sm flex items-center gap-2", result.valid ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-600")}>
          {result.valid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {result.valid ? "Validation passed! YAML data matches the schema." : `Validation failed with ${result.errors.length} error(s).`}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSON Schema</label>
          <textarea
            value={schema}
            onChange={(e) => { setSchema(e.target.value); setResult(null); }}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Paste JSON Schema..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">YAML Data</label>
          <textarea
            value={yaml}
            onChange={(e) => { setYaml(e.target.value); setResult(null); }}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Paste YAML data to validate..."
            spellCheck={false}
          />
        </div>
      </div>

      {result && result.parsed !== undefined && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Parsed as JSON</label>
          <pre className="text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre">
            {JSON.stringify(result.parsed, null, 2)}
          </pre>
        </div>
      )}

      {result && !result.valid && result.errors.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Validation Errors</label>
          <div className="space-y-1.5">
            {result.errors.map((err, i) => (
              <div key={i} className="flex gap-2 text-sm bg-red-50 rounded-lg px-3 py-2">
                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-red-700">{err.path}</span>
                  <span className="text-red-600 ml-2">{err.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
