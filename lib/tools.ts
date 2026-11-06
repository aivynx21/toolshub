export type CategoryName = "Health" | "Finance" | "Everyday" | "Utilities" | "PDF";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: CategoryName;
  tags: string[];
  href: string;
  accent: string;
  icon: "heart" | "calc" | "coins" | "chart" | "qr" | "key" | "token" | "pdf";
};

export type CategoryMeta = {
  name: CategoryName;
  slug: string;
  tagline: string;
  description: string;
  whenToUse: string[];
  accent: string;
  icon: "heart" | "calc" | "coins" | "chart" | "qr" | "key" | "token" | "pdf";
};

export const TOOLS: Tool[] = [
  {
    slug: "bmi",
    name: "BMI Calculator",
    description:
      "Quickly estimate your Body Mass Index with units in metric or imperial, plus a healthy weight range.",
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
      "A clean, keyboard friendly calculator for everyday arithmetic.",
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
    tags: ["investment", "sip", "mutual funds", "returns"],
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
      "Generate secure API tokens, UUIDs, hex, base64url, and nanoid IDs with optional prefix and batch output.",
    category: "Utilities",
    tags: ["token", "api", "uuid", "hex", "base64", "nanoid"],
    href: "/tools/token",
    accent: "from-cyan-500/20 to-cyan-500/0 text-cyan-400",
    icon: "token",
  },
  ...pdfTools(),
];

function pdfTools(): Tool[] {
  const accent = "from-red-500/20 to-red-500/0 text-red-400";
  const mk = (slug: string, name: string, description: string, tags: string[]): Tool => ({
    slug,
    name,
    description,
    category: "PDF",
    tags: ["pdf", ...tags],
    href: `/tools/${slug}`,
    accent,
    icon: "pdf",
  });
  return [
    mk("pdf-to-text", "PDF to Text", "Extract text from any PDF — search, copy, or download as .txt.", ["text", "extract"]),
    mk("pdf-splitter", "PDF Splitter", "Split PDFs by page range or extract specific pages.", ["split", "pages"]),
    mk("pdf-merger", "PDF Merger", "Merge multiple PDFs into a single document, in any order.", ["merge", "combine"]),
    mk("pdf-to-markdown", "PDF to Markdown", "Convert PDFs to Markdown with heading detection.", ["markdown", "convert"]),
    mk("pdf-to-json", "PDF to JSON", "Extract structured JSON from PDFs — pages, lines, or words.", ["json", "data"]),
    mk("pdf-to-html", "PDF to HTML", "Convert PDF to HTML — extract text content with basic formatting.", ["html", "convert"]),
    mk("pdf-to-images", "PDF to Images", "Convert PDF pages to PNG images — high resolution.", ["png", "images"]),
    mk("pdf-rotator", "PDF Rotator", "Rotate PDF pages — 90°, 180°, 270° clockwise.", ["rotate"]),
    mk("pdf-page-remover", "PDF Page Remover", "Remove pages from PDF — select and delete.", ["pages", "delete"]),
    mk("pdf-page-counter", "PDF Page Counter", "Count PDF pages — view file size, version, and metadata.", ["pages", "count"]),
    mk("pdf-watermark", "PDF Watermark Adder", "Add text watermarks to PDF — customizable style and position.", ["watermark"]),
    mk("pdf-password-remover", "PDF Password Remover", "Remove PDF password — enter the password to unlock and save.", ["password", "unlock"]),
    mk("pdf-metadata-viewer", "PDF Metadata Viewer", "View PDF metadata — title, author, dates, and more.", ["metadata", "info"]),
    mk("pdf-metadata-editor", "PDF Metadata Editor", "Edit PDF metadata — title, author, subject, keywords.", ["metadata", "edit"]),
    mk("pdf-form-filler", "PDF Form Filler", "Fill PDF forms — text, checkbox, and dropdown fields.", ["forms", "fill"]),
    mk("pdf-annotator", "PDF Annotator", "Add text annotations to PDF — click to place.", ["annotate"]),
    mk("pdf-to-word", "PDF to Word", "Convert PDF to Word — extract text to RTF format.", ["word", "rtf"]),
    mk("pdf-images-to-pdf", "Images to PDF", "Combine JPG/PNG images into a single PDF.", ["images", "jpg", "png"]),
  ];
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    name: "Health",
    slug: "health",
    tagline: "Measure, track, and understand your body.",
    description:
      "Private health utilities that run entirely in your browser — no accounts, no tracking, no data leaves your device.",
    whenToUse: [
      "Estimating body composition with BMI and healthy weight ranges",
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
  {
    name: "PDF",
    slug: "pdf",
    tagline: "Convert, merge, split, and edit PDFs — all in-browser.",
    description:
      "A suite of fast, private PDF utilities powered by pdf-lib and pdfjs-dist. Files never leave your device.",
    whenToUse: [
      "Converting PDFs to text, Markdown, JSON, or images",
      "Merging multiple PDFs or splitting large PDFs into individual pages",
      "Editing metadata, rotating pages, or adding watermarks",
    ],
    accent: "from-red-500/20 to-red-500/0 text-red-400",
    icon: "pdf",
  },
];

export const CATEGORIES = CATEGORY_META.map((c) => c.name);

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORY_META.find((c) => c.slug === slug);
}

export function getToolsByCategory(name: CategoryName): Tool[] {
  return TOOLS.filter((t) => t.category === name);
}

/** One accent colour per category, used for icon glyphs only (tiles stay flat). */
export const CATEGORY_COLOR: Record<CategoryName, string> = {
  Health: "#22c55e",
  Finance: "#fbbf24",
  Everyday: "#38bdf8",
  Utilities: "#f472b6",
  PDF: "#fb7185",
};
