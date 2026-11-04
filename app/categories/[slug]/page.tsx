import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_META,
  getCategoryBySlug,
  getToolsByCategory,
} from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { ToolIcon } from "@/components/ToolIcon";

export function generateStaticParams() {
  return CATEGORY_META.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Category not found" };
  return {
    title: `${cat.name} Tools — Toolhub`,
    description: cat.description,
  };
}

const CAT_THEME: Record<string, { bg: string; fg: string; border: string }> = {
  Health:    { bg: "rgba(34,197,94,0.12)",   fg: "#22c55e", border: "rgba(34,197,94,0.25)" },
  Finance:   { bg: "rgba(251,191,36,0.12)",  fg: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  Everyday:  { bg: "rgba(56,189,248,0.12)",  fg: "#38bdf8", border: "rgba(56,189,248,0.25)" },
  Utilities: { bg: "rgba(244,114,182,0.12)", fg: "#f472b4", border: "rgba(244,114,182,0.25)"},
  PDF:       { bg: "rgba(251,113,133,0.12)", fg: "#fb7185", border: "rgba(251,113,133,0.25)"},
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();
  const tools = getToolsByCategory(cat.name);
  const theme = CAT_THEME[cat.name] ?? {
    bg: "rgba(255,255,255,0.08)",
    fg: "var(--color-accent)",
    border: "var(--color-border)",
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm"
        style={{ color: "var(--color-text-faint)" }}
      >
        <Link
          href="/"
          className="transition-colors hover:text-[var(--color-text)]"
          style={{ transitionDuration: "var(--duration-fast)" }}
        >
          Home
        </Link>
        <span aria-hidden>/</span>
        <span style={{ color: "var(--color-text-muted)" }}>{cat.name}</span>
      </nav>

      {/* Header */}
      <header className="mt-8 flex items-start gap-5">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-xl"
          style={{
            background: theme.bg,
            color: theme.fg,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div className="scale-125">
            <ToolIcon name={cat.icon} />
          </div>
        </div>
        <div>
          <h1
            className="text-3xl font-semibold sm:text-4xl"
            style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}
          >
            {cat.name} Tools
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {tools.length} tool{tools.length === 1 ? "" : "s"} · browser-only · no sign-ups required
          </p>
        </div>
      </header>

      {/* Description */}
      <p
        className="mt-6 max-w-2xl text-base leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {cat.description}
      </p>

      {/* When to use */}
      <section className="mt-10">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-text)", letterSpacing: "-0.01em" }}
        >
          When to use {cat.name.toLowerCase()} tools
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {cat.whenToUse.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl p-4 text-sm"
              style={{
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text-muted)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--color-accent)" }}
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tool list */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--color-text)", letterSpacing: "-0.01em" }}
          >
            All {cat.name.toLowerCase()} tools
          </h2>
          <span
            className="text-xs"
            style={{
              color: "var(--color-text-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {tools.length} available
          </span>
        </div>

        {tools.length === 0 ? (
          <p className="mt-4 text-sm" style={{ color: "var(--color-text-faint)" }}>
            No tools in this category yet.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t, i) => (
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
      </section>

      {/* Back button */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/#categories"
          className="action-btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
          style={{ minHeight: "44px" }}
        >
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Browse all categories
        </Link>
      </div>
    </main>
  );
}
