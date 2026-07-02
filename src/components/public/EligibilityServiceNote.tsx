// Inline buyer-eligibility note shown above the listing inquiry form (prj.md-1).
//
// NOTE FOR THE OWNER: the wording below is intentionally neutral and non-committal — it is
// a placeholder that must be reviewed/finalised with legal counsel before launch. It is not
// legal advice and deliberately avoids making eligibility guarantees. See also the
// persistent LegalDisclaimer / ConstructionDisclaimer components.

export function EligibilityServiceNote({ className }: { className?: string }) {
  return (
    <aside
      className={`rounded-lg border border-brand-100 bg-white p-4 text-sm text-brand-700 ${
        className ?? ""
      }`}
      data-testid="eligibility-service-note"
    >
      <p className="font-medium text-brand-900">Not sure if you're eligible to buy?</p>
      <p className="mt-1">
        Eligibility to own Indian agricultural land depends on your status — resident Indian, NRI,
        OCI, or foreign citizen — and is subject to FEMA and local rules. Tell us your situation and
        we'll help you understand what's possible before you commit. This note is general
        information, not legal advice.
      </p>
    </aside>
  );
}
