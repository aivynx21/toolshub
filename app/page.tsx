import Link from "next/link";
import {
  ArrowRight,
  Cursor,
  DeviceMobile,
  LockKey,
  Plus,
  Stack,
  UserMinus,
} from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES, CATEGORY_COLOR, CATEGORY_META, TOOLS } from "@/lib/tools";
import { ToolsExplorer } from "@/components/ToolsExplorer";
import { ToolIcon } from "@/components/ToolIcon";
import { Reveal } from "@/components/Reveal";
import { TaglineReveal } from "@/components/TaglineReveal";

const BENEFITS = [
  { icon: LockKey, title: "Your files stay with you", body: "PDF tools run inside your browser. Nothing is uploaded, so a contract or a payslip never touches a server." },
  { icon: UserMinus, title: "No account to create", body: "Open a tool and use it. There is no signup wall, no email capture and no trial clock." },
  { icon: Stack, title: "One place for the odd jobs", body: "Merge a PDF, generate a password and check an exchange rate without hunting for a new site each time." },
  { icon: DeviceMobile, title: "Works on your phone too", body: "Every tool is built mobile first, and you can install Toolhub to your home screen in one tap." },
];

const STEPS = [
  { n: "01", title: "Find your tool", body: "Search by what you want to do, or filter by category." },
  { n: "02", title: "Enter values or drop a file", body: "Results update as you type. Files are read on your device." },
  { n: "03", title: "Copy or download", body: "Take the answer with you and close the tab. That is the whole flow." },
];

const FAQ = [
  { q: "Is Toolhub free?", a: "Yes. Every tool is free to use, with no signup and no usage limits." },
  { q: "Are my PDF files uploaded anywhere?", a: "No. The PDF tools run in your browser, so your files are read and processed on your own device and never sent to a server." },
  { q: "Do I need to create an account?", a: "No. There are no accounts. Open a tool and start." },
  { q: "Does the currency converter need an internet connection?", a: "Yes. It fetches exchange rates, which refresh about once a day. The other tools do not need live data." },
  { q: "Can I install Toolhub on my phone?", a: "Yes. Use the Install button in the top bar. On iPhone, open the Share menu in Safari and choose Add to Home Screen." },
  { q: "Who builds Toolhub?", a: "Toolhub is built and maintained by Aivynx." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
          <p className="caption-1 animate-fade-in rounded-full border border-border-strong bg-surface px-3 py-1 text-text-muted">
            {TOOLS.length} free tools · No signup
          </p>
          <h1 className="heading-3 sm:heading-1 hero-text animate-fade-up mt-6" style={{ animationDelay: "80ms" }}>
            Every small job.
            <br />
            One fast tool.
          </h1>
          <p className="body-3 animate-fade-up mt-6 max-w-[680px] text-text-muted sm:text-lg" style={{ animationDelay: "160ms" }}>
            Merge PDFs, work out a SIP, make a QR code or check your BMI. Pick a tool, get the answer and get on with your day.
          </p>
          <div className="animate-fade-up mt-8 flex flex-col items-center gap-3" style={{ animationDelay: "240ms" }}>
            <Link href="#tools" className="btn btn-primary button-md">
              Browse all tools
              <ArrowRight size={18} weight="bold" aria-hidden />
            </Link>
            <p className="caption-4 text-text-faint">Free forever. PDF files never leave your device.</p>
          </div>
        </div>

        <div className="mt-16 scroll-mt-24">
          <ToolsExplorer tools={TOOLS} categories={CATEGORIES as string[]} randomLimit={6} />
        </div>
      </section>

      {/* Tagline reveal (B11) */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6" aria-label="Our promise">
        <TaglineReveal lines={["No signup. No uploads.", "Just the tool you came for."]} />
      </section>

      {/* Benefits */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 className="heading-4 sm:heading-3 max-w-[680px]">Built for the five minute job</h2>
          <p className="body-3 mt-4 max-w-[680px] text-text-muted">
            Most web tools bury the answer under ads and sign in prompts. Toolhub keeps the page empty so the answer is the loudest thing on it.
          </p>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={i * 60} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-surface-hover text-accent">
                    <b.icon size={20} weight="duotone" aria-hidden />
                  </div>
                  <h3 className="title-2 mt-6">{b.title}</h3>
                  <p className="body-6 mt-2 text-text-muted">{b.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 className="heading-4 sm:heading-3">How it works</h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.n}>
              <Reveal delay={i * 60} className="h-full">
                <div className="h-full rounded-2xl border border-border p-6">
                  <span className="font-mono caption-3 text-accent">{s.n}</span>
                  <h3 className="title-1 mt-6">{s.title}</h3>
                  <p className="body-6 mt-2 text-text-muted">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 className="heading-4 sm:heading-3">Browse by category</h2>
          <p className="body-3 mt-4 max-w-[680px] text-text-muted">Know the kind of job but not the tool? Start here.</p>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_META.map((cat, i) => {
            const count = TOOLS.filter((t) => t.category === cat.name).length;
            return (
              <li key={cat.slug}>
                <Reveal delay={i * 60} className="h-full">
                  <Link href={`/categories/${cat.slug}`} className="card group flex h-full items-start gap-4 rounded-2xl p-6">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ background: "var(--color-surface-hover)", color: CATEGORY_COLOR[cat.name] }}>
                      <ToolIcon name={cat.icon} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="title-2">{cat.name}</span>
                        <span className="font-mono caption-5 text-text-faint">{count} tool{count === 1 ? "" : "s"}</span>
                      </div>
                      <p className="body-6 mt-1 text-text-muted">{cat.tagline}</p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 className="heading-4 sm:heading-3">Questions, answered</h2>
        </Reveal>
        <Reveal className="mt-10">
          <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-6">
                <summary className="title-3 flex items-center justify-between gap-4 py-4 text-left">
                  {f.q}
                  <Plus size={18} weight="bold" className="faq-icon shrink-0 text-text-muted" aria-hidden />
                </summary>
                <p className="body-6 pb-6 text-text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </section>

      {/* Final CTA, identical to the top */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-center rounded-2xl border border-border-strong bg-surface px-6 py-16 text-center">
            <h2 className="heading-4 sm:heading-3 max-w-[680px]">Got a job to get done?</h2>
            <p className="body-3 mt-4 max-w-[680px] text-text-muted">Pick a tool and be finished before this page would have loaded elsewhere.</p>
            <Link href="#tools" className="btn btn-primary button-md mt-8">
              Browse all tools
              <ArrowRight size={18} weight="bold" aria-hidden />
            </Link>
            <p className="caption-4 mt-4 flex items-center gap-1 text-text-faint">
              <Cursor size={14} aria-hidden /> Free forever. No signup.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
