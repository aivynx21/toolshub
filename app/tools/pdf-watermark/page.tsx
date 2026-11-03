"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { PdfShell } from "@/components/PdfShell";
import { downloadBlob, readFileAsArrayBuffer } from "@/lib/pdf-utils";

type Pos = "center" | "top" | "bottom" | "tl" | "tr" | "bl" | "br";

export default function PdfWatermarkPage() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("CONFIDENTIAL");
  const [size, setSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [angle, setAngle] = useState(-30);
  const [pos, setPos] = useState<Pos>("center");
  const [err, setErr] = useState("");

  const handle = async (files: File[]) => {
    const f = files[0];
    setName(f.name.replace(/\.pdf$/i, ""));
    setBuf(await readFileAsArrayBuffer(f));
  };

  const run = async () => {
    if (!buf) return;
    setErr("");
    try {
      const doc = await PDFDocument.load(buf);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const textW = font.widthOfTextAtSize(text, size);
      const textH = font.heightAtSize(size);
      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        let x = (width - textW) / 2;
        let y = (height - textH) / 2;
        if (pos === "top") y = height - textH - 40;
        else if (pos === "bottom") y = 40;
        else if (pos === "tl") { x = 40; y = height - textH - 40; }
        else if (pos === "tr") { x = width - textW - 40; y = height - textH - 40; }
        else if (pos === "bl") { x = 40; y = 40; }
        else if (pos === "br") { x = width - textW - 40; y = 40; }
        page.drawText(text, {
          x,
          y,
          size,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(angle),
        });
      }
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes.slice()], { type: "application/pdf" }), `${name}-watermarked.pdf`);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <PdfShell
      title="PDF Watermark Adder"
      description="Add a text watermark to every page — style, angle, and position."
      onFiles={handle}
    >
      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}
      {buf && (
        <div className="mt-6 space-y-4 rounded-xl border border-neutral-800 p-4 text-sm">
          <div className="text-neutral-400">{name}.pdf</div>
          <div>
            <label className="block text-xs text-neutral-400">Text</label>
            <input value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label={`Size: ${size}`}>
              <input type="range" min={10} max={120} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Opacity: ${opacity.toFixed(2)}`}>
              <input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Angle: ${angle}°`}>
              <input type="range" min={-90} max={90} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full" />
            </Field>
          </div>
          <div>
            <label className="block text-xs text-neutral-400">Position</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {(["center", "top", "bottom", "tl", "tr", "bl", "br"] as Pos[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPos(p)}
                  className={
                    "rounded-md border px-2.5 py-1 " +
                    (pos === p
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                      : "border-neutral-800 hover:bg-neutral-900")
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={run}
            className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Apply & download
          </button>
        </div>
      )}
    </PdfShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-neutral-400">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
