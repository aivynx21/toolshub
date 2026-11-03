"use client";

import { useState } from "react";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, loadPdfJs, readFileAsArrayBuffer } from "@/lib/pdf-utils";

type Mode = "pages" | "lines" | "words";

export default function PdfToJsonPage() {
  const [json, setJson] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("pages");
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const run = async (data: ArrayBuffer, m: Mode) => {
    const pdfjs = await loadPdfJs();
    const doc = await pdfjs.getDocument({ data }).promise;
    const result: unknown[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const items = content.items as Array<{ str: string; transform: number[] }>;
      if (m === "pages") {
        result.push({ page: i, text: items.map((it) => it.str).join(" ") });
      } else if (m === "words") {
        result.push({
          page: i,
          words: items.flatMap((it) =>
            it.str
              .split(/\s+/)
              .filter(Boolean)
              .map((w) => ({ text: w, x: it.transform[4], y: it.transform[5] })),
          ),
        });
      } else {
        const lines: Record<number, string[]> = {};
        for (const it of items) {
          const y = Math.round(it.transform[5]);
          (lines[y] ??= []).push(it.str);
        }
        result.push({
          page: i,
          lines: Object.entries(lines)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([y, parts]) => ({ y: Number(y), text: parts.join(" ") })),
        });
      }
    }
    return JSON.stringify(result, null, 2);
  };

  const handle = async (files: File[]) => {
    setErr("");
    setLoading(true);
    try {
      const f = files[0];
      setName(f.name.replace(/\.pdf$/i, ""));
      const data = await readFileAsArrayBuffer(f);
      setBuf(data);
      setJson(await run(data, mode));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const changeMode = async (m: Mode) => {
    setMode(m);
    if (!buf) return;
    setLoading(true);
    setJson(await run(buf, m));
    setLoading(false);
  };

  return (
    <PdfShell
      title="PDF to JSON"
      description="Extract structured JSON from PDFs — by page, line, or word position."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {buf && (
        <div className="mt-6 flex gap-2 text-sm">
          {(["pages", "lines", "words"] as const).map((m) => (
            <button
              key={m}
              onClick={() => changeMode(m)}
              className={
                "rounded-md border px-3 py-1.5 " +
                (mode === m
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-neutral-800 hover:bg-neutral-900")
              }
            >
              {m}
            </button>
          ))}
        </div>
      )}
      {loading && <p className="mt-6 text-sm text-neutral-400">Processing…</p>}
      {json && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(json)}
              className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-900"
            >
              Copy
            </button>
            <button
              onClick={() => downloadBlob(json, `${name}.json`, "application/json")}
              className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
            >
              Download .json
            </button>
          </div>
          <textarea
            readOnly
            value={json}
            className="h-96 w-full rounded-md border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs"
          />
        </div>
      )}
    </PdfShell>
  );
}
