"use client";

import { useState } from "react";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, loadPdfJs, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfToWordPage() {
  const [rtf, setRtf] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    setErr("");
    setLoading(true);
    try {
      const f = files[0];
      setName(f.name.replace(/\.pdf$/i, ""));
      const pdfjs = await loadPdfJs();
      const data = await readFileAsArrayBuffer(f);
      const doc = await pdfjs.getDocument({ data }).promise;
      const paras: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const items = content.items as Array<{ str: string; transform: number[] }>;
        const lines: Record<number, string[]> = {};
        for (const it of items) {
          const y = Math.round(it.transform[5]);
          (lines[y] ??= []).push(it.str);
        }
        const pageText = Object.entries(lines)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([, parts]) => parts.join(" "))
          .join("\\par\n");
        paras.push(pageText);
        if (i < doc.numPages) paras.push("\\page");
      }
      const header = "{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Times New Roman;}}\\fs24\n";
      const body = paras.join("\\par\n").replace(/[\\{}]/g, (c) => "\\" + c);
      setRtf(header + body + "\n}");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PdfShell
      title="PDF to Word"
      description="Extract PDF text into an RTF file that opens in Microsoft Word."
      onFiles={handle}
    >
      {loading && <p className="mt-6 text-sm text-neutral-400">Converting…</p>}
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {rtf && (
        <div className="mt-6 space-y-3">
          <button
            onClick={() => downloadBlob(rtf, `${name}.rtf`, "application/rtf")}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Download .rtf
          </button>
          <p className="text-xs text-neutral-500">
            Opens directly in Microsoft Word, Google Docs, or LibreOffice.
          </p>
        </div>
      )}
    </PdfShell>
  );
}
