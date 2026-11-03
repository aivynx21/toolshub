import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator",
  description:
    "A fast, keyboard-friendly calculator for everyday arithmetic.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
