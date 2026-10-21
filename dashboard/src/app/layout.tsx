import type { Metadata } from "next";
import { Figtree, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

/* Same type pairing as the public site: Newsreader for headings, Figtree for UI text. */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "IFLEON Dashboard", template: "%s · IFLEON Dashboard" },
  description: "Admin dashboard for ifleon.com",
  // Private admin tool: keep every page out of search engines.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${newsreader.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
