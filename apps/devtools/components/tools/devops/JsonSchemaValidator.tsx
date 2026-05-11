"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Trash2, Play } from "lucide-react";

interface ValidationError {
  path: string;
  message: string;
}

function validateAgainstSchema(data: unknown, schema: Record<string, unknown>, path: string = ""): ValidationError[] {
  const errors: ValidationError[] = [];
  const currentPath = path || "$";

  // Type validation
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actualType = data === null ? "null" : Array.isArray(data) ? "array" : typeof data;
    // Map "integer" to number check
    const typeMatch = types.some((t) => {
      if (t === "integer") return typeof data === "number" && Number.isInteger(data);
      if (t === "array") return Array.isArray(data);
      if (t === "null") return data === null;
      return actualType === t;
    });
    if (!typeMatch) {
      errors.push({ path: currentPath, message: `Expected type "${types.join(" | ")}" but got "${actualType}"` });
      return errors; // No point continuing with wrong type
    }
  }

  // Enum validation
  if (schema.enum && Array.isArray(schema.enum)) {
    if (!schema.enum.some((v: unknown) => JSON.stringify(v) === JSON.stringify(data))) {
      errors.push({ path: currentPath, message: `Value must be one of: ${JSON.stringify(schema.enum)}` });
    }
  }

  // String validations
  if (typeof data === "string") {
    if (typeof schema.minLength === "number" && data.length < schema.minLength) {
      errors.push({ path: currentPath, message: `String length ${data.length} is less than minLength ${schema.minLength}` });
    }
    if (typeof schema.maxLength === "number" && data.length > schema.maxLength) {
      errors.push({ path: currentPath, message: `String length ${data.length} exceeds maxLength ${schema.maxLength}` });
    }
    if (typeof schema.pattern === "string") {
      try {
        if (!new RegExp(schema.pattern).test(data)) {
          errors.push({ path: currentPath, message: `String does not match pattern "${schema.pattern}"` });
        }
      } catch {}
    }
  }

  // Number validations
  if (typeof data === "number") {
    if (typeof schema.minimum === "number" && data < schema.minimum) {
      errors.push({ path: currentPath, message: `Value ${data} is less than minimum ${schema.minimum}` });
    }
    if (typeof schema.maximum === "number" && data > schema.maximum) {
      errors.push({ path: currentPath, message: `Value ${data} exceeds maximum ${schema.maximum}` });
    }
  }

  // Object validations
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;

    // Required
    if (Array.isArray(schema.required)) {
      for (const key of schema.required as string[]) {
        if (!(key in obj)) {
          errors.push({ path: `${currentPath}.${key}`, message: `Missing required property "${key}"` });
        }
      }
    }

    // Properties
    if (schema.properties && typeof schema.properties === "object") {
      const props = schema.properties as Record<string, Record<string, unknown>>;
      for (const [key, propSchema] of Object.entries(props)) {
        if (key in obj) {
          errors.push(...validateAgainstSchema(obj[key], propSchema, `${currentPath}.${key}`));
        }
      }
    }

    // Additional properties
    if (schema.additionalProperties === false && schema.properties) {
      const allowed = new Set(Object.keys(schema.properties as object));
      for (const key of Object.keys(obj)) {
        if (!allowed.has(key)) {
          errors.push({ path: `${currentPath}.${key}`, message: `Additional property "${key}" is not allowed` });
        }
      }
    }
  }

  // Array validations
  if (Array.isArray(data)) {
    if (typeof schema.minItems === "number" && data.length < schema.minItems) {
      errors.push({ path: currentPath, message: `Array has ${data.length} items, minItems is ${schema.minItems}` });
    }
    if (typeof schema.maxItems === "number" && data.length > schema.maxItems) {
      errors.push({ path: currentPath, message: `Array has ${data.length} items, maxItems is ${schema.maxItems}` });
    }
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
  "required": ["name", "age", "email"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0, "maximum": 150 },
    "email": { "type": "string", "pattern": "^.+@.+\\\\..+$" },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    }
  }
}`;

const EXAMPLE_DATA = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "tags": ["developer", "designer"]
}`;

export default function JsonSchemaValidator() {
  const [schema, setSchema] = useState(EXAMPLE_SCHEMA);
  const [data, setData] = useState(EXAMPLE_DATA);
  const [result, setResult] = useState<{ valid: boolean; errors: ValidationError[] } | null>(null);
  const [parseError, setParseError] = useState("");

  const validate = () => {
    setParseError("");
    setResult(null);
    try {
      const parsedSchema = JSON.parse(schema);
      let parsedData: unknown;
      try {
        parsedData = JSON.parse(data);
      } catch {
        setParseError("Invalid JSON data. Check the right panel for syntax errors.");
        return;
      }
      const errors = validateAgainstSchema(parsedData, parsedSchema);
      setResult({ valid: errors.length === 0, errors });
    } catch {
      setParseError("Invalid JSON schema. Check the left panel for syntax errors.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={validate} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Play className="h-4 w-4" /> Validate
        </button>
        <button onClick={() => { setSchema(EXAMPLE_SCHEMA); setData(EXAMPLE_DATA); setResult(null); setParseError(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          Load Example
        </button>
        <button onClick={() => { setSchema(""); setData(""); setResult(null); setParseError(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      {parseError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{parseError}</div>
      )}

      {result && (
        <div className={cn("rounded-xl border p-3 text-sm flex items-center gap-2", result.valid ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-600")}>
          {result.valid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {result.valid ? "Validation passed! Data matches the schema." : `Validation failed with ${result.errors.length} error(s).`}
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
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSON Data</label>
          <textarea
            value={data}
            onChange={(e) => { setData(e.target.value); setResult(null); }}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Paste JSON data to validate..."
            spellCheck={false}
          />
        </div>
      </div>

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
