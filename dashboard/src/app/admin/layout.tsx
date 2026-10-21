import Link from "next/link";
import { Suspense } from "react";
import { getAdmin } from "@/lib/auth";
import { logout } from "../login/actions";
import { NavLinks } from "./NavLinks";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex flex-wrap items-center gap-4 border-b border-line bg-sidebar p-4 text-sidebar-foreground md:sticky md:border-r md:border-b-0 md:top-0 md:h-screen md:w-56 md:flex-col md:flex-nowrap md:items-stretch">
        <Link href="/admin" className="flex items-center gap-2.5 px-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG, no optimization needed */}
          <img src="/logo.svg" alt="" width={32} height={32} />
          <span className="font-serif text-xl font-medium">IFLEON</span>
        </Link>
        <Suspense fallback={<div className="h-20" />}>
          <NavLinks />
        </Suspense>
        <div className="ml-auto space-y-1 px-3 md:mt-auto md:ml-0">
          <Suspense fallback={null}>
            <AdminEmail />
          </Suspense>
          <form action={logout}>
            <button type="submit" className="text-sm text-sidebar-muted hover:text-sidebar-foreground hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

async function AdminEmail() {
  const email = await getAdmin();
  return <p className="max-w-48 truncate text-xs text-sidebar-muted">{email}</p>;
}
