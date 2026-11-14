import type { Metadata } from "next";
import { LegalDocument } from "@/components/mui/LegalDocument";
import { refundDocument } from "@/lib/legal/refund";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | CareerLoop",
  description:
    "When CareerLoop fees are refundable, how failed payments reverse, how to request a refund, and the timelines that apply.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return <LegalDocument doc={refundDocument} />;
}
