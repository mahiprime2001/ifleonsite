"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ENTRY_KINDS } from "@/lib/portfolio";

const TABS = [
  { href: "/admin/portfolio", label: "Profile" },
  ...Object.values(ENTRY_KINDS).map((k) => ({ href: `/admin/portfolio/${k.segment}`, label: k.plural })),
];

export function PortfolioTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Portfolio sections" className="-mx-1 flex gap-1 overflow-x-auto border-b border-line pb-px text-sm">
      {TABS.map(({ href, label }) => {
        const active = href === "/admin/portfolio" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2 ${
              active ? "border-accent font-medium text-foreground" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
