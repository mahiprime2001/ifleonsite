import { Link } from "@/lib/router";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-paper-2 pt-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-ink mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-brand-700 hover:text-brand-700">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
};
