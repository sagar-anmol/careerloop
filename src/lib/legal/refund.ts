import { LEGAL_META as M } from "./meta";
import type { LegalDocumentData } from "./types";

export const refundDocument: LegalDocumentData = {
  slug: "/refund-policy",
  title: "Refund and Cancellation Policy",
  shortTitle: "Refund & Cancellation",
  version: M.version,
  lastUpdated: M.lastUpdated,
  effectiveDate: M.effectiveDate,
  draft: M.draft,
  intro: [
    `This Refund and Cancellation Policy ("Policy") explains the terms governing refunds and payment reversals for purchases made on ${M.website} through ${M.entityName} ("Company", "we", "us").`,
    "All passes are single, one-time payments for immediate digital services. Because there is no recurring billing or automatic renewal, there are no ongoing subscriptions to cancel.",
  ],
  sections: [
    {
      id: "general-policy",
      number: "1",
      heading: "General Policy & Nature of Fees",
      blocks: [
        {
          t: "p",
          text: "Fees paid for CareerLoop passes cover instant digital access to mock assessments, resume curation, and mentorship prep. Once an account is activated, payments are generally non-refundable.",
        },
        {
          t: "clause",
          text: "Every Plan is a one-time purchase in Indian Rupees (INR) with no auto-renewal mandate. Access begins immediately upon cryptographic payment verification by our servers.",
        },
        {
          t: "clause",
          text: "Once a plan is activated, fees are non-refundable for change of mind, personal scheduling conflicts, partial usage, or dissatisfaction with test scores, rankings, or feedback.",
        },
        {
          t: "clause",
          text: "Fees are strictly non-refundable on the basis of placement or interview outcomes. Referral assistance and interview scheduling are complimentary, best-efforts benefits and are never guaranteed employment deliverables.",
        },
      ],
    },
    {
      id: "failed-payments",
      number: "2",
      heading: "Failed & Unverified Payments",
      blocks: [
        {
          t: "p",
          text: "If a transaction is declined or fails at PayU, no account is created, and temporary bank holds are automatically reversed.",
        },
        {
          t: "clause",
          text: "Where your bank or UPI app debits funds for a transaction that fails or cannot be verified by our servers, the amount is automatically reversed by PayU and your banking partner within five (5) to seven (7) business days.",
        },
        {
          t: "clause",
          text: `You do not need to file a formal claim for automated bank reversals. If funds have not returned after seven (7) business days, contact our billing desk at ${M.paymentEmail} with your transaction reference (txnid).`,
        },
      ],
    },
    {
      id: "eligible-exceptions",
      number: "3",
      heading: "Eligible Exceptions for Refund",
      blocks: [
        {
          t: "p",
          text: "We issue full or proportionate refunds under verified operational exceptions.",
        },
        {
          t: "clause",
          text: "Payment Captured but Account Unactivated: In rare events where a payment is verified by PayU but automated account creation fails (such as an existing account conflict), the Company will, at your choice within seven (7) days, either manually activate your plan or refund the full amount.",
        },
        {
          t: "clause",
          text: "Duplicate Charges: If technical delays result in multiple successful charges for the same order reference, the excess charge will be refunded in full upon gateway verification.",
        },
        {
          t: "clause",
          text: "Company Service Default: If a core deliverable specified in your plan is unavailable due to platform default and remains uncured for ten (10) days after written notification, you may request a proportionate or full refund.",
        },
      ],
    },
    {
      id: "how-to-request",
      number: "4",
      heading: "How to Request a Refund & Timelines",
      blocks: [
        {
          t: "p",
          text: "Submit refund requests via email to ensure prompt tracking and audit reconciliation.",
        },
        {
          t: "clause",
          text: `To request an exception refund, email ${M.paymentEmail} (or ${M.supportEmail}) with the subject line "Refund Request: [Your txnid]".`,
        },
        {
          t: "clause",
          text: "Please provide: (a) full registered name, email, and mobile number; (b) order transaction reference (txnid); (c) plan purchased and amount; (d) payment method used (last 4 digits of card or UPI ID, omitting PIN); and (e) a clear explanation with supporting receipts or screenshots.",
        },
        {
          t: "clause",
          text: "Acknowledgment is provided within 48 hours. Decisions are communicated within seven (7) business days. Approved refunds are initiated back to the original payment source within seven (7) business days of approval.",
        },
      ],
    },
    {
      id: "statutory-escalation",
      number: "5",
      heading: "Statutory Rights, Escalation & Contact",
      blocks: [
        {
          t: "p",
          text: "Your consumer protections under Indian law remain fully preserved.",
        },
        {
          t: "clause",
          text: "Nothing in this Policy limits statutory rights available under the Consumer Protection Act, 2019 or the Consumer Protection (E-Commerce) Rules, 2020.",
        },
        {
          t: "clause",
          text: `Unresolved billing escalations may be directed to our Grievance Officer, ${M.grievanceOfficerName}, at ${M.grievanceOfficerEmail}, with guaranteed acknowledgment within 48 hours.`,
        },
        {
          t: "clause",
          text: `Operating Entity: ${M.entityName}, ${M.registeredOffice}. Support: ${M.supportEmail} | Payments: ${M.paymentEmail}.`,
        },
      ],
    },
  ],
};
