import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] w-full max-w-6xl place-items-center px-4 sm:px-6">
      <div className="text-center">
        <p className="font-mono caption-3 text-accent">404</p>
        <h1 className="heading-4 sm:heading-3 mt-4">This page does not exist</h1>
        <p className="body-3 mx-auto mt-4 max-w-[680px] text-text-muted">
          The link may be old, or the tool may have moved. Head back and search for what you need.
        </p>
        <Link href="/#tools" className="btn btn-primary button-md mt-8">
          <ArrowLeft size={18} weight="bold" aria-hidden />
          Back to all tools
        </Link>
      </div>
    </main>
  );
}
