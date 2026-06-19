// Pure slug helper. Deterministic and dependency-free so it is trivially unit-tested
// and reusable on both server and client. Uniqueness (appending -2, -3, ...) is the
// service layer's responsibility, not this function's.

const FALLBACK_SLUG = "listing";

export function slugify(input: string): string {
  const slug = input
    .normalize("NFKD") // split accented chars into base + combining marks
    .replace(/[\u0300-\u036f]/g, "") // strip the combining marks (diacritics)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // any run of non-alphanumerics -> single dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes

  return slug.length > 0 ? slug : FALLBACK_SLUG;
}
