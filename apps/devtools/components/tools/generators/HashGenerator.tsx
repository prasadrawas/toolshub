"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Hash, Trash2 } from "lucide-react";

function md5(input: string): string {
  // Simple MD5 implementation
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
  }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }
  function add32(a: number, b: number) {
    return (a + b) & 0xFFFFFFFF;
  }

  const n = input.length;
  let state = [1732584193, -271733879, -1732584194, 271733878];
  let tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let i: number;
  for (i = 64; i <= n; i += 64) {
    const blk = [];
    for (let j = 0; j < 64; j += 4) {
      blk.push(
        input.charCodeAt(i - 64 + j) |
        (input.charCodeAt(i - 64 + j + 1) << 8) |
        (input.charCodeAt(i - 64 + j + 2) << 16) |
        (input.charCodeAt(i - 64 + j + 3) << 24)
      );
    }
    md5cycle(state, blk);
  }
  for (let j = 0; j < 16; j++) tail[j] = 0;
  for (let j = 0; j < n % 64; j++) {
    tail[j >> 2] |= input.charCodeAt(i - 64 + i % 64 === 0 ? j : i - (i % 64) + j) << ((j % 4) << 3);
  }
  // Simplified: re-encode remaining bytes
  tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const startIdx = n - (n % 64);
  for (let j = 0; j < n % 64; j++) {
    tail[j >> 2] |= input.charCodeAt(startIdx + j) << ((j % 4) << 3);
  }
  tail[(n % 64) >> 2] |= 0x80 << (((n % 64) % 4) << 3);
  if (n % 64 > 55) {
    md5cycle(state, tail);
    tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  tail[14] = n * 8;
  md5cycle(state, tail);

  const hex = "0123456789abcdef";
  let s = "";
  for (let j = 0; j < 4; j++) {
    for (let k = 0; k < 4; k++) {
      const byte = (state[j] >> (k * 8)) & 0xFF;
      s += hex[byte >> 4] + hex[byte & 0xF];
    }
  }
  return s;
}

async function webCryptoHash(algo: string, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const generate = async () => {
    setError("");
    try {
      const [sha1, sha256, sha512] = await Promise.all([
        webCryptoHash("SHA-1", input),
        webCryptoHash("SHA-256", input),
        webCryptoHash("SHA-512", input),
      ]);
      setHashes({
        MD5: md5(input),
        "SHA-1": sha1,
        "SHA-256": sha256,
        "SHA-512": sha512,
      });
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Enter text to hash..."
            spellCheck={false}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <Hash className="h-4 w-4" /> Generate Hashes
          </button>
          <button
            onClick={() => { setInput(""); setHashes({}); setError(""); }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {Object.keys(hashes).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <label className="text-sm font-medium text-gray-700 block">Hash Results</label>
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase">{algo}</span>
                <button
                  onClick={() => handleCopy(algo, hash)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {copiedKey === algo ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedKey === algo ? "Copied" : "Copy"}
                </button>
              </div>
              <code className="block text-xs font-mono text-gray-800 bg-gray-50 rounded-lg px-3 py-2 break-all">{hash}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
