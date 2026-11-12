"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { supabase } from "@/lib/supabaseClient";
import type { PlanKey } from "@/lib/payments/upi";

interface PlanView {
  plan: PlanKey;
  name: string;
  amountInr: number;
}

interface OrderView {
  id: string;
  plan: PlanKey;
  amountInr: number;
  status: "pending" | "completed" | "failed";
  utr: string | null;
}

interface CreateResponse {
  success?: boolean;
  order?: OrderView;
  payeeName?: string;
  upiUri?: string;
  qrUrl?: string;
  plans?: PlanView[];
  error?: string;
  code?: string;
}

interface MuiUpiPaymentModalProps {
  isOpen: boolean;
  plan: PlanKey;
  onClose: () => void;
  /** Fired after the UTR is accepted by the server (order still pending admin verification). */
  onSubmitted?: (order: OrderView) => void;
}

/**
 * UPI "scan & pay + enter UTR" flow.
 *
 * The price and payee come from POST /api/payment/create — never from the
 * client. The order is created server-side, the candidate pays from their
 * own UPI app, then submits the 12-digit bank UTR against that order.
 * The UPI id itself is deliberately never sent to the browser — the QR is
 * the only way to pay.
 */
export function MuiUpiPaymentModal({ isOpen, plan, onClose, onSubmitted }: MuiUpiPaymentModalProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderView | null>(null);
  const [payeeName, setPayeeName] = useState("");
  const [upiUri, setUpiUri] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [plans, setPlans] = useState<PlanView[]>([]);
  const [utr, setUtr] = useState("");
  const [done, setDone] = useState(false);

  // Create (or resume) the order once the modal mounts. The modal is mounted
  // per checkout from the parent, so each fresh open starts from clean state.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          if (!cancelled) {
            setError("Sign in again to pay.");
            setLoading(false);
          }
          return;
        }

        const res = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ plan }),
        });
        const json = (await res.json()) as CreateResponse;
        if (cancelled) return;

        if (!res.ok || !json.success || !json.order) {
          setError(json.error || "Could not start payment.");
          return;
        }
        setOrder(json.order);
        setPayeeName(json.payeeName || "");
        setUpiUri(json.upiUri || "");
        setQrUrl(json.qrUrl || "");
        setPlans(json.plans || []);
        setUtr(json.order.utr || "");
      } catch {
        if (!cancelled) setError("Could not start payment. Check your connection and try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, plan]);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.plan === plan) ?? null,
    [plans, plan]
  );

  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
    setUtr(digits);
    if (error) setError(null);
  };

  const handleSubmitUtr = async () => {
    if (!order) return;
    if (utr.length !== 12) {
      setError("UTR must be exactly 12 digits.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError("Sign in again to submit the UTR.");
        return;
      }
      const res = await fetch("/api/payment/submit-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: order.id, utr }),
      });
      const json = (await res.json()) as { success?: boolean; order?: OrderView; error?: string };
      if (!res.ok || !json.success || !json.order) {
        setError(json.error || "Could not submit the UTR.");
        return;
      }
      setOrder(json.order);
      setDone(true);
      // Let the whole-site pending-verification banner refresh immediately.
      window.dispatchEvent(new CustomEvent("careerloop:payment-utr-submitted"));
      onSubmitted?.(json.order);
    } catch {
      setError("Could not submit the UTR. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { bgcolor: "background.paper", borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <QrCodeIcon sx={{ color: "primary.main" }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Scan &amp; Pay via UPI
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {selectedPlan?.name || "CareerLoop enrollment"}
            </Typography>
          </Box>
        </Box>
        <IconButton aria-label="close" onClick={handleClose} size="small" disabled={submitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3, pt: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary">
              Preparing secure payment…
            </Typography>
          </Box>
        ) : error && !order ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : order ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Amount */}
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Amount payable
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main" }}>
                ₹{order.amountInr.toLocaleString("en-IN")}
              </Typography>
            </Box>

            {done ? (
              <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  UTR submitted — verification pending
                </Typography>
                <Typography variant="caption">
                  Your payment reference has been recorded. Your enrollment activates once the team verifies it.
                </Typography>
              </Alert>
            ) : (
              <>
                {/* QR */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 2,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  {qrUrl ? (
                    <Box
                      component="img"
                      src={qrUrl}
                      alt="UPI payment QR code"
                      sx={{ width: 220, height: 220, objectFit: "contain" }}
                    />
                  ) : (
                    <Box sx={{ width: 220, height: 220, display: "grid", placeItems: "center" }}>
                      <CircularProgress size={28} />
                    </Box>
                  )}
                </Box>

                {/* Payee name only — the UPI id is intentionally never shown */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Payee</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{payeeName}</Typography>
                  </Box>
                </Box>

                {/* Mobile deep link */}
                {upiUri && (
                  <Button
                    href={upiUri}
                    variant="outlined"
                    endIcon={<OpenInNewIcon />}
                    sx={{ display: { xs: "inline-flex", sm: "none" }, alignSelf: "center" }}
                  >
                    Open in UPI App
                  </Button>
                )}

                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                  Scan with any UPI app, pay exactly ₹{order.amountInr.toLocaleString("en-IN")}, then enter the 12-digit UTR from your receipt below.
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  label="12-digit UTR / Reference number"
                  value={utr}
                  onChange={handleUtrChange}
                  inputMode="numeric"
                  placeholder="e.g. 431234567890"
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Chip
                            size="small"
                            label={`${utr.length}/12`}
                            color={utr.length === 12 ? "success" : "default"}
                            variant="outlined"
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmitUtr}
                  disabled={submitting || utr.length !== 12}
                  startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                  {submitting ? "Submitting…" : "Submit UTR"}
                </Button>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                  <WarningAmberIcon sx={{ fontSize: 14, color: "warning.main", mt: 0.25 }} />
                  <Typography variant="caption" color="text.secondary">
                    Do not close this window before submitting the UTR. A wrong UTR delays verification.
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}