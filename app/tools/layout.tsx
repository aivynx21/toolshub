import Link from "next/link";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text)] transition-colors"
          style={{ transitionDuration: "var(--duration-fast)" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            style={{
              transitionDuration: "var(--duration-fast)",
              transitionTimingFunction: "var(--ease-out)",
            }}
            aria-hidden
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to directory
        </Link>
      </div>
      {children}
    </>
  );
}
