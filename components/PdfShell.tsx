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
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold sm:text-3xl"
          style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
          {description}
        </p>
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
        className="cursor-pointer rounded-2xl p-10 text-center transition-all"
        style={{
          border: `1.5px dashed ${drag ? "var(--color-accent)" : "var(--color-border)"}`,
          background: drag ? "var(--color-accent-dim)" : "var(--color-surface)",
          transitionProperty: "border-color, background-color, transform",
          transitionDuration: "var(--duration-fast)",
          transitionTimingFunction: "var(--ease-out)",
        }}
      >
        <div
          className="mx-auto grid h-12 w-12 place-items-center rounded-xl"
          style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-raised)",
            color: drag ? "var(--color-accent)" : "var(--color-text-faint)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M12 3v12" />
            <path d="m7 10 5-5 5 5" />
            <path d="M5 21h14" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium" style={{ color: "var(--color-text)" }}>
          Click or drop {multiple ? "PDF files" : "a PDF file"} here
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--color-text-faint)" }}>
          Files are processed entirely in your browser — zero data leaves your device.
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

      {children && <div className="mt-8">{children}</div>}
    </main>
  );
}
