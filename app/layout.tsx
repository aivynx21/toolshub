import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Toolhub — A directory of fast, focused tools",
    template: "%s · Toolhub",
  },
  description:
    "A curated directory of fast, focused web tools: calculators, converters, financial planners, and more. Free, minimal, and distraction-free.",
  keywords: [
    "tools",
    "calculator",
    "bmi",
    "currency converter",
    "sip calculator",
    "online utilities",
  ],
  authors: [{ name: "Toolhub" }],
  openGraph: {
    title: "Toolhub — A directory of fast, focused tools",
    description: "Free, minimal, and distraction-free web tools in one place.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
