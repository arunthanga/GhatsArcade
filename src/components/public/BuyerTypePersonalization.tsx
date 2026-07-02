"use client";

import { useEffect, useState } from "react";
import { BUYER_TYPE_LABELS, BUYER_TYPES, type BuyerType } from "@/types";

// Lightweight, login-free buyer-type personalisation (prj.md-1). The visitor's chosen
// buyer type is kept in localStorage and broadcast to every mounted instance via a custom
// event, so the listings selector and the per-card trust snippets stay in sync without a
// global store. Everything degrades to the default (resident_indian) when nothing is set.

const STORAGE_KEY = "ga_buyer_type";
const CHANGE_EVENT = "ga:buyer-type";
const DEFAULT_BUYER_TYPE: BuyerType = "resident_indian";

function isBuyerType(value: unknown): value is BuyerType {
  return typeof value === "string" && (BUYER_TYPES as readonly string[]).includes(value);
}

function readStored(): BuyerType {
  if (typeof window === "undefined") {
    return DEFAULT_BUYER_TYPE;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isBuyerType(stored) ? stored : DEFAULT_BUYER_TYPE;
}

function useBuyerType(): [BuyerType, (next: BuyerType) => void] {
  // Start from the default so server and first client render match (no hydration warning);
  // the stored value is applied after mount.
  const [buyerType, setBuyerType] = useState<BuyerType>(DEFAULT_BUYER_TYPE);

  useEffect(() => {
    setBuyerType(readStored());
    const sync = () => setBuyerType(readStored());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = (next: BuyerType) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    setBuyerType(next);
  };

  return [buyerType, update];
}

// One-line reassurance tailored to the visitor's buyer type. Deliberately link-free so it
// can sit inside listing cards (which are already wrapped in a single detail link).
const TRUST_SNIPPETS: Record<BuyerType, string> = {
  resident_indian:
    "Clean-title farmland with a weekend home rhythm — visit when it matters while we manage the land.",
  nri: "Built for NRIs: remote follow-up on WhatsApp, trusted on-ground management, and clear title documents.",
  oci: "For OCI cardholders: the same remote management, with extra care on buyer-eligibility clarity.",
  foreign_citizen:
    "For foreign citizens: agri-land ownership needs an eligibility check first — we confirm what's possible before you commit.",
};

export function BuyerTrustSnippet({ className }: { className?: string }) {
  const [buyerType] = useBuyerType();
  return (
    <p className={`text-sm text-brand-700 ${className ?? ""}`} data-testid="buyer-trust-snippet">
      {TRUST_SNIPPETS[buyerType]}
    </p>
  );
}

export function BuyerTypeSelector({ className }: { className?: string }) {
  const [buyerType, setBuyerType] = useBuyerType();
  return (
    <fieldset className={`mt-4 ${className ?? ""}`}>
      <legend className="text-sm font-medium text-brand-800">I'm exploring as a…</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {BUYER_TYPES.map((type) => {
          const active = type === buyerType;
          return (
            <button
              key={type}
              type="button"
              aria-pressed={active}
              onClick={() => setBuyerType(type)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                active
                  ? "border-brand-700 bg-brand-700 text-brand-50"
                  : "border-brand-200 bg-white text-brand-700 hover:border-brand-400"
              }`}
            >
              {BUYER_TYPE_LABELS[type]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
