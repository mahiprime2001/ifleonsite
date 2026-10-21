"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/ai-writer", label: "AI writer" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/api-keys", label: "API keys" },
  { href: "/admin/trash", label: "Trash" },
  { href: "/admin/settings", label: "Settings" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 text-sm md:flex-col">
      {NAV.map(({ href, label }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 ${
              active
                ? "bg-sidebar-active font-medium text-sidebar-foreground"
                : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
