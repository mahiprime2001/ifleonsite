import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Logo } from "../components/Logo";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const ForgotPassword = () => {
  useDocumentMeta({ title: "Reset Password | IFLEON", noindex: true });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <motion.div
      className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background glow orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-2/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          className="surface-card rounded-2xl p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Logo size={36} />
            <div>
              <span className="block font-bold text-lg text-foreground leading-none">
                IFLEON
              </span>
              <span className="eyebrow block text-[10px]">
                Consulting
              </span>
            </div>
          </div>

          {!submitted ? (
            <>
              <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
                Forgot your password?
              </h1>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-4"
            >
              <CheckCircle className="w-12 h-12 text-brand mx-auto mb-4" />
              <h2 className="text-xl font-display font-semibold text-foreground mb-2">
                Check your inbox
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If an account exists for{" "}
                <span className="text-foreground font-medium">{email}</span>, you'll
                receive a reset link shortly.
              </p>
            </motion.div>
          )}

          <div className="mt-6 pt-5 border-t border-border text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
