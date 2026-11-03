"use client";

import { useState } from "react";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, loadPdfJs, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfToImagesPage() {
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [scale, setScale] = useState(2);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);

  const render = async (data: ArrayBuffer, s: number) => {
    const pdfjs = await loadPdfJs();
    const doc = await pdfjs.getDocument({ data }).promise;
    const out: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const vp = page.getViewport({ scale: s });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
      out.push(canvas.toDataURL("image/png"));
    }
    return out;
  };

  const handle = async (files: File[]) => {
    setErr("");
    setLoading(true);
    try {
      const f = files[0];
      setName(f.name.replace(/\.pdf$/i, ""));
      const data = await readFileAsArrayBuffer(f);
      setBuf(data);
      setImages(await render(data, scale));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const rerender = async (s: number) => {
    setScale(s);
    if (!buf) return;
    setLoading(true);
    setImages(await render(buf, s));
    setLoading(false);
  };

  const downloadOne = (dataUrl: string, idx: number) => {
    const bin = atob(dataUrl.split(",")[1]);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    downloadBlob(new Blob([arr], { type: "image/png" }), `${name}-page-${idx + 1}.png`);
  };

  return (
    <PdfShell
      title="PDF to Images"
      description="Render each PDF page as a high-resolution PNG."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {buf && (
        <div className="mt-6 flex items-center gap-3 text-sm">
          <label className="text-neutral-400">Scale</label>
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => rerender(s)}
              className={
                "rounded-md border px-3 py-1.5 " +
                (scale === s
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-neutral-800 hover:bg-neutral-900")
              }
            >
              {s}×
            </button>
          ))}
        </div>
      )}
      {loading && <p className="mt-6 text-sm text-neutral-400">Rendering…</p>}
      {images.length > 0 && (
        <div className="mt-6 space-y-4">
          {images.map((src, i) => (
            <div key={i} className="rounded-md border border-neutral-800 p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-neutral-400">Page {i + 1}</span>
                <button
                  onClick={() => downloadOne(src, i)}
                  className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-medium text-neutral-950 hover:bg-emerald-400"
                >
                  Download PNG
                </button>
              </div>
              {}
              <img src={src} alt={`Page ${i + 1}`} className="w-full rounded border border-neutral-900" />
            </div>
          ))}
        </div>
      )}
    </PdfShell>
  );
}
