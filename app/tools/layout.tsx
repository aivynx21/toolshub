import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <Link href="/#tools" className="body-5 group inline-flex items-center gap-2 text-text-muted transition-colors duration-300 hover:text-text">
          <ArrowLeft size={16} weight="bold" className="transition-transform duration-500 ease-base group-hover:-translate-x-1" aria-hidden />
          All tools
        </Link>
      </div>
      {children}
    </>
  );
}
