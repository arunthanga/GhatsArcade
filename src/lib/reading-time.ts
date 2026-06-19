// Estimated reading time for blog posts (prj.md Section 3). Pure + dependency-light so it can
// run on the server when a post is saved, and is unit-tested in reading-time.test.ts.

const WORDS_PER_MINUTE = 200;

// Counts words in a body that may contain (sanitized) HTML, ignoring tags and entities.
export function countWords(body: string): number {
  const text = body
    .replace(/<[^>]*>/g, " ") // drop tags
    .replace(/&[a-z0-9#]+;/gi, " ") // drop HTML entities
    .trim();
  if (text.length === 0) {
    return 0;
  }
  return text.split(/\s+/).length;
}

// Whole minutes, rounded up, with a floor of 1 for any non-empty post.
export function estimateReadMinutes(body: string): number {
  const words = countWords(body);
  if (words === 0) {
    return 0;
  }
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
