import { z } from "zod";
import {
  BLOG_CATEGORIES,
  BLOG_STATUSES,
  BUYER_TYPES,
  COMMON_ASSET_HANDOVER_STATUSES,
  CONTACT_METHODS,
  EVENT_STATUSES,
  HORTICULTURE_ACTIVITY_TYPES,
  LAND_REVENUE_CLASSIFICATIONS,
  LAND_TYPES,
  LEAD_STATUSES,
  LEAD_TYPES,
  LISTING_STATUSES,
  PLOT_STATUSES,
  PREFERRED_CALL_SLOTS,
  PROJECT_PHOTO_TAGS,
  PROJECT_STATUSES,
  ROAD_HANDOVER_STATUSES,
  ROAD_STATUSES,
  TESTIMONIAL_BUYER_TYPES,
} from "@/types";

// Shared Zod schemas (used by forms and API routes). Derived from prj.md Section 8.

// Superset capture payload shared by every public lead surface (full inquiry, the
// 3-field "hold a plot" form, and the site-visit request). Lighter forms simply omit
// the optional fields; `leadType` records which surface it came from. `buyerType`
// defaults so the short forms that don't ask for it still validate.
export const leadInquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(5, "A contactable phone number is required"),
  whatsapp: z.string().max(40).optional(),
  buyerType: z.enum(BUYER_TYPES).default("resident_indian"),
  leadType: z.enum(LEAD_TYPES).default("inquiry"),
  message: z.string().max(2000).optional(),
  isCofarmer: z.boolean().default(false),
  preferredDate: z.coerce.date().optional(),
  preferredCallSlot: z.enum(PREFERRED_CALL_SLOTS).optional(),
  preferredTimezone: z.string().trim().min(1).max(80).optional(),
  projectInterest: z.string().max(200).optional(),
  plotInterest: z.string().max(200).optional(),
  sourcePage: z.string().max(300).optional(),
  sourceListingId: z.string().optional(),
  sourceProjectId: z.string().optional(),
  sourceBlogPostId: z.string().optional(),
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
  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .or(z.literal(""))
    .optional(),
  category: z.enum(BLOG_CATEGORIES).default("lifestyle"),
  status: z.enum(BLOG_STATUSES).default("draft"),
  // SEO overrides — fall back to title/excerpt/cover at render time when omitted.
  // Empty strings are accepted so an admin can clear a previously set value.
  metaTitle: z.string().max(70, "Keep the meta title under 70 characters").optional(),
  metaDescription: z
    .string()
    .max(200, "Keep the meta description under 200 characters")
    .optional(),
  ogImageUrl: z.string().url("OG image must be a valid URL").or(z.literal("")).optional(),
  // Optional manual override; the service auto-estimates from the body when omitted.
  estimatedReadMinutes: z.coerce
    .number()
    .int("Reading time must be a whole number")
    .positive("Reading time must be positive")
    .max(120)
    .optional(),
});
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;

export const updateBlogPostSchema = createBlogPostSchema.partial();
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;

// --- Events ---------------------------------------------------------------

export const eventPhotoSchema = z.object({
  url: z.string().url("Each photo needs a valid URL"),
  alt: z.string().max(300).optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});
export type EventPhotoInput = z.infer<typeof eventPhotoSchema>;

// The slug is generated server-side from the title (src/lib/slug.ts).
export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  eventDate: z.coerce.date({ message: "A valid event date is required" }),
  theme: z.string().max(120).optional(),
  status: z.enum(EVENT_STATUSES).default("upcoming"),
  projectId: z.string().optional(),
  photos: z.array(eventPhotoSchema).optional(),
});
export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema.partial();
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// --- Testimonials ---------------------------------------------------------

export const createTestimonialSchema = z.object({
  buyerName: z.string().min(1, "Buyer name is required"),
  buyerCity: z.string().max(120).optional(),
  buyerType: z.enum(TESTIMONIAL_BUYER_TYPES).default("resident_indian"),
  quoteText: z.string().min(1, "A quote is required").max(2000),
  videoUrl: z.string().url("Video URL must be valid").or(z.literal("")).optional(),
  displayOrder: z.coerce.number().int("Order must be a whole number").nonnegative().default(0),
  isActive: z.boolean().default(true),
  projectId: z.string().optional(),
});
export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;

export const updateTestimonialSchema = createTestimonialSchema.partial();
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;

// --- Horticulture logs ----------------------------------------------------

export const createHorticultureLogSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  plotId: z.string().optional(),
  activityType: z.enum(HORTICULTURE_ACTIVITY_TYPES),
  description: z.string().min(1, "Description is required").max(5000),
  activityDate: z.coerce.date({ message: "A valid activity date is required" }),
});
export type CreateHorticultureLogInput = z.infer<typeof createHorticultureLogSchema>;

export const updateHorticultureLogSchema = createHorticultureLogSchema.partial();
export type UpdateHorticultureLogInput = z.infer<typeof updateHorticultureLogSchema>;

