"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SquaresFour } from "@phosphor-icons/react";
import { InstallButton } from "./InstallButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/#tools" },
  { label: "Categories", href: "/#categories" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-2xl border border-border-strong py-2 pl-4 pr-2"
        style={{ background: "rgba(24,24,24,0.72)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      >
        <Link href="/" className="title-3 flex items-center gap-2" aria-current={pathname === "/" ? "page" : undefined}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-black">
            <SquaresFour size={18} weight="fill" aria-hidden />
          </span>
          Toolhub
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.slice(1).map((l) => (
            <Link key={l.href} href={l.href} className="nav-link title-4 rounded-lg px-3 py-2">
              {l.label}
            </Link>
          ))}
          <InstallButton />
          <Link href="/#tools" className="btn btn-primary button-sm ml-1">
            Browse tools
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <InstallButton />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative grid h-10 w-10 place-items-center rounded-lg border border-border-strong transition-transform duration-300 ease-base active:scale-95"
          >
            <span
              className="absolute h-0.5 w-5 rounded-full bg-text transition-transform duration-500 ease-base"
              style={{ transform: open ? "rotate(45deg)" : "translateY(-4px)" }}
            />
            <span
              className="absolute h-0.5 w-5 rounded-full bg-text transition-transform duration-500 ease-base"
              style={{ transform: open ? "rotate(-45deg)" : "translateY(4px)" }}
            />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className="fixed inset-0 -z-10 flex flex-col justify-center gap-2 px-6 transition-opacity duration-500 ease-base sm:hidden"
        style={{
          background: "rgba(0,0,0,0.94)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {NAV_LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            aria-current={l.href === pathname ? "page" : undefined}
            className="heading-4 py-2 text-text-muted transition-[opacity,transform,color] duration-500 ease-base aria-[current=page]:text-text"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "none" : "translateY(24px)",
              transitionDelay: open ? `${Math.min(i * 60, 400)}ms` : "0ms",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
