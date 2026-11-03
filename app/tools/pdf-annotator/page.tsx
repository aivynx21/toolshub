"use client";

import { useRef, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, loadPdfJs, readFileAsArrayBuffer } from "@/lib/pdf-utils";

type Note = { page: number; x: number; y: number; text: string };

export default function PdfAnnotatorPage() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [previews, setPreviews] = useState<{ src: string; w: number; h: number }[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("Note");
  const [size, setSize] = useState(14);
  const refs = useRef<Record<number, HTMLDivElement | null>>({});
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    setErr("");
    try {
      const f = files[0];
      const data = await readFileAsArrayBuffer(f);
      setBuf(data);
      setName(f.name.replace(/\.pdf$/i, ""));
      setNotes([]);
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data }).promise;
      const list: { src: string; w: number; h: number }[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 1.3 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
        list.push({ src: canvas.toDataURL("image/png"), w: vp.width, h: vp.height });
      }
      setPreviews(list);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const addNote = (pageIdx: number, e: React.MouseEvent<HTMLDivElement>) => {
    const el = refs.current[pageIdx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNotes((prev) => [...prev, { page: pageIdx, x, y, text }]);
  };

  const save = async () => {
    if (!buf) return;
    try {
      const doc = await PDFDocument.load(buf);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      previews.forEach((prev, idx) => {
        const p = pages[idx];
        if (!p) return;
        const { width: pw, height: ph } = p.getSize();
        const sx = pw / prev.w;
        const sy = ph / prev.h;
        for (const n of notes.filter((n) => n.page === idx)) {
          const x = n.x * sx;
          const y = ph - n.y * sy;
          p.drawText(n.text, { x, y, size, font, color: rgb(0.9, 0.1, 0.1) });
        }
      });
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), `${name}-annotated.pdf`);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Annotator"
      description="Click on a page to drop a text annotation."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {previews.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-neutral-800 p-3 text-sm">
            <label className="text-neutral-400">Note text</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5"
            />
            <label className="text-neutral-400">Size</label>
            <input
              type="number"
              min={6}
              max={48}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-20 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5"
            />
            <button
              onClick={() => setNotes([])}
              className="rounded-md border border-neutral-800 px-3 py-1.5 hover:bg-neutral-900"
            >
              Clear
            </button>
            <button
              onClick={save}
              className="rounded-md bg-emerald-500 px-3 py-1.5 font-medium text-neutral-950 hover:bg-emerald-400"
            >
              Save & download
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {previews.map((p, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  refs.current[idx] = el;
                }}
                onClick={(e) => addNote(idx, e)}
                className="relative inline-block cursor-crosshair rounded border border-neutral-800"
                style={{ width: p.w }}
              >
                {}
                <img src={p.src} alt={`Page ${idx + 1}`} width={p.w} height={p.h} />
                {notes.filter((n) => n.page === idx).map((n, i) => (
                  <span
                    key={i}
                    className="absolute rounded bg-red-500/80 px-1 text-xs text-white"
                    style={{ left: n.x, top: n.y }}
                  >
                    {n.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </PdfShell>
  );
}
