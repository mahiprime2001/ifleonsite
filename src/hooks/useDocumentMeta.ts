import { useEffect } from "react";

type MetaOptions = {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
};

const setMetaTag = (name: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setOgTag = (property: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="canonical"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const removeCanonical = () => {
  document.head.querySelector(`link[rel="canonical"]`)?.remove();
};

export const useDocumentMeta = ({ title, description, canonical, noindex }: MetaOptions) => {
  useEffect(() => {
    const prevTitle = document.title;

    if (title) {
      document.title = title;
      setOgTag("og:title", title);
      setMetaTag("twitter:title", title);
    }
    if (description) {
      setMetaTag("description", description);
      setOgTag("og:description", description);
      setMetaTag("twitter:description", description);
    }
    if (canonical) {
      setCanonical(canonical);
      setOgTag("og:url", canonical);
    }
    if (noindex) {
      setMetaTag("robots", "noindex, nofollow");
    }

    return () => {
      document.title = prevTitle;
      if (noindex) setMetaTag("robots", "index, follow");
      if (canonical) removeCanonical();
    };
  }, [title, description, canonical, noindex]);
};
