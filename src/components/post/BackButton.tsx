import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const BackButton = () => (
  <Link
    to="/blog"
    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
  >
    <ArrowLeft className="h-4 w-4" />
    <span>Back to Blog</span>
  </Link>
);
