export const BUYING_TIMELINES = [
  "Just researching",
  "Planning a visit this month",
  "Ready in 1-3 months",
  "Ready in 3-6 months",
  "Only if the right project fits",
] as const;

export const BUDGET_RANGES = [
  "Still deciding",
  "Under ₹25 lakh",
  "₹25-50 lakh",
  "₹50 lakh-₹1 crore",
  "₹1 crore+",
] as const;

export const VISIT_READINESS = [
  "Send project facts first",
  "Call me before scheduling",
  "I am ready to visit",
  "I need help choosing a project",
] as const;

type LeadQualificationDetails = {
  buyingTimeline?: string;
  budgetRange?: string;
  visitReadiness?: string;
  wantsProofPack?: boolean;
};

const MAX_LEAD_MESSAGE_LENGTH = 2000;

export function appendLeadQualification(
  message: string | undefined,
  details: LeadQualificationDetails,
): string | undefined {
  const lines = [
    details.buyingTimeline ? `When you'd like to join: ${details.buyingTimeline}` : null,
    details.budgetRange ? `Budget range: ${details.budgetRange}` : null,
    details.visitReadiness ? `Visit readiness: ${details.visitReadiness}` : null,
    details.wantsProofPack ? "Requested proof pack/factsheet before follow-up." : null,
  ].filter(Boolean);

  if (lines.length === 0) {
    return message?.trim() || undefined;
  }

  const qualificationNote = `Lead qualification:\n${lines.map((line) => `- ${line}`).join("\n")}`;
  const trimmedMessage = message?.trim();
  const composed = trimmedMessage ? `${trimmedMessage}\n\n${qualificationNote}` : qualificationNote;
  return composed.slice(0, MAX_LEAD_MESSAGE_LENGTH);
}
