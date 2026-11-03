"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, parsePageRanges, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfRotatorPage() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [total, setTotal] = useState(0);
  const [angle, setAngle] = useState(90);
  const [ranges, setRanges] = useState("");
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    const f = files[0];
    const data = await readFileAsArrayBuffer(f);
    const doc = await PDFDocument.load(data);
    setBuf(data);
    setName(f.name.replace(/\.pdf$/i, ""));
    setTotal(doc.getPageCount());
    setRanges(`1-${doc.getPageCount()}`);
  };

  const rotate = async () => {
    if (!buf) return;
    setErr("");
    try {
      const doc = await PDFDocument.load(buf);
      const pages = parsePageRanges(ranges, total);
      if (!pages.length) throw new Error("No valid pages");
      for (const n of pages) {
        const p = doc.getPage(n - 1);
        p.setRotation(degrees((p.getRotation().angle + angle) % 360));
      }
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), `${name}-rotated.pdf`);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Rotator"
      description="Rotate selected pages by 90°, 180°, or 270° clockwise."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {buf && (
        <div className="mt-6 space-y-4 rounded-xl border border-neutral-800 p-4">
          <div className="text-sm text-neutral-400">{name}.pdf — {total} pages</div>
          <div className="flex gap-2 text-sm">
            {[90, 180, 270].map((a) => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={
                  "rounded-md border px-3 py-1.5 " +
                  (angle === a
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-neutral-800 hover:bg-neutral-900")
                }
              >
                {a}°
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs text-neutral-400">Pages</label>
            <input
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={rotate}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Rotate & download
          </button>
        </div>
      )}
    </PdfShell>
  );
}
