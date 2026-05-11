"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Play, Container } from "lucide-react";

interface ParsedDocker {
  image: string;
  name?: string;
  ports: string[];
  volumes: string[];
  envVars: string[];
  restart?: string;
  detach: boolean;
  network?: string;
  cpus?: string;
  memory?: string;
  command?: string;
}

function parseDockerRun(cmd: string): ParsedDocker | null {
  const cleaned = cmd.trim().replace(/\\\n/g, " ").replace(/\s+/g, " ");
  if (!cleaned.startsWith("docker run")) return null;

  const result: ParsedDocker = { image: "", ports: [], volumes: [], envVars: [], detach: false };
  const tokens: string[] = [];

  // Tokenize respecting quotes
  let i = 0;
  const str = cleaned;
  while (i < str.length) {
    if (str[i] === " ") { i++; continue; }
    if (str[i] === '"' || str[i] === "'") {
      const quote = str[i];
      let token = "";
      i++;
      while (i < str.length && str[i] !== quote) { token += str[i]; i++; }
      i++;
      tokens.push(token);
    } else {
      let token = "";
      while (i < str.length && str[i] !== " ") { token += str[i]; i++; }
      tokens.push(token);
    }
  }

  // Skip "docker" and "run"
  let idx = 2;
  while (idx < tokens.length) {
    const t = tokens[idx];
    if (t === "-p" || t === "--publish") {
      idx++;
      if (idx < tokens.length) result.ports.push(tokens[idx]);
    } else if (t === "-v" || t === "--volume") {
      idx++;
      if (idx < tokens.length) result.volumes.push(tokens[idx]);
    } else if (t === "-e" || t === "--env") {
      idx++;
      if (idx < tokens.length) result.envVars.push(tokens[idx]);
    } else if (t === "--name") {
      idx++;
      if (idx < tokens.length) result.name = tokens[idx];
    } else if (t === "--restart") {
      idx++;
      if (idx < tokens.length) result.restart = tokens[idx];
    } else if (t === "--network" || t === "--net") {
      idx++;
      if (idx < tokens.length) result.network = tokens[idx];
    } else if (t === "--cpus") {
      idx++;
      if (idx < tokens.length) result.cpus = tokens[idx];
    } else if (t === "--memory" || t === "-m") {
      idx++;
      if (idx < tokens.length) result.memory = tokens[idx];
    } else if (t === "-d" || t === "--detach") {
      result.detach = true;
    } else if (t.startsWith("-p=")) {
      result.ports.push(t.slice(3));
    } else if (t.startsWith("-e=") || t.startsWith("--env=")) {
      result.envVars.push(t.split("=").slice(1).join("="));
    } else if (t.startsWith("--name=")) {
      result.name = t.split("=").slice(1).join("=");
    } else if (t.startsWith("--restart=")) {
      result.restart = t.split("=").slice(1).join("=");
    } else if (t.startsWith("--network=") || t.startsWith("--net=")) {
      result.network = t.split("=").slice(1).join("=");
    } else if (t.startsWith("--cpus=")) {
      result.cpus = t.split("=")[1];
    } else if (t.startsWith("--memory=")) {
      result.memory = t.split("=")[1];
    } else if (!t.startsWith("-")) {
      // Image or command
      if (!result.image) {
        result.image = t;
      } else {
        result.command = tokens.slice(idx).join(" ");
        break;
      }
    }
    idx++;
  }

  return result.image ? result : null;
}

