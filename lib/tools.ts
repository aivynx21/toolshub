export type CategoryName = "Health" | "Finance" | "Everyday" | "Utilities";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: CategoryName;
  tags: string[];
  href: string;
  accent: string;
  icon: "heart" | "calc" | "coins" | "chart" | "qr" | "key" | "token";
};

export type CategoryMeta = {
  name: CategoryName;
  slug: string;
  tagline: string;
  description: string;
  whenToUse: string[];
  accent: string;
  icon: "heart" | "calc" | "coins" | "chart" | "qr" | "key" | "token";
};

export const TOOLS: Tool[] = [
  {
    slug: "bmi",
    name: "BMI Calculator",
    description:
      "Quickly estimate your Body Mass Index with units in metric or imperial, plus a healthy-weight range.",
    category: "Health",
    tags: ["health", "fitness", "weight", "metric", "imperial"],
    href: "/tools/bmi",
    accent: "from-emerald-500/20 to-emerald-500/0 text-emerald-400",
    icon: "heart",
  },
  {
    slug: "calculator",
    name: "Calculator",
    description:
      "A clean, keyboard-friendly scientific-style calculator for everyday arithmetic.",
    category: "Everyday",
    tags: ["math", "arithmetic", "basic"],
    href: "/tools/calculator",
    accent: "from-sky-500/20 to-sky-500/0 text-sky-400",
    icon: "calc",
  },
  {
    slug: "currency",
    name: "Currency Converter",
    description:
      "Convert between 150+ currencies with live exchange rates refreshed every ~24 hours.",
    category: "Finance",
    tags: ["currency", "forex", "exchange", "money"],
    href: "/tools/currency",
    accent: "from-amber-500/20 to-amber-500/0 text-amber-400",
    icon: "coins",
  },
  {
    slug: "sip",
    name: "SIP Calculator",
    description:
      "Project SIP, lumpsum, and step-up investments with year-by-year growth and gains.",
    category: "Finance",
    tags: ["investment", "sip", "mutual-funds", "returns"],
    href: "/tools/sip",
    accent: "from-violet-500/20 to-violet-500/0 text-violet-400",
    icon: "chart",
  },
  {
    slug: "qr",
    name: "QR Code Generator",
    description:
      "Generate QR codes for URLs, WiFi, vCards, SMS, and more. Customize colors, size, and download as PNG, SVG, or WebP.",
    category: "Utilities",
    tags: ["qr", "qrcode", "generator", "wifi", "vcard", "url"],
    href: "/tools/qr",
    accent: "from-pink-500/20 to-pink-500/0 text-pink-400",
    icon: "qr",
  },
  {
    slug: "password",
    name: "Password Generator",
    description:
      "Generate strong passwords, passphrases, and PINs with custom character sets, length, and batch output.",
    category: "Utilities",
    tags: ["password", "security", "passphrase", "pin", "random"],
    href: "/tools/password",
    accent: "from-yellow-500/20 to-yellow-500/0 text-yellow-400",
    icon: "key",
  },
  {
    slug: "token",
    name: "Token Generator",
    description:
      "Generate secure API tokens, UUIDs, hex, base64url, and nanoid-style IDs with optional prefix and batch output.",
    category: "Utilities",
    tags: ["token", "api", "uuid", "hex", "base64", "nanoid"],
    href: "/tools/token",
    accent: "from-cyan-500/20 to-cyan-500/0 text-cyan-400",
    icon: "token",
  },
];

export const CATEGORY_META: CategoryMeta[] = [
  {
    name: "Health",
    slug: "health",
    tagline: "Measure, track, and understand your body.",
    description:
      "Private health utilities that run entirely in your browser — no accounts, no tracking, no data leaves your device.",
    whenToUse: [
      "Estimating body composition with BMI and healthy-weight ranges",
      "Converting between metric and imperial units for height and weight",
      "Interpreting health metrics without sharing personal data online",
    ],
    accent: "from-emerald-500/20 to-emerald-500/0 text-emerald-400",
    icon: "heart",
  },
  {
    name: "Finance",
    slug: "finance",
    tagline: "Investment, currency, and money math.",
    description:
      "Loan calculators, investment projections, and currency conversions — all running instantly in your browser.",
    whenToUse: [
      "Projecting SIP, lumpsum, and step-up mutual-fund returns",
      "Converting between 150+ world currencies at live rates",
      "Comparing scenarios across years without touching a spreadsheet",
    ],
    accent: "from-amber-500/20 to-amber-500/0 text-amber-400",
    icon: "coins",
  },
  {
    name: "Everyday",
    slug: "everyday",
    tagline: "The small utilities you reach for daily.",
    description:
      "Quick, no-friction tools for routine math and everyday productivity — open, use, close.",
    whenToUse: [
      "Running quick arithmetic without opening a native calculator app",
      "Performing keyboard-first calculations during focused work",
      "Doing fast conversions and estimates on any device",
    ],
    accent: "from-sky-500/20 to-sky-500/0 text-sky-400",
    icon: "calc",
  },
  {
    name: "Utilities",
    slug: "utilities",
    tagline: "Generators, encoders, and developer helpers.",
    description:
      "QR codes, passwords, tokens, and other small-but-essential utilities. All generated locally with the Web Crypto API.",
    whenToUse: [
      "Generating secure passwords, API tokens, and UUIDs offline",
      "Creating QR codes for links, WiFi, vCards, SMS, and more",
      "Producing random IDs in hex, base64, or nanoid formats",
    ],
    accent: "from-pink-500/20 to-pink-500/0 text-pink-400",
    icon: "qr",
  },
];

export const CATEGORIES = CATEGORY_META.map((c) => c.name);

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORY_META.find((c) => c.slug === slug);
}

export function getToolsByCategory(name: CategoryName): Tool[] {
  return TOOLS.filter((t) => t.category === name);
}
