import { z } from "zod";
import {
  BUYER_TYPES,
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

export const listingSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  district: z.string().min(1),
  nearestTown: z.string().optional(),
  keralaTnBorder: z.boolean().default(false),
  landType: z.enum(LAND_TYPES),
  sizeAcres: z.number().positive(),
  priceInr: z.number().int().nonnegative(),
  status: z.enum(LISTING_STATUSES).default("draft"),
});
export type ListingInput = z.infer<typeof listingSchema>;

export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
