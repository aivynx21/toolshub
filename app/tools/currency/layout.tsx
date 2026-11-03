import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currency Converter",
  description:
    "Convert between 150+ currencies with live exchange rates.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
