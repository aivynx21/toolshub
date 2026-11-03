import type { Tool } from "@/lib/tools";

export function ToolIcon({ name }: { name: Tool["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
  };
  switch (name) {
    case "heart":
      return (
        <svg {...common} aria-hidden>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
      );
    case "calc":
      return (
        <svg {...common} aria-hidden>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" />
        </svg>
      );
    case "coins":
      return (
        <svg {...common} aria-hidden>
          <circle cx="9" cy="9" r="5" />
          <path d="M15 9a5 5 0 1 1 0 10 5 5 0 0 1-4-2" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common} aria-hidden>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "qr":
      return (
        <svg {...common} aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1" />
        </svg>
      );
    case "key":
      return (
        <svg {...common} aria-hidden>
          <circle cx="8" cy="15" r="4" />
          <path d="m10.85 12.15 7.65-7.65M16 8l3 3M14 10l3 3" />
        </svg>
      );
    case "token":
      return (
        <svg {...common} aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h10" />
          <circle cx="18" cy="17" r="2" />
        </svg>
      );
    case "pdf":
      return (
        <svg {...common} aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h1M8 17h4M12 13h4" />
        </svg>
      );
  }
}
