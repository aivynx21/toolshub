"use client";

import { useState } from "react";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, loadPdfJs, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfToHtmlPage() {
  const [html, setHtml] = useState("");
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
      const body: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const items = content.items as Array<{ str: string; transform: number[] }>;
        const lines: Record<number, string[]> = {};
        for (const it of items) {
          const y = Math.round(it.transform[5]);
          (lines[y] ??= []).push(escapeHtml(it.str));
        }
        const paras = Object.entries(lines)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([, parts]) => `  <p>${parts.join(" ")}</p>`)
          .join("\n");
        body.push(`<section data-page="${i}">\n${paras}\n</section>`);
      }
      const title = f.name.replace(/\.pdf$/i, "");
      const doc_ = `<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <title>${escapeHtml(title)}</title>\n</head>\n<body>\n<h1>${escapeHtml(title)}</h1>\n${body.join("\n")}\n</body>\n</html>`;
      setHtml(doc_);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PdfShell
      title="PDF to HTML"
      description="Convert PDF to HTML — extract text content with paragraph structure."
      onFiles={handle}
    >
      {loading && <p className="mt-6 text-sm text-neutral-400">Converting…</p>}
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {html && (
        <div className="mt-6 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(html)}
              className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-900"
            >
              Copy
            </button>
            <button
              onClick={() => downloadBlob(html, `${name}.html`, "text/html")}
              className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
            >
              Download .html
            </button>
          </div>
          <textarea
            readOnly
            value={html}
            className="h-96 w-full rounded-md border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs"
          />
        </div>
      )}
    </PdfShell>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c] as string));
}
