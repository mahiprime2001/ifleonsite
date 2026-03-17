export type SearchItem = {
  title: string;
  description: string;
  url: string;
};

export const searchIndex: SearchItem[] = [
  {
    title: "Pricing",
    description: "Engagement models and pricing options",
    url: "/pricing",
  },
  {
    title: "Case Studies",
    description: "Real-world projects and solutions delivered by IFLEON",
    url: "/case-studies",
  },
  {
    title: "Tech Stack",
    description: "Technologies, tools, and platforms we use",
    url: "/tech-stack",
  },
  {
    title: "FAQ",
    description: "Frequently asked questions about IFLEON services",
    url: "/faq",
  },
  {
    title: "Blog",
    description: "Articles on AI, DevOps, cloud, and technology",
    url: "/blog",
  },
];
