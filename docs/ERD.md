# Ghats Arcade - Data Model / ERD

Formalized from [prj.md](../prj.md) Section 8. The authoritative schema is
[`prisma/schema.prisma`](../prisma/schema.prisma); this diagram is kept in sync as it evolves.

```mermaid
erDiagram
    User ||--o{ Project : "creates"
    User ||--o{ Listing : "creates"
    User ||--o{ BlogPost : "authors"
    User ||--o{ Event : "creates"
    User ||--o{ Testimonial : "creates"
    User ||--o{ HorticultureLog : "logs"
    User ||--o{ LeadMagnetAsset : "creates"
    User ||--o{ FollowUpNote : "writes"
    User ||--o{ Session : "has"
    User ||--o{ Account : "has"

    Project ||--o{ Plot : "contains"
    Project ||--o{ ProjectPhoto : "has"
    Project ||--o{ HorticultureLog : "tracks"
    Project |o--o{ Event : "hosts (optional)"
    Project |o--o{ Testimonial : "features (optional)"
    Project |o--o{ Lead : "sources (optional)"

    Plot |o--o{ HorticultureLog : "scoped to (optional)"

    Listing ||--o{ ListingPhoto : "has"
    Listing |o--o{ Lead : "sources (optional)"

    BlogPost |o--o{ Lead : "sources (optional)"

    Event ||--o{ EventPhoto : "has"

    Lead ||--o{ FollowUpNote : "has"

    User {
        string id PK
        string name
        string email UK
        string role "OWNER | ADMIN"
        boolean isActive
    }
    Project {
        string id PK
        string slug UK
        string theme
        string landRevenueClassification "nilam | purayidam | converted"
        string status "draft | published | sold_out | coming_soon"
        float latitude "optional; drives the Leaflet map"
        float longitude "optional"
        json locationDistances
        json nearbyAttractions
        string createdById FK
    }
    ProjectPhoto {
        string id PK
        string projectId FK
        string url
        string tag "taxonomy for the public gallery"
    }
    Plot {
        string id PK
        string projectId FK
        string plotNumber
        string status "available | reserved | sold"
        int pricePerCent
    }
    Listing {
        string id PK
        string slug UK
        string landType "agricultural | converted_non_agricultural"
        int priceInr
        string status "draft | published | under_offer | sold"
        string createdById FK
    }
    ListingPhoto {
        string id PK
        string listingId FK
        string url
    }
    Lead {
        string id PK
        string phone
        string whatsapp
        string buyerType "resident_indian | nri | oci | foreign_citizen"
        string leadType "inquiry | site_visit_request | callback | lead_magnet_download"
        string status "new | contacted | site_visit_requested | site_visit_scheduled | negotiating | converted | lost"
        boolean isCofarmer
        datetime preferredDate
        string preferredCallSlot "morning | afternoon | evening"
        string preferredTimezone
        string sourceListingId FK
        string sourceProjectId FK
        string sourceBlogPostId FK
    }
    FollowUpNote {
        string id PK
        string leadId FK
        string authorId FK
        string contactMethod "whatsapp | call | email | in_person | site_visit"
    }
    BlogPost {
        string id PK
        string slug UK
        string category "legal_guides | investment | ... | myth_busting | farming_guides"
        int estimatedReadMinutes
        string status "draft | published"
        string authorId FK
    }
    Event {
        string id PK
        string slug UK
        datetime eventDate
        string status "upcoming | past"
        string projectId FK
        string createdById FK
    }
    EventPhoto {
        string id PK
        string eventId FK
        string url
    }
    Testimonial {
        string id PK
        string buyerName
        string buyerType "resident_indian | nri | oci"
        int displayOrder
        boolean isActive
        string projectId FK
        string createdById FK
    }
    HorticultureLog {
        string id PK
        string projectId FK
        string plotId FK
        string activityType "plantation | maintenance | harvest | irrigation | pest_control"
        datetime activityDate
        string loggedById FK
    }
    LeadMagnetAsset {
        string id PK
        string title
        string fileUrl
        int downloadCount
        boolean isActive
        string createdById FK
    }
```

## Notes

- SQLite has no native enums or scalar lists, so enum-like fields are `String` (allowed
  values documented inline) and lists (`photos`, `follow_up_notes`) are relations.
- JSON columns (`locationDistances`, `nearbyAttractions`) use Prisma's native `Json` scalar,
  which requires Prisma ≥ 6.2 on SQLite.
- Money is stored as integers (whole rupees / paise-free) to avoid floating-point issues
  (`priceInr` on Listing, `pricePerCent` on Plot).
- `BlogPost.body` and the rich-text `description` fields hold author-entered content; project
  and event descriptions are sanitised HTML, while blog bodies are rendered as plain text.
- `HorticultureLog` is gated under the `project:manage` permission (it is a project sub-record).
- Auth tables (`Session`, `Account`, `Verification`) follow Better Auth's expected shape.
- **Lead phone deduplication** is enforced in application code (`captureLead` in `src/server/leads.ts`), not via a DB unique index: repeat submissions from the same normalised phone merge into the existing row (canonical storage as `+{digits}`).
