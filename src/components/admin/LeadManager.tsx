"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUYER_TYPE_LABELS, CONTACT_METHODS, LEAD_STATUSES, type BuyerType } from "@/types";
import { LeadStatusBadge } from "./LeadStatusBadge";

export type AdminLeadNote = {
  id: string;
  noteText: string;
  contactMethod: string;
  authorName: string;
  createdAt: string;
};

export type AdminLeadRow = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  buyerType: string;
  leadType: string;
  status: string;
  projectInterest: string | null;
  plotInterest: string | null;
  preferredDate: string | null;
  sourceTitle: string | null;
  notes: AdminLeadNote[];
};

const LEAD_TYPE_LABEL: Record<string, string> = {
  inquiry: "Inquiry",
  site_visit_request: "Site visit",
  callback: "Callback",
  lead_magnet_download: "Guide download",
};

export function LeadManager({ initialLeads }: { initialLeads: AdminLeadRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, { text: string; method: string }>>({});

  function draftFor(id: string) {
    return noteDrafts[id] ?? { text: "", method: CONTACT_METHODS[0] };
  }

  async function changeStatus(id: string, status: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Status change rejected (check the allowed pipeline).");
      return;
    }
    router.refresh();
  }

  async function addNote(id: string) {
    const draft = draftFor(id);
    if (!draft.text.trim()) {
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/leads/${id}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ noteText: draft.text, contactMethod: draft.method }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not save the note.");
      return;
    }
    setNoteDrafts({ ...noteDrafts, [id]: { text: "", method: draft.method } });
    router.refresh();
  }

  return (
    <section data-testid="lead-manager">
      {error ? <p role="alert">{error}</p> : null}
      {initialLeads.length === 0 ? <p>No leads yet.</p> : null}

      {initialLeads.map((lead) => {
        const draft = draftFor(lead.id);
        return (
          <article key={lead.id} data-testid="lead-row">
            <h3>
              {lead.name} - {lead.phone}
              {lead.whatsapp ? ` (WhatsApp: ${lead.whatsapp})` : ""}
            </h3>
            <p>
              <strong>{LEAD_TYPE_LABEL[lead.leadType] ?? lead.leadType}</strong>
              {" - "}
              {BUYER_TYPE_LABELS[lead.buyerType as BuyerType] ?? lead.buyerType}
              {lead.email ? ` - ${lead.email}` : ""}
              {lead.sourceTitle ? ` - re: ${lead.sourceTitle}` : ""}
            </p>
            {lead.projectInterest || lead.plotInterest || lead.preferredDate ? (
              <p>
                {lead.projectInterest ? `Project: ${lead.projectInterest}. ` : ""}
                {lead.plotInterest ? `Plot: ${lead.plotInterest}. ` : ""}
                {lead.preferredDate ? `Preferred visit: ${lead.preferredDate}.` : ""}
              </p>
            ) : null}

            <LeadStatusBadge status={lead.status} />

            <label>
              Status
              <select
                value={lead.status}
                onChange={(e) => changeStatus(lead.id, e.target.value)}
                disabled={busy}
              >
                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <ul>
              {lead.notes.map((note) => (
                <li key={note.id}>
                  [{note.contactMethod}] {note.noteText} - {note.authorName}
                </li>
              ))}
            </ul>

            <div>
              <textarea
                placeholder="Add a follow-up note"
                value={draft.text}
                onChange={(e) =>
                  setNoteDrafts({ ...noteDrafts, [lead.id]: { ...draft, text: e.target.value } })
                }
              />
              <select
                value={draft.method}
                onChange={(e) =>
                  setNoteDrafts({ ...noteDrafts, [lead.id]: { ...draft, method: e.target.value } })
                }
              >
                {CONTACT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => addNote(lead.id)} disabled={busy}>
                Add note
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
