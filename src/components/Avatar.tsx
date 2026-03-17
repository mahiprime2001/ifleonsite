import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  email?: string;
  name?: string;
};

const Avatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Safe localStorage parsing
  let user: User = {};
  try {
    user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  } catch {
    user = {};
  }

  const avatarSeed = user.email || user.name || "user";

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsOpen(false);
    navigate("/login");
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      >
        <img
          className="h-10 w-10 rounded-full border border-gray-300 hover:ring-2 hover:ring-blue-400 transition"
          src={`https://i.pravatar.cc/150?u=${avatarSeed}`}
          alt="User avatar"
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50"
            role="menu"
          >
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              role="menuitem"
            >
              Profile
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              role="menuitem"
            >
              Settings
            </Link>

            <div className="my-1 h-px bg-gray-200" />

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              role="menuitem"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Avatar;
