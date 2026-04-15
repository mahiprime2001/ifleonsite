import { useEffect } from "react";

type MetaOptions = {
  title?: string;
  description?: string;
};

const setMetaTag = (name: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(
  `meta[name="${name}"]`,
  );
  if (!tag) {
  tag = document.createElement("meta");
  tag.setAttribute("name", name);
  document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setOgTag = (property: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(
  `meta[property="${property}"]`,
  );
  if (!tag) {
  tag = document.createElement("meta");
  tag.setAttribute("property", property);
  document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

export const useDocumentMeta = ({ title, description }: MetaOptions) => {
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
  return () => {
  document.title = prevTitle;
  };
  }, [title, description]);
};
