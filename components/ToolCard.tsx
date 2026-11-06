import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CATEGORY_COLOR, type Tool } from "@/lib/tools";
import { ToolIcon } from "@/components/ToolIcon";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={tool.href} className="card group flex h-full flex-col rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div
          className="grid h-10 w-10 place-items-center rounded-lg bg-surface-hover"
          style={{ color: CATEGORY_COLOR[tool.category], background: "var(--color-surface-hover)" }}
        >
          <ToolIcon name={tool.icon} />
        </div>
        <span className="caption-4 text-text-faint">{tool.category}</span>
      </div>

      <h3 className="title-2 mt-6">{tool.name}</h3>
      <p className="body-6 mt-2 flex-1 text-text-muted">{tool.description}</p>

      <div className="button-sm mt-6 flex items-center gap-1 text-text-faint transition-colors duration-300 group-hover:text-accent">
        Open tool
        <ArrowUpRight
          size={16}
          weight="bold"
          className="transition-transform duration-500 ease-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </Link>
  );
}
