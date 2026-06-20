import type { Metadata } from "next";
import { CategoryHub } from "@/components/public/CategoryHub";
import { absoluteUrl } from "@/lib/seo";
import { listPublishedPostsByCategory } from "@/server/blog";

export const dynamic = "force-dynamic";

const TITLE = "Farmland — Real or Hype?";
const DESCRIPTION =
  "Honest answers to the most common myths and objections about managed farmland in Kerala — title, fees, buildability, and whether it's the right fit for your family.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/farmland-real-or-hype") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/farmland-real-or-hype"),
    type: "website",
  },
};

export default async function MythBustingHubPage() {
  const posts = await listPublishedPostsByCategory("myth_busting");

  return (
    <CategoryHub
      eyebrow="Myth-busting"
      title={TITLE}
      intro="Managed farmland attracts a lot of scepticism — some of it fair, some of it based on misunderstanding. We tackle the hard questions head-on so you can decide with clear eyes."
      posts={posts}
      emptyMessage="We're writing these myth-busters now. In the meantime, reach out and ask us anything directly."
    />
  );
}
