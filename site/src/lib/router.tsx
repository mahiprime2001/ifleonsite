"use client";

/*
 * The handful of react-router-dom APIs the site's components use, on top of Next.js navigation,
 * so components moved over from the Vite app keep working unchanged.
 */
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & { to: string };

export function Link({ to, ...rest }: LinkProps) {
  return <NextLink href={to} {...rest} />;
}

export function useLocation() {
  return { pathname: usePathname() ?? "/" };
}

export function useNavigate() {
  const router = useRouter();
  return (to: string) => router.push(to);
}
