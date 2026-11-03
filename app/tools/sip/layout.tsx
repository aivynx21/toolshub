import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator",
  description:
    "Project SIP, lumpsum, and step-up investment returns with year-by-year growth.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
