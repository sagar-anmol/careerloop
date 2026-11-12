"use client";

import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { fetchEntitlement } from "@/lib/payments/entitlement";
import type { PlanKey } from "@/lib/payments/upi";

interface MuiTrialExpiredGateProps {
  /** When the 7-day trial lapsed (ISO string), shown to the candidate. */
  expiresAt: string | null;
  /** Opens the UPI checkout for the chosen upgrade plan. */
  onUpgrade: (plan: PlanKey) => void;
  /** Called when the hold lifts (a fresh UTR was submitted → pending verification). */
  onRelease: () => void;
  onSignOut: () => void | Promise<void>;
}

const UPGRADE_PLANS: Array<{
  plan: PlanKey;
  name: string;
  price: string;
  blurb: string;
  color: string;
}> = [
  {
    plan: "pro_all_access",
    name: "Pro All-Access Pass",
    price: "₹4,999",
    blurb: "Full weekly mock series, automated analytics, resume curation and HR referrals.",
    color: "#10b981",
  },
  {
    plan: "mentorship_1on1",
    name: "1-on-1 Intensive Mentorship",
    price: "₹8,999",
    blurb: "Everything in Pro plus dedicated senior-industry mock interviews and placement advisory.",
    color: "#d97706",
  },
];

const KEPT_PERKS = [
  "Your account, profile and trial record stay safe",
  "Resume Diagnostic Checklist",
  "Community Q&A and Knowledge Base",
];

/**
 * Full-screen hold shown at sign-in when the 7-day Starter Trial has lapsed
 * and no new payment is awaiting verification. The account is flagged by the
 * computed entitlement (payment_orders is the single source of truth — nothing
 * is deleted). Not dismissible: upgrade or sign out.
 *
 * Self-releases: listens for the `careerloop:payment-utr-submitted` event
 * fired by the UPI checkout and re-checks — a fresh UTR switches my-status to
 * `pendingVerification`, which is not a hold.
 */
export function MuiTrialExpiredGate({ expiresAt, onUpgrade, onRelease, onSignOut }: MuiTrialExpiredGateProps) {
  const [rechecking, setRechecking] = useState(false);

  const recheck = useCallback(async () => {
    setRechecking(true);
    try {
      const status = await fetchEntitlement();
      if (!status.held) onRelease();
    } finally {
      setRechecking(false);
    }
  }, [onRelease]);

  useEffect(() => {
    window.addEventListener("careerloop:payment-utr-submitted", recheck);
    return () => window.removeEventListener("careerloop:payment-utr-submitted", recheck);
  }, [recheck]);

  const expiryLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <Dialog open fullScreen slotProps={{ paper: { sx: { bgcolor: "#f8fafc" } } }}>
      <Box
        sx={{
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 560, textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "rgba(180, 83, 9, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <LockIcon sx={{ fontSize: 30, color: "#b45309" }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Your 7-day Starter Trial has ended
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            {expiryLabel ? `Your trial expired on ${expiryLabel}. ` : ""}
            Sign-in is held until you pick a plan below — your account and trial
            record remain untouched.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
            {UPGRADE_PLANS.map((p) => (
              <Paper
                key={p.plan}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  borderColor: p.color,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {p.name}
                    </Typography>
                    <Chip label={p.price} size="small" sx={{ fontWeight: 800, fontSize: "0.7rem", bgcolor: `${p.color}1a`, color: p.color }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.4, display: "block" }}>
                    {p.blurb}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onUpgrade(p.plan)}
                  sx={{ bgcolor: p.color, fontWeight: 700, whiteSpace: "nowrap", "&:hover": { bgcolor: p.color, filter: "brightness(0.92)" } }}
                >
                  Pay via UPI
                </Button>
              </Paper>
            ))}
          </Box>

          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
            Pay via UPI and enter the UTR from your receipt — the hold lifts
            immediately and your enrollment activates once the team verifies it
            (usually within 24–48 hours).
          </Typography>

          <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.04em", display: "block", mb: 1 }}>
              STILL INCLUDED WITH YOUR ACCOUNT:
            </Typography>
            {KEPT_PERKS.map((perk) => (
              <Box key={perk} sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, mb: 0.5 }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: "success.main" }} />
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {perk}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            variant="text"
            color="inherit"
            size="small"
            onClick={onSignOut}
            disabled={rechecking}
            sx={{ mt: 2 }}
          >
            {rechecking ? <CircularProgress size={16} /> : "Sign out"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
