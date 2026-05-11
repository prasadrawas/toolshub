"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Download, Trash2, Search } from "lucide-react";

const TEMPLATES: Record<string, string> = {
  Node: `# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/
.next/
out/

# Env
.env
.env.local
.env.*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db`,

  Python: `# Byte-compiled
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
.env/
.venv/

# Distribution
dist/
build/
*.egg-info/
*.egg

# IDE
.idea/
.vscode/
*.swp

# Testing
.pytest_cache/
.coverage
htmlcov/`,

  Java: `# Compiled
*.class
*.jar
*.war
*.ear

# Build
target/
build/

# IDE
.idea/
*.iml
.eclipse/
.settings/
.project
.classpath

# Maven
pom.xml.tag
pom.xml.releaseBackup`,

  Go: `# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test
*.test
*.out
coverage.txt

# Vendor
vendor/

# IDE
.idea/
.vscode/`,

  Rust: `# Build
target/
Cargo.lock

# IDE
.idea/
.vscode/

# OS
.DS_Store`,

  React: `# Dependencies
node_modules/

# Build
build/
dist/
.next/

# Environment
.env
.env.local

# Testing
coverage/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db`,

  "C/C++": `# Object files
*.o
*.obj

# Libraries
*.lib
*.a
*.la

# Executables
*.exe
*.out
*.app

# Build
build/
cmake-build-*/

# IDE
.idea/
.vscode/
*.swp`,

  Ruby: `# Gems
*.gem
.bundle/
vendor/bundle/

# Environment
.env

# Logs
log/*.log

# IDE
.idea/
.vscode/

# OS
.DS_Store`,

  PHP: `# Dependencies
vendor/

# Environment
.env

# IDE
.idea/
.vscode/

# Cache
*.cache
.phpunit.result.cache

# OS
.DS_Store`,

  Swift: `# Build
.build/
DerivedData/
*.xcodeproj/xcuserdata/

# CocoaPods
Pods/

# SPM
.swiftpm/

# IDE
*.xcworkspace/xcuserdata/
*.playground/timeline.xctimeline`,

  Kotlin: `# Build
build/
.gradle/

# IDE
.idea/
*.iml

# OS
.DS_Store`,

  macOS: `.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.Spotlight-V100
.Trashes`,

  Windows: `Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk`,

  Linux: `*~
.fuse_hidden*
.directory
.Trash-*
.nfs*`,

  JetBrains: `.idea/
*.iml
*.iws
*.ipr
out/
.idea_modules/`,

  "VS Code": `.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace`,
};

export default function GitignoreGenerator() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const filteredTemplates = useMemo(() => {
    if (!search.trim()) return Object.keys(TEMPLATES);
    return Object.keys(TEMPLATES).filter((k) =>
      k.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const output = useMemo(() => {
    const parts: string[] = [];
    for (const name of Array.from(selected)) {
      if (TEMPLATES[name]) {
        parts.push(`# === ${name} ===`);
        parts.push(TEMPLATES[name]);
        parts.push("");
      }
    }
    return parts.join("\n");
  }, [selected]);

  const toggle = (name: string) => {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelected(next);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = ".gitignore";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            placeholder="Search templates..."
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredTemplates.map((name) => (
            <button
              key={name}
              onClick={() => toggle(name)}
              className={cn(
                "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                selected.has(name)
                  ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={selected.size === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            disabled={selected.size === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Download .gitignore
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {output && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Generated .gitignore</label>
          <pre className="text-sm font-mono text-gray-800 bg-gray-50 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