// --- Projects & Plots -----------------------------------------------------

export const projectPhotoSchema = z.object({
  url: z.string().url("Each photo needs a valid URL"),
  alt: z.string().max(300).optional(),
  tag: z.enum(PROJECT_PHOTO_TAGS).optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});
export type ProjectPhotoInput = z.infer<typeof projectPhotoSchema>;

const locationDistanceSchema = z.object({
  city: z.string().min(1),
  km: z.number().nonnegative(),
  driveMinutes: z.number().int().nonnegative().optional(),
});

const nearbyAttractionSchema = z.object({
  name: z.string().min(1),
  distanceKm: z.number().nonnegative().optional(),
  driveMinutes: z.number().int().nonnegative().optional(),
  description: z.string().max(2000).optional(),
  seasonalNote: z.string().max(500).optional(),
});

// The slug is auto-generated server-side from the title (see src/server/projects.ts),
// so it is not accepted here. `description` and the other rich-text fields are
// sanitised in the service before persisting.
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tagline: z.string().max(300).optional(),
  theme: z.string().max(120).optional(),
  description: z.string().min(1, "Description is required"),
  locationDistrict: z.string().min(1, "District is required"),
  locationNearestTown: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  keralaTnBorder: z.boolean().default(false),
  locationDistances: z.array(locationDistanceSchema).optional(),
  totalAreaAcres: z.number().positive().optional(),
  landRevenueClassification: z.enum(LAND_REVENUE_CLASSIFICATIONS).default("purayidam"),
  roadStatus: z.enum(ROAD_STATUSES).default("planned"),
  roadSpec: z.string().max(2000).optional(),
  clubhouseDescription: z.string().max(5000).optional(),
  waterSourceDescription: z.string().max(5000).optional(),
  plantationDescription: z.string().max(5000).optional(),
  maintenanceFeePerCentPerMonth: z.number().int().nonnegative().optional(),
  maintenanceFeeIncludedScope: z.string().max(5000).optional(),
  maintenanceFeeExcludedScope: z.string().max(5000).optional(),
  maintenanceFeeEscalationPolicy: z.string().max(2000).optional(),
  commonAssetHandoverStatus: z.enum(COMMON_ASSET_HANDOVER_STATUSES).default("owner_held"),
  associationFormationTrigger: z.string().max(2000).optional(),
  roadHandoverToPanchayatStatus: z.enum(ROAD_HANDOVER_STATUSES).default("not_initiated"),
  nearbyAttractions: z.array(nearbyAttractionSchema).optional(),
  legalChecklistSummary: z.string().max(5000).optional(),
  status: z.enum(PROJECT_STATUSES).default("draft"),
  coverPhotoUrl: z.string().url("Cover photo must be a valid URL").optional(),
  videoEmbedUrl: z.string().url("Video embed must be a valid URL").optional(),
  photos: z.array(projectPhotoSchema).optional(),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// Public browse filters for projects (query strings → coerced).
export const projectFilterSchema = z.object({
  district: z.string().min(1).optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  minPricePerCent: z.coerce.number().int().nonnegative().optional(),
  maxPricePerCent: z.coerce.number().int().nonnegative().optional(),
  minCents: z.coerce.number().positive().optional(),
  maxCents: z.coerce.number().positive().optional(),
});
export type ProjectFilter = z.infer<typeof projectFilterSchema>;

export const createPlotSchema = z.object({
  plotNumber: z.string().min(1, "Plot number is required"),
  sizeCents: z.number().positive("Size must be greater than 0"),
  pricePerCent: z.number().int().nonnegative("Price cannot be negative"),
  totalPrice: z.number().int().nonnegative("Price cannot be negative").optional(),
  positionNotes: z.string().max(1000).optional(),
  status: z.enum(PLOT_STATUSES).default("available"),
});
export type CreatePlotInput = z.infer<typeof createPlotSchema>;

export const updatePlotSchema = createPlotSchema.partial();
export type UpdatePlotInput = z.infer<typeof updatePlotSchema>;

// --- Lead magnets ---------------------------------------------------------

export const createLeadMagnetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fileUrl: z.string().url("A valid file URL is required"),
  isActive: z.boolean().default(true),
});
export type CreateLeadMagnetInput = z.infer<typeof createLeadMagnetSchema>;

export const updateLeadMagnetSchema = createLeadMagnetSchema.partial();
export type UpdateLeadMagnetInput = z.infer<typeof updateLeadMagnetSchema>;

// Public gated-download payload. Just enough to capture a lead in exchange for the file;
// `company` is the same bot honeypot used by the other capture forms.
export const leadMagnetDownloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(5, "A contactable phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  whatsapp: z.string().max(40).optional(),
  sourceBlogPostId: z.string().optional(),
  sourcePage: z.string().max(300).optional(),
  company: z.string().optional(),
});
export type LeadMagnetDownloadInput = z.infer<typeof leadMagnetDownloadSchema>;

export const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
