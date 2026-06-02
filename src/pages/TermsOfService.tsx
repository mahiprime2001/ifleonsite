import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { PageHero } from "../components/PageHero";

const sections = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using the IFLEON website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site or engage our services.",
  },
  {
    title: "Services",
    body: "IFLEON provides IT consulting services including AI/ML development, DevOps automation, cloud infrastructure, and cybersecurity. The specific scope, deliverables, timeline, and pricing for each engagement are agreed upon in writing before work begins.",
  },
  {
    title: "Client Responsibilities",
    body: "You agree to provide accurate information, timely feedback, and necessary access to systems required for the engagement. Delays caused by failure to provide these may extend project timelines at no additional cost to IFLEON.",
  },
  {
    title: "Intellectual Property",
    body: "Upon full payment, clients receive ownership of custom deliverables created specifically for their project. IFLEON retains ownership of pre-existing tools, frameworks, and methodologies used during the engagement. We reserve the right to list the project as a case study unless confidentiality is explicitly agreed upon in writing.",
  },
  {
    title: "Confidentiality",
    body: "We treat all client information as confidential. We will not disclose proprietary business information to third parties without your consent. Clients are likewise expected to keep IFLEON's internal processes and methodologies confidential.",
  },
  {
    title: "Payment Terms",
    body: "Payment terms are specified in individual engagement agreements. Typically, a deposit is required before work begins. IFLEON reserves the right to pause or stop work on accounts with outstanding invoices beyond the agreed payment window.",
  },
  {
    title: "Limitation of Liability",
    body: "IFLEON's liability for any claim arising from services provided is limited to the total fees paid for the specific engagement in question. We are not liable for indirect, incidental, or consequential damages including but not limited to lost profits or data loss.",
  },
  {
    title: "Governing Law",
    body: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Nellore, Andhra Pradesh, India.",
  },
  {
    title: "Changes to Terms",
    body: "We may update these Terms from time to time. Continued use of the website or services after changes constitutes acceptance. For active engagements, changes to terms require written agreement from both parties.",
  },
  {
    title: "Contact",
    body: "For questions about these Terms, contact: S. Mahendra Reddy, IFLEON, Nellore, Andhra Pradesh, India. Email: mahendra@ifleon.com",
  },
];

export default function TermsOfService() {
  useDocumentMeta({
    title: "Terms of Service | IFLEON",
    description: "IFLEON's Terms of Service — the rules and conditions governing use of our website and consulting services.",
    canonical: "https://ifleon.com/terms",
  });

  return (
    <div className="bg-transparent min-h-screen">
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description={`Effective date: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`}
        size="sm"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-foreground mb-3">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
