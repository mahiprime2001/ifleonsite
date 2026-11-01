import { Suspense } from "react";
import { PortfolioTabs } from "./PortfolioTabs";

const SITE_URL = process.env.PORTFOLIO_SITE_URL || "https://mahendra.ifleon.com";

export default function PortfolioLayout({ children }: LayoutProps<"/admin/portfolio">) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Portfolio</h1>
          <p className="mt-1 text-sm text-muted">Everything shown on your personal site.</p>
        </div>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
          View site ↗
        </a>
      </div>
      <Suspense fallback={<div className="h-10 border-b border-line" />}>
        <PortfolioTabs />
      </Suspense>
      {children}
    </div>
  );
}
