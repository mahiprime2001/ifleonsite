import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TechStackPage from "@/views/TechStackPage";

export const metadata: Metadata = pageMetadata("/tech-stack");

export default function Page() {
  return <TechStackPage />;
}
