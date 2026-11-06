import Link from "next/link";
import { CATEGORY_META, TOOLS } from "@/lib/tools";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-16 sm:px-6">
      <div className="grid gap-10 border-t border-border pt-10 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="title-2">Toolhub</p>
          <p className="body-6 mt-3 max-w-xs text-text-muted">
            {TOOLS.length} free tools for everyday work. No accounts, no ads, no clutter.
          </p>
        </div>
        <nav aria-label="Categories">
          <p className="caption-3 text-text-faint">Categories</p>
          <ul className="mt-3 space-y-2">
            {CATEGORY_META.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="body-6 text-text-muted transition-colors duration-300 hover:text-text">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legal">
          <p className="caption-3 text-text-faint">Company</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/privacy" className="body-6 text-text-muted transition-colors duration-300 hover:text-text">Privacy policy</Link></li>
            <li><Link href="/terms" className="body-6 text-text-muted transition-colors duration-300 hover:text-text">Terms of use</Link></li>
            <li>
              <a href="https://aivynx.com" target="_blank" rel="noopener noreferrer" className="body-6 text-text-muted transition-colors duration-300 hover:text-text">
                Built by Aivynx
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
