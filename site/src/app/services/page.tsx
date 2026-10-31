import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ServicesPage from "@/views/ServicesPage";

export const metadata: Metadata = pageMetadata("/services");

export default function Page() {
  return <ServicesPage />;
}
