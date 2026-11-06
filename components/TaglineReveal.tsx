"use client";

import { useEffect, useRef } from "react";

/**
 * B11: every word starts muted and lights up one at a time as it crosses a
 * trigger line at 70% of the viewport height. Lit state is derived from scroll
 * position, so scrolling back up dims words again. Throttled with rAF.
 */
export function TaglineReveal({ lines }: { lines: string[] }) {
  const root = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const words = Array.from(root.current?.querySelectorAll<HTMLElement>(".tw") ?? []);
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.7;
      for (const w of words) w.classList.toggle("on", w.getBoundingClientRect().top < line);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={root} className="heading-3 sm:heading-2 mx-auto max-w-[680px] text-center">
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((w, i) => (
            <span key={i} className="tw inline-block">
              {w}&nbsp;
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
