// Agricultural-land construction disclaimer (prj.md Section 3.4 - hard requirement).
// MUST be rendered as its own component, distinct from the NRI/FEMA LegalDisclaimer;
// folding one into the other is a defect. Shown on every listing + project detail page.

export function ConstructionDisclaimer() {
  return (
    <p
      role="note"
      data-testid="construction-disclaimer"
      className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900"
    >
      All plots are sold as agricultural land (purayidam/dryland classification unless
      otherwise stated). No conversion to residential use is included in or implied by this
      sale. Buyers are solely responsible for obtaining any construction or land-use
      permission from the relevant panchayat or authority. Ghats Arcade makes no
      representation on individual plot buildability. The shared clubhouse is the only
      permitted structure constructed by the developer.
    </p>
  );
}
