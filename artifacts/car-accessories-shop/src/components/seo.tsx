import { useEffect } from "react";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
}

const SITE_NAME = "TWM";
const DEFAULT_DESCRIPTION =
  "TWM is your trusted Malaysian car accessories store — roof boxes, dash cams, air fresheners, wipers, and more. Shop premium car accessories online.";
const DEFAULT_IMAGE = "/twm-logo.png";

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function Seo({ title, description, image, path, type = "website", noIndex = false }: SeoProps) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Car Accessories Malaysia`;
    const pageDesc = description ?? DEFAULT_DESCRIPTION;
    const pageImage = image ?? DEFAULT_IMAGE;
    const pageUrl = `${window.location.origin}${path ?? window.location.pathname}`;

    document.title = pageTitle;

    setMeta("description", pageDesc);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");

    // Open Graph
    setMeta("og:title", pageTitle, true);
    setMeta("og:description", pageDesc, true);
    setMeta("og:image", pageImage.startsWith("http") ? pageImage : `${window.location.origin}${pageImage}`, true);
    setMeta("og:url", pageUrl, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:locale", "en_MY", true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", pageDesc);
    setMeta("twitter:image", pageImage.startsWith("http") ? pageImage : `${window.location.origin}${pageImage}`);

    // Canonical
    setLink("canonical", pageUrl);
  }, [title, description, image, path, type, noIndex]);

  return null;
}
