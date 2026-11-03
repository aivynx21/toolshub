"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [err, setErr] = useState("");

  const add = (list: File[]) => setFiles((prev) => [...prev, ...list.filter((f) => /image\/(png|jpeg)/.test(f.type))]);
  const move = (i: number, d: -1 | 1) =>
    setFiles((prev) => {
      const copy = [...prev];
      const j = i + d;
      if (j < 0 || j >= copy.length) return prev;
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  const remove = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const run = async () => {
    setErr("");
    if (!files.length) return setErr("Add at least one JPG or PNG image.");
    try {
      const doc = await PDFDocument.create();
      for (const f of files) {
        const data = await readFileAsArrayBuffer(f);
        const img = f.type === "image/png" ? await doc.embedPng(data) : await doc.embedJpg(data);
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), "images.pdf");
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="Images to PDF"
      description="Combine JPG and PNG images into a single PDF — one image per page."
      accept="image/png,image/jpeg"
      multiple
      onFiles={add}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-2 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm">
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
            onClick={run}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Build PDF
          </button>
        </div>
      )}
    </PdfShell>
  );
}
