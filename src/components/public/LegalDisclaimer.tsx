// Persistent legal/eligibility disclaimer (prj.md Section 3 - hard requirement).
// Rendered in the root footer and reused on listing pages and inquiry forms.

export function LegalDisclaimer() {
  return (
    <p role="note" data-testid="legal-disclaimer">
      Ghats Arcade is a marketing and lead-generation service and does not facilitate payments,
      escrow, or legal title transfer. Registering agricultural land by NRIs, OCI cardholders, and
      foreign citizens is subject to FEMA and other eligibility rules; please seek independent legal
      advice before transacting.
    </p>
  );
}
