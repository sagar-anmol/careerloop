import type { Metadata } from "next";
import { LegalDocument } from "@/components/mui/LegalDocument";
import { privacyDocument } from "@/lib/legal/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | CareerLoop",
  description:
    "What personal data CareerLoop collects, why it is processed, who it is shared with, how long it is kept, and the rights you can exercise under the DPDP Act, 2023.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return <LegalDocument doc={privacyDocument} />;
}
