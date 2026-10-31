import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PricingPage from "@/views/PricingPage";

export const metadata: Metadata = pageMetadata("/pricing");

export default function Page() {
  return <PricingPage />;
}
