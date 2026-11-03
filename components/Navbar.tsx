"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900/80 bg-neutral-950/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-emerald-500 text-neutral-950">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M14.7 6.3a4 4 0 1 1 3 3L8 19.5l-4.5 1 1-4.5 10.2-9.7Z" />
            </svg>
          </span>
          <span>Toolhub</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-neutral-400 sm:flex">
          <Link href="/" className="hover:text-neutral-100">
            Home
          </Link>
          <Link href="/#tools" className="hover:text-neutral-100">
            Tools
          </Link>
          <Link href="/#categories" className="hover:text-neutral-100">
            Categories
          </Link>
          <Link
            href="/#tools"
            className="rounded-md bg-emerald-500 px-3 py-1.5 font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Browse
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-neutral-800 p-2 sm:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-neutral-900 bg-neutral-950 sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-neutral-300 hover:bg-neutral-900"
            >
              Home
            </Link>
            <Link
              href="/#tools"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-neutral-300 hover:bg-neutral-900"
            >
              Tools
            </Link>
            <Link
              href="/#categories"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-neutral-300 hover:bg-neutral-900"
            >
              Categories
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
