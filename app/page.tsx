import { TOOLS, CATEGORIES, CATEGORY_META } from "@/lib/tools";
import { ToolsExplorer } from "@/components/ToolsExplorer";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(600px 300px at 50% 0%, rgba(16,185,129,0.18), transparent 70%), radial-gradient(400px 200px at 20% 100%, rgba(139,92,246,0.14), transparent 70%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs font-mono text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {TOOLS.length} tools · zero fluff
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Fast, focused tools.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                All in one place.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-400 sm:text-base">
              A curated directory of distraction-free utilities for health,
              finance, and everyday math. No sign-ups. No pop-ups. Just open and
              use.
            </p>
          </div>

          <div className="mt-10">
            <ToolsExplorer
              tools={TOOLS}
              categories={CATEGORIES as string[]}
              randomLimit={6}
            />
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section id="categories" className="border-b border-neutral-900">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Browse by category
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_META.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.name).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 transition hover:border-neutral-700 hover:bg-neutral-900"
                >
                  <div>
                    <div className="text-base font-medium">{cat.name}</div>
                    <div className="text-xs text-neutral-500">
                      {count} tool{count === 1 ? "" : "s"}
                    </div>
                  </div>
                  <svg
                    className="h-4 w-4 text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-neutral-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-4 py-10 text-center text-xs text-neutral-600 sm:px-6">
        Created by{" "}
        <a
          href="https://aivynx.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-neutral-200 underline underline-offset-2"
        >
          Aivynx
        </a>
      </footer>
    </main>
  );
}
