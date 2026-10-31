import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import FAQPage from "@/views/FAQPage";

export const metadata: Metadata = pageMetadata("/faq");

export default function Page() {
  return <FAQPage />;
}
