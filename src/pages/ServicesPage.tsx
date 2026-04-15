import { useEffect, useState } from "react";
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
    <motion.button
      type="button"
      onClick={() => onOpen(service)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
      className="text-left bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all p-6 flex flex-col group focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
          <Icon className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {service.title}
          </h3>
          <p className="text-sm text-blue-600 mt-1">{service.tagline}</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">
        {service.description}
      </p>

      <span className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
        View details
        <ArrowRight className="h-4 w-4 ml-2" />
      </span>
    </motion.button>
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
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-dialog-title"
            className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6 pr-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                  <service.icon className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h3
                    id="details-dialog-title"
                    className="text-2xl md:text-3xl font-bold text-gray-900"
                  >
                    {service.title}
                  </h3>
                  <p className="text-blue-600 font-medium mt-1">
                    {service.tagline}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100">
                <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                  <Sparkles className="h-5 w-5" />
                  Real-World Impact
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {service.realWorld}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-900 font-semibold mb-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    Key Features
                  </div>
                  <ul className="space-y-2">
                    {service.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-700 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-900 font-semibold mb-3">
                    <Package className="h-5 w-5 text-teal-600" />
                    What We Deliver
                  </div>
                  <ul className="space-y-2">
                    {service.deliverables.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-700 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-900 font-semibold mb-3">
                  <Layers className="h-5 w-5 text-purple-600" />
                  Technologies
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="text-gray-900 font-semibold mb-3">
                  Common Use Cases
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {service.useCases.map((u, i) => (
                    <div
                      key={i}
                      className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
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
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
                >
                  Discuss This Service
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
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
    <div className="min-h-screen bg-white pt-20">
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
              Services
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What we build, deploy, and maintain
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              End-to-end AI, DevOps, cloud, and cybersecurity work for businesses
              and individuals. Click any service to see the full breakdown.
            </p>

            <div className="flex flex-wrap gap-2">
              {groups.map((g) => (
                <a
                  key={g.key}
                  href={`#${g.key}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition"
                >
                  {g.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {groups.map((group) => {
        const GroupIcon = group.icon;
        return (
          <section
            key={group.key}
            id={group.key}
            className="py-16 md:py-20 scroll-mt-24 border-b border-gray-100"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <GroupIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {group.title}
                </h2>
              </div>
              <p className="text-gray-600 mb-10 ml-12">{group.subtitle}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Not sure which service fits?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Tell us what you're working on. We'll suggest the right approach.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                setDialogPrefill({});
                setDialogOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Schedule Free Consultation
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              to="/case-studies"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-white transition"
            >
              View Case Studies
            </Link>
          </div>
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
