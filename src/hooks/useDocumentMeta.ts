import { useEffect } from "react";

type MetaOptions = {
  title?: string;
  description?: string;
  /** Full URL of the page, for <link rel="canonical"> and og:url. */
  canonical?: string;
  /** Share image (og:image / twitter:image). */
  image?: string;
  /** Ask search engines not to index this page (e.g. "post not found"). */
  noIndex?: boolean;
};

/* Sets an attribute on a <head> element (creating it if needed) and returns a function that undoes it. */
const setHead = (selector: string, create: () => HTMLElement, attr: string, value: string) => {
  let tag = document.head.querySelector<HTMLElement>(selector);
  const created = !tag;
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  const previous = tag.getAttribute(attr);
  tag.setAttribute(attr, value);
  return () => {
    if (created) tag!.remove();
    else if (previous !== null) tag!.setAttribute(attr, previous);
  };
};

const meta = (key: "name" | "property", name: string, content: string) =>
  setHead(
    `meta[${key}="${name}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute(key, name);
      return el;
    },
    "content",
    content,
  );

export const useDocumentMeta = ({ title, description, canonical, image, noIndex }: MetaOptions) => {
  useEffect(() => {
    const prevTitle = document.title;
    const undo: Array<() => void> = [];
    if (title) {
      document.title = title;
      undo.push(meta("property", "og:title", title), meta("name", "twitter:title", title));
    }
    if (description) {
      undo.push(
        meta("name", "description", description),
        meta("property", "og:description", description),
        meta("name", "twitter:description", description),
      );
    }
    if (canonical) {
      undo.push(
        setHead('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", canonical),
        meta("property", "og:url", canonical),
      );
    }
    if (image) undo.push(meta("property", "og:image", image), meta("name", "twitter:image", image));
    if (noIndex) undo.push(meta("name", "robots", "noindex, follow"));
    return () => {
      document.title = prevTitle;
      undo.reverse().forEach((fn) => fn());
    };
  }, [title, description, canonical, image, noIndex]);
};
