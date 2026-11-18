import { LEGAL_META as M } from "./meta";
import type { LegalDocumentData } from "./types";

export const privacyDocument: LegalDocumentData = {
  slug: "/privacy-policy",
  title: "Privacy Policy and Notice",
  shortTitle: "Privacy Policy",
  version: M.version,
  lastUpdated: M.lastUpdated,
  effectiveDate: M.effectiveDate,
  draft: M.draft,
  intro: [
    `This Privacy Policy and Notice ("Policy") applies to the processing of personal data collected when you visit ${M.website}, register an account, take Assessments, make payments, or interact with ${M.entityName} ("Company", "we", "us").`,
    "We process personal data in strict compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act), the Information Technology Act, 2000, and applicable data security regulations.",
    "This document explains which data we collect, why we need it, who we share it with, how we secure it, and how you can exercise your statutory rights as a Data Principal.",
  ],
  sections: [
    {
      id: "collection",
      number: "1",
      heading: "Data Collection & Categories",
      blocks: [
        {
          t: "p",
          text: "We collect personal data directly from you and generated automatically through your use of the platform.",
        },
        {
          t: "clause",
          text: "Account & Profile: Full name, email address (OTP verified), 10-digit Indian mobile number, password (stored only as a salted cryptographic hash by Supabase Auth), career domain, years of experience, city, and uploaded resume (PDF).",
        },
        {
          t: "clause",
          text: "Assessment & Proctoring Telemetry: Single webcam snapshot captured at enrolment; browser-based face presence detection indicators; mock attempt timestamps, answer selections, scores, and integrity indicators. We do not store live video, record screens, or maintain biometric facial templates.",
        },
        {
          t: "clause",
          text: "Billing Records: Selected plan, order reference (txnid), PayU payment reference, verification status, and timestamp. Payment credentials (card numbers, UPI PINs, bank details) are processed directly by PayU and are never collected or stored by CareerLoop.",
        },
        {
          t: "clause",
          text: "We do not request or store sensitive government identity identifiers such as Aadhaar, PAN, caste, religion, or financial account balances.",
        },
      ],
    },
    {
      id: "purposes-grounds",
      number: "2",
      heading: "Purposes & Lawful Grounds of Processing",
      blocks: [
        {
          t: "p",
          text: "Processing is conducted with your consent and under legitimate operational grounds recognised by the DPDP Act.",
        },
        {
          t: "clause",
          text: "Service Delivery: Administering mock tests, scoring answers server-side with negative marking, delivering performance insights, conducting live mentorship sessions, and curating resumes.",
        },
        {
          t: "clause",
          text: "Referral Assistance: Compiling candidate scores and curated resumes into verified dossiers to introduce to hiring partner employers and HR networks upon candidate consent.",
        },
        {
          t: "clause",
          text: "Platform Integrity & Security: Enforcing single-account rules, rate-limiting OTP challenges, detecting duplicate registrations, preventing exam fraud, and fulfilling accounting compliance.",
        },
      ],
    },
    {
      id: "sharing-processors",
      number: "3",
      heading: "Data Sharing & Third-Party Processors",
      blocks: [
        {
          t: "p",
          text: "We share data only with verified technical infrastructure providers and consenting employer networks.",
        },
        {
          t: "clause",
          text: "Technical Sub-Processors: Cloud infrastructure and databases (Supabase), serverless edge hosting (Vercel), payment gateway (PayU India), and transactional email delivery (Resend). All sub-processors are bound by strict data processing confidentiality obligations.",
        },
        {
          t: "clause",
          text: "HR Networks & Employers: When you enroll and opt in to Referral Assistance, we share your candidate dossier (resume, domain, city, verified mock scores) with corporate recruiters and HR partner agencies. Employers act as independent Data Fiduciaries upon receiving your dossier.",
        },
        {
          t: "clause",
          text: "We do not sell, rent, or trade your personal data to advertising brokers or unsolicited third-party marketing services.",
        },
      ],
    },
    {
      id: "storage-security-retention",
      number: "4",
      heading: "Storage, Security & Data Retention",
      blocks: [
        {
          t: "p",
          text: "Data is protected with end-to-end encryption in transit and granular server-side access controls.",
        },
        {
          t: "clause",
          text: "Security Measures: All communications are encrypted via HTTPS (TLS). Database access uses Row-Level Security (RLS). Sensitive authentication tokens and OTP challenges use salted cryptographic hashing.",
        },
        {
          t: "clause",
          text: "Retention Schedule: Active candidate profiles and assessment records are maintained to support ongoing referral dispatch and re-attempts during platform operation. Accounting and payment records are retained as required under Indian tax statutes.",
        },
        {
          t: "clause",
          text: "Temporary checkout data held during payment initiation is permanently wiped immediately upon payment verification or cancellation.",
        },
      ],
    },
    {
      id: "rights-grievance",
      number: "5",
      heading: "Candidate Rights & Grievance Redressal",
      blocks: [
        {
          t: "p",
          text: "Under the DPDP Act 2023, you enjoy statutory rights regarding your personal information.",
        },
        {
          t: "clause",
          text: "Your Rights: You may request a summary of personal data held, request correction of inaccurate profile data, or request account deletion by emailing our support desk.",
        },
        {
          t: "clause",
          text: `Grievance Redressal: If you have queries or complaints regarding data processing, contact our Grievance Officer, ${M.grievanceOfficerName}, at ${M.grievanceOfficerEmail}. Formal acknowledgments are provided within 48 hours, and resolutions are targeted within 30 days.`,
        },
        {
          t: "clause",
          text: "If a grievance remains unresolved after exhausting our internal redressal mechanism, you may escalate to the Data Protection Board of India.",
        },
      ],
    },
    {
      id: "annexure-b",
      number: "B",
      heading: "Annexure B — Personal data inventory and retention",
      blocks: [
        {
          t: "table",
          head: ["Data category", "Where it is held", "Purpose", "Retention"],
          rows: [
            ["Account identity (name, email, phone, password hash)", "Authentication service", "Login and account identity", "Until account deletion or statutory requirement"],
            ["Candidate profile (domain, experience, city, resume, photo, scores, integrity flags)", "Candidates database & secure storage", "Dossier curation, Assessments, Referral Assistance", "While account remains active or until requested deletion"],
            ["Assessment attempts & answer logs", "Exam responses tables", "Delivery, automated scoring, performance history", "While account is active; anonymised thereafter"],
            ["Demo completion record", "Demo completions table", "Pre-requisite gate before scored tests", "While account is active"],
            ["Email OTP challenge records", "OTP challenge table", "Email verification & anti-abuse rate limits", "Temporary verification window; purged periodically"],
            ["Payment orders (plan, amount, status, txnid)", "Payment orders table", "Order fulfillment & accounting records", "Maintained as required by Indian tax statutes"],
            ["Temporary checkout payload", "Payment staging record", "Stage signup details during PayU checkout", "Cleared upon payment confirmation or timeout"],
            ["Client session tokens", "Browser local storage", "Secure session continuity", "Cleared on sign-out or session expiry"],
          ],
        },
      ],
    },
    {
      id: "annexure-c",
      number: "C",
      heading: "Annexure C — Data Processors and third parties",
      blocks: [
        {
          t: "table",
          head: ["Provider", "Function", "Data involved"],
          rows: [
            ["Supabase", "Cloud database, authentication, and file storage", "Application candidate records & encrypted credentials"],
            ["Vercel", "Web hosting and serverless execution", "HTTP traffic, IP addresses, application server logs"],
            ["PayU India", "Payment gateway checkout partner", "Name, email, mobile, transaction amount, order txnid"],
            ["Resend", "Transactional email delivery", "Recipient email address and verification OTP messages"],
            ["Ethora", "Embedded landing assistant", "Direct queries submitted by visitors to the chat widget"],
            ["Google Tag Manager", "Website analytics & performance tags", "Anonymised page views, interactions, device telemetry"],
            ["Cloudflare", "Authoritative DNS resolution", "DNS queries only (no user data proxy)"],
            ["Partner Employers & HR Agencies", "Referral Assistance & hiring consideration", "Candidate dossier (curated resume, domain, mock scores) with consent"],
          ],
        },
      ],
    },
    {
      id: "annexure-e",
      number: "E",
      heading: "Annexure E — Grievance Officer and response timelines",
      blocks: [
        {
          t: "defs",
          items: [
            { term: "Grievance Officer", text: `${M.grievanceOfficerName}, ${M.grievanceOfficerDesignation}. Email: ${M.grievanceOfficerEmail}. Address: ${M.grievanceOfficerAddress}.` },
          ],
        },
        {
          t: "table",
          head: ["Level", "Channel", "Acknowledgement", "Target resolution"],
          rows: [
            ["1", `Support Desk: ${M.supportEmail} (Billing: ${M.paymentEmail})`, "48 hours", "7 business days"],
            ["2", `Grievance Officer: ${M.grievanceOfficerEmail}`, "48 hours", "Within 30 calendar days"],
            ["3", "Data Protection Board of India / Consumer Disputes Redressal Commission", "External", "In accordance with statutory procedures"],
          ],
        },
      ],
    },
  ],
};
