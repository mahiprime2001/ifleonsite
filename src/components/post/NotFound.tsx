import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="min-h-screen bg-transparent pt-20 flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-display text-2xl font-semibold text-foreground mb-4">
        Post Not Found
      </h1>
      <Link to="/blog" className="text-brand hover:text-brand/80">
        ← Back to Blog
      </Link>
    </div>
  </div>
);
