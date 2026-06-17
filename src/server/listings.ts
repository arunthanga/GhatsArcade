// Listing service layer (prj.md Section 3). All listing writes funnel through here so
// role checks (src/lib/roles.ts) are enforced server-side, never only in the UI.
//
// TDD placeholder: add listings.test.ts (create/update/delete, slug uniqueness,
// status transitions) before implementing against src/lib/db.ts.

export {};
