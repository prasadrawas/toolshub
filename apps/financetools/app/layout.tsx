import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "USFinanceTools — Free Financial Calculators",
    template: "%s | USFinanceTools — Free Financial Calculators",
  },
  description:
    "112 free financial calculators for mortgages, retirement, taxes, debt, and investing. Accurate, updated for 2026. No sign-up required.",
  metadataBase: new URL("https://usfinancetools.com"),
  openGraph: {
    siteName: "USFinanceTools",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense - uncomment when account is approved */}
        {/* <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        /> */}
      </head>
      <body className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}>
        <TooltipProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
