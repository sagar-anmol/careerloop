"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface PendingOrder {
  id: string;
  plan: string;
  amountInr: number;
  utr: string | null;
  submittedAt: string;
}

interface ExpiredTrial {
  plan: string;
  amountInr: number;
  expiresAt: string | null;
}

type BannerState =
  | { kind: "pendingVerification"; order: PendingOrder }
  | { kind: "trialExpired"; trial: ExpiredTrial }
  | null;

/**
 * Whole-site status strip at the very top of the page. Not dismissible.
 *
 *  - RED   `pendingVerification`: a UTR was submitted but not yet verified by
 *          the team — enrollment stays blocked until verification.
 *  - AMBER `trialExpired`: the 7-day Starter Trial lapsed (records persist in
 *          the DB; expiry is computed). Prompts an upgrade to a higher tier.
 *
 * Refreshes on mount, on auth changes, and on the
 * `careerloop:payment-utr-submitted` window event fired by the UPI modal.
 */
export function MuiPaymentPendingBanner() {
  const [state, setState] = useState<BannerState>(null);

  const check = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setState(null);
        return;
      }
      const res = await fetch("/api/payment/my-status", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) {
        setState(null);
        return;
      }
      if (!res.ok) return; // transient server error — keep last known state
      const json = (await res.json()) as {
        pendingVerification?: boolean;
        order?: PendingOrder;
        trialExpired?: boolean;
        trial?: ExpiredTrial;
      };
      if (json.pendingVerification && json.order) {
        setState({ kind: "pendingVerification", order: json.order });
      } else if (json.trialExpired && json.trial) {
        setState({ kind: "trialExpired", trial: json.trial });
      } else {
        setState(null);
      }
    } catch {
      /* network hiccup — keep last known state */
    }
  }, []);

  useEffect(() => {
    // Defer off the synchronous effect path so the fetch's setState can't
    // cascade a render inside mount.
    queueMicrotask(check);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => check());
    window.addEventListener("careerloop:payment-utr-submitted", check);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("careerloop:payment-utr-submitted", check);
    };
  }, [check]);

  if (!state) return null;

  if (state.kind === "trialExpired") {
    return (
      <div
        role="alert"
        style={{
          background: "#b45309",
          color: "#ffffff",
          padding: "8px 16px",
          fontSize: "13px",
          lineHeight: 1.45,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          textAlign: "center",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="1.8" />
          <path d="M12 7v5l3.2 2" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span>
          <strong>Your 7-day Starter Trial has ended.</strong> Your account and
          trial record remain — upgrade to Pro All-Access or 1-on-1 Mentorship
          to continue with full mock series, analytics and referrals.
        </span>
        <Link
          href="/#pricing"
          style={{
            color: "#ffffff",
            fontWeight: 700,
            textDecoration: "underline",
            whiteSpace: "nowrap",
          }}
        >
          Upgrade now →
        </Link>
      </div>
    );
  }

  const tail = state.order.utr ? state.order.utr.slice(-4) : "";

  return (
    <div
      role="alert"
      style={{
        background: "#b91c1c",
        color: "#ffffff",
        padding: "8px 16px",
        fontSize: "13px",
        lineHeight: 1.45,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        textAlign: "center",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M12 3 2.5 20.5h19L12 3Z"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 10v4.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="17.2" r="0.4" fill="#ffffff" stroke="#ffffff" strokeWidth="1.2" />
      </svg>
      <span>
        <strong>Payment pending verification.</strong>{" "}
        {tail ? <>UTR ending in ••••{tail} was recorded. </> : null}
        Your enrollment activates only after our team confirms it against the bank
        statement — usually within 24–48 hours.
      </span>
    </div>
  );
}
