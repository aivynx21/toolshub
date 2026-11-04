"use client";

import Link from "next/link";
import { useState } from "react";
import { InstallButton } from "./InstallButton";

/** Geometric grid icon — inline SVG, no emoji */
function GridIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="11" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="1" y="11" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect
        x="11"
        y="11"
        width="6"
        height="6"
        rx="1.5"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "Tools",      href: "/#tools" },
  { label: "Categories", href: "/#categories" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: "rgba(8,8,8,0.90)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 font-semibold tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-lg"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
          >
            <GridIcon />
          </span>
          <span className="text-[15px]">Toolhub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link rounded-md px-3 py-1.5 text-sm"
            >
              {l.label}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-2">
            <InstallButton />
            <Link
              href="/#tools"
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-transform active:scale-[0.97]"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-bg)",
                transitionProperty: "transform",
                transitionDuration: "160ms",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              Browse tools
            </Link>
          </div>
        </div>

        {/* Mobile row */}
        <div className="flex items-center gap-2 sm:hidden">
          <InstallButton />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg transition-transform active:scale-[0.95]"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
              transitionProperty: "transform",
              transitionDuration: "160ms",
              transitionTimingFunction: "var(--ease-out)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="animate-slide-down sm:hidden"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-0.5 px-4 py-2.5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="nav-link rounded-lg px-3 py-2.5 text-sm"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#tools"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-transform active:scale-[0.97]"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-bg)",
                transitionProperty: "transform",
                transitionDuration: "160ms",
              }}
            >
              Browse tools
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
