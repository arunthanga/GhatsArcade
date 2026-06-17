// Shared domain types/enums (mirrors prj.md Section 8). SQLite has no native enums,
// so these string-literal unions are the single source of truth in the app layer.

export const ROLES = ["OWNER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const LISTING_STATUSES = ["draft", "published", "under_offer", "sold"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const LAND_TYPES = ["agricultural", "converted_non_agricultural"] as const;
export type LandType = (typeof LAND_TYPES)[number];

export const LEAD_STATUSES = ["new", "contacted", "negotiating", "converted", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const BUYER_TYPES = ["resident_indian", "nri", "oci", "foreign_citizen"] as const;
export type BuyerType = (typeof BUYER_TYPES)[number];

export const CONTACT_METHODS = ["whatsapp", "call", "email", "in_person"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];
