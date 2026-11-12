"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

/**
 * Return page for a failed / non-success / unfulfilled PayU payment.
 * No account was created for a declined payment. If money was captured but
 * account creation failed, the copy switches to a support-first message —
 * the order is kept on our side for reconciliation either way.
 */
const REASON_COPY: Record<string, { title: string; body: string }> = {
  declined: {
    title: "Payment did not go through",
    body: "PayU could not complete your payment — your bank has not charged you, or any debit will auto-reverse within 5–7 business days. No CareerLoop account has been created.",
  },
  verify_declined: {
    title: "Payment could not be confirmed",
    body: "PayU did not confirm this transaction as successful. If any amount was deducted, it will auto-reverse within 5–7 business days. No CareerLoop account has been created.",
  },
  amount: {
    title: "Payment amount mismatch",
    body: "The amount PayU confirmed does not match the plan selected, so we could not complete your enrollment. If money was deducted, it will auto-reverse within 5–7 business days.",
  },
  hash: {
    title: "Payment could not be verified",
    body: "The response from PayU failed verification, so no account was created. If any amount was deducted, it will auto-reverse within 5–7 business days.",
  },
  unknown_txn: {
    title: "We couldn't match this payment",
    body: "This transaction reference doesn't match a CareerLoop checkout we know about. If money was deducted, please write to us with the reference below and we'll reconcile it manually.",
  },
  account_exists: {
    title: "Payment received — action needed",
    body: "Your payment was captured, but a CareerLoop account with this email or mobile already exists, so we could not create a second one. Write to mail@m.careerloop.co.in with your reference and we'll link the payment to your existing account.",
  },
  account_failed: {
    title: "Payment received — action needed",
    body: "Your payment was captured but account creation hit an unexpected error. Write to mail@m.careerloop.co.in with your reference and we'll finish your enrollment manually.",
  },
  internal: {
    title: "Something went wrong on our side",
    body: "We hit an unexpected error while handling your payment. If money was deducted, write to mail@m.careerloop.co.in with your reference and we'll reconcile it.",
  },
  config: {
    title: "Payment is temporarily unavailable",
    body: "CareerLoop's payment service is not configured on this deployment. Nothing was charged. Please try again later.",
  },
};

const DEFAULT_COPY = {
  title: "Payment not completed",
  body: "Your payment did not complete. If money was deducted, it will auto-reverse within 5–7 business days. If that doesn't happen, write to mail@m.careerloop.co.in with your transaction reference.",
};

function PaymentFailedInner() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get("txnid");
  const reason = searchParams.get("reason") ?? "";
  const copy = REASON_COPY[reason] ?? DEFAULT_COPY;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f7fe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm" disableGutters>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <ErrorOutlinedIcon sx={{ fontSize: 72, color: "#ef4444", mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {copy.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            {copy.body}
          </Typography>

          {txnid && (
            <Typography
              variant="caption"
              sx={{
                display: "inline-block",
                fontFamily: "monospace",
                bgcolor: "#eef2ff",
                border: "1px solid #e0e7ff",
                borderRadius: 1.5,
                px: 1.5,
                py: 0.75,
                mb: 3,
                color: "#3730a3",
              }}
            >
              Transaction reference: {txnid}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              bgcolor: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 2,
              p: 1.5,
              mb: 3,
              textAlign: "left",
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 18, color: "#c2410c", mt: 0.2, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: "#7c2d12", lineHeight: 1.5 }}>
              If any amount was deducted, it is never held permanently — it auto-refunds within
              5–7 business days. Still stuck? Write to{" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                mail@m.careerloop.co.in
              </Box>{" "}
              with your PayU transaction ID.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center" }}>
            <Button
              component={Link}
              href="/"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#405FE2",
                fontWeight: 700,
                px: 4,
                "&:hover": { bgcolor: "#2843be" },
              }}
            >
              Back to CareerLoop
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <PaymentFailedInner />
    </Suspense>
  );
}
