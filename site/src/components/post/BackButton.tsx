import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/router";

export const BackButton = () => (
  <Link
    to="/blog"
    className="inline-flex items-center space-x-2 text-brand-700 hover:text-brand-700 mb-8"
  >
    <ArrowLeft className="h-4 w-4" />
    <span>Back to Blog</span>
  </Link>
);
