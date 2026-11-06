import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Toolhub: free online tools that open instantly",
    template: "%s · Toolhub",
  },
  description:
    "Calculators, PDF tools, generators and converters in one place. Free, no signup, and most files never leave your device.",
  keywords: ["online tools", "pdf tools", "bmi calculator", "currency converter", "sip calculator", "qr code generator"],
  authors: [{ name: "Toolhub" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Toolhub" },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Toolhub: free online tools that open instantly",
    description: "Calculators, PDF tools, generators and converters. No signup, no clutter.",
    type: "website",
    images: ["/icon-512.png"],
  },
  twitter: { card: "summary", title: "Toolhub", description: "Free online tools that open instantly." },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <a
          href="#main"
          className="btn btn-primary button-sm fixed left-4 top-4 z-[60] -translate-y-20 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <div id="main">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
