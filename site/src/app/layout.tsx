import type { Metadata, Viewport } from "next";
import { Figtree, JetBrains_Mono, Newsreader } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DEFAULT_IMAGE, PAGES, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: PAGES["/"].title, template: "%s" },
  description: PAGES["/"].description,
  keywords: [
    "AI consulting Nellore",
    "DevOps services India",
    "cloud services",
    "cybersecurity",
    "digital transformation",
    "AWS",
    "Azure",
    "machine learning",
  ],
  openGraph: { siteName: "IFLEON", type: "website", locale: "en_IN", images: [DEFAULT_IMAGE] },
  twitter: { card: "summary", images: [DEFAULT_IMAGE] },
  robots: { index: true, follow: true },
  referrer: "strict-origin-when-cross-origin",
};

export const viewport: Viewport = { themeColor: "#FAF8F4" };

const GTM_ID = "GTM-MM5GJ8VG";

/* Headlines: Newsreader (editorial serif). Body: Figtree. Labels and code: JetBrains Mono. */
const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Figtree({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        {/* Paper grain over everything; never intercepts clicks. */}
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[60]" />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Toaster position="top-center" richColors />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Script src="https://plausible.io/js/script.js" data-domain="ifleon.com" strategy="afterInteractive" />
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </body>
    </html>
  );
}
