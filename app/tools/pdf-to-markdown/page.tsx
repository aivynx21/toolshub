"use client";

import { useState } from "react";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, loadPdfJs, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfToMarkdownPage() {
  const [md, setMd] = useState("");
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
      const out: string[] = [`# ${f.name.replace(/\.pdf$/i, "")}`];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const items = content.items as Array<{ str: string; height?: number; transform?: number[] }>;
        const heights = items.map((it) => it.height ?? 0).filter(Boolean);
        const med = heights.sort((a, b) => a - b)[Math.floor(heights.length / 2)] || 0;
        const lines: string[] = [];
        let line: string[] = [];
        let lastY: number | null = null;
        let lastH = 0;
        for (const it of items) {
          const y = it.transform?.[5] ?? 0;
          if (lastY !== null && Math.abs(y - lastY) > 2) {
            if (line.length) {
              const txt = line.join(" ").trim();
              if (lastH > med * 1.4) lines.push(`\n## ${txt}`);
              else if (lastH > med * 1.15) lines.push(`\n### ${txt}`);
              else lines.push(txt);
            }
            line = [];
          }
          if (it.str.trim()) line.push(it.str);
          lastY = y;
          lastH = it.height ?? lastH;
        }
        if (line.length) lines.push(line.join(" ").trim());
        out.push(`\n<!-- page ${i} -->\n`, lines.join("\n"));
      }
      setMd(out.join("\n"));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PdfShell
      title="PDF to Markdown"
      description="Convert PDFs to Markdown with heading detection based on font size."
      onFiles={handle}
    >
      {loading && <p className="mt-6 text-sm text-neutral-400">Converting…</p>}
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {md && (
        <div className="mt-6 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(md)}
              className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-900"
            >
              Copy
            </button>
            <button
              onClick={() => downloadBlob(md, `${name}.md`, "text/markdown")}
              className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
            >
              Download .md
            </button>
          </div>
          <textarea
            readOnly
            value={md}
            className="h-96 w-full rounded-md border border-neutral-800 bg-neutral-950 p-3 font-mono text-sm"
          />
        </div>
      )}
    </PdfShell>
  );
}
