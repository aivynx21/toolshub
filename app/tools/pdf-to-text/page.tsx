"use client";

import { useState } from "react";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, loadPdfJs, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfToTextPage() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    setErr("");
    setLoading(true);
    try {
      const file = files[0];
      setName(file.name.replace(/\.pdf$/i, ""));
      const pdfjs = await loadPdfJs();
      const data = await readFileAsArrayBuffer(file);
      const doc = await pdfjs.getDocument({ data }).promise;
      const out: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const str = content.items
          .map((it) => ("str" in it ? it.str : ""))
          .join(" ");
        out.push(`--- Page ${i} ---\n${str}`);
      }
      setText(out.join("\n\n"));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PdfShell
      title="PDF to Text"
      description="Extract text from any PDF — search, copy, or download as .txt."
      onFiles={handle}
    >
      {loading && <p className="mt-6 text-sm text-neutral-400">Extracting…</p>}
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {text && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(text)}
              className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-900"
            >
              Copy
            </button>
            <button
              onClick={() => downloadBlob(text, `${name}.txt`, "text/plain")}
              className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
            >
              Download .txt
            </button>
          </div>
          <textarea
            readOnly
            value={text}
            className="h-96 w-full rounded-md border border-neutral-800 bg-neutral-950 p-3 font-mono text-sm"
          />
        </div>
      )}
    </PdfShell>
  );
}
