"use client";

import { useState } from "react";
import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";

type Field =
  | { kind: "text"; name: string; value: string }
  | { kind: "check"; name: string; value: boolean }
  | { kind: "dropdown"; name: string; value: string; options: string[] }
  | { kind: "radio"; name: string; value: string; options: string[] };

export default function PdfFormFillerPage() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    setErr("");
    try {
      const f = files[0];
      const data = await readFileAsArrayBuffer(f);
      const doc = await PDFDocument.load(data);
      setBuf(data);
      setName(f.name.replace(/\.pdf$/i, ""));
      const form = doc.getForm();
      const list: Field[] = form.getFields().map((field) => {
        const n = field.getName();
        if (field instanceof PDFTextField) return { kind: "text", name: n, value: field.getText() ?? "" };
        if (field instanceof PDFCheckBox) return { kind: "check", name: n, value: field.isChecked() };
        if (field instanceof PDFDropdown)
          return { kind: "dropdown", name: n, value: field.getSelected()[0] ?? "", options: field.getOptions() };
        if (field instanceof PDFRadioGroup)
          return { kind: "radio", name: n, value: field.getSelected() ?? "", options: field.getOptions() };
        return { kind: "text", name: n, value: "" };
      });
      setFields(list);
      if (!list.length) setErr("This PDF has no fillable form fields.");
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const update = (i: number, patch: Partial<Field>) =>
    setFields((prev) => prev.map((f, idx) => (idx === i ? ({ ...f, ...patch } as Field) : f)));

  const save = async () => {
    if (!buf) return;
    try {
      const doc = await PDFDocument.load(buf);
      const form = doc.getForm();
      for (const f of fields) {
        const field = form.getField(f.name);
        if (f.kind === "text" && field instanceof PDFTextField) field.setText(f.value);
        else if (f.kind === "check" && field instanceof PDFCheckBox) f.value ? field.check() : field.uncheck();
        else if (f.kind === "dropdown" && field instanceof PDFDropdown && f.value) field.select(f.value);
        else if (f.kind === "radio" && field instanceof PDFRadioGroup && f.value) field.select(f.value);
      }
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), `${name}-filled.pdf`);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Form Filler"
      description="Fill text, checkbox, dropdown, and radio fields in a fillable PDF."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {fields.length > 0 && (
        <div className="mt-6 space-y-3 rounded-xl border border-neutral-800 p-4 text-sm">
          {fields.map((f, i) => (
            <div key={i}>
              <label className="block text-xs text-neutral-500">{f.name} ({f.kind})</label>
              {f.kind === "text" && (
                <input
                  value={f.value}
                  onChange={(e) => update(i, { value: e.target.value })}
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2"
                />
              )}
              {f.kind === "check" && (
                <label className="mt-1 flex items-center gap-2">
                  <input type="checkbox" checked={f.value} onChange={(e) => update(i, { value: e.target.checked })} />
                  <span>Checked</span>
                </label>
              )}
              {(f.kind === "dropdown" || f.kind === "radio") && (
                <select
                  value={f.value}
                  onChange={(e) => update(i, { value: e.target.value })}
                  className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2"
                >
                  <option value="">(none)</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
          <button
            onClick={save}
            className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Save & download
          </button>
        </div>
      )}
    </PdfShell>
  );
}
