// Formatting helpers. Pure + dependency-free for easy unit testing.

// Formats whole rupees with Indian digit grouping, e.g. 7500000 -> "Rs 75,00,000".
export function formatInr(rupees: number): string {
  const rounded = Math.round(rupees);
  const sign = rounded < 0 ? "-" : "";
  const grouped = new Intl.NumberFormat("en-IN").format(Math.abs(rounded));
  return `${sign}Rs ${grouped}`;
}

// Human-friendly acreage, trimming trailing zeros (5 -> "5", 2.5 -> "2.5").
export function formatAcres(acres: number): string {
  return `${Number.parseFloat(acres.toFixed(2))} acres`;
}
