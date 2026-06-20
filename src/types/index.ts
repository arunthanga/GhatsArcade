// Shared domain types/enums (mirrors prj.md Section 8). SQLite has no native enums,
// so these string-literal unions are the single source of truth in the app layer.

export const ROLES = ["OWNER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const LISTING_STATUSES = ["draft", "published", "under_offer", "sold"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const LAND_TYPES = ["agricultural", "converted_non_agricultural"] as const;
export type LandType = (typeof LAND_TYPES)[number];

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "site_visit_scheduled",
  "negotiating",
  "converted",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

// How a lead came in. Drives the admin funnel view + which capture surface it used.
export const LEAD_TYPES = [
  "inquiry",
  "site_visit_request",
  "callback",
  "lead_magnet_download",
] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const BUYER_TYPES = ["resident_indian", "nri", "oci", "foreign_citizen"] as const;
export type BuyerType = (typeof BUYER_TYPES)[number];

// Public-facing labels for lead forms (internal field remains `buyerType` in the DB).
export const BUYER_TYPE_LABELS: Record<BuyerType, string> = {
  resident_indian: "Resident Indian co-farmer",
  nri: "NRI co-farmer",
  oci: "OCI co-farmer",
  foreign_citizen: "Foreign citizen (eligibility check required)",
};

// Buyer types shown on testimonials (a subset of BUYER_TYPES; keep in sync with the
// Testimonial.buyerType comment in prisma/schema.prisma).
export const TESTIMONIAL_BUYER_TYPES = ["resident_indian", "nri", "oci"] as const;
export type TestimonialBuyerType = (typeof TESTIMONIAL_BUYER_TYPES)[number];
export const TESTIMONIAL_BUYER_TYPE_LABELS: Record<TestimonialBuyerType, string> = {
  resident_indian: "Resident Indian co-farmer",
  nri: "NRI co-farmer",
  oci: "OCI co-farmer",
};

export const CONTACT_METHODS = ["whatsapp", "call", "email", "in_person", "site_visit"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

// Editorial categories (prj.md Section 3). `myth_busting` and `farming_guides` back the two
// standalone content hubs; the rest are general editorial buckets. Keep in sync with the
// BlogPost.category default/comment in prisma/schema.prisma.
export const BLOG_CATEGORIES = [
  "legal_guides",
  "investment",
  "lifestyle",
  "plantation_farming",
  "location_spotlight",
  "nri_corner",
  "community_stories",
  "myth_busting",
  "farming_guides",
] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

// Human-readable labels for admin selects and public badges.
export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  legal_guides: "Legal Guides",
  investment: "Legacy & Land",
  lifestyle: "Lifestyle",
  plantation_farming: "Plantation & Farming",
  location_spotlight: "Location Spotlight",
  nri_corner: "NRI Corner",
  community_stories: "Community Stories",
  myth_busting: "Farmland — Real or Hype?",
  farming_guides: "Farming Guides",
};

// --- Events (prj.md Section 3 / 8) ----------------------------------------

export const EVENT_STATUSES = ["upcoming", "past"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

// --- Horticulture logs (prj.md Section 8) ---------------------------------
// Internal operational log of on-the-ground activity per project/plot. Keep in sync
// with the HorticultureLog.activityType comment in prisma/schema.prisma.
export const HORTICULTURE_ACTIVITY_TYPES = [
  "plantation",
  "maintenance",
  "harvest",
  "irrigation",
  "pest_control",
] as const;
export type HorticultureActivityType = (typeof HORTICULTURE_ACTIVITY_TYPES)[number];
export const HORTICULTURE_ACTIVITY_LABELS: Record<HorticultureActivityType, string> = {
  plantation: "Plantation",
  maintenance: "Maintenance",
  harvest: "Harvest",
  irrigation: "Irrigation",
  pest_control: "Pest control",
};

// --- Projects & Plots (prj.md Section 8) ----------------------------------

export const PROJECT_STATUSES = ["draft", "published", "sold_out", "coming_soon"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PLOT_STATUSES = ["available", "reserved", "sold"] as const;
export type PlotStatus = (typeof PLOT_STATUSES)[number];

export const LAND_REVENUE_CLASSIFICATIONS = ["nilam", "purayidam", "converted"] as const;
export type LandRevenueClassification = (typeof LAND_REVENUE_CLASSIFICATIONS)[number];

export const ROAD_STATUSES = ["planned", "in_progress", "complete"] as const;
export type RoadStatus = (typeof ROAD_STATUSES)[number];

export const COMMON_ASSET_HANDOVER_STATUSES = [
  "owner_held",
  "association_pending",
  "transferred_to_association",
  "transferred_to_panchayat",
] as const;
export type CommonAssetHandoverStatus = (typeof COMMON_ASSET_HANDOVER_STATUSES)[number];

export const ROAD_HANDOVER_STATUSES = ["not_initiated", "in_progress", "complete"] as const;
export type RoadHandoverStatus = (typeof ROAD_HANDOVER_STATUSES)[number];

// Tags for project gallery photos.
export const PROJECT_PHOTO_TAGS = [
  "land",
  "road",
  "water",
  "clubhouse",
  "plantation",
  "landscape",
  "aerial",
  "seasonal",
  "community",
] as const;
export type ProjectPhotoTag = (typeof PROJECT_PHOTO_TAGS)[number];
