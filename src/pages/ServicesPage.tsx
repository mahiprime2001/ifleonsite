import { useEffect, useState } from "react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  User,
  Sparkles,
  X,
  CheckCircle2,
  Package,
  Layers,
  Target,
} from "lucide-react";
import { ContactFormDialog } from "../components/ContactFormDialog";
import {
  businessServices,
  individualServices,
  specialtyServices,
  serviceSelectMap,
  buildPrefillMessage,
  type Service,
} from "../data/services";
import { PageHero } from "../components/PageHero";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { MagnetCard } from "../components/animations/MagnetCard";

type CategoryGroup = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Service[];
};

const groups: CategoryGroup[] = [
  {
    key: "business",
    title: "Business Solutions",
    subtitle: "Scale your product, platform, and team.",
    icon: Briefcase,
    items: businessServices,
  },
  {
    key: "individual",
    title: "Individual Solutions",
    subtitle: "Personal tech setup, security, smart home, and career guidance.",
    icon: User,
    items: individualServices,
  },
  {
    key: "specialty",
    title: "Specialty & Add-Ons",
    subtitle: "Targeted offerings we plug into existing teams and products.",
    icon: Sparkles,
    items: specialtyServices,
  },
];

const ServiceCard = ({
  service,
  onOpen,
}: {
  service: Service;
  onOpen: (s: Service) => void;
}) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <MagnetCard
        intensity={6}
        className="surface-card h-full rounded-2xl transition-all"
      >
        <button
          type="button"
          onClick={() => onOpen(service)}
          className="text-left w-full h-full p-6 flex flex-col group focus:outline-none rounded-2xl"
        >
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              whileHover={{ rotate: 6, scale: 1.06 }}
              className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-card"
            >
              <Icon className="h-5 w-5 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-display font-bold text-foreground leading-tight">
                {service.title}
              </h3>
              <p className="text-sm text-brand mt-1">{service.tagline}</p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
            {service.description}
          </p>

          <span className="inline-flex items-center text-brand font-medium text-sm group-hover:translate-x-1 transition-transform">
            View details
            <ArrowRight className="h-4 w-4 ml-2" />
          </span>
        </button>
      </MagnetCard>
    </motion.div>
  );
};

const DetailsDialog = ({
  service,
  onClose,
  onDiscuss,
}: {
  service: Service | null;
  onClose: () => void;
  onDiscuss: (s: Service) => void;
}) => {
  useEffect(() => {
    if (!service) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-dialog-title"
            className="relative surface-card rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none rounded-3xl" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-foreground z-10 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6 pr-10">
                <motion.div
                  whileHover={{ rotate: 6, scale: 1.06 }}
                  className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-card"
                >
                  <service.icon className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <h3
                    id="details-dialog-title"
                    className="text-2xl md:text-3xl font-display font-semibold text-foreground"
                  >
                    {service.title}
                  </h3>
                  <p className="text-brand font-medium mt-1">
                    {service.tagline}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="mb-6 p-5 rounded-2xl bg-primary/10 border border-border">
                <div className="flex items-center gap-2 text-brand font-bold mb-2">
                  <Sparkles className="h-5 w-5" />
                  Real-World Impact
                </div>
                <p className="text-foreground leading-relaxed">
                  {service.realWorld}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-foreground font-bold mb-3">
                    <Target className="h-5 w-5 text-brand" />
                    Key Features
                  </div>
                  <ul className="space-y-2">
                    {service.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-muted-foreground text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-foreground font-bold mb-3">
                    <Package className="h-5 w-5 text-brand" />
                    What We Deliver
                  </div>
                  <ul className="space-y-2">
                    {service.deliverables.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-muted-foreground text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-foreground font-bold mb-3">
                  <Layers className="h-5 w-5 text-brand" />
                  Technologies
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary/10 text-foreground rounded-full text-xs font-medium border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="text-foreground font-bold mb-3">Common Use Cases</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {service.useCases.map((u, i) => (
                    <div
                      key={i}
                      className="text-sm text-foreground bg-primary/5 border border-border rounded-lg px-3 py-2"
                    >
                      {u}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onDiscuss(service)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 font-semibold py-3 px-6 rounded-xl transition-all"
                >
                  Discuss This Service
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:w-auto px-6 py-3 rounded-xl border border-border text-foreground hover:bg-primary/10 font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ServicesPage() {
  useDocumentMeta({
    title: "AI, DevOps & Cloud Services | IFLEON",
    description: "Explore IFLEON's full range of services: AI/ML solutions, DevOps automation, cloud migration, cybersecurity, and IT consulting for businesses and individuals across India.",
    canonical: "https://ifleon.com/services",
  });
  const [active, setActive] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPrefill, setDialogPrefill] = useState<{
    service?: string;
    message?: string;
  }>({});

  const openDiscuss = (s: Service) => {
    setDialogPrefill({
      service: serviceSelectMap[s.title] ?? "Other",
      message: buildPrefillMessage(s.title, s.features),
    });
    setActive(null);
    setDialogOpen(true);
  };

  return (
    <div className="bg-transparent min-h-screen">
      <PageHero
        eyebrow="Services"
        title="What we build,"
        highlight="deploy & maintain"
        description="End-to-end AI, DevOps, cloud, and cybersecurity work for businesses and individuals — click any card for the full breakdown."
      >
        <div className="flex flex-wrap gap-2 justify-center">
          {groups.map((g) => (
            <a
              key={g.key}
              href={`#${g.key}`}
              className="px-4 py-2 surface-card hover:border-brand-soft text-muted-foreground hover:text-foreground rounded-full text-sm font-medium transition-all"
            >
              {g.title}
            </a>
          ))}
        </div>
      </PageHero>

      {groups.map((group) => {
        const GroupIcon = group.icon;
        return (
          <section
            key={group.key}
            id={group.key}
            className="relative py-16 md:py-20 scroll-mt-24 bg-transparent overflow-hidden border-b border-border"
          >
            <div className="absolute inset-0 mesh-bg opacity-25 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal direction="up">
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    whileHover={{ rotate: 6, scale: 1.06 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-gradient shadow-card"
                  >
                    <GroupIcon className="h-5 w-5 text-white" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                    {group.title}
                  </h2>
                </div>
                <p className="text-muted-foreground mb-10 ml-13">{group.subtitle}</p>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 perspective-1000">
                {group.items.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onOpen={setActive}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="relative py-20 bg-transparent overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full glow-brand blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full glow-brand blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4">
              Not sure which service{" "}
              <span className="text-gradient-iflo">
                fits?
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              Tell us what you're working on. We'll suggest the right approach.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  setDialogPrefill({});
                  setDialogOpen(true);
                }}
                className="shine-on-hover inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 px-7 py-3.5 rounded-xl font-semibold transition-all"
              >
                Schedule Free Consultation
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                to="/case-studies"
                className="inline-flex items-center justify-center gap-2 border-2 border-border text-foreground hover:border-brand-soft hover:text-brand hover:-translate-y-0.5 px-7 py-3.5 rounded-xl font-semibold transition-all"
              >
                View Case Studies
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <DetailsDialog
        service={active}
        onClose={() => setActive(null)}
        onDiscuss={openDiscuss}
      />

      <ContactFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        prefill={dialogPrefill}
        title={
          dialogPrefill.service
            ? `Discuss: ${dialogPrefill.service}`
            : "Let's Talk"
        }
        subtitle="Share a few details and we'll get back within 24 hours."
      />
    </div>
  );
}
