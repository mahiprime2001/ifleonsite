import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Post Not Found
      </h1>
      <Link to="/blog" className="text-blue-600 hover:text-blue-700">
        ← Back to Blog
      </Link>
    </div>
  </div>
);
