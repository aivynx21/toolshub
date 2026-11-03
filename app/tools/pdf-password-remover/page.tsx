"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, loadPdfJs, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfPasswordRemoverPage() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"" | "working" | "done">("");
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    setErr("");
    const f = files[0];
    setName(f.name.replace(/\.pdf$/i, ""));
    setBuf(await readFileAsArrayBuffer(f));
  };

  const run = async () => {
    if (!buf) return;
    setErr("");
    setStatus("working");
    try {
      const pdfjs = await loadPdfJs();
      const task = pdfjs.getDocument({ data: buf, password });
      const src = await task.promise;
      const out = await PDFDocument.create();
      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const vp = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
        const pngBytes = await (await fetch(canvas.toDataURL("image/png"))).arrayBuffer();
        const img = await out.embedPng(pngBytes);
        const p = out.addPage([vp.width, vp.height]);
        p.drawImage(img, { x: 0, y: 0, width: vp.width, height: vp.height });
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), `${name}-unlocked.pdf`);
      setStatus("done");
    } catch (e) {
      setStatus("");
      setErr((e as Error).message || "Failed — wrong password?");
    }
  };

  return (
    <PdfShell
      title="PDF Password Remover"
      description="Unlock a password-protected PDF — enter the password to generate an unlocked copy."
      onFiles={handle}
    >
      {buf && (
        <div className="mt-6 space-y-4 rounded-xl border border-neutral-800 p-4 text-sm">
          <div className="text-neutral-400">{name}.pdf</div>
          <div>
            <label className="block text-xs text-neutral-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2"
            />
          </div>
          <button
            onClick={run}
            disabled={status === "working"}
            className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {status === "working" ? "Unlocking…" : "Unlock & download"}
          </button>
          {status === "done" && <p className="text-emerald-400">Done.</p>}
          {err && <p className="text-red-400">{err}</p>}
          <p className="text-xs text-neutral-500">
            Note: You must know the password. The output is rebuilt from rendered pages, so it will be larger and text may not be selectable.
          </p>
        </div>
      )}
    </PdfShell>
  );
}
