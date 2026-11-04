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
  const [query, setQuery]           = useState("");
  const [cat, setCat]               = useState<string>("All");
  const [randomized, setRandomized] = useState<Tool[]>(tools);

  useEffect(() => {
    if (randomLimit) setRandomized(shuffle(tools));
  }, [tools, randomLimit]);

  const isDefaultView = randomLimit && !query.trim() && cat === "All";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
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
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--color-text-faint)" }}
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
            className="w-full rounded-xl py-3 pl-11 pr-10 text-base outline-none"
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              transition:
                "border-color var(--duration-fast), box-shadow var(--duration-fast)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px var(--color-accent-dim)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.boxShadow = "";
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors hover:text-[var(--color-text)]"
              style={{ color: "var(--color-text-faint)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div
        id="tools"
        className="mt-6 flex flex-wrap items-center justify-center gap-2"
      >
        {["All", ...categories].map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className="rounded-full px-4 py-2 text-sm font-medium transition-transform active:scale-[0.97]"
              style={{
                border: `1px solid ${active ? "rgba(34,197,94,0.4)" : "var(--color-border)"}`,
                background: active ? "var(--color-accent-dim)" : "var(--color-surface)",
                color: active ? "var(--color-accent)" : "var(--color-text-muted)",
                transitionProperty: "background-color, color, border-color, transform",
                transitionDuration: "var(--duration-fast)",
                transitionTimingFunction: "var(--ease-out)",
                minHeight: "44px",
                minWidth: "44px",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-8">
        {displayed.length === 0 ? (
          <EmptyState
            query={query}
            onReset={() => { setQuery(""); setCat("All"); }}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((t, i) => (
              <li
                key={t.slug}
                className="animate-fade-up"
                style={
                  {
                    "--stagger": i,
                    animationDelay: `${Math.min(i * 30, 300)}ms`,
                  } as React.CSSProperties
                }
              >
                <ToolCard tool={t} index={i} />
              </li>
            ))}
          </ul>
        )}

        {isDefaultView && tools.length > (randomLimit ?? 0) && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/#categories"
              className="action-btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
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
                aria-hidden
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

function EmptyState({
  query,
  onReset,
}: {
  query: string;
  onReset: () => void;
}) {
  return (
    <div
      className="animate-scale-in mx-auto flex max-w-sm flex-col items-center rounded-2xl px-6 py-14 text-center"
      style={{
        border: "1px dashed var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      {/* Icon */}
      <div
        className="grid h-12 w-12 place-items-center rounded-full"
        style={{
          border: "1px solid var(--color-border)",
          color: "var(--color-text-faint)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      <h3
        className="mt-4 text-base font-semibold"
        style={{ color: "var(--color-text)" }}
      >
        No tools found
      </h3>
      <p className="mt-1.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
        {query
          ? `Nothing matched "${query}". Try a different term.`
          : "No tools match that filter."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="action-btn mt-5 rounded-lg px-4 py-2 text-sm font-medium"
        style={{ minHeight: "44px" }}
      >
        Clear filters
      </button>
    </div>
  );
}
