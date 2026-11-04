import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { ToolIcon } from "@/components/ToolIcon";

/** Single-accent icon bg/fg per category */
const CATEGORY_COLOR: Record<string, { bg: string; fg: string }> = {
  Health:    { bg: "rgba(34,197,94,0.14)",  fg: "#22c55e" },
  Finance:   { bg: "rgba(251,191,36,0.14)", fg: "#fbbf24" },
  Everyday:  { bg: "rgba(56,189,248,0.14)", fg: "#38bdf8" },
  Utilities: { bg: "rgba(244,114,182,0.14)",fg: "#f472b4" },
  PDF:       { bg: "rgba(251,113,133,0.14)",fg: "#fb7185" },
};

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const palette = CATEGORY_COLOR[tool.category] ?? {
    bg: "rgba(255,255,255,0.06)",
    fg: "var(--color-text-muted)",
  };

  return (
    <Link
      href={tool.href}
      className="group tool-card block h-full rounded-xl p-5"
      style={
        {
          "--stagger": index,
          display: "flex",
          flexDirection: "column",
        } as React.CSSProperties
      }
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
          style={{ background: palette.bg, color: palette.fg }}
        >
          <ToolIcon name={tool.icon} />
        </div>

        {/* Category tag */}
        <span
          className="text-xs"
          style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-sans)" }}
        >
          {tool.category.toLowerCase()}
        </span>
      </div>

      {/* Title */}
      <h3
        className="mt-4 text-base font-semibold leading-snug"
        style={{ color: "var(--color-text)", letterSpacing: "-0.01em" }}
      >
        {tool.name}
      </h3>

      {/* Description */}
      <p
        className="mt-1.5 flex-1 text-sm leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {tool.description}
      </p>

      {/* Open tool → */}
      <div
        className="mt-5 flex items-center gap-1.5 text-sm font-medium"
        style={{
          color: "var(--color-text-faint)",
          transition: "color var(--duration-fast) var(--ease-out)",
        }}
      >
        <span
          className="group-hover:text-[var(--color-accent)]"
          style={{ transition: "color var(--duration-fast) var(--ease-out)" }}
        >
          Open tool
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
          style={{
            transition:
              "transform var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)",
          }}
          aria-hidden
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
