// Builds wa.me click-to-chat links with pre-filled context (prj.md Section 3).
// Pure and side-effect free so it is trivial to test first.

/** Removes everything except digits from a phone number. */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Build a https://wa.me link for `phone`, optionally pre-filling `message`.
 * Throws if the phone contains no digits.
 */
export function buildWhatsAppLink(phone: string, message?: string): string {
  const digits = normalizePhone(phone);
  if (digits.length === 0) {
    throw new Error("A WhatsApp phone number must contain at least one digit.");
  }
  const base = `https://wa.me/${digits}`;
  if (message && message.trim().length > 0) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}
