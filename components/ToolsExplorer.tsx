"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Tool } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ToolsExplorer({
  tools,
  categories,
  randomLimit,
}: {
  tools: Tool[];
  categories: string[];
  randomLimit?: number;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [randomized, setRandomized] = useState<Tool[]>(tools);

  useEffect(() => {
    if (randomLimit) setRandomized(shuffle(tools));
  }, [tools, randomLimit]);

  const isDefaultView = randomLimit && !query.trim() && cat === "All";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = tools.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
    return base;
  }, [tools, query, cat]);

  const displayed = isDefaultView ? randomized.slice(0, randomLimit) : filtered;

  return (
    <div>
      {/* Search */}
      <div className="mx-auto max-w-2xl">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="tool-search"
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder="Search tools, categories, or tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/70 py-3.5 pl-11 pr-4 text-base text-neutral-100 placeholder:text-neutral-500 outline-none ring-emerald-500/40 transition focus:border-emerald-500/60 focus:ring-2"
          />
        </div>
      </div>

      {/* Categories */}
      <div
        id="tools"
        className="mt-5 flex flex-wrap items-center justify-center gap-2"
      >
        {["All", ...categories].map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                  : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-8">
        {displayed.length === 0 ? (
          <EmptyState query={query} onReset={() => { setQuery(""); setCat("All"); }} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((t) => (
              <li key={t.slug}>
                <ToolCard tool={t} />
              </li>
            ))}
          </ul>
        )}

        {isDefaultView && tools.length > (randomLimit ?? 0) && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/#categories"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-2.5 text-sm font-medium text-neutral-200 transition hover:border-neutral-700 hover:bg-neutral-900"
            >
              Browse all {tools.length} tools
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-neutral-800 bg-neutral-900">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-neutral-500"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-medium text-neutral-200">
        No tools match {query ? `“${query}”` : "that filter"}
      </h3>
      <p className="mt-1 text-sm text-neutral-500">
        Try a different search term or clear your filters.
      </p>
      <button
        onClick={onReset}
        className="mt-5 rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white"
      >
        Reset filters
      </button>
    </div>
  );
}

