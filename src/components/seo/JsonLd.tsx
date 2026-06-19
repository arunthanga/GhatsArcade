// Renders a schema.org JSON-LD <script>. Server-safe; the data comes from the pure
// helpers in src/lib/seo.ts. Using dangerouslySetInnerHTML is the standard way to emit
// ld+json without React escaping the JSON.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      data-testid="json-ld"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: required to emit JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
