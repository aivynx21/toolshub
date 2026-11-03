"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallButton({ className = "" }: { className?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (standalone) setInstalled(true);

    const ua = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    setIsIos(iOS);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    if (isIos) {
      setShowIosHint(true);
      return;
    }
    setShowIosHint(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install Toolhub app"
        className={
          "inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 " +
          className
        }
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
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
        <span>Install</span>
      </button>

      {showIosHint && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={() => setShowIosHint(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-950 p-5 text-sm text-neutral-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-base font-semibold text-neutral-100">
              Install Toolhub
            </h3>
            {isIos ? (
              <p className="text-neutral-400">
                Tap the <span className="font-medium text-neutral-200">Share</span> icon
                in Safari, then choose{" "}
                <span className="font-medium text-neutral-200">Add to Home Screen</span>.
              </p>
            ) : (
              <p className="text-neutral-400">
                Open your browser menu and tap{" "}
                <span className="font-medium text-neutral-200">
                  Install app
                </span>{" "}
                or{" "}
                <span className="font-medium text-neutral-200">
                  Add to Home screen
                </span>
                .
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowIosHint(false)}
              className="mt-4 w-full rounded-md bg-emerald-500 px-3 py-2 font-medium text-neutral-950 hover:bg-emerald-400"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
