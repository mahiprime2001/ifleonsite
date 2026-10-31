import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TeamPage from "@/views/TeamPage";

export const metadata: Metadata = pageMetadata("/team");

export default function Page() {
  return <TeamPage />;
}
