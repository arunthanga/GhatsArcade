// Transactional email via Resend's REST API (https://resend.com/docs/api-reference).
// Implemented with fetch (no SDK dependency) and designed to fail soft: a missing API
// key, missing recipient, or a Resend error never throws into the request path — the
// lead is already captured, the email is a best-effort nicety.

import { serverEnv } from "@/lib/env";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendEmailResult = { sent: boolean; reason?: string };

export type InquiryConfirmationInput = {
  to: string | null | undefined;
  name: string;
};

export async function sendInquiryConfirmationEmail(
  input: InquiryConfirmationInput,
): Promise<SendEmailResult> {
  const apiKey = serverEnv.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "no_api_key" };
  }
  const to = input.to?.trim();
  if (!to) {
    return { sent: false, reason: "no_recipient" };
  }

  const firstName = input.name.trim().split(/\s+/)[0] || "there";
  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for your enquiry with Ghats Arcade. We've received it and a member of our team",
    "will be in touch on WhatsApp within 24 hours.",
    "",
    "If it's urgent, just reply to this email and we'll get back to you.",
    "",
    "- The Ghats Arcade team",
  ].join("\n");

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: serverEnv.RESEND_FROM_EMAIL,
        to,
        subject: "We received your enquiry - Ghats Arcade",
        text,
      }),
      // Never let a slow email API hold up the (already-captured) lead response.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      return { sent: false, reason: `http_${res.status}` };
    }
    return { sent: true };
  } catch {
    return { sent: false, reason: "network_error" };
  }
}
