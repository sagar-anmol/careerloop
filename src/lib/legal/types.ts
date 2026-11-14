/**
 * Shared types for the published legal documents (Terms, Refund Policy,
 * Privacy Policy). Content lives in `src/lib/legal/*.ts` as plain data so the
 * three pages share one accessible, printable renderer.
 */

export type LegalBlock =
  | { t: "p"; text: string }
  | { t: "clause"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "defs"; items: Array<{ term: string; text: string }> }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "h3"; text: string }
  | { t: "note"; text: string };

export interface LegalSection {
  /** stable anchor id (used for the table of contents) */
  id: string;
  /** "1", "2", … or "A" for annexures */
  number: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocumentData {
  slug: string;
  /** full document title */
  title: string;
  /** short label used in cross-links and the table of contents header */
  shortTitle: string;
  version: string;
  lastUpdated: string;
  effectiveDate: string;
  /** true → render the amber "draft, pending legal review" notice */
  draft: boolean;
  intro: string[];
  sections: LegalSection[];
}
