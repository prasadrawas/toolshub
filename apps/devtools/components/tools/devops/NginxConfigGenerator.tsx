"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Download, Server } from "lucide-react";

interface NginxConfig {
  serverName: string;
  listenPort: string;
  rootPath: string;
  ssl: boolean;
  sslCertPath: string;
  sslKeyPath: string;
  proxyPass: string;
  gzip: boolean;
  staticCaching: boolean;
}

function generateConfig(cfg: NginxConfig): string {
  const lines: string[] = [];

  lines.push("server {");

  // Listen
  if (cfg.ssl) {
    lines.push(`    listen ${cfg.listenPort} ssl http2;`);
    lines.push(`    listen [::]:${cfg.listenPort} ssl http2;`);
  } else {
    lines.push(`    listen ${cfg.listenPort};`);
    lines.push(`    listen [::]:${cfg.listenPort};`);
  }

  // Server name
  if (cfg.serverName) {
    lines.push(`    server_name ${cfg.serverName};`);
  }

  // Root
  if (cfg.rootPath && !cfg.proxyPass) {
    lines.push("");
    lines.push(`    root ${cfg.rootPath};`);
    lines.push("    index index.html index.htm;");
  }

  // SSL
  if (cfg.ssl) {
    lines.push("");
    lines.push("    # SSL Configuration");
    lines.push(`    ssl_certificate ${cfg.sslCertPath || "/etc/ssl/certs/server.crt"};`);
    lines.push(`    ssl_certificate_key ${cfg.sslKeyPath || "/etc/ssl/private/server.key"};`);
    lines.push("    ssl_protocols TLSv1.2 TLSv1.3;");
    lines.push("    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;");
    lines.push("    ssl_prefer_server_ciphers off;");
    lines.push("    ssl_session_cache shared:SSL:10m;");
    lines.push("    ssl_session_timeout 10m;");
  }

  // Gzip
  if (cfg.gzip) {
    lines.push("");
    lines.push("    # Gzip Compression");
    lines.push("    gzip on;");
    lines.push("    gzip_vary on;");
    lines.push("    gzip_proxied any;");
    lines.push("    gzip_comp_level 6;");
    lines.push("    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;");
    lines.push("    gzip_min_length 256;");
  }

  // Proxy pass
  if (cfg.proxyPass) {
    lines.push("");
    lines.push("    location / {");
    lines.push(`        proxy_pass ${cfg.proxyPass};`);
    lines.push("        proxy_http_version 1.1;");
    lines.push('        proxy_set_header Upgrade $http_upgrade;');
    lines.push("        proxy_set_header Connection 'upgrade';");
    lines.push("        proxy_set_header Host $host;");
    lines.push("        proxy_set_header X-Real-IP $remote_addr;");
    lines.push("        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;");
    lines.push("        proxy_set_header X-Forwarded-Proto $scheme;");
    lines.push("        proxy_cache_bypass $http_upgrade;");
    lines.push("    }");
  } else {
    lines.push("");
    lines.push("    location / {");
    lines.push("        try_files $uri $uri/ =404;");
    lines.push("    }");
  }

  // Static file caching
  if (cfg.staticCaching) {
    lines.push("");
    lines.push("    # Static File Caching");
    lines.push("    location ~* \\.(jpg|jpeg|png|gif|ico|svg|webp)$ {");
    lines.push("        expires 30d;");
    lines.push("        add_header Cache-Control \"public, immutable\";");
    lines.push("    }");
    lines.push("");
    lines.push("    location ~* \\.(css|js|woff|woff2|ttf|eot)$ {");
    lines.push("        expires 7d;");
    lines.push("        add_header Cache-Control \"public\";");
    lines.push("    }");
  }

  // Error pages
  lines.push("");
  lines.push("    error_page 404 /404.html;");
  lines.push("    error_page 500 502 503 504 /50x.html;");

  lines.push("}");

  // HTTP to HTTPS redirect
  if (cfg.ssl) {
    lines.push("");
    lines.push("# HTTP to HTTPS redirect");
    lines.push("server {");
    lines.push("    listen 80;");
    lines.push("    listen [::]:80;");
    if (cfg.serverName) lines.push(`    server_name ${cfg.serverName};`);
    lines.push("    return 301 https://$host$request_uri;");
    lines.push("}");
  }

  return lines.join("\n");
}

