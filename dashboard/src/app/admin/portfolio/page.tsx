import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/db";
import { portfolioProfile } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { saveProfile } from "./actions";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioProfilePage() {
  return (
    <Suspense fallback={<div className="card h-96 animate-pulse" />}>
      <Profile />
    </Suspense>
  );
}

async function Profile() {
  await requireAdmin();
  const [p] = await db.select().from(portfolioProfile).where(eq(portfolioProfile.id, 1)).limit(1);

  return (
    <ProfileForm
      action={saveProfile}
      initial={{
        name: p?.name ?? "",
        headline: p?.headline ?? "",
        intro: p?.intro ?? "",
        bio: p?.bio ?? "",
        location: p?.location ?? "",
        email: p?.email ?? "",
        phone: p?.phone ?? "",
        availability: p?.availability ?? "",
        photoUrl: p?.photoUrl ?? "",
        resumeUrl: p?.resumeUrl ?? "",
        links: p?.links ?? [],
        seoTitle: p?.seoTitle ?? "",
        seoDescription: p?.seoDescription ?? "",
      }}
    />
  );
}
