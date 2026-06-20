// Shared post-submit acknowledgement for every public lead-capture form.
// Keeps the WhatsApp-within-24-hours promise consistent across surfaces.
type LeadCaptureSuccessProps = {
  testId: string;
  title: string;
  message?: string;
  resetLabel: string;
  onReset: () => void;
};

export function LeadCaptureSuccess({
  testId,
  title,
  message = "We'll contact you on WhatsApp within 24 hours.",
  resetLabel,
  onReset,
}: LeadCaptureSuccessProps) {
  return (
    <div
      data-testid={testId}
      className="flex flex-col items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 p-5"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-lg font-bold text-brand-50"
      >
        ✓
      </span>
      <div>
        <p className="text-base font-semibold text-brand-900">{title}</p>
        <p className="mt-1 text-sm text-brand-700">{message}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
      >
        {resetLabel}
      </button>
    </div>
  );
}
