import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createPost } from "../actions";
import { PostForm } from "../PostForm";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/posts" className="text-sm text-muted hover:underline">
          ← Posts
        </Link>
        <h1 className="page-title mt-1">New post</h1>
      </div>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <NewPostForm />
      </Suspense>
    </div>
  );
}

async function NewPostForm() {
  await requireAdmin();
  return <PostForm action={createPost} submitLabel="Create post" />;
}
