/**
 * Single source of truth for the facts that appear in all three legal
 * documents. Fill these in once, publish, and set DRAFT to false.
 *
 * Nothing here is secret — these values are printed on the public pages.
 */
export const LEGAL_META = {
  brand: "CareerLoop",
  product: "CareerLoop Pro",
  website: "https://www.careerloop.co.in",
  supportEmail: "support@careerloop.co.in",
  paymentEmail: "mail@m.careerloop.co.in",
  senderEmail: "hello@m.careerloop.co.in",

  /**
   * Placeholders. The renderer highlights anything wrapped in [SQUARE
   * BRACKETS] so a draft can never pass for a published document by accident.
   */
  entityName: "CareerLoop",
  registeredOffice: "Sonpur, Bihar, India",
  jurisdictionCity: "Patna, Bihar",
  effectiveDate: "14 November 2026",
  grievanceOfficerName: "Mirnal Kishore",
  grievanceOfficerDesignation: "Grievance Officer",
  grievanceOfficerEmail: "mirnal@careerloop.co.in",
  grievanceOfficerAddress: "c/o CareerLoop, Sonpur, Bihar, India",

  lastUpdated: "14 November 2026",
  version: "1.0",
  /** flip to false only after every placeholder above is replaced */
  draft: false,
} as const;

export const LEGAL_LINKS = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund & Cancellation" },
  { href: "/privacy-policy", label: "Privacy Policy" },
] as const;
