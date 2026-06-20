/**
 * useSEO.js — OpsTools programmatic SEO hook
 *
 * Usage:
 *   useSEO(seoConfig)
 *
 * Every document generator page calls this with its own config object.
 * The hook writes <title>, <meta>, <link rel="canonical">, and JSON-LD
 * directly into document.head so Vite's static build can pick them up,
 * and dynamic routes still get correct tags on client navigation.
 *
 * For true SSR/prerendering, pair this with vite-plugin-ssr or
 * @vitejs/plugin-react + react-snap later.
 */

import { useEffect } from "react";

export function useSEO({
  title,
  description,
  canonical,
  ogImage = "https://www.opstools.ai/og-image.png",
  ogType = "website",
  schemas = [],          // array of JSON-LD objects
  breadcrumbs = [],      // [{ name, url }]
}) {
  useEffect(() => {
    // ── Title ──
    document.title = title;

    // ── Meta helpers ──
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [k, v] = attr.split("=");
        el.setAttribute(k.trim(), v?.replace(/"/g, "") ?? "");
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta('meta[name="description"]',           'name="description"',           description);
    setMeta('meta[property="og:title"]',           'property="og:title"',           title);
    setMeta('meta[property="og:description"]',     'property="og:description"',     description);
    setMeta('meta[property="og:type"]',            'property="og:type"',            ogType);
    setMeta('meta[property="og:url"]',             'property="og:url"',             canonical);
    setMeta('meta[property="og:image"]',           'property="og:image"',           ogImage);
    setMeta('meta[property="og:site_name"]',       'property="og:site_name"',       "OpsTools");
    setMeta('meta[property="og:locale"]',          'property="og:locale"',          "en_IN");
    setMeta('meta[name="twitter:card"]',           'name="twitter:card"',           "summary_large_image");
    setMeta('meta[name="twitter:title"]',          'name="twitter:title"',          title);
    setMeta('meta[name="twitter:description"]',    'name="twitter:description"',    description);
    setMeta('meta[name="twitter:image"]',          'name="twitter:image"',          ogImage);
    setMeta('meta[name="robots"]',                 'name="robots"',                 "index, follow");

    // ── Canonical ──
    let canonEl = document.querySelector('link[rel="canonical"]');
    if (!canonEl) {
      canonEl = document.createElement("link");
      canonEl.rel = "canonical";
      document.head.appendChild(canonEl);
    }
    canonEl.href = canonical;

    // ── JSON-LD schemas ──
    document.querySelectorAll('script[data-opstools-schema]').forEach((s) => s.remove());

    const allSchemas = [...schemas];

    // Auto-inject BreadcrumbList if breadcrumbs array provided
    if (breadcrumbs.length > 0) {
      allSchemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      });
    }

    allSchemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-opstools-schema", "true");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-opstools-schema]').forEach((s) => s.remove());
    };
  }, [title, description, canonical, ogImage, ogType]);
}
