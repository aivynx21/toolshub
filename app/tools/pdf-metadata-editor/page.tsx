"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";

type Fields = { title: string; author: string; subject: string; keywords: string; creator: string; producer: string };

export default function PdfMetadataEditorPage() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [f, setF] = useState<Fields>({ title: "", author: "", subject: "", keywords: "", creator: "", producer: "" });
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    const file = files[0];
    const data = await readFileAsArrayBuffer(file);
    const doc = await PDFDocument.load(data);
    setBuf(data);
    setName(file.name.replace(/\.pdf$/i, ""));
    setF({
      title: doc.getTitle() ?? "",
      author: doc.getAuthor() ?? "",
      subject: doc.getSubject() ?? "",
      keywords: (doc.getKeywords() ?? "") as string,
      creator: doc.getCreator() ?? "",
      producer: doc.getProducer() ?? "",
    });
  };

  const run = async () => {
    if (!buf) return;
    setErr("");
    try {
      const doc = await PDFDocument.load(buf);
      doc.setTitle(f.title);
      doc.setAuthor(f.author);
      doc.setSubject(f.subject);
      doc.setKeywords(f.keywords.split(/[,\s]+/).filter(Boolean));
      doc.setCreator(f.creator);
      doc.setProducer(f.producer);
      doc.setModificationDate(new Date());
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), `${name}-edited.pdf`);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Metadata Editor"
      description="Edit title, author, subject, and keywords, then save a new copy."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {buf && (
        <div className="mt-6 space-y-3 rounded-xl border border-neutral-800 p-4 text-sm">
          {(Object.keys(f) as (keyof Fields)[]).map((k) => (
            <div key={k}>
              <label className="block text-xs uppercase tracking-wide text-neutral-500">{k}</label>
              <input
                value={f[k]}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2"
              />
            </div>
          ))}
          <button
            onClick={run}
            className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Save & download
          </button>
        </div>
      )}
    </PdfShell>
  );
}
