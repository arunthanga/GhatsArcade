import { describe, expect, it } from "vitest";
import {
  followUpNoteSchema,
  leadCaptureSchema,
  leadStatusUpdateSchema,
} from "./index";

const validInquiry = {
  name: "Asha",
  phone: "+919876543210",
  buyerType: "resident_indian",
};

describe("leadCaptureSchema", () => {
  it("accepts a minimal valid inquiry", () => {
    expect(leadCaptureSchema.safeParse(validInquiry).success).toBe(true);
  });

  it("requires a name and phone", () => {
    expect(leadCaptureSchema.safeParse({ ...validInquiry, name: "" }).success).toBe(false);
    expect(leadCaptureSchema.safeParse({ ...validInquiry, phone: "" }).success).toBe(false);
  });

  it("rejects an unknown buyer type", () => {
    expect(leadCaptureSchema.safeParse({ ...validInquiry, buyerType: "alien" }).success).toBe(false);
  });

  it("passes the honeypot field through", () => {
    const parsed = leadCaptureSchema.parse({ ...validInquiry, company: "spam corp" });
    expect(parsed.company).toBe("spam corp");
  });
});

describe("leadStatusUpdateSchema", () => {
  it("accepts a known status and rejects others", () => {
    expect(leadStatusUpdateSchema.parse({ status: "contacted" }).status).toBe("contacted");
    expect(leadStatusUpdateSchema.safeParse({ status: "sleeping" }).success).toBe(false);
  });
});

describe("followUpNoteSchema", () => {
  it("requires note text and defaults the contact method to call", () => {
    const parsed = followUpNoteSchema.parse({ noteText: "Called, will visit Saturday." });
    expect(parsed.contactMethod).toBe("call");
  });

  it("rejects an empty note and an unknown contact method", () => {
    expect(followUpNoteSchema.safeParse({ noteText: "" }).success).toBe(false);
    expect(
      followUpNoteSchema.safeParse({ noteText: "hi", contactMethod: "telepathy" }).success,
    ).toBe(false);
  });
});
