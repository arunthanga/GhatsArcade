// The canonical FAQ set (prj.md Section 3.7 — minimum 12 questions). Shared between the
// standalone /faq page and (later) the inline home-page FAQ block, and used to emit
// schema.org FAQPage JSON-LD. Kept as plain data so it's trivially unit-testable and reusable.

export type FaqItem = { question: string; answer: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What exactly does "managed farmland" mean?',
    answer:
      "You own a clearly demarcated, registered plot of agricultural land, and a professional team handles the day-to-day cultivation and upkeep — soil, irrigation, plantation, and common areas — on your behalf. You get the ownership and the produce without having to live on-site or farm it yourself.",
  },
  {
    question: "Who legally owns the land — me or Ghats Arcade?",
    answer:
      "You do. The plot is registered in your name at the sub-registrar's office with a clear-title sale deed. Ghats Arcade provides management services under a separate maintenance agreement; it does not retain ownership of your plot.",
  },
  {
    question: "Can I build a house or farmhouse on my plot?",
    answer:
      "These are agricultural plots. Construction is governed by Kerala's land-use and panchayat rules, which generally restrict permanent structures on agricultural land. We never promise construction approvals — please see our agricultural-land construction disclaimer and verify independently before registering.",
  },
  {
    question: "Who is managed farmland NOT suitable for?",
    answer:
      "It is not a fit if you need guaranteed short-term returns, expect to build a residence immediately, or want a liquid asset you can exit overnight. Farmland is a long-horizon, appreciation-and-lifestyle asset. We'd rather tell you that upfront than oversell it.",
  },
  {
    question: "Can I sell the land in the future? Will Ghats Arcade help?",
    answer:
      "Yes — you can resell at any time as the registered owner. We offer resale and exit facilitation support to help connect you with prospective buyers, though we cannot guarantee a sale price or timeline.",
  },
  {
    question: "How does Ghats Arcade ensure clear titles and approvals?",
    answer:
      "Before a project launches we complete title-history checks, encumbrance certificates, boundary and survey verification, road-access confirmation, and land-classification review. The project's legal checklist section documents exactly what was verified for that specific land.",
  },
  {
    question: "What is the source of water for the farm?",
    answer:
      "Each project page lists its specific water source — typically borewells, ponds, or canal access suited to the Palakkad agroclimatic zone — along with the irrigation arrangement maintained by the management team.",
  },
  {
    question: "Is farm management mandatory or can I self-manage later?",
    answer:
      "Common-area maintenance is shared and continuous to keep the whole estate productive. Plot-level horticulture management is an optional paid add-on, and the path to self-management or association handover is defined per project.",
  },
  {
    question: "Can I visit my farm anytime?",
    answer:
      "Yes. It's your land. We also run scheduled site visits and farm-visit days to make travel easy, especially for NRI and out-of-state co-farmers — see our Events page or schedule a visit directly.",
  },
  {
    question: "Who can own farmland here? Are there restrictions for NRIs?",
    answer:
      "Resident Indians can own agricultural land subject to state rules. Acquisition of agricultural land by NRIs/OCIs/foreign citizens is restricted under FEMA and may require specific eligibility or RBI approval. Please read our NRI/FEMA eligibility disclaimer and take independent legal advice for your situation.",
  },
  {
    question: "What happens to maintenance if I don't use the land for years?",
    answer:
      "Nothing changes for the land's upkeep — the management team continues cultivation and common-area maintenance against the agreed maintenance fee, so your plot stays productive whether or not you visit.",
  },
  {
    question: "What is the registration process step-by-step?",
    answer:
      "KYC and buyer eligibility check → booking your plot with an advance → choosing a payment option → sale-deed preparation → registration at the sub-registrar's office → you receive the registered deed and become the registered owner. Each project page lays this out in a 'How to register' section.",
  },
];