export default function NginxConfigGenerator() {
  const [config, setConfig] = useState<NginxConfig>({
    serverName: "example.com",
    listenPort: "443",
    rootPath: "/var/www/html",
    ssl: true,
    sslCertPath: "/etc/ssl/certs/server.crt",
    sslKeyPath: "/etc/ssl/private/server.key",
    proxyPass: "",
    gzip: true,
    staticCaching: true,
  });
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => generateConfig(config), [config]);

  const update = (field: keyof NginxConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nginx.conf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const presets = [
    { label: "Static Site", action: () => setConfig({ serverName: "example.com", listenPort: "80", rootPath: "/var/www/html", ssl: false, sslCertPath: "", sslKeyPath: "", proxyPass: "", gzip: true, staticCaching: true }) },
    { label: "Reverse Proxy", action: () => setConfig({ serverName: "api.example.com", listenPort: "443", rootPath: "", ssl: true, sslCertPath: "/etc/ssl/certs/server.crt", sslKeyPath: "/etc/ssl/private/server.key", proxyPass: "http://localhost:3000", gzip: true, staticCaching: false }) },
    { label: "SSL Static", action: () => setConfig({ serverName: "example.com", listenPort: "443", rootPath: "/var/www/html", ssl: true, sslCertPath: "/etc/ssl/certs/server.crt", sslKeyPath: "/etc/ssl/private/server.key", proxyPass: "", gzip: true, staticCaching: true }) },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button key={p.label} onClick={p.action} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Server Name</label>
            <input type="text" value={config.serverName} onChange={(e) => update("serverName", e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="example.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Listen Port</label>
            <input type="text" value={config.listenPort} onChange={(e) => update("listenPort", e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="80" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Root Path</label>
            <input type="text" value={config.rootPath} onChange={(e) => update("rootPath", e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="/var/www/html" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Proxy Pass URL</label>
            <input type="text" value={config.proxyPass} onChange={(e) => update("proxyPass", e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="http://localhost:3000 (leave empty for static)" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input type="checkbox" checked={config.ssl} onChange={(e) => update("ssl", e.target.checked)} className="rounded border-gray-300" />
            SSL / HTTPS
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input type="checkbox" checked={config.gzip} onChange={(e) => update("gzip", e.target.checked)} className="rounded border-gray-300" />
            Gzip Compression
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input type="checkbox" checked={config.staticCaching} onChange={(e) => update("staticCaching", e.target.checked)} className="rounded border-gray-300" />
            Static File Caching
          </label>
        </div>

        {config.ssl && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">SSL Certificate Path</label>
              <input type="text" value={config.sslCertPath} onChange={(e) => update("sslCertPath", e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="/etc/ssl/certs/server.crt" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">SSL Key Path</label>
              <input type="text" value={config.sslKeyPath} onChange={(e) => update("sslKeyPath", e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="/etc/ssl/private/server.key" />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy Config"}
          </button>
          <button onClick={handleDownload} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Download className="h-4 w-4" /> Download
          </button>
          <button onClick={() => setConfig({ serverName: "", listenPort: "80", rootPath: "", ssl: false, sslCertPath: "", sslKeyPath: "", proxyPass: "", gzip: false, staticCaching: false })} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Trash2 className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
          <Server className="h-4 w-4" /> Generated nginx.conf
        </label>
        <pre className="text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre max-h-[500px] overflow-y-auto">
          {output}
        </pre>
      </div>
    </div>
  );
}
