"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";

type Template = "URL" | "WiFi" | "vCard" | "SMS" | "Email" | "Phone";
type ErrorLevel = "L" | "M" | "Q" | "H";

const TEMPLATES: Template[] = ["URL", "WiFi", "vCard", "SMS", "Email", "Phone"];

const ERROR_LEVELS: { value: ErrorLevel; label: string }[] = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
];

const PLACEHOLDERS: Record<Template, string> = {
  URL: "https://example.com",
  WiFi: "SSID: MyNetwork\nPassword: secret\nEncryption: WPA",
  vCard: "Name: Jane Doe\nPhone: +15551234\nEmail: jane@example.com",
  SMS: "+15551234 | Hello there",
  Email: "someone@example.com | Subject | Body",
  Phone: "+15551234",
};

function buildPayload(template: Template, raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  switch (template) {
    case "URL":
      return t;
    case "WiFi": {
      const lines = Object.fromEntries(
        t.split(/\r?\n/).map((l) => {
          const [k, ...rest] = l.split(":");
          return [k?.trim().toLowerCase() ?? "", rest.join(":").trim()];
        }),
      );
      const ssid = lines["ssid"] ?? "";
      const pass = lines["password"] ?? "";
      const enc = (lines["encryption"] ?? "WPA").toUpperCase();
      return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    }
    case "vCard": {
      const lines = Object.fromEntries(
        t.split(/\r?\n/).map((l) => {
          const [k, ...rest] = l.split(":");
          return [k?.trim().toLowerCase() ?? "", rest.join(":").trim()];
        }),
      );
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${lines["name"] ?? ""}`,
        `TEL:${lines["phone"] ?? ""}`,
        `EMAIL:${lines["email"] ?? ""}`,
        "END:VCARD",
      ].join("\n");
    }
    case "SMS": {
      const [num, ...msg] = t.split("|");
      return `SMSTO:${num?.trim() ?? ""}:${msg.join("|").trim()}`;
    }
    case "Email": {
      const [to, subject, body] = t.split("|").map((s) => s.trim());
      const params: string[] = [];
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      return `mailto:${to ?? ""}${params.length ? `?${params.join("&")}` : ""}`;
    }
    case "Phone":
      return `tel:${t}`;
  }
}

export default function QRPage() {
  const [template, setTemplate] = useState<Template>("URL");
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

  const payload = useMemo(() => buildPayload(template, text), [template, text]);
  const effectiveErrorLevel: ErrorLevel = logoDataUrl ? "H" : errorLevel;

  useEffect(() => {
    let cancelled = false;
    async function render() {
      if (!payload) {
        setPngUrl(null);
        setSvgMarkup(null);
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        await QRCode.toCanvas(canvas, payload, {
          width: size,
          margin: 2,
          errorCorrectionLevel: effectiveErrorLevel,
          color: { dark: fg, light: bg },
        });
        if (logoDataUrl) {
          const img = new Image();
          img.src = logoDataUrl;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
          });
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const s = Math.round(size * 0.22);
            const x = Math.round((size - s) / 2);
            ctx.fillStyle = bg;
            ctx.fillRect(x - 4, x - 4, s + 8, s + 8);
            ctx.drawImage(img, x, x, s, s);
          }
        }
        if (!cancelled) setPngUrl(canvas.toDataURL("image/png"));
        const svg = await QRCode.toString(payload, {
          type: "svg",
          width: size,
          margin: 2,
          errorCorrectionLevel: effectiveErrorLevel,
          color: { dark: fg, light: bg },
        });
        if (!cancelled) setSvgMarkup(svg);
      } catch {
        if (!cancelled) {
          setPngUrl(null);
          setSvgMarkup(null);
        }
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [payload, size, effectiveErrorLevel, fg, bg, logoDataUrl]);

  const handleLogo = (file: File | null) => {
    if (!file) {
      setLogoDataUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const download = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadPng = () => {
    if (pngUrl) download(pngUrl, "qr.png");
  };

  const downloadSvg = () => {
    if (!svgMarkup) return;
    const url = URL.createObjectURL(
      new Blob([svgMarkup], { type: "image/svg+xml" }),
    );
    download(url, "qr.svg");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadWebp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/webp", 1);
    download(url, "qr.webp");
  };

  const downloadBatch = async () => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const data = buildPayload(template, line);
      if (!data) continue;
      const dataUrl = await QRCode.toDataURL(data, {
        width: size,
        margin: 2,
        errorCorrectionLevel: effectiveErrorLevel,
        color: { dark: fg, light: bg },
      });
      download(dataUrl, `qr-${i + 1}.png`);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            QR Code Generator
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Generate QR codes for URLs, WiFi, vCards and more — fully offline.
          </p>
        </header>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6">
          <div>
            <label className="text-sm font-medium text-neutral-200">
              Template
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {TEMPLATES.map((t) => {
                const active = template === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                        : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="qr-text"
              className="text-sm font-medium text-neutral-200"
            >
              {batchMode ? "Batch input (one per line)" : "Text or URL"}
            </label>
            <textarea
              id="qr-text"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDERS[template]}
              className="mt-3 w-full resize-y rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none ring-emerald-500/40 transition focus:border-emerald-500/60 focus:ring-2"
            />
            <div className="mt-1 text-right text-xs text-neutral-500">
              {text.length} characters
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-neutral-200">
              Logo overlay{" "}
              <span className="text-neutral-500 font-normal">(optional)</span>
            </label>
            <div className="mt-3 flex items-center gap-3">
              <label className="cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-neutral-700 hover:text-neutral-100">
                Choose file
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogo(e.target.files?.[0] ?? null)}
                />
              </label>
              <span className="text-xs text-neutral-500">
                {logoDataUrl ? "Logo loaded" : "No file chosen"}
              </span>
              {logoDataUrl && (
                <button
                  type="button"
                  onClick={() => setLogoDataUrl(null)}
                  className="text-xs text-neutral-400 underline-offset-2 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Adds logo centered on QR code. Error correction auto-switches to High.
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="qr-size"
                  className="text-sm font-medium text-neutral-200"
                >
                  Size
                </label>
                <span className="font-mono text-sm text-emerald-400">
                  {size}px
                </span>
              </div>
              <input
                id="qr-size"
                type="range"
                min={128}
                max={512}
                step={8}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="mt-3 w-full accent-emerald-500"
              />
              <div className="mt-1 flex justify-between text-xs text-neutral-500">
                <span>128px</span>
                <span>512px</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="qr-ec"
                className="text-sm font-medium text-neutral-200"
              >
                Error correction
              </label>
              <select
                id="qr-ec"
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as ErrorLevel)}
                disabled={!!logoDataUrl}
                className="mt-3 w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 text-sm text-neutral-100 outline-none ring-emerald-500/40 transition focus:border-emerald-500/60 focus:ring-2 disabled:opacity-60"
              >
                {ERROR_LEVELS.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <ColorInput
              label="Foreground color"
              value={fg}
              onChange={setFg}
            />
            <ColorInput
              label="Background color"
              value={bg}
              onChange={setBg}
            />
          </div>

          <div className="mt-6">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-200">
              <input
                type="checkbox"
                checked={batchMode}
                onChange={(e) => setBatchMode(e.target.checked)}
                className="h-4 w-4 accent-emerald-500"
              />
              Batch mode{" "}
              <span className="text-neutral-500 font-normal">
                (one per line)
              </span>
            </label>
          </div>

          <div className="mt-8">
            <div className="text-sm font-medium text-neutral-200">Preview</div>
            <div className="mt-3 flex items-center justify-center rounded-2xl border border-neutral-800 bg-white p-6">
              {payload ? (
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 py-10 text-neutral-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-12 w-12"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1" />
                  </svg>
                  <span className="text-sm">Type something to generate</span>
                  {/* keep canvas mounted hidden to avoid null ref */}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ActionButton onClick={downloadPng} disabled={!pngUrl}>
              <DownloadIcon /> PNG
            </ActionButton>
            <ActionButton onClick={downloadSvg} disabled={!svgMarkup}>
              <DownloadIcon /> SVG
            </ActionButton>
            <ActionButton onClick={downloadWebp} disabled={!pngUrl}>
              <DownloadIcon /> WebP
            </ActionButton>
            {batchMode ? (
              <ActionButton onClick={downloadBatch} disabled={!text.trim()}>
                <DownloadIcon /> Batch
              </ActionButton>
            ) : (
              <ActionButton
                onClick={() => window.print()}
                disabled={!pngUrl}
              >
                <PrintIcon /> Print
              </ActionButton>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-neutral-200">{label}</label>
      <div className="mt-3 flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950/60"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 font-mono text-sm text-neutral-100 outline-none ring-emerald-500/40 transition focus:border-emerald-500/60 focus:ring-2"
        />
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
    >
      {children}
    </button>
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

function PrintIcon() {
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
      <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6z" />
    </svg>
  );
}
