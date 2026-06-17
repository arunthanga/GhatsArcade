// CSV export serialization (Owner-only export, prj.md Section 9).
//
// TDD placeholder: implement behind failing tests in csv.test.ts (escaping of commas,
// quotes, newlines; header ordering; empty-rows handling) before wiring to the export route.

export function toCsv(_rows: ReadonlyArray<Record<string, unknown>>): string {
  throw new Error("toCsv is not implemented yet - write csv.test.ts first (TDD).");
}
