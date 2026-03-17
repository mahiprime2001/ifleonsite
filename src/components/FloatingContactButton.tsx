import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail, Phone, Calendar } from "lucide-react";

export const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: Mail,
      label: "Email Us",
      href: "mailto:info@ifleon.com",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Phone,
      label: "Call Us",
      href: "tel:+911234567890",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Calendar,
      label: "Schedule Call",
      href: "/#contact",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.a
                  key={index}
                  href={option.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 bg-gradient-to-r ${option.color} text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group whitespace-nowrap`}
                >
                  <Icon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span className="font-medium">{option.label}</span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-2xl flex items-center justify-center hover:shadow-3xl transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {!isOpen && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
        />
      )}
    </div>
  );
};
