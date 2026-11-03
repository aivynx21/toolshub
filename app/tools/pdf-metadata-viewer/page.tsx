"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { formatBytes, readFileAsArrayBuffer } from "@/lib/pdf-utils";

export default function PdfMetadataViewerPage() {
  const [meta, setMeta] = useState<Record<string, string | number | undefined> | null>(null);
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    setErr("");
    try {
      const f = files[0];
      const data = await readFileAsArrayBuffer(f);
      const doc = await PDFDocument.load(data);
      setMeta({
        File: f.name,
        Size: formatBytes(f.size),
        Pages: doc.getPageCount(),
        Title: doc.getTitle(),
        Author: doc.getAuthor(),
        Subject: doc.getSubject(),
        Keywords: doc.getKeywords(),
        Creator: doc.getCreator(),
        Producer: doc.getProducer(),
        Created: doc.getCreationDate()?.toISOString(),
        Modified: doc.getModificationDate()?.toISOString(),
      });
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Metadata Viewer"
      description="Inspect title, author, dates, and other PDF metadata."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {meta && (
        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(meta).map(([k, v]) => (
            <div key={k} className="rounded-md border border-neutral-800 bg-neutral-950 p-3">
              <dt className="text-xs uppercase tracking-wide text-neutral-500">{k}</dt>
              <dd className="mt-1 text-sm text-neutral-200 break-all">{v ?? "—"}</dd>
            </div>
          ))}
        </dl>
      )}
    </PdfShell>
  );
}
