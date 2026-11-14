"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * Return page for a verified PayU payment (surl and furl both land on
 * /payment/callback, which 303s here). By this point the money is captured,
 * the order is 'completed' and — for signups — the account has been created.
 * This page only has to say that in human language and send the candidate
 * to sign in.
 */
function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get("txnid");

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
          <CheckCircleIcon sx={{ fontSize: 72, color: "#10b981", mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Payment received — you&apos;re in!
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
            Your payment via PayU was verified and your CareerLoop account is ready.
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Sign in with the email and password you used during enrollment.
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
              Go to CareerLoop
            </Button>
            <Typography variant="caption" sx={{ color: "text.secondary", maxWidth: 380 }}>
              Didn&apos;t get this far? Write to mail@m.careerloop.co.in with your transaction
              reference and we&apos;ll help.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessInner />
    </Suspense>
  );
}
