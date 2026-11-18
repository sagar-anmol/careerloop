"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUpgradeOptions, startPayuUpgradeCheckout } from "@/lib/candidateService";
import type { UpgradeOptions } from "@/lib/candidateService";

function formatAmount(amountInr: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(amountInr)}`;
}

/**
 * The candidate's own plan, and the only upgrade door the dashboard has:
 * buy a higher tier straight from here (full plan fee, nothing credited —
 * Refund Policy §8). Prices and the current plan both come from the server
 * (`/api/payment/upgrade-options`) so the browser never sets a price.
 *
 * The button is inert unless the console is signed in: the checkout needs the
 * Supabase access token.
 */
export function PlanCard() {
  const [data, setData] = useState<UpgradeOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyPlan, setBusyPlan] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchUpgradeOptions());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load your plans.";
      setError(/Sign in/i.test(message) ? "Sign in to see your plan." : message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleUpgrade = async (plan: string) => {
    setBusyPlan(plan);
    setError(null);
    try {
      // Never returns on success: the browser is POSTed to PayU's hosted page.
      await startPayuUpgradeCheckout(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setBusyPlan(null);
      await load();
    }
  };

  const upgrades = data?.upgrades ?? [];

  return (
    <Card className="border-slate-200 shadow-none bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Your Plan</CardTitle>
            <CardDescription className="mt-1">
              Every plan is one-time and never expires. Move up whenever you like.
            </CardDescription>
          </div>
          {loading ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              <BadgeCheck className="w-3.5 h-3.5" />
              {data?.current ? data.current.name : "No paid plan yet"}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <span>{error}</span>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => void load()}>
              Retry
            </Button>
          </div>
        )}

        {loading && (
          <p className="text-xs text-slate-400">
            Checking which pass you own…
          </p>
        )}

        {!loading && upgrades.length === 0 && (
          <p className="text-xs text-slate-500">
            You are on the highest plan — there is nothing higher to move up to.
          </p>
        )}

        {upgrades.map((option) => (
          <div
            key={option.plan}
            className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-0.5">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
                {option.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatAmount(option.amountInr)} one-time · everything in your current plan, plus the
                pass itself
              </p>
            </div>
            <Button
              size="sm"
              className="h-9 shrink-0 bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
              disabled={busyPlan !== null}
              onClick={() => void handleUpgrade(option.plan)}
            >
              {busyPlan === option.plan ? (
                <>
                  <Loader2 className="mr-1.5 w-3.5 h-3.5 animate-spin" />
                  Opening PayU…
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 w-3.5 h-3.5" />
                  Upgrade · {formatAmount(option.amountInr)}
                </>
              )}
            </Button>
          </div>
        ))}

        {!loading && upgrades.length > 0 && (
          <p className="text-[11px] leading-relaxed text-slate-400">
            You pay the full price of the plan you choose — earlier purchases are not credited or
            prorated.{" "}
            <Link href="/refund-policy" className="text-blue-600 underline hover:text-blue-700">
              Refund & Cancellation Policy §8
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}