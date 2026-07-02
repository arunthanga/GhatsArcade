// Soft farmhouse-support note for project detail pages (prj.md). Explains that Ghats Arcade
// can guide construction coordination within the 20%-permanent-structure / 80%-open-land
// principle, while conversion, permissions, approvals, and legal responsibility stay with
// the owner.

export function FarmhouseSupportNote({ className }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border border-brand-100 bg-brand-50 p-6 text-sm text-brand-700 ${
        className ?? ""
      }`}
      data-testid="farmhouse-support-note"
    >
      <h2 className="text-lg font-semibold text-brand-900">Thinking of a farmhouse?</h2>
      <p className="mt-2 leading-relaxed">
        We can help coordinate architecture and construction for a farmhouse on your plot. Permanent
        structures stay within <strong>20% of the holding</strong>, keeping at least{" "}
        <strong>80% as open farmland</strong>.
      </p>
      <p className="mt-2 leading-relaxed">
        Land-use conversion, residential permissions, statutory approvals, and the associated legal
        responsibility remain with the owner. We'll guide you, but the final approvals are yours to
        hold.
      </p>
    </aside>
  );
}
