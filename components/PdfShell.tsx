"use client";

import { useRef, useState, type ReactNode } from "react";

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-neutral-400">{description}</p>
      </div>

      <div
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
          "cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition " +
          (drag
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-neutral-800 hover:border-neutral-700")
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto h-10 w-10 text-neutral-500"
        >
          <path d="M12 3v12" />
          <path d="m7 10 5-5 5 5" />
          <path d="M5 21h14" />
        </svg>
        <p className="mt-3 text-sm text-neutral-300">
          Click or drop {multiple ? "PDF files" : "a PDF file"} here
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Files are processed in your browser — nothing is uploaded.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handle(e.target.files)}
        />
      </div>

      {children}
    </main>
  );
}
