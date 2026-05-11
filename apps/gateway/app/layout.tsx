import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "USFinanceTools — Free Online Tools",
  description: "Free online tools for finance, productivity, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
