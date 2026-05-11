"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Trash2, Plus, X } from "lucide-react";

type FieldType = "name" | "email" | "phone" | "address" | "date" | "number" | "boolean" | "uuid";

interface Field {
  id: number;
  name: string;
  type: FieldType;
}

const FIRST_NAMES = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "example.com", "company.org", "mail.io", "test.dev"];
const STREETS = ["Main St", "Oak Ave", "Park Blvd", "Cedar Ln", "Maple Dr", "Elm St", "Washington Ave", "Lake Rd", "Hill Ct", "River Way"];
const CITIES = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "Austin"];
const STATES = ["NY", "CA", "IL", "TX", "AZ", "PA", "FL", "OH", "GA", "NC"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFieldValue(type: FieldType): any {
  switch (type) {
    case "name":
      return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    case "email": {
      const first = pick(FIRST_NAMES).toLowerCase();
      const last = pick(LAST_NAMES).toLowerCase();
      return `${first}.${last}${randomInt(1, 99)}@${pick(DOMAINS)}`;
    }
    case "phone":
      return `+1 (${randomInt(200, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
    case "address":
      return `${randomInt(100, 9999)} ${pick(STREETS)}, ${pick(CITIES)}, ${pick(STATES)} ${randomInt(10000, 99999)}`;
    case "date": {
      const year = randomInt(1980, 2025);
      const month = String(randomInt(1, 12)).padStart(2, "0");
      const day = String(randomInt(1, 28)).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    case "number":
      return randomInt(1, 10000);
    case "boolean":
      return Math.random() > 0.5;
    case "uuid":
      return crypto.randomUUID();
  }
}

export default function MockDataGenerator() {
  const [fields, setFields] = useState<Field[]>([
    { id: 1, name: "id", type: "uuid" },
    { id: 2, name: "name", type: "name" },
    { id: 3, name: "email", type: "email" },
    { id: 4, name: "phone", type: "phone" },
  ]);
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  let nextId = Math.max(0, ...fields.map((f) => f.id)) + 1;

  const addField = () => {
    setFields([...fields, { id: nextId++, name: "field", type: "name" }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: number, key: "name" | "type", value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const generate = () => {
    const data: Record<string, any>[] = [];
    for (let i = 0; i < count; i++) {
      const row: Record<string, any> = {};
      for (const field of fields) {
        row[field.name] = generateFieldValue(field.type);
      }
      data.push(row);
    }
    setOutput(JSON.stringify(data, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Schema Fields</label>
          <button
            onClick={addField}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <Plus className="h-3 w-3" /> Add Field
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(field.id, "name", e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                placeholder="field name"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(field.id, "type", e.target.value)}
                className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="address">Address</option>
                <option value="date">Date</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="uuid">UUID</option>
              </select>
              <button
                onClick={() => removeField(field.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Count
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <RefreshCw className="h-4 w-4" /> Generate
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy JSON"}
          </button>
          <button
            onClick={() => setOutput("")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {output && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Generated Mock Data (JSON)</label>
          <pre className="text-sm font-mono text-gray-800 bg-gray-50 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