function toCompose(parsed: ParsedDocker): string {
  const serviceName = parsed.name || parsed.image.split("/").pop()?.split(":")[0] || "app";
  const lines: string[] = ["version: '3.8'", "", "services:", `  ${serviceName}:`];
  lines.push(`    image: ${parsed.image}`);
  if (parsed.name) lines.push(`    container_name: ${parsed.name}`);
  if (parsed.restart) lines.push(`    restart: ${parsed.restart}`);
  if (parsed.network) {
    lines.push(`    networks:`);
    lines.push(`      - ${parsed.network}`);
  }
  if (parsed.ports.length > 0) {
    lines.push("    ports:");
    parsed.ports.forEach((p) => lines.push(`      - "${p}"`));
  }
  if (parsed.volumes.length > 0) {
    lines.push("    volumes:");
    parsed.volumes.forEach((v) => lines.push(`      - ${v}`));
  }
  if (parsed.envVars.length > 0) {
    lines.push("    environment:");
    parsed.envVars.forEach((e) => {
      const eqIdx = e.indexOf("=");
      if (eqIdx >= 0) {
        lines.push(`      - ${e}`);
      } else {
        lines.push(`      - ${e}`);
      }
    });
  }
  if (parsed.cpus || parsed.memory) {
    lines.push("    deploy:");
    lines.push("      resources:");
    lines.push("        limits:");
    if (parsed.cpus) lines.push(`          cpus: '${parsed.cpus}'`);
    if (parsed.memory) lines.push(`          memory: ${parsed.memory}`);
  }
  if (parsed.command) {
    lines.push(`    command: ${parsed.command}`);
  }
  if (parsed.network) {
    lines.push("");
    lines.push("networks:");
    lines.push(`  ${parsed.network}:`);
    lines.push("    external: true");
  }

  return lines.join("\n");
}

export default function DockerRunToCompose() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const parsed = input.trim() ? parseDockerRun(input) : null;
  const output = parsed ? toCompose(parsed) : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const examples = [
    'docker run -d --name nginx -p 80:80 -p 443:443 -v /data:/usr/share/nginx/html --restart always nginx:latest',
    'docker run -d --name postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=mydb -p 5432:5432 -v pgdata:/var/lib/postgresql/data --restart unless-stopped postgres:15',
    'docker run -d --name redis --network mynet -p 6379:6379 --memory 256m --cpus 0.5 redis:alpine',
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              Example {i + 1}
            </button>
          ))}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Docker Run Command</label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            className="w-full h-32 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder='docker run -d --name myapp -p 8080:80 -v ./data:/data -e NODE_ENV=production node:18'
            spellCheck={false}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy YAML"}
          </button>
          <button onClick={() => { setInput(""); setError(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {input.trim() && !parsed && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Could not parse the docker run command. Make sure it starts with &quot;docker run&quot; and includes an image name.
        </div>
      )}

      {output && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <label className="text-sm font-medium text-gray-700 block flex items-center gap-2">
            <Container className="h-4 w-4" /> docker-compose.yml
          </label>
          <pre className="text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre">
            {output}
          </pre>
        </div>
      )}

      {parsed && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
            <Play className="h-4 w-4" /> Parsed Flags
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500">Image</span>
              <p className="font-mono text-gray-800">{parsed.image}</p>
            </div>
            {parsed.name && (
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500">Name</span>
                <p className="font-mono text-gray-800">{parsed.name}</p>
              </div>
            )}
            {parsed.restart && (
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500">Restart</span>
                <p className="font-mono text-gray-800">{parsed.restart}</p>
              </div>
            )}
            {parsed.network && (
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500">Network</span>
                <p className="font-mono text-gray-800">{parsed.network}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500">Detach</span>
              <p className="font-mono text-gray-800">{parsed.detach ? "Yes" : "No"}</p>
            </div>
            {parsed.ports.length > 0 && (
              <div className="bg-gray-50 rounded-lg px-3 py-2 col-span-2 sm:col-span-3">
                <span className="text-xs text-gray-500">Ports ({parsed.ports.length})</span>
                <p className="font-mono text-gray-800">{parsed.ports.join(", ")}</p>
              </div>
            )}
            {parsed.volumes.length > 0 && (
              <div className="bg-gray-50 rounded-lg px-3 py-2 col-span-2 sm:col-span-3">
                <span className="text-xs text-gray-500">Volumes ({parsed.volumes.length})</span>
                <p className="font-mono text-gray-800">{parsed.volumes.join(", ")}</p>
              </div>
            )}
            {parsed.envVars.length > 0 && (
              <div className="bg-gray-50 rounded-lg px-3 py-2 col-span-2 sm:col-span-3">
                <span className="text-xs text-gray-500">Environment ({parsed.envVars.length})</span>
                <p className="font-mono text-gray-800 break-all">{parsed.envVars.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
