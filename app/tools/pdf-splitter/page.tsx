"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, parsePageRanges, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfSplitterPage() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [total, setTotal] = useState(0);
  const [ranges, setRanges] = useState("");
  const [mode, setMode] = useState<"range" | "each">("range");
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    setErr("");
    const file = files[0];
    const b = await readFileAsArrayBuffer(file);
    const doc = await PDFDocument.load(b);
    setBuf(b);
    setName(file.name.replace(/\.pdf$/i, ""));
    setTotal(doc.getPageCount());
    setRanges(`1-${doc.getPageCount()}`);
  };

  const split = async () => {
    if (!buf) return;
    setErr("");
    try {
      const src = await PDFDocument.load(buf);
      if (mode === "each") {
        for (let i = 0; i < src.getPageCount(); i++) {
          const out = await PDFDocument.create();
          const [p] = await out.copyPages(src, [i]);
          out.addPage(p);
          const bytes = await out.save();
          downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), `${name}-page-${i + 1}.pdf`);
        }
      } else {
        const pages = parsePageRanges(ranges, total).map((n) => n - 1);
        if (!pages.length) throw new Error("No valid pages in range");
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, pages);
        copied.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), `${name}-split.pdf`);
      }
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Splitter"
      description="Split PDFs by page range or extract each page separately."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {buf && (
        <div className="mt-6 space-y-4 rounded-xl border border-neutral-800 p-4">
          <div className="text-sm text-neutral-400">
            {name}.pdf — {total} pages
          </div>
          <div className="flex gap-2 text-sm">
            {(["range", "each"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  "rounded-md border px-3 py-1.5 " +
                  (mode === m
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-neutral-800 hover:bg-neutral-900")
                }
              >
                {m === "range" ? "Pick range" : "Each page as PDF"}
              </button>
            ))}
          </div>
          {mode === "range" && (
            <div>
              <label className="block text-xs text-neutral-400">
                Pages (e.g. 1-3, 5, 7-9)
              </label>
              <input
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </div>
          )}
          <button
            onClick={split}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Split & download
          </button>
        </div>
      )}
    </PdfShell>
  );
}
