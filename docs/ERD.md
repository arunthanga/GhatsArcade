# Ghats Arcade - Data Model / ERD

Formalized from [prj.md](../prj.md) Section 8. The authoritative schema is
[`prisma/schema.prisma`](../prisma/schema.prisma); this diagram is kept in sync as it evolves.

```mermaid
erDiagram
    User ||--o{ Listing : "creates"
    User ||--o{ BlogPost : "authors"
    User ||--o{ FollowUpNote : "writes"
    User ||--o{ Session : "has"
    User ||--o{ Account : "has"
    Listing ||--o{ ListingPhoto : "has"
    Listing ||--o{ Lead : "sources"
    Lead ||--o{ FollowUpNote : "has"

    User {
        string id PK
        string name
        string email UK
        string role "OWNER | ADMIN"
        boolean isActive
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
        string buyerType "resident_indian | nri | oci | foreign_citizen"
        string status "new | contacted | negotiating | converted | lost"
        string sourceListingId FK
    }
    FollowUpNote {
        string id PK
        string leadId FK
        string authorId FK
        string contactMethod "whatsapp | call | email | in_person"
    }
    BlogPost {
        string id PK
        string slug UK
        string status "draft | published"
        string authorId FK
    }
```

## Notes

- SQLite has no native enums or scalar lists, so enum-like fields are `String` (allowed
  values documented inline) and lists (`photos`, `follow_up_notes`) are relations.
- Money is stored as `priceInr` (`Int`, whole rupees) to avoid floating-point issues.
- Auth tables (`Session`, `Account`, `Verification`) follow Better Auth's expected shape.
