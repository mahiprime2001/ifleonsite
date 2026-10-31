import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PortfolioPage from "@/views/PortfolioPage";

export const metadata: Metadata = pageMetadata("/portfolio");

export default function Page() {
  return <PortfolioPage />;
}
