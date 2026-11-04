import { TOOLS, CATEGORIES, CATEGORY_META } from "@/lib/tools";
import { ToolsExplorer } from "@/components/ToolsExplorer";
import Link from "next/link";

/** Category icon glyphs — refined inline SVG, no emoji */
const CAT_ICON: Record<string, React.ReactNode> = {
  Health: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  ),
  Finance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <circle cx="9" cy="9" r="5" />
      <path d="M15 9a5 5 0 1 1 0 10 5 5 0 0 1-4-2" />
    </svg>
  ),
  Everyday: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" />
    </svg>
  ),
  Utilities: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1" />
    </svg>
  ),
  PDF: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h1M8 17h4M12 13h4" />
    </svg>
  ),
};

const CAT_PALETTE: Record<string, { bg: string; fg: string }> = {
  Health:    { bg: "rgba(34,197,94,0.08)",   fg: "#22c55e" },
  Finance:   { bg: "rgba(251,191,36,0.08)",  fg: "#fbbf24" },
  Everyday:  { bg: "rgba(56,189,248,0.08)",  fg: "#38bdf8" },
  Utilities: { bg: "rgba(244,114,182,0.08)", fg: "#f472b4" },
  PDF:       { bg: "rgba(251,113,133,0.08)", fg: "#fb7185" },
};

export default function HomePage() {
  const toolCount = TOOLS.length;
  const catCount  = CATEGORIES.length;

  return (
    <main className="relative">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        {/* Subtle radial glow — emerald only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 400px at 50% -60px, rgba(34,197,94,0.07), transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Headline */}
            <h1
              className="text-5xl font-semibold leading-tight sm:text-6xl"
              style={{ letterSpacing: "-0.03em", color: "var(--color-text)" }}
            >
              Fast,{" "}
              <span style={{ color: "var(--color-accent)" }}>focused</span>
              {" "}tools.
              <br />
              All in one place.
            </h1>

            {/* Subtitle */}
            <p
              className="mx-auto mt-5 max-w-xl text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              A curated directory of distraction-free utilities for health,
              finance, and everyday math. No sign-ups. No pop-ups. Just open and
              use.
            </p>

            {/* Stats strip */}
            <div
              className="mt-7 inline-flex items-center gap-3 text-xs"
              style={{
                color: "var(--color-text-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <span>{toolCount} tools</span>
              <span
                aria-hidden
                style={{
                  width: "1px",
                  height: "12px",
                  background: "var(--color-border-strong)",
                  display: "inline-block",
                }}
              />
              <span>{catCount} categories</span>
              <span
                aria-hidden
                style={{
                  width: "1px",
                  height: "12px",
                  background: "var(--color-border-strong)",
                  display: "inline-block",
                }}
              />
              <span>No sign-ups</span>
            </div>
          </div>

          {/* Explorer */}
          <div className="mt-12">
            <ToolsExplorer
              tools={TOOLS}
              categories={CATEGORIES as string[]}
              randomLimit={6}
            />
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section
        id="categories"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          {/* Section header */}
          <div className="mb-8">
            <h2
              className="text-2xl font-semibold"
              style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}
            >
              Browse by category
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Every tool runs entirely in your browser — no data leaves your device.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_META.map((cat) => {
              const count   = TOOLS.filter((t) => t.category === cat.name).length;
              const palette = CAT_PALETTE[cat.name] ?? { bg: "rgba(255,255,255,0.06)", fg: "var(--color-text-muted)" };
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group category-card flex items-start gap-4 rounded-xl p-5"
                >
                  {/* Category icon */}
                  <div
                    className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg"
                    style={{ background: palette.bg, color: palette.fg }}
                  >
                    {CAT_ICON[cat.name]}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className="text-base font-semibold group-hover:text-[var(--color-accent)]"
                        style={{
                          color: "var(--color-text)",
                          letterSpacing: "-0.01em",
                          transition: "color var(--duration-fast)",
                        }}
                      >
                        {cat.name}
                      </span>
                      <span
                        className="shrink-0 text-xs"
                        style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)" }}
                      >
                        {count} tool{count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p
                      className="mt-0.5 text-sm leading-snug"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {cat.tagline}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      color: "var(--color-text-faint)",
                      transition: "transform var(--duration-fast) var(--ease-out), color var(--duration-fast)",
                    }}
                    aria-hidden
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div
          className="flex flex-col items-center justify-between gap-3 text-xs sm:flex-row"
          style={{ color: "var(--color-text-faint)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-faint)",
            }}
          >
            Toolhub — {toolCount} tools, zero fluff
          </span>
          <span>
            Built by{" "}
            <a
              href="https://aivynx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline underline-offset-4 transition-colors"
              style={{ transitionDuration: "var(--duration-fast)" }}
            >
              Aivynx
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
