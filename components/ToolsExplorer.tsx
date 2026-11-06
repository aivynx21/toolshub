"use client";

import { useEffect, useMemo, useState } from "react";
import { CaretDown, MagnifyingGlass, X } from "@phosphor-icons/react";
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
  const [cat, setCat] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [order, setOrder] = useState<Tool[]>(tools);

  useEffect(() => {
    if (randomLimit) setOrder(shuffle(tools));
  }, [tools, randomLimit]);

  const q = query.trim().toLowerCase();
  const isDefault = !!randomLimit && !q && cat === "All" && !showAll;

  const filtered = useMemo(
    () =>
      tools.filter((t) => {
        if (cat !== "All" && t.category !== cat) return false;
        if (!q) return true;
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }),
    [tools, q, cat],
  );

  const displayed = isDefault ? order.slice(0, randomLimit) : filtered;

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <div className="relative">
          <MagnifyingGlass
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-faint"
            aria-hidden
          />
          <input
            id="tool-search"
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder="Search tools, like merge, QR or BMI"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="body-3 w-full rounded-2xl border border-border-strong bg-surface py-4 pl-12 pr-12 text-text outline-none transition-[border-color,box-shadow] duration-300 ease-base placeholder:text-text-faint focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-dim)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-text-faint transition-colors duration-300 hover:bg-surface-hover hover:text-text"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>
      </div>

      <div id="tools" className="mt-6 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter by category">
        {["All", ...categories].map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => setCat(c)}
              className={
                "button-sm rounded-full border px-4 py-2 transition-[transform,background-color,color,border-color] duration-300 ease-base active:scale-[0.98] " +
                (active
                  ? "border-accent bg-accent-dim text-accent"
                  : "border-border bg-surface text-text-muted hover:bg-surface-raised hover:text-text")
              }
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-10" aria-live="polite">
        {displayed.length === 0 ? (
          <EmptyState query={query} onReset={() => { setQuery(""); setCat("All"); }} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((t, i) => (
              <li key={t.slug} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}>
                <ToolCard tool={t} />
              </li>
            ))}
          </ul>
        )}

        {isDefault && tools.length > (randomLimit ?? 0) && (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setShowAll(true)} className="btn btn-secondary button-md">
              Show all {tools.length} tools
              <CaretDown size={16} weight="bold" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="animate-scale-in mx-auto flex max-w-sm flex-col items-center rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-hover text-text-faint">
        <MagnifyingGlass size={24} aria-hidden />
      </div>
      <h3 className="title-2 mt-4">No tools found</h3>
      <p className="body-6 mt-2 text-text-muted">
        {query ? `Nothing matched "${query}". Try a shorter word, or pick a category.` : "No tools match that filter."}
      </p>
      <button type="button" onClick={onReset} className="btn btn-secondary button-sm mt-6">
        Clear filters
      </button>
    </div>
  );
}
