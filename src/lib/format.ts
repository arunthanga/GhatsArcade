// Formatting helpers. Pure + dependency-free for easy unit testing.

// Formats whole rupees with Indian (lakh/crore) digit grouping, e.g. 7500000 -> "₹75,00,000".
// Uses Intl en-IN grouping so co-farmers see ₹35,00,000, not the Western ₹3,500,000.
export function formatInr(rupees: number): string {
  const rounded = Math.round(rupees);
  const sign = rounded < 0 ? "-" : "";
  const grouped = new Intl.NumberFormat("en-IN").format(Math.abs(rounded));
  return `${sign}₹${grouped}`;
}

// Human-friendly acreage, trimming trailing zeros (5 -> "5", 2.5 -> "2.5").
export function formatAcres(acres: number): string {
  return `${Number.parseFloat(acres.toFixed(2))} acres`;
}
