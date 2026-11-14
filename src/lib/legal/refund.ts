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
    `This Refund and Cancellation Policy ("Policy") explains when and how Fees paid to ${M.entityName} ("Company", "we", "us") for CareerLoop Plans may be refunded.`,
    "Capitalised terms have the meaning given in the Terms and Conditions. This Policy forms part of the Terms and Conditions.",
  ],
  sections: [
    {
      id: "scope",
      number: "1",
      heading: "Scope and nature of Fees",
      blocks: [
        { t: "clause", text: "Every Plan is a one-time payment in Indian Rupees for digital preparation services. No Plan is a subscription, and no recurring payment mandate is created." },
        { t: "clause", text: "Because nothing recurs, there is no subscription to cancel and no cancellation charge applies." },
        { t: "clause", text: "Access begins immediately on verification of payment. The Services are digital and are made available at once, and this Policy is framed accordingly." },
      ],
    },
    {
      id: "failed-payments",
      number: "2",
      heading: "Failed, declined or unverified payments",
      blocks: [
        { t: "clause", text: "If a payment is declined or fails at the Payment Gateway, no account is created, no access begins and no Fee is due." },
        { t: "clause", text: "Where your bank or wallet shows a temporary debit for such a payment, the amount is ordinarily reversed automatically to the source account within five (5) to seven (7) business days. You are not required to apply for a refund." },
        { t: "clause", text: "The same position applies where the Company cannot verify a payment, for example because the amount returned by the Payment Gateway does not match the order or the response signature cannot be verified. The order is marked failed and no account is created." },
        { t: "clause", text: `If a reversal has not reached you within seven (7) business days, write to ${M.paymentEmail} with your transaction reference and the Company will trace the transaction with the Payment Gateway.` },
      ],
    },
    {
      id: "not-activated",
      number: "3",
      heading: "Payment received but Plan not activated",
      blocks: [
        { t: "clause", text: "In rare cases a payment is captured but the account or Plan cannot be activated, for example where another account with the same email address or mobile number came into existence between checkout and confirmation. You will be shown a message asking you to contact support with your transaction reference." },
        { t: "clause", text: "In such a case the Company will, within seven (7) business days of receiving your complete request and at your election where practicable, either (a) activate your Plan on an email address and mobile number that you validly nominate, or (b) refund the full amount paid to the original payment method." },
        { t: "clause", text: "The Company will not retain a payment for a Plan that it has not activated, unless you ask for activation." },
      ],
    },
    {
      id: "duplicate",
      number: "4",
      heading: "Duplicate or excess charges",
      blocks: [
        { t: "clause", text: "Where you have been charged more than once for the same order, or charged an amount greater than the Fee displayed at checkout, the Company will, after verification with the Payment Gateway, refund the excess amount in full." },
      ],
    },
    {
      id: "company-default",
      number: "5",
      heading: "Service not made available by reason of the Company's default",
      blocks: [
        { t: "clause", text: "If a Service included in your Plan is not made available because of a default on the Company's part, and the Company has not cured the default within ten (10) days of your written notice, you may request a refund of the Fee for the affected Plan." },
        { t: "clause", text: "The Company will consider each request in good faith and may grant a full or a proportionate refund, having regard to the extent to which the Services were actually made available and used." },
        { t: "clause", text: "Where a proportionate refund is approved, the Company will calculate it and communicate the basis together with its decision." },
      ],
    },
    {
      id: "non-refundable",
      number: "6",
      heading: "Circumstances in which Fees are not refundable",
      blocks: [
        { t: "clause", text: "Once a Plan has been activated, the Fee is non-refundable where the request is based on change of mind, personal circumstances, non-use or partial use of the Services, completion of fewer Assessments than anticipated, or dissatisfaction with scores, rankings, feedback or the style of mentorship." },
        { t: "clause", text: "The Fee is not refundable on the ground that you have not received interview calls, referrals, an offer of employment or any other employment outcome. Referral Assistance and interview scheduling are complimentary, are provided on a best-efforts basis and are not guaranteed." },
        { t: "clause", text: "The Fee is not refundable where access is suspended or terminated for breach of the Terms, including Assessment misconduct, impersonation or the submission of false information." },
        { t: "clause", text: "Nothing in this section overrides any right that cannot be excluded under applicable consumer law." },
      ],
    },
    {
      id: "plans",
      number: "7",
      heading: "One-time Plans, including the Starter Practice Pass",
      blocks: [
        { t: "clause", text: "The Starter Practice Pass (₹999) is a paid, one-time Plan that provides access to the Services described in Annexure A of the Terms and Conditions. It is not a free trial. No Plan currently has a fixed expiry date." },
        { t: "clause", text: "The Fee for the Starter Practice Pass, and for every other Plan, is non-refundable once activated, and is not credited against the Fee of any other Plan." },
      ],
    },
    {
      id: "upgrades",
      number: "8",
      heading: "Upgrades and absence of proration",
      blocks: [
        { t: "clause", text: "If you purchase a higher or different Plan, the full Fee of that Plan is payable. The Company does not give credit, set-off, proration or a part-refund for any Plan previously purchased." },
      ],
    },
    {
      id: "how-to-request",
      number: "9",
      heading: "How to request a refund",
      blocks: [
        { t: "clause", text: `Send an email to ${M.supportEmail} or, for payment matters, ${M.paymentEmail}, with the subject line "Refund Request: [Transaction Reference]".` },
        { t: "clause", text: "Please include: (a) your full name, registered email address and mobile number; (b) the Company transaction reference (txnid) and, if available, the Payment Gateway reference; (c) the Plan and amount; (d) the date and time of payment; (e) the payment method and the last four digits or UPI handle used, without disclosing any full card number or PIN; (f) a clear description of the reason for the request; and (g) supporting screenshots or bank statement entries." },
        { t: "clause", text: "The Company may ask for further information to verify your identity and the transaction. Delay in providing it extends the time taken to decide." },
      ],
    },
    {
      id: "timelines",
      number: "10",
      heading: "Acknowledgement, decision and timelines",
      blocks: [
        { t: "clause", text: "The Company will acknowledge a request within forty-eight (48) hours of receiving it." },
        { t: "clause", text: "The Company will communicate its decision, with reasons if the request is declined, within seven (7) business days of receiving a complete request." },
        { t: "clause", text: "An approved refund will be initiated within seven (7) business days of the decision. Overall, the Company aims to resolve every request within one (1) month of receipt." },
      ],
    },
    {
      id: "mode",
      number: "11",
      heading: "Mode and timing of refund",
      blocks: [
        { t: "clause", text: "Refunds are made only to the original payment method used for the transaction, through the Payment Gateway. The Company does not refund in cash or to a different instrument or account." },
        { t: "clause", text: "After the Company initiates a refund, banks, card networks and wallet providers may take additional business days to show the credit. These periods are outside the Company's control." },
        { t: "clause", text: "Where the original instrument is closed or unusable, the Company will, on receiving proof of the closure, take reasonable steps with the Payment Gateway to complete the refund." },
      ],
    },
    {
      id: "taxes",
      number: "12",
      heading: "Taxes and invoices",
      blocks: [
        { t: "clause", text: "Where a refund is made, any tax charged on the Fee is refunded in proportion, and any tax document will be adjusted as required by law." },
        { t: "clause", text: `For a receipt or a tax-related request, write to ${M.paymentEmail} quoting your transaction reference.` },
      ],
    },
    {
      id: "chargebacks",
      number: "13",
      heading: "Chargebacks and payment disputes",
      blocks: [
        { t: "clause", text: "Please contact the Company before initiating a chargeback or dispute with your bank, so that the problem can be resolved quickly." },
        { t: "clause", text: "The Company may contest a chargeback by providing the Payment Gateway and your bank with the order record, verification record, access logs and correspondence relating to the transaction." },
      ],
    },
    {
      id: "fraud",
      number: "14",
      heading: "Fraud and misuse",
      blocks: [
        { t: "clause", text: "The Company may decline a refund and may suspend access where it reasonably suspects fraud, abuse of this Policy, use of an unauthorised payment instrument or repeated claims arising from the same transaction." },
      ],
    },
    {
      id: "statutory",
      number: "15",
      heading: "Statutory rights preserved",
      blocks: [
        { t: "clause", text: "Nothing in this Policy limits any right you have under the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020 or any other law that cannot be excluded by agreement." },
      ],
    },
    {
      id: "escalation",
      number: "16",
      heading: "Escalation",
      blocks: [
        { t: "clause", text: `If you are dissatisfied with the response of the support team, you may escalate to the Grievance Officer, ${M.grievanceOfficerName}, at ${M.grievanceOfficerEmail}, who will acknowledge within forty-eight (48) hours and endeavour to resolve within one (1) month.` },
        { t: "clause", text: "You may also approach the National Consumer Helpline (toll-free 1915) or the appropriate Consumer Disputes Redressal Commission." },
      ],
    },
    {
      id: "amendments",
      number: "17",
      heading: "Amendments and contact",
      blocks: [
        { t: "clause", text: "The Company may amend this Policy. The version in force on the date of your payment applies to that payment." },
        { t: "clause", text: `Contact: ${M.supportEmail}; ${M.paymentEmail}. Registered office: ${M.registeredOffice}.` },
      ],
    },
  ],
};
