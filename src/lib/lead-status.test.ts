import { describe, expect, it } from "vitest";
import {
  canTransitionLeadStatus,
  isLeadStatus,
  isTerminalLeadStatus,
} from "./lead-status";

describe("isLeadStatus", () => {
  it("accepts known statuses, rejects others (fail-closed)", () => {
    expect(isLeadStatus("new")).toBe(true);
    expect(isLeadStatus("converted")).toBe(true);
    expect(isLeadStatus("NEW")).toBe(false);
    expect(isLeadStatus("")).toBe(false);
    expect(isLeadStatus(undefined)).toBe(false);
    expect(isLeadStatus(null)).toBe(false);
    expect(isLeadStatus(3)).toBe(false);
  });
});

describe("isTerminalLeadStatus", () => {
  it("is true only for converted and lost", () => {
    expect(isTerminalLeadStatus("converted")).toBe(true);
    expect(isTerminalLeadStatus("lost")).toBe(true);
    expect(isTerminalLeadStatus("new")).toBe(false);
    expect(isTerminalLeadStatus("negotiating")).toBe(false);
    expect(isTerminalLeadStatus("unknown")).toBe(false);
  });
});

describe("canTransitionLeadStatus", () => {
  it("walks the forward pipeline", () => {
    expect(canTransitionLeadStatus("new", "contacted")).toBe(true);
    expect(canTransitionLeadStatus("contacted", "negotiating")).toBe(true);
    expect(canTransitionLeadStatus("negotiating", "converted")).toBe(true);
  });

  it("allows lost from any non-terminal state", () => {
    expect(canTransitionLeadStatus("new", "lost")).toBe(true);
    expect(canTransitionLeadStatus("contacted", "lost")).toBe(true);
    expect(canTransitionLeadStatus("site_visit_requested", "lost")).toBe(true);
    expect(canTransitionLeadStatus("site_visit_scheduled", "lost")).toBe(true);
    expect(canTransitionLeadStatus("negotiating", "lost")).toBe(true);
  });

  it("routes a lead through a scheduled site visit", () => {
    expect(canTransitionLeadStatus("new", "site_visit_scheduled")).toBe(true);
    expect(canTransitionLeadStatus("contacted", "site_visit_requested")).toBe(true);
    expect(canTransitionLeadStatus("site_visit_requested", "site_visit_scheduled")).toBe(true);
    expect(canTransitionLeadStatus("site_visit_requested", "negotiating")).toBe(true);
    expect(canTransitionLeadStatus("site_visit_requested", "converted")).toBe(true);
    expect(canTransitionLeadStatus("contacted", "site_visit_scheduled")).toBe(true);
    expect(canTransitionLeadStatus("site_visit_scheduled", "negotiating")).toBe(true);
    expect(canTransitionLeadStatus("site_visit_scheduled", "converted")).toBe(true);
  });

  it("allows idempotent no-op", () => {
    expect(canTransitionLeadStatus("new", "new")).toBe(true);
    expect(canTransitionLeadStatus("converted", "converted")).toBe(true);
  });

  it("locks terminal states", () => {
    expect(canTransitionLeadStatus("converted", "negotiating")).toBe(false);
    expect(canTransitionLeadStatus("lost", "new")).toBe(false);
    expect(canTransitionLeadStatus("converted", "lost")).toBe(false);
  });

  it("rejects illegal jumps", () => {
    expect(canTransitionLeadStatus("new", "converted")).toBe(false);
    expect(canTransitionLeadStatus("new", "negotiating")).toBe(false);
    expect(canTransitionLeadStatus("new", "site_visit_requested")).toBe(false);
    expect(canTransitionLeadStatus("contacted", "converted")).toBe(false);
  });

  it("fails closed on unknown statuses", () => {
    expect(canTransitionLeadStatus("new", "archived")).toBe(false);
    expect(canTransitionLeadStatus("bogus", "contacted")).toBe(false);
    expect(canTransitionLeadStatus(undefined, undefined)).toBe(false);
  });
});
