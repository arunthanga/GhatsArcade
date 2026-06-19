import type { Metadata } from "next";
import { CategoryHub } from "@/components/public/CategoryHub";
import { absoluteUrl } from "@/lib/seo";
import { listPublishedPostsByCategory } from "@/server/blog";

export const dynamic = "force-dynamic";

const TITLE = "Farming Guides / Knowledge Base";
const DESCRIPTION =
  "Practical how-to guides for farmland buyers in the Palakkad agroclimatic zone — crop calendars, reading a survey sketch, encumbrance certificates, panchayat permissions, and site-visit checklists.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/farming-guides") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/farming-guides"),
    type: "website",
  },
};

export default async function FarmingGuidesHubPage() {
  const posts = await listPublishedPostsByCategory("farming_guides");

  return (
    <CategoryHub
      eyebrow="Knowledge base"
      title={TITLE}
      intro="Own your land with confidence. These practical guides explain the paperwork, the seasons, and the on-the-ground checks every farmland owner in the Palakkad region should know."
      posts={posts}
      emptyMessage="Our knowledge base is growing. Check back soon, or ask us for guidance directly."
    />
  );
}
