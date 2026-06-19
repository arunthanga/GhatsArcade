// Server-only HTML sanitiser for rich-text authored in the admin (TipTap output for
// project descriptions and, later, blog bodies). We store sanitised HTML so the public
// render has no XSS surface. Keep this on the server: sanitize-html depends on Node.

import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "blockquote",
    "code",
    "pre",
    "h1",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "hr",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title"],
  },
  // Only http(s) and mailto links; blocks javascript: and data: URIs.
  allowedSchemes: ["http", "https", "mailto"],
  // Force safe rel on links that open in a new tab.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}
