import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = { themeColor: "#0b1220" };

const GTM_ID = "GTM-MM5GJ8VG";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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
        {children}
        <Footer />
        <Script src="https://plausible.io/js/script.js" data-domain="ifleon.com" strategy="afterInteractive" />
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </body>
    </html>
  );
}
