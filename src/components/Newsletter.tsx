import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";
import { SplitReveal } from "./motion/SplitReveal";
import { NewsletterScene } from "./animations/NewsletterScene";

export const Newsletter = () => {
  return (
    <section className="relative py-16 md:py-20 bg-transparent overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-50" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-soft blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-soft blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Animated illustration */}
          <ScrollReveal direction="left" className="order-2 lg:order-1">
            <div className="relative max-w-md mx-auto">
              <NewsletterScene className="w-full h-auto" />
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal direction="right" className="order-1 lg:order-2">
            <div>
              <p className="eyebrow mb-3">
                Stay in the loop
              </p>
              <SplitReveal as="h2" className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 leading-tight">
                Get insights{" "}
                <span className="font-display text-brand-gradient">
                  delivered.
                </span>
              </SplitReveal>
              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg">
                Subscribe for periodic updates on AI, DevOps, cloud engineering,
                and security — straight to your inbox.
              </p>

              <motion.form
                className="flex flex-col sm:flex-row gap-3 max-w-md"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="shine-on-hover bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-3 rounded-xl shadow-card transition-all flex items-center justify-center gap-2"
                >
                  Subscribe <Send className="h-4 w-4" />
                </motion.button>
              </motion.form>
              <p className="text-xs text-muted-foreground mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
