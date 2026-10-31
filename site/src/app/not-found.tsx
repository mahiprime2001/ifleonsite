import type { Metadata } from "next";
import { NotFoundPage } from "@/components/Pagenotfound";

export const metadata: Metadata = {
  title: { absolute: "Page not found | IFLEON" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage />;
}
