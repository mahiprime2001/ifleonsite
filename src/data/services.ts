import type { ComponentType } from "react";
import {
  Brain,
  GitBranch,
  Cloud,
  Shield,
  Cog,
  Database,
  Smartphone,
  Palette,
  BarChart3,
  Globe,
  Workflow,
  Bot,
  Monitor,
  Home,
  GraduationCap,
} from "lucide-react";

export type ServiceCategory = "business" | "individual" | "specialty";

export type Service = {
  id: string;
  category: ServiceCategory;
  icon: ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  technologies: string[];
  useCases: string[];
  realWorld: string;
  deliverables: string[];
  color: string;
};

export const services: Service[] = [
  // ===== Business Solutions =====
  {
    id: "ai-solutions",
    category: "business",
    icon: Brain,
    title: "AI & Machine Learning Solutions",
    tagline: "Transform Data into Intelligence",
    description:
      "Design and deploy intelligent AI systems that automate workflows, extract insights, and drive smarter business decisions.",
    features: [
      "Custom ML Model Development",
      "Natural Language Processing",
      "Computer Vision Solutions",
      "Predictive Analytics",
      "AI Strategy Consulting",
      "Model Training & Optimization",
    ],
    technologies: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Hugging Face"],
    useCases: [
      "Fraud Detection Systems",
      "Customer Behavior Analysis",
      "Automated Document Processing",
      "Intelligent Chatbots",
    ],
    realWorld:
      "Retailers use our forecasting models to cut stockouts by up to 35%. Support teams deflect 40%+ of tickets with AI assistants. Finance teams catch fraud patterns in seconds instead of weeks.",
    deliverables: [
      "Discovery workshop to scope high-value use cases",
      "Data pipeline & feature engineering",
      "Trained, validated, and benchmarked ML models",
      "API or dashboard integration into your stack",
      "Monitoring, drift detection, and retraining playbook",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "devops",
    category: "business",
    icon: GitBranch,
    title: "DevOps & CI/CD Automation",
    tagline: "Accelerate Development, Ensure Quality",
    description:
      "Streamline your software delivery pipeline with modern DevOps practices, continuous integration, and automated deployment strategies.",
    features: [
      "CI/CD Pipeline Design",
      "Infrastructure as Code",
      "Container Orchestration",
      "Automated Testing",
      "Release Management",
      "DevOps Culture Training",
    ],
    technologies: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform"],
    useCases: [
      "Zero-Downtime Deployments",
      "Multi-Environment Setup",
      "Automated Quality Gates",
      "Infrastructure Scaling",
    ],
    realWorld:
      "Teams that used to ship once a quarter move to daily releases. Build times drop from 40 minutes to under 5. One-click rollbacks replace panic-driven hotfixes at 2 AM.",
    deliverables: [
      "CI pipelines on GitHub Actions, GitLab, or Jenkins",
      "Containerized builds with Docker & Kubernetes",
      "Blue-green and canary deployment strategy",
      "Secret management, RBAC, and audit trails",
      "Runbooks + team onboarding so it stays maintainable",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "cloud-migration",
    category: "business",
    icon: Cloud,
    title: "Cloud Infrastructure & Migration",
    tagline: "Scale with Confidence",
    description:
      "Migrate, optimize, and scale your infrastructure on secure and cost-efficient cloud platforms.",
    features: [
      "Cloud Strategy & Planning",
      "AWS & Azure Migration",
      "Cloud Architecture Design",
      "Cost Optimization",
      "Performance Tuning",
      "Disaster Recovery",
    ],
    technologies: ["AWS", "Azure", "CloudFormation", "Lambda", "S3"],
    useCases: [
      "Legacy System Migration",
      "Multi-Cloud Architecture",
      "Serverless Applications",
      "Cloud-Native Development",
    ],
    realWorld:
      "Mid-sized firms cut infra costs 30–50% by right-sizing on AWS/Azure. Startups skip capex entirely. Peak-season traffic auto-scales instead of crashing servers.",
    deliverables: [
      "Cloud readiness assessment & TCO forecast",
      "Migration blueprint — lift-and-shift or re-architect",
      "Infrastructure-as-code (Terraform / CloudFormation)",
      "Phased migration with zero-downtime cutover",
      "Post-migration cost & performance optimization",
    ],
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "cybersecurity",
    category: "business",
    icon: Shield,
    title: "Cybersecurity & Compliance",
    tagline: "Protect What Matters Most",
    description:
      "Safeguard your digital assets with comprehensive security solutions, compliance frameworks, and proactive threat management.",
    features: [
      "Security Audits & Assessments",
      "Compliance Implementation",
      "Threat Detection & Response",
      "Penetration Testing",
      "Security Training",
      "DPDP Act Compliance",
    ],
    technologies: ["ISO 27001", "DPDP", "SIEM Tools", "Linux Hardening"],
    useCases: [
      "Enterprise Security Framework",
      "Compliance Readiness",
      "Incident Response Planning",
      "Security Monitoring",
    ],
    realWorld:
      "SaaS companies close enterprise deals faster with ISO 27001. Indian fintechs meet DPDP/RBI requirements without penalties. SOC teams catch breaches in minutes instead of months.",
    deliverables: [
      "Gap analysis against ISO 27001 / DPDP / SOC 2",
      "Policies, controls, and process implementation",
      "Penetration testing and remediation support",
      "SIEM / EDR setup, alert tuning, and IR runbooks",
      "Audit-ready documentation and evidence packs",
    ],
    color: "from-red-500 to-orange-500",
  },
  {
    id: "custom-development",
    category: "business",
    icon: Cog,
    title: "Custom Software Development",
    tagline: "Built for Your Business",
    description:
      "Develop tailored software solutions that perfectly align with your unique business processes and growth objectives.",
    features: [
      "Web Application Development",
      "Mobile App Development",
      "ERP & CRM Solutions",
      "API Development & Integration",
      "Legacy System Modernization",
      "Maintenance & Support",
    ],
    technologies: ["React", "TypeScript", "Node.js", "Python", "Odoo"],
    useCases: [
      "Custom Business Applications",
      "E-Commerce Platforms",
      "Management Systems",
      "Integration Solutions",
    ],
    realWorld:
      "Manufacturers replace paper workflows with Odoo ERP and reclaim weeks every quarter. SaaS products ship to production in under 12 weeks. One codebase serves both iOS and Android.",
    deliverables: [
      "Product discovery, UX flows, and wireframes",
      "Modular architecture and clean API design",
      "Web, mobile, or ERP build-out with test coverage",
      "QA, load testing, and CI/CD delivery",
      "Ongoing maintenance and feature iteration",
    ],
    color: "from-green-500 to-teal-500",
  },
  {
    id: "digital-transformation",
    category: "business",
    icon: Database,
    title: "Digital Transformation",
    tagline: "Modernize, Automate, Grow",
    description:
      "Transform your business operations with data-driven insights, intelligent automation, and modern technology platforms.",
    features: [
      "Process Automation",
      "Data Analytics & BI",
      "System Integration",
      "Change Management",
      "Technology Roadmapping",
      "Digital Strategy Consulting",
    ],
    technologies: ["Power BI", "Automation Tools", "Integration Platforms"],
    useCases: [
      "Workflow Automation",
      "Data-Driven Decision Making",
      "Legacy System Replacement",
      "Business Process Optimization",
    ],
    realWorld:
      "Traditional retailers unify online and offline data in a single dashboard. HR teams automate onboarding end-to-end. Executives get real-time KPIs instead of monthly PDFs.",
    deliverables: [
      "Technology and process audit",
      "12-month transformation roadmap",
      "Data lake, warehouse, and BI dashboards",
      "Legacy system modernization, incrementally",
      "Change management and team training",
    ],
    color: "from-indigo-500 to-purple-500",
  },

  // ===== Individual Solutions =====
  {
    id: "tech-support",
    category: "individual",
    icon: Monitor,
    title: "Tech Support & Setup",
    tagline: "Productive From Day One",
    description:
      "Reliable device setup, troubleshooting, and performance optimization for everyday technology needs.",
    features: [
      "Device Configuration",
      "Software Installation",
      "System Troubleshooting",
      "Performance Optimization",
      "Data Migration",
      "Remote & On-Site Support",
    ],
    technologies: ["Windows", "macOS", "Linux", "iOS", "Android"],
    useCases: [
      "New Device Onboarding",
      "Family Tech Setup",
      "Remote-Work Workstations",
      "Performance Cleanup",
    ],
    realWorld:
      "Remote professionals get productive on day one. Students avoid weeks of debugging. Families keep devices running smoothly without extra store trips.",
    deliverables: [
      "New device setup (Windows / macOS / Linux)",
      "Software installation and license activation",
      "Driver, OS, and hardware troubleshooting",
      "Performance tuning, cleanup, and backups",
      "Remote or on-site support with clear handover",
    ],
    color: "from-sky-500 to-blue-500",
  },
  {
    id: "personal-security",
    category: "individual",
    icon: Shield,
    title: "Personal Cybersecurity",
    tagline: "Stay Safe Online",
    description:
      "Secure your digital life with strong protection against malware, data loss, and online threats.",
    features: [
      "Antivirus & Firewall Setup",
      "Secure Wi-Fi Configuration",
      "Password Manager + 2FA",
      "Encrypted Backups",
      "Phishing Awareness",
      "Privacy Hardening",
    ],
    technologies: ["1Password", "Bitwarden", "WireGuard VPN", "Veracrypt"],
    useCases: [
      "Family Online Safety",
      "Freelancer Client Data",
      "Crypto Wallet Hardening",
      "Travel Security Setup",
    ],
    realWorld:
      "Users stop phishing scams before they click. Parents protect kids online. Freelancers safeguard client data from day one.",
    deliverables: [
      "Antivirus and firewall configuration",
      "Secure Wi-Fi and VPN setup",
      "Password manager + 2FA rollout",
      "Encrypted backups (local + cloud)",
      "Plain-language cyber awareness coaching",
    ],
    color: "from-rose-500 to-red-500",
  },
  {
    id: "smart-home",
    category: "individual",
    icon: Home,
    title: "Smart Home Integration",
    tagline: "A Home That Runs Itself",
    description:
      "Seamless setup and automation of smart home and IoT devices for comfort and security.",
    features: [
      "IoT Device Setup",
      "Home Automation Routines",
      "Alexa / Google / Siri",
      "Smart Security Cameras",
      "Smart Lighting",
      "Energy Monitoring",
    ],
    technologies: ["Home Assistant", "Matter", "Zigbee", "Z-Wave", "HomeKit"],
    useCases: [
      "Voice-Driven Routines",
      "Security Camera Networks",
      "Energy-Saving Schedules",
      "Whole-Home Audio",
    ],
    realWorld:
      "Morning routines run on voice. Lights, locks, and cameras react automatically. Energy bills drop with smart scheduling.",
    deliverables: [
      "Device selection and compatibility check",
      "Hub and home network configuration",
      "Automation scenes and daily routines",
      "Alexa / Google / Siri integration",
      "Security camera + doorbell setup",
    ],
    color: "from-teal-500 to-emerald-500",
  },
  {
    id: "career-guidance",
    category: "individual",
    icon: GraduationCap,
    title: "IT & AI Career Guidance",
    tagline: "From Curious to Career-Ready",
    description:
      "Personalized guidance for students and professionals entering AI, DevOps, cloud, or cybersecurity.",
    features: [
      "Skill Gap Assessment",
      "Personalized Learning Path",
      "Certification Roadmap",
      "Hands-On Projects",
      "Mock Interviews",
      "Resume & LinkedIn Review",
    ],
    technologies: ["AWS", "Azure", "GCP", "CKA", "Terraform", "Python"],
    useCases: [
      "First Tech Job",
      "Career Switch into DevOps",
      "Adding ML to Your Resume",
      "Cloud Certification Prep",
    ],
    realWorld:
      "Students land their first cloud role within 6 months. Career switchers move from support into DevOps. Working professionals add ML to their resume without quitting their job.",
    deliverables: [
      "Skill gap assessment and goal-setting",
      "Personalized, phase-based learning path",
      "Certification roadmap (AWS / Azure / GCP / CKA)",
      "Hands-on project portfolio you can show off",
      "Mock interviews and resume / LinkedIn review",
    ],
    color: "from-amber-500 to-yellow-500",
  },

  // ===== Specialty & Add-On Services =====
  {
    id: "mobile-apps",
    category: "specialty",
    icon: Smartphone,
    title: "Mobile App Development",
    tagline: "Ship to Both Stores, From One Codebase",
    description:
      "Native and cross-platform mobile apps that feel fast, look great, and reach every user on iOS and Android.",
    features: [
      "React Native & Flutter",
      "Native SwiftUI & Kotlin",
      "Offline-First Architecture",
      "Push Notifications",
      "Deep Linking & Universal Links",
      "App Store Submission",
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    useCases: [
      "Customer-Facing Apps",
      "Field-Service Tools",
      "Internal Productivity Apps",
      "Marketplace & Social Apps",
    ],
    realWorld:
      "Field-service teams replace paper with offline-first tablets. DTC brands launch a store on both stores in under 10 weeks. Internal tools reach every employee on their phone.",
    deliverables: [
      "UX flows and interactive prototype",
      "Shared React Native / Flutter codebase",
      "Store submission (App Store + Play Store)",
      "Crash & analytics instrumentation",
      "Release pipeline with OTA updates",
    ],
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "ui-ux",
    category: "specialty",
    icon: Palette,
    title: "UI / UX Design & Prototyping",
    tagline: "Clickable Prototypes, Not Just Slides",
    description:
      "Design systems, product UX, and high-fidelity prototypes that turn a vague idea into something users love.",
    features: [
      "User Research & Journey Mapping",
      "Figma Design Systems",
      "Interactive Prototypes",
      "Accessibility (WCAG AA)",
      "Developer Handoff & Tokens",
      "Usability Testing",
    ],
    technologies: ["Figma", "Framer", "Protopie", "Tokens Studio"],
    useCases: [
      "Investor-Ready Prototypes",
      "SaaS Product UX",
      "Design System Rollouts",
      "Conversion Optimization",
    ],
    realWorld:
      "Founders walk into investor meetings with a clickable prototype instead of slides. Teams cut UI churn in half with a shared design system. Conversion rates lift after a focused UX audit.",
    deliverables: [
      "UX audit with prioritized fixes",
      "Figma design system and component library",
      "High-fidelity screens for web + mobile",
      "Clickable prototype for stakeholders",
      "Developer handoff with specs & tokens",
    ],
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "data-engineering",
    category: "specialty",
    icon: BarChart3,
    title: "Data Engineering & Analytics",
    tagline: "From Raw Events to Trusted Answers",
    description:
      "ETL pipelines, warehouses, and dashboards that turn scattered data into decisions your team can trust.",
    features: [
      "ETL / ELT Pipelines",
      "dbt Transformations & Tests",
      "Data Warehouse Architecture",
      "BI Dashboards",
      "Data Quality & Alerting",
      "Real-Time Event Streaming",
    ],
    technologies: ["dbt", "Airflow", "BigQuery", "Snowflake", "Metabase"],
    useCases: [
      "Unified KPI Dashboards",
      "Product Usage Analytics",
      "Financial Reporting",
      "Customer Data Platforms",
    ],
    realWorld:
      "Ops teams stop emailing spreadsheets and trust a single dashboard. Product teams ship features based on real usage data. Finance closes the month in days, not weeks.",
    deliverables: [
      "Source inventory and schema design",
      "Automated ingestion pipelines",
      "Modeled, tested dbt transformations",
      "BI dashboards (Metabase / Looker / Power BI)",
      "Data quality alerts and runbook",
    ],
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "seo-performance",
    category: "specialty",
    icon: Globe,
    title: "Technical SEO & Web Performance",
    tagline: "Fast, Crawlable, Discoverable",
    description:
      "Make your site load fast and rank well with measurable lifts in Core Web Vitals and organic traffic.",
    features: [
      "Core Web Vitals Optimization",
      "Structured Data & Schema.org",
      "SSR / ISR Strategies",
      "Lighthouse-Ready Builds",
      "Sitemaps & Crawl Health",
      "International SEO",
    ],
    technologies: ["Next.js", "Lighthouse", "Search Console", "GA4"],
    useCases: [
      "Marketing Site Speed-Up",
      "E-Commerce LCP Reduction",
      "Organic Traffic Growth",
      "Migrations Without SEO Loss",
    ],
    realWorld:
      "Marketing sites hit 90+ Lighthouse scores and start ranking for terms they were invisible on. E-commerce bounce rates drop once LCP is under 2 seconds.",
    deliverables: [
      "Technical SEO audit with priorities",
      "Performance budget and fixes",
      "Schema.org structured data",
      "Server-side rendering where it matters",
      "Before/after Lighthouse + analytics report",
    ],
    color: "from-emerald-500 to-green-500",
  },
  {
    id: "automation",
    category: "specialty",
    icon: Workflow,
    title: "Workflow & Process Automation",
    tagline: "Let the Boring Work Run Itself",
    description:
      "Connect the tools you already pay for so repetitive tasks route, approve, and report themselves.",
    features: [
      "Zapier / n8n / Make",
      "Custom API Integrations",
      "Google Workspace Scripts",
      "Slack & Teams Bots",
      "Approval Workflows",
      "Monitoring & Alerts",
    ],
    technologies: ["n8n", "Zapier", "Make", "Apps Script", "Slack SDK"],
    useCases: [
      "Lead Routing",
      "Invoice Reconciliation",
      "Ticket Triage",
      "Employee Onboarding",
    ],
    realWorld:
      "Sales teams stop copy-pasting leads between tools. Finance reconciles invoices automatically. Support tickets route themselves to the right engineer within seconds.",
    deliverables: [
      "Process discovery workshop",
      "End-to-end automated workflows",
      "Custom integrations where off-the-shelf fails",
      "Monitoring and failure alerts",
      "Documentation your non-technical team can own",
    ],
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "ai-agents",
    category: "specialty",
    icon: Bot,
    title: "AI Agents & Copilots",
    tagline: "LLMs That Actually Do Work",
    description:
      "Agents that plug into your data and tools to handle real tasks — far beyond demo-grade chatbots.",
    features: [
      "Retrieval-Augmented Generation",
      "Tool-Using Agents",
      "Vector DBs & Embeddings",
      "Evaluation Harnesses",
      "Guardrails & PII Filtering",
      "Usage Analytics",
    ],
    technologies: ["Claude", "OpenAI", "LangChain", "Pinecone", "Weaviate"],
    useCases: [
      "Support Copilots",
      "Sales Account Briefs",
      "Internal Knowledge Search",
      "Text-to-SQL Assistants",
    ],
    realWorld:
      "Support teams cut response time in half with an assistant that answers from your docs. Sales reps get instant account summaries. Internal ops teams query databases in plain English.",
    deliverables: [
      "Use-case discovery + risk review",
      "RAG pipeline over your knowledge base",
      "Agent with tool access (search, API, DB)",
      "Evaluation harness and guardrails",
      "Deployment with usage analytics",
    ],
    color: "from-violet-500 to-indigo-500",
  },
];

export const businessServices = services.filter((s) => s.category === "business");
export const individualServices = services.filter((s) => s.category === "individual");
export const specialtyServices = services.filter((s) => s.category === "specialty");

export const serviceSelectMap: Record<string, string> = {
  "AI & Machine Learning Solutions": "AI Solutions",
  "DevOps & CI/CD Automation": "DevOps",
  "Cloud Infrastructure & Migration": "Cloud Migration",
  "Cybersecurity & Compliance": "Cybersecurity",
  "Custom Software Development": "Custom Software",
  "Mobile App Development": "Mobile Apps",
  "UI / UX Design & Prototyping": "UI/UX Design",
  "Data Engineering & Analytics": "Data Engineering",
};

export const buildPrefillMessage = (title: string, features: string[]) =>
  `Hi IFLEON team,\n\nI'd like to discuss your "${title}" service for my project. ` +
  `I'm particularly interested in:\n` +
  features.map((f) => `  • ${f}`).join("\n") +
  `\n\n--- A bit about my project / requirements ---\n\n\n\n` +
  `---\n\nPlease share next steps, a rough timeline, and any initial questions you have.\n\nThanks!`;
