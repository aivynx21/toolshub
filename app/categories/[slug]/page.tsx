import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_META,
  getCategoryBySlug,
  getToolsByCategory,
} from "@/lib/tools";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { CATEGORY_COLOR } from "@/lib/tools";
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
    title: `${cat.name} tools`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();
  const tools = getToolsByCategory(cat.name);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="body-6 flex items-center gap-2 text-text-faint">
        <Link href="/" className="transition-colors duration-300 hover:text-text">Home</Link>
        <span aria-hidden>/</span>
        <span aria-current="page" className="text-text-muted">{cat.name}</span>
      </nav>

      <header className="mt-8 flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-surface-hover" style={{ color: CATEGORY_COLOR[cat.name] }}>
          <ToolIcon name={cat.icon} size={28} />
        </div>
        <div>
          <h1 className="heading-5 sm:heading-3">{cat.name} tools</h1>
          <p className="body-6 mt-2 text-text-muted">
            {tools.length} tool{tools.length === 1 ? "" : "s"} · Free · No signup
          </p>
        </div>
      </header>

      <p className="body-3 mt-6 max-w-[680px] text-text-muted">{cat.description}</p>

      <section className="mt-12">
        <h2 className="heading-6">When to use {cat.name.toLowerCase()} tools</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {cat.whenToUse.map((item) => (
            <li key={item} className="body-6 flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-text-muted">
              <CheckCircle size={20} weight="fill" className="shrink-0 text-accent" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="heading-6">All {cat.name.toLowerCase()} tools</h2>
        {tools.length === 0 ? (
          <p className="body-6 mt-4 text-text-faint">No tools in this category yet.</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t, i) => (
              <li key={t.slug} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}>
                <ToolCard tool={t} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
