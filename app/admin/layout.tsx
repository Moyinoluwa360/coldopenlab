import type { Metadata } from "next";

// The admin area must never be indexed.
export const metadata: Metadata = {
  title: "Admin | Cold Open Lab",
  robots: { index: false, follow: false },
};

export default function AdminBaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
