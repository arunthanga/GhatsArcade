import { sanitizeRichText } from "@/lib/sanitize";

// Renders admin-authored rich text. The HTML is sanitised on write and re-sanitised here on
// render (defence-in-depth), so this is the single, audited place that sets inner HTML.
// Server-only: sanitizeRichText depends on Node's sanitize-html.

export function SanitizedHtml({ html, className }: { html: string; className?: string }) {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: input is sanitised by sanitizeRichText
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />;
}
