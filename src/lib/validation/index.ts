import { z } from "zod";
import {
  BLOG_STATUSES,
  BUYER_TYPES,
  CONTACT_METHODS,
  LAND_TYPES,
  LEAD_STATUSES,
  LISTING_STATUSES,
} from "@/types";

// Shared Zod schemas (used by forms and API routes). Derived from prj.md Section 8.

export const leadInquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(5, "A contactable phone number is required"),
  buyerType: z.enum(BUYER_TYPES),
  message: z.string().max(2000).optional(),
  sourceListingId: z.string().optional(),
});
export type LeadInquiryInput = z.infer<typeof leadInquirySchema>;

export const listingPhotoSchema = z.object({
  url: z.string().url("Each photo needs a valid URL"),
  alt: z.string().max(300).optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});
export type ListingPhotoInput = z.infer<typeof listingPhotoSchema>;

// Create payload: the slug is auto-generated server-side from the title
// (see src/lib/slug.ts + uniqueness in src/server/listings.ts), so it is NOT accepted here.
export const createListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  district: z.string().min(1, "District is required"),
  nearestTown: z.string().optional(),
  keralaTnBorder: z.boolean().default(false),
  landType: z.enum(LAND_TYPES),
  sizeAcres: z.number().positive("Size must be greater than 0"),
  priceInr: z.number().int().nonnegative("Price cannot be negative"),
  status: z.enum(LISTING_STATUSES).default("draft"),
  photos: z.array(listingPhotoSchema).optional(),
});
export type CreateListingInput = z.infer<typeof createListingSchema>;

export const updateListingSchema = createListingSchema.partial();
export type UpdateListingInput = z.infer<typeof updateListingSchema>;

// Public browse filters. Values arrive as query strings, so numerics/booleans are coerced.
export const listingFilterSchema = z.object({
  district: z.string().min(1).optional(),
  landType: z.enum(LAND_TYPES).optional(),
  minPriceInr: z.coerce.number().int().nonnegative().optional(),
  maxPriceInr: z.coerce.number().int().nonnegative().optional(),
  minAcres: z.coerce.number().positive().optional(),
  maxAcres: z.coerce.number().positive().optional(),
  keralaTnBorder: z
    .union([z.boolean(), z.enum(["true", "false"]).transform((v) => v === "true")])
    .optional(),
});
export type ListingFilter = z.infer<typeof listingFilterSchema>;

export const leadStatusSchema = z.enum(LEAD_STATUSES);

// Public capture payload. `company` is a honeypot: real users never see it, so a
// non-empty value signals a bot (the API silently drops it).
export const leadCaptureSchema = leadInquirySchema.extend({
  company: z.string().optional(),
});
export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;

export const leadStatusUpdateSchema = z.object({ status: leadStatusSchema });
export type LeadStatusUpdateInput = z.infer<typeof leadStatusUpdateSchema>;

export const followUpNoteSchema = z.object({
  noteText: z.string().min(1, "A note is required"),
  contactMethod: z.enum(CONTACT_METHODS).default("call"),
});
export type FollowUpNoteInput = z.infer<typeof followUpNoteSchema>;

// Blog/CMS. The slug is auto-generated server-side from the title (src/lib/slug.ts),
// so it is not accepted here.
export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  coverImage: z.string().url("Cover image must be a valid URL").optional(),
  status: z.enum(BLOG_STATUSES).default("draft"),
});
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;

export const updateBlogPostSchema = createBlogPostSchema.partial();
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;

export const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
