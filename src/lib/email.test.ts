import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mutable mock env so we can flip RESEND_API_KEY per test. email.ts reads it at call time.
vi.mock("@/lib/env", () => ({
  serverEnv: {
    RESEND_API_KEY: undefined as string | undefined,
    RESEND_FROM_EMAIL: "Ghats Arcade <test@example.com>",
  },
  publicEnv: {},
}));

import { serverEnv } from "@/lib/env";
import { sendInquiryConfirmationEmail } from "./email";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  serverEnv.RESEND_API_KEY = undefined;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sendInquiryConfirmationEmail", () => {
  it("no-ops when no API key is configured", async () => {
    const result = await sendInquiryConfirmationEmail({ to: "buyer@example.com", name: "Asha" });
    expect(result).toEqual({ sent: false, reason: "no_api_key" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("no-ops when there is no recipient", async () => {
    serverEnv.RESEND_API_KEY = "re_test";
    const result = await sendInquiryConfirmationEmail({ to: "  ", name: "Asha" });
    expect(result).toEqual({ sent: false, reason: "no_recipient" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to Resend and reports success", async () => {
    serverEnv.RESEND_API_KEY = "re_test";
    fetchMock.mockResolvedValue({ ok: true });
    const result = await sendInquiryConfirmationEmail({
      to: "buyer@example.com",
      name: "Asha Nair",
    });
    expect(result).toEqual({ sent: true });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    const body = JSON.parse(init.body);
    expect(body.to).toBe("buyer@example.com");
    expect(body.text).toContain("Hi Asha,");
  });

  it("fails soft on a Resend error response", async () => {
    serverEnv.RESEND_API_KEY = "re_test";
    fetchMock.mockResolvedValue({ ok: false, status: 422 });
    const result = await sendInquiryConfirmationEmail({ to: "buyer@example.com", name: "Asha" });
    expect(result).toEqual({ sent: false, reason: "http_422" });
  });

  it("fails soft when fetch throws", async () => {
    serverEnv.RESEND_API_KEY = "re_test";
    fetchMock.mockRejectedValue(new Error("network down"));
    const result = await sendInquiryConfirmationEmail({ to: "buyer@example.com", name: "Asha" });
    expect(result).toEqual({ sent: false, reason: "network_error" });
  });
});
