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
          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-transform active:scale-[0.97] " +
          className
        }
        style={{
          border: "1px solid rgba(34,197,94,0.3)",
          background: "var(--color-accent-dim)",
          color: "var(--color-accent)",
          transitionProperty: "transform, background-color, border-color",
          transitionDuration: "var(--duration-fast)",
          transitionTimingFunction: "var(--ease-out)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
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
          className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowIosHint(false)}
        >
          <div
            className="animate-scale-in w-full max-w-sm rounded-2xl p-6 text-sm shadow-2xl"
            style={{
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-base font-semibold"
              style={{ color: "var(--color-text)", letterSpacing: "-0.01em" }}
            >
              Install Toolhub
            </h3>
            {isIos ? (
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Tap the <span style={{ color: "var(--color-text)" }}>Share</span> icon in
                Safari, then choose{" "}
                <span style={{ color: "var(--color-text)" }}>Add to Home Screen</span>.
              </p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Open your browser menu and tap{" "}
                <span style={{ color: "var(--color-text)" }}>Install app</span> or{" "}
                <span style={{ color: "var(--color-text)" }}>Add to Home screen</span>.
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowIosHint(false)}
              className="mt-5 w-full rounded-lg px-4 py-2.5 font-medium transition-transform active:scale-[0.98]"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-bg)",
                minHeight: "44px",
                transitionProperty: "transform",
                transitionDuration: "160ms",
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
