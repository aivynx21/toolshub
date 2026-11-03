"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfMergerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [err, setErr] = useState("");

  const addFiles = (list: File[]) => {
    setFiles((prev) => [...prev, ...list]);
  };
  const move = (i: number, d: -1 | 1) => {
    setFiles((prev) => {
      const copy = [...prev];
      const j = i + d;
      if (j < 0 || j >= copy.length) return prev;
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };
  const remove = (i: number) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const merge = async () => {
    setErr("");
    if (files.length < 2) {
      setErr("Add at least 2 PDFs.");
      return;
    }
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const b = await readFileAsArrayBuffer(f);
        const src = await PDFDocument.load(b);
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), "merged.pdf");
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Merger"
      description="Combine multiple PDFs into a single document, in any order."
      multiple
      onFiles={addFiles}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              >
                <div className="truncate">
                  <span className="text-neutral-500">{i + 1}.</span> {f.name}{" "}
                  <span className="text-neutral-500">({formatBytes(f.size)})</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} className="rounded border border-neutral-800 px-2 py-0.5">↑</button>
                  <button onClick={() => move(i, 1)} className="rounded border border-neutral-800 px-2 py-0.5">↓</button>
                  <button onClick={() => remove(i)} className="rounded border border-neutral-800 px-2 py-0.5 text-red-400">×</button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={merge}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Merge → merged.pdf
          </button>
        </div>
      )}
    </PdfShell>
  );
}
