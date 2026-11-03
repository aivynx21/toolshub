"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Format = "hex" | "base64" | "base64url" | "nanoid" | "uuid";

const FORMATS: { value: Format; label: string; desc: string }[] = [
  { value: "hex", label: "Hex", desc: "0-9 a-f" },
  { value: "base64", label: "Base64", desc: "URL-safe off" },
  { value: "base64url", label: "Base64 URL", desc: "URL-safe" },
  { value: "nanoid", label: "Nanoid", desc: "A-Z a-z 0-9 _ -" },
  { value: "uuid", label: "UUID v4", desc: "Fixed 36 chars" },
];

const NANOID_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

function randomBytes(n: number): Uint8Array {
  const arr = new Uint8Array(n);
  crypto.getRandomValues(arr);
  return arr;
}

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function toBase64Url(bytes: Uint8Array): string {
  return toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function nanoid(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += NANOID_ALPHABET[bytes[i] & 63];
  }
  return out;
}

function uuidv4(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = randomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = toHex(b);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function generateToken(format: Format, length: number): string {
  switch (format) {
    case "hex":
      return toHex(randomBytes(Math.max(1, Math.ceil(length / 2)))).slice(0, length);
    case "base64":
      return toBase64(randomBytes(Math.max(1, Math.ceil((length * 3) / 4)))).slice(0, length);
    case "base64url":
      return toBase64Url(randomBytes(Math.max(1, Math.ceil((length * 3) / 4)))).slice(0, length);
    case "nanoid":
      return nanoid(length);
    case "uuid":
      return uuidv4();
  }
}

function entropyBits(format: Format, length: number): number {
  switch (format) {
    case "hex":
      return length * 4;
    case "base64":
    case "base64url":
    case "nanoid":
      return length * 6;
    case "uuid":
      return 122;
  }
}

function strengthLabel(bits: number): {
  label: string;
  pct: number;
  color: string;
  text: string;
} {
  const pct = Math.min(100, Math.round((bits / 256) * 100));
  if (bits < 64)
    return { label: "Weak", pct, color: "bg-orange-500", text: "text-orange-400" };
  if (bits < 112)
    return { label: "Fair", pct, color: "bg-amber-500", text: "text-amber-400" };
  if (bits < 160)
    return { label: "Strong", pct, color: "bg-emerald-500", text: "text-emerald-400" };
  return { label: "Very Strong", pct, color: "bg-cyan-500", text: "text-cyan-400" };
}

export default function TokenPage() {
  const [format, setFormat] = useState<Format>("hex");
  const [length, setLength] = useState(32);
  const [prefix, setPrefix] = useState("");
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const fixedLength = format === "uuid";
  const effectiveLength = fixedLength ? 36 : length;

  const strength = useMemo(
    () => strengthLabel(entropyBits(format, effectiveLength)),
    [format, effectiveLength],
  );

  const generate = useCallback(() => {
    const n = Math.max(1, Math.min(50, Math.floor(count) || 1));
    const items: string[] = [];
    for (let i = 0; i < n; i++) {
      let t = generateToken(format, effectiveLength);
      if (uppercase && (format === "hex" || format === "base64" || format === "base64url"))
        t = t.toUpperCase();
      if (prefix) t = `${prefix}${t}`;
      items.push(t);
    }
    setOutput(items.join("\n"));
    setHistory((h) => [...items, ...h].slice(0, 10));
  }, [format, effectiveLength, uppercase, prefix, count]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tokens.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Token Generator
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Generate secure API tokens, UUIDs, and random IDs — fully offline.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
            <LockIcon /> Nothing leaves your browser
          </div>
        </header>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6">
          <div>
            <label className="text-sm font-medium text-neutral-200">Format</label>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {FORMATS.map((f) => {
                const active = format === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFormat(f.value)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition ${
                      active
                        ? "border-emerald-500/60 bg-emerald-500/15"
                        : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        active ? "text-emerald-300" : "text-neutral-200"
                      }`}
                    >
                      {f.label}
                    </div>
                    <div className="text-[11px] text-neutral-500">{f.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label htmlFor="tk-length" className="text-sm font-medium text-neutral-200">
                Length
              </label>
              <span className="font-mono text-sm text-emerald-400">
                {effectiveLength}
                {fixedLength && (
                  <span className="ml-2 text-xs text-neutral-500">fixed</span>
                )}
              </span>
            </div>
            <input
              id="tk-length"
              type="range"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              disabled={fixedLength}
              className="mt-3 w-full accent-emerald-500 disabled:opacity-50"
            />
            <div className="mt-1 flex justify-between text-xs text-neutral-500">
              <span>8</span>
              <span>128</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tk-prefix" className="text-sm font-medium text-neutral-200">
                Prefix{" "}
                <span className="font-normal text-neutral-500">(optional)</span>
              </label>
              <input
                id="tk-prefix"
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="e.g. sk_live_"
                className="mt-3 w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 font-mono text-sm text-neutral-100 placeholder:text-neutral-600 outline-none ring-emerald-500/40 transition focus:border-emerald-500/60 focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="tk-count" className="text-sm font-medium text-neutral-200">
                Batch generate
              </label>
              <input
                id="tk-count"
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="mt-3 w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 font-mono text-sm text-neutral-100 outline-none ring-emerald-500/40 transition focus:border-emerald-500/60 focus:ring-2"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-200">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                disabled={format === "nanoid" || format === "uuid"}
                className="h-4 w-4 accent-emerald-500 disabled:opacity-50"
              />
              Uppercase{" "}
              <span className="font-normal text-neutral-500">
                (hex / base64 only)
              </span>
            </label>
          </div>

          <div className="mt-6">
            <div className="relative">
              <textarea
                readOnly
                value={output}
                rows={Math.min(8, Math.max(1, output.split("\n").length))}
                className="w-full resize-y rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 pr-12 font-mono text-sm text-neutral-100 outline-none"
              />
              <button
                type="button"
                onClick={() => copy(output)}
                className="absolute right-2 top-2 rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 transition hover:text-neutral-100"
                aria-label="Copy all"
              >
                <CopyIcon />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-200">
                Strength{" "}
                <span className="font-mono text-xs text-neutral-500">
                  (~{entropyBits(format, effectiveLength)} bits)
                </span>
              </span>
              <span className={`font-semibold ${strength.text}`}>
                {strength.label}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className={`h-full transition-all ${strength.color}`}
                style={{ width: `${strength.pct}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={generate}
              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Generate token{count > 1 ? "s" : ""}
            </button>
            <button
              type="button"
              onClick={downloadTxt}
              disabled={!output}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-3 text-sm font-medium text-neutral-200 transition hover:border-neutral-700 hover:text-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <DownloadIcon /> Download .txt
            </button>
          </div>

          {history.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-neutral-200">
                  Session history
                </h2>
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  className="text-xs text-neutral-400 underline-offset-2 hover:underline"
                >
                  Clear
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {history.map((h, i) => (
                  <li
                    key={`${i}-${h}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2"
                  >
                    <code className="truncate font-mono text-sm text-neutral-300">
                      {h}
                    </code>
                    <button
                      type="button"
                      onClick={() => copy(h)}
                      className="shrink-0 rounded-md p-1.5 text-neutral-500 transition hover:text-neutral-100"
                      aria-label="Copy"
                    >
                      <CopyIcon />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
