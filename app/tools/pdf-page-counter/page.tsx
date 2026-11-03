"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { formatBytes, readFileAsArrayBuffer } from "@/lib/pdf-utils";

type Info = {
  name: string;
  size: number;
  pages: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  createdAt?: string;
  modifiedAt?: string;
};

export default function PdfPageCounterPage() {
  const [info, setInfo] = useState<Info | null>(null);
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    setErr("");
    try {
      const f = files[0];
      const data = await readFileAsArrayBuffer(f);
      const doc = await PDFDocument.load(data);
      setInfo({
        name: f.name,
        size: f.size,
        pages: doc.getPageCount(),
        title: doc.getTitle(),
        author: doc.getAuthor(),
        subject: doc.getSubject(),
        creator: doc.getCreator(),
        producer: doc.getProducer(),
        createdAt: doc.getCreationDate()?.toISOString(),
        modifiedAt: doc.getModificationDate()?.toISOString(),
      });
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Page Counter"
      description="Count PDF pages and view file size, version, and metadata."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {info && (
        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries({
            File: info.name,
            Size: formatBytes(info.size),
            Pages: info.pages,
            Title: info.title,
            Author: info.author,
            Subject: info.subject,
            Creator: info.creator,
            Producer: info.producer,
            Created: info.createdAt,
            Modified: info.modifiedAt,
          }).map(([k, v]) => (
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
