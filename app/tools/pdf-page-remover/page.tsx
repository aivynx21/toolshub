"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, parsePageRanges, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfPageRemoverPage() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [total, setTotal] = useState(0);
  const [ranges, setRanges] = useState("");
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    const f = files[0];
    const data = await readFileAsArrayBuffer(f);
    const doc = await PDFDocument.load(data);
    setBuf(data);
    setName(f.name.replace(/\.pdf$/i, ""));
    setTotal(doc.getPageCount());
    setRanges("");
  };

  const run = async () => {
    if (!buf) return;
    setErr("");
    try {
      const doc = await PDFDocument.load(buf);
      const toRemove = new Set(parsePageRanges(ranges, total));
      if (!toRemove.size) throw new Error("No valid pages");
      if (toRemove.size >= doc.getPageCount()) throw new Error("Cannot remove all pages");
      for (let i = doc.getPageCount(); i >= 1; i--) {
        if (toRemove.has(i)) doc.removePage(i - 1);
      }
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), `${name}-trimmed.pdf`);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Page Remover"
      description="Remove selected pages from a PDF and download the result."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {buf && (
        <div className="mt-6 space-y-4 rounded-xl border border-neutral-800 p-4">
          <div className="text-sm text-neutral-400">{name}.pdf — {total} pages</div>
          <div>
            <label className="block text-xs text-neutral-400">Pages to remove (e.g. 2, 5-7)</label>
            <input
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={run}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Remove & download
          </button>
        </div>
      )}
    </PdfShell>
  );
}
