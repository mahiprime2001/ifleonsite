import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CaseStudiesPage from "@/views/CaseStudiesPage";

export const metadata: Metadata = pageMetadata("/case-studies");

export default function Page() {
  return <CaseStudiesPage />;
}
