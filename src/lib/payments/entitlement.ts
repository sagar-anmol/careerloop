import { supabase } from "@/lib/supabaseClient";

/**
 * Client-side entitlement check for the 7-day Starter Trial hold.
 *
 * Asks `/api/payment/my-status` (single source of truth: the payment_orders
 * table — the "flag" is computed there, never stored twice) and boils it down
 * to one question: should sign-in be held?
 *
 *   held = trialExpired AND NOT pendingVerification
 *
 * The moment the candidate submits a fresh UTR the hold releases (the team
 * still verifies it — the red banner takes over until then). On any network
 * or server error we do NOT hold: an outage must never lock people out.
 */
export interface EntitlementStatus {
  /** true → render the upgrade gate and hold navigation into the dashboard. */
  held: boolean;
  pendingVerification: boolean;
  trialExpired: boolean;
  /** When the trial lapsed (ISO), for display in the gate. */
  expiresAt: string | null;
}

export async function fetchEntitlement(): Promise<EntitlementStatus> {
  const idle: EntitlementStatus = {
    held: false,
    pendingVerification: false,
    trialExpired: false,
    expiresAt: null,
  };
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return idle;

    const res = await fetch("/api/payment/my-status", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return idle;

    const json = (await res.json()) as {
      pendingVerification?: boolean;
      trialExpired?: boolean;
      trial?: { expiresAt?: string | null } | null;
    };
    const pendingVerification = Boolean(json.pendingVerification);
    const trialExpired = Boolean(json.trialExpired);
    return {
      held: trialExpired && !pendingVerification,
      pendingVerification,
      trialExpired,
      expiresAt: json.trial?.expiresAt ?? null,
    };
  } catch {
    return idle;
  }
}
