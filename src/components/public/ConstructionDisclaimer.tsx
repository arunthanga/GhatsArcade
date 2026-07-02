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
      All plots are sold as agricultural land (purayidam/dryland classification unless otherwise
      stated). Ghats Arcade does not undertake any legal obligation to convert agricultural land to
      residential use or secure construction approvals. If a registered owner wants a small
      farmhouse or farm-use structure, we may support architecture, construction coordination, and
      guidance, but permissions, conversion, compliance, and legal responsibility remain with the
      owner and their chosen professionals. To protect the farmland character of the project, we
      help keep permanent concrete structures within 20% of each owner's total land holding, leaving
      at least 80% open for trees, soil, water, and farm life.
    </p>
  );
}
