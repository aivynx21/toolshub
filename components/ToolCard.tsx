import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { ToolIcon } from "@/components/ToolIcon";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group block h-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition hover:-translate-y-0.5 hover:border-neutral-700 hover:bg-neutral-900"
    >
      <div className="flex items-start justify-between">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${tool.accent} border border-neutral-800`}
        >
          <ToolIcon name={tool.icon} />
        </div>
        <span className="rounded-full border border-neutral-800 bg-neutral-950/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
          {tool.category}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-neutral-100">
        {tool.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
        {tool.description}
      </p>
      <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-neutral-200 group-hover:text-emerald-400">
        Open tool
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition group-hover:translate-x-0.5"
          aria-hidden
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
