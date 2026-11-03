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
    title: `${cat.name} Tools — AivynxTools`,
    description: cat.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();
  const tools = getToolsByCategory(cat.name);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-300">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-300">{cat.name}</span>
      </nav>

      <header className="mt-6 flex items-start gap-5">
        <div
          className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${cat.accent} border border-neutral-800`}
        >
          <div className="scale-[1.6]">
            <ToolIcon name={cat.icon} />
          </div>
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {cat.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            {tools.length} tool{tools.length === 1 ? "" : "s"} available. All
            free, all private.
          </p>
        </div>
      </header>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-neutral-400">
        {cat.description}
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          When to use {cat.name.toLowerCase()} tools
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {cat.whenToUse.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-sm text-neutral-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">
          Popular {cat.name.toLowerCase()} tools
        </h2>
        {tools.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            No tools in this category yet.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <li key={t.slug}>
                <ToolCard tool={t} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-12 flex justify-center">
        <Link
          href="/#categories"
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-700 hover:text-neutral-100"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Browse all categories
        </Link>
      </div>
    </main>
  );
}
