import type { Metadata } from "next";
import { LegalDocument } from "@/components/mui/LegalDocument";
import { termsDocument } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions | CareerLoop",
  description:
    "The terms governing your use of CareerLoop — accounts, plans and fees, assessments, mentorship, referral assistance, liability and grievance redressal.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalDocument doc={termsDocument} />;
}
