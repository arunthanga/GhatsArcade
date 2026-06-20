import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LeadCaptureSuccess } from "./LeadCaptureSuccess";

describe("LeadCaptureSuccess", () => {
  it("shows the WhatsApp acknowledgement and calls onReset", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <LeadCaptureSuccess
        testId="lead-success"
        title="Enquiry received"
        resetLabel="Send another enquiry"
        onReset={onReset}
      />,
    );

    expect(screen.getByTestId("lead-success")).toBeInTheDocument();
    expect(screen.getByText("Enquiry received")).toBeInTheDocument();
    expect(screen.getByText("We'll contact you on WhatsApp within 24 hours.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Send another enquiry" }));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
