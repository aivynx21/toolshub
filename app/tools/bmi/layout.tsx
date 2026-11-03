import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator",
  description:
    "Estimate your Body Mass Index in metric or imperial units, with a healthy-weight range and WHO categories.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
