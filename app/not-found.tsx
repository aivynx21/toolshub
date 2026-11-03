import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] w-full max-w-6xl place-items-center px-4 sm:px-6">
      <div className="text-center">
        <div className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          404
        </div>
        <h1 className="mt-3 text-2xl font-semibold">Nothing here.</h1>
        <p className="mt-2 text-sm text-neutral-500">
          That page or tool doesn't exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
        >
          Back to directory
        </Link>
      </div>
    </main>
  );
}
