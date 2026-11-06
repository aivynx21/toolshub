"use client";

import { useRef, useState, type ReactNode } from "react";
import { UploadSimple } from "@phosphor-icons/react";

export function PdfShell({
  title,
  description,
  accept = "application/pdf",
  multiple = false,
  onFiles,
  children,
}: {
  title: string;
  description: string;
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  children?: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handle = (list: FileList | null) => {
    if (!list || !list.length) return;
    onFiles(Array.from(list));
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="heading-5 sm:heading-4">{title}</h1>
        <p className="body-6 mt-2 text-text-muted">{description}</p>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={`Choose ${multiple ? "PDF files" : "a PDF file"}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={
          "cursor-pointer rounded-2xl border border-dashed p-10 text-center transition-[background-color,border-color,transform] duration-300 ease-base active:scale-[0.99] " +
          (drag ? "border-accent bg-accent-dim" : "border-border-strong bg-surface hover:bg-surface-raised")
        }
      >
        <div className={"mx-auto grid h-12 w-12 place-items-center rounded-lg bg-surface-hover " + (drag ? "text-accent" : "text-text-muted")}>
          <UploadSimple size={24} weight="duotone" aria-hidden />
        </div>
        <p className="title-3 mt-4">Click or drop {multiple ? "PDF files" : "a PDF file"} here</p>
        <p className="caption-5 mt-2 text-text-faint">Files are processed in your browser. Nothing is uploaded.</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          tabIndex={-1}
          onChange={(e) => handle(e.target.files)}
        />
      </div>

      {children && <div className="mt-8">{children}</div>}
    </main>
  );
}
