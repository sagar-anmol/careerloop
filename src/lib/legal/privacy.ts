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
    `This Privacy Policy and Notice ("Policy") applies to the processing of personal data collected when you visit ${M.website}, register for an account, take Assessments, pay for a Plan, communicate with us or otherwise use the Services described in the Terms and Conditions.`,
    "It explains who we are, which personal data we collect, for what purposes and on what lawful ground we use it, with whom we share it, how long we keep it, how we protect it, and what rights you have and how to exercise them.",
    "This Policy is published under the Digital Personal Data Protection Act, 2023 (\"DPDP Act\"), the Information Technology Act, 2000 and the rules made under them. It is intended to serve as the notice that accompanies a request for consent.",
  ],
  sections: [
    {
      id: "definitions",
      number: "1",
      heading: "Definitions",
      blocks: [
        {
          t: "defs",
          items: [
            { term: "Data Fiduciary", text: "the person who alone or together with others determines the purpose and means of processing personal data. For this Policy, the Company." },
            { term: "Data Principal", text: "the individual to whom personal data relates. For this Policy, you." },
            { term: "Data Processor", text: "a person who processes personal data on behalf of a Data Fiduciary, including the service providers listed in Annexure C." },
          ],
        },
        { t: "p", text: "Other capitalised terms have the meaning given in the DPDP Act or, if not defined there, in the Terms and Conditions." },
      ],
    },
    {
      id: "about",
      number: "2",
      heading: "About CareerLoop (the Data Fiduciary)",
      blocks: [
        { t: "clause", text: `${M.entityName}, having its registered office at ${M.registeredOffice} ("Company", "we", "us"), processes your personal data in accordance with this Policy.` },
        { t: "clause", text: "Except as stated in this Policy, the Company is the Data Fiduciary for the personal data you give us. Employers and HR agencies that receive your Dossier with your consent become independent Data Fiduciaries for their own processing." },
        { t: "clause", text: `For data protection matters, write to the Grievance Officer, ${M.grievanceOfficerName}, at ${M.grievanceOfficerEmail}, or to ${M.supportEmail}.` },
      ],
    },
    {
      id: "visitors",
      number: "3",
      heading: "Website visitors",
      blocks: [
        { t: "h3", text: "What personal data do we collect?" },
        { t: "p", text: "When you visit the Website, we collect technical information about your device, your browser and the way you navigate the content, such as:" },
        {
          t: "ul",
          items: [
            "the Internet Protocol (IP) address of your device",
            "browser type and version, operating system and device type",
            "screen resolution and preferred language",
            "the date and time of access",
            "the pages you visit, the links you click and the website from which you reached us",
            "events and interactions recorded by analytics tags, subject to the cookies section of this Policy",
            "whatever you type into the AI chat assistant on the landing page",
          ],
        },
        { t: "h3", text: "Why do we need your personal data?" },
        {
          t: "ul",
          items: [
            "to operate, secure and administer the Website, and to diagnose and fix technical problems",
            "to analyse how the Website is used and to improve its content and design",
            "to respond to your enquiries made through support email or the chat assistant",
            "to detect and prevent abuse, fraud and unauthorised access",
          ],
        },
        { t: "h3", text: "Lawful ground" },
        { t: "p", text: "Analytics that are not strictly necessary are based on your consent. Operating and securing the Website is a legitimate use under section 7 of the DPDP Act and our legitimate interest in protecting our systems." },
      ],
    },
    {
      id: "candidates",
      number: "4",
      heading: "Candidate (registered user)",
      blocks: [
        { t: "h3", text: "What personal data do we collect about you?" },
        {
          t: "defs",
          items: [
            { term: "Identification and contact information", text: "full name, email address (verified by OTP), ten-digit Indian mobile number, and password, which is stored only as a cryptographic hash by our authentication provider." },
            { term: "Professional and profile information", text: "career domain, years of experience, city, resume (PDF) and file name, and the Plan you selected." },
            { term: "Photograph and integrity data", text: "one still webcam photograph captured at enrolment; the result of browser-based face detection (whether a single face was present and aligned); integrity indicators for each Assessment attempt, such as counts of face and look-away events; and device and browser information sent by your browser with an attempt. We do not record or store video, do not record your screen, do not use a live human proctor and do not create or store a biometric template." },
            { term: "Assessment and performance information", text: "Assessments and sets attempted with start, submission and duration times; your selected answer to each question, mark-for-review and visited flags, and time spent per question; scores, correct, incorrect and unattempted counts, section-wise scores and status; and the demo orientation completion record." },
            { term: "Payment and order information", text: "Plan, amount and order status; the Company's transaction reference and the Payment Gateway's payment reference; gateway status or error message; and the payment verification time. We do not receive or store your card number, UPI PIN or bank credentials." },
            { term: "Security and verification information", text: "OTP challenge records (email, hashed code, send counts, timestamps, attempt counts and verification timestamps) and server logs including IP address and request details." },
            { term: "Temporary checkout record", text: "between the start of checkout and confirmation of payment, the details you entered at signup (including the password you chose, your photograph and your resume) are held in a pending-payment record. The record is cleared when payment succeeds, fails or is replaced by a newer attempt." },
            { term: "Information you choose to share", text: "any other personal data contained in your resume or messages to us." },
          ],
        },
        { t: "h3", text: "What we do not collect" },
        { t: "p", text: "We do not ask for Aadhaar, PAN, bank account numbers, government identity documents, health information, caste, religion, or criminal or credit records. Please do not include these in your resume or messages unless you accept that they will be stored with your Dossier." },
        { t: "h3", text: "From where do we obtain your data?" },
        { t: "p", text: "We obtain your personal data directly from you and from your browser and device. We also generate data about you, for example Assessment scores and integrity indicators. We do not purchase personal data from third parties." },
      ],
    },
    {
      id: "purposes",
      number: "5",
      heading: "Why we process your personal data: purposes and lawful grounds",
      blocks: [
        { t: "p", text: "The Company processes personal data only for the purposes below, on the ground stated against each. \"Consent\" means your free, specific, informed, unconditional and unambiguous consent given by a clear affirmative action under section 6 of the DPDP Act. \"Legitimate use\" means a use permitted by section 7 of the DPDP Act." },
        {
          t: "table",
          head: ["Purpose", "Lawful ground"],
          rows: [
            ["To register you, verify your email address, create and secure your account and prevent duplicate or abusive registrations", "Consent; legitimate use (security and prevention of fraud)"],
            ["To process your payment, verify it with the Payment Gateway, grant access and keep a record of the transaction", "Consent; legitimate use (compliance with law and performance of the contract you requested)"],
            ["To deliver Assessments, score them, show your history and results, and protect Assessment integrity through photograph, face detection and integrity indicators", "Consent"],
            ["To provide mentorship, resume curation and Dossier management", "Consent"],
            ["To share your Dossier with employers and HR agencies for Referral Assistance, where your Plan includes it", "Consent"],
            ["To send transactional emails (OTPs, account and payment messages) and respond to support requests", "Legitimate use; consent"],
            ["To understand and improve use of the Website", "Consent for non-essential analytics"],
            ["To detect, investigate and prevent fraud, misuse and Assessment misconduct, to protect the Company's legal interests and to establish, exercise or defend legal claims", "Legitimate use; compliance with law"],
            ["To comply with legal, tax, accounting and regulatory obligations and to respond to lawful requests of public authorities", "Legitimate use (legal obligation)"],
          ],
        },
        { t: "p", text: "We do not sell your personal data, and we do not use it for purposes incompatible with those listed above." },
        { t: "p", text: "We do not currently send marketing or promotional email. If the Company introduces it, a separate, optional consent and a purpose entry will be added to this Policy first." },
      ],
    },
    {
      id: "consent",
      number: "6",
      heading: "Consent: how it is given and how it may be withdrawn",
      blocks: [
        { t: "clause", text: "At signup you are asked to tick a box titled \"Data Processing & Terms Consent\", which records your consent to the processing of your proctoring data and Assessment scores and to the matters described in this Policy." },
        { t: "clause", text: "Consent is required for the core Services. If you do not consent, we cannot create your account or deliver Assessments." },
        { t: "clause", text: `You may withdraw your consent at any time by writing to ${M.supportEmail}. Withdrawal is as easy as giving consent.` },
        { t: "clause", text: "Withdrawal does not affect the lawfulness of processing done on the basis of consent before withdrawal. Withdrawal of consent to processing necessary for the Services will result in closure of your account and loss of access without refund, except as provided in the Refund and Cancellation Policy." },
      ],
    },
    {
      id: "photo",
      number: "7",
      heading: "Photograph, face detection and Assessment integrity",
      blocks: [
        { t: "clause", text: "At enrolment, you are asked to capture one live photograph through your webcam. Browser-based face detection checks that one face is present and aligned. The photograph is stored with your profile." },
        { t: "clause", text: "During an Assessment, integrity indicators (for example, counts of face and look-away events) and device or browser information are recorded for the attempt." },
        { t: "clause", text: "These data are used to protect the integrity of Assessments and to detect impersonation. At present no automatic penalty is applied on the basis of them alone." },
        { t: "clause", text: "The Company may review integrity indicators and ask you for an explanation before taking any action. Any action is subject to the Terms and Conditions, and you may contest it through the grievance process." },
      ],
    },
    {
      id: "automated",
      number: "8",
      heading: "Automated processing and scoring",
      blocks: [
        { t: "clause", text: "Assessments are scored automatically by the Company's servers using pre-set answer keys and negative marking. Scores are indicative and for preparation only." },
        { t: "clause", text: "The Company does not make any decision that produces legal effects for you, or that similarly significantly affects you, solely by automated means. Integrity indicators alone do not lead to any penalty." },
        { t: "clause", text: `You may write to ${M.supportEmail} to request a manual review of a score you believe is wrong. The Company will review the request and respond within thirty (30) days.` },
      ],
    },
    {
      id: "payment",
      number: "9",
      heading: "Payment data",
      blocks: [
        { t: "clause", text: "Payments are made on the Payment Gateway's hosted page. The Company shares with the Payment Gateway your name, email address, mobile number, the amount, the product name and the Company's transaction reference, so that the payment can be processed and reconciled." },
        { t: "clause", text: "The Payment Gateway collects your card, UPI, net banking or wallet details directly and acts as an independent processor of that information. The Company receives only a payment reference and status." },
        { t: "clause", text: "Payment requests and responses are digitally signed using SHA-512 with a secret key held only on the Company's server, and each response is independently verified through the Payment Gateway's verification service." },
      ],
    },
    {
      id: "sharing",
      number: "10",
      heading: "Who we share your personal data with",
      blocks: [
        { t: "clause", text: "Your personal data may be shared with: (a) Data Processors engaged by the Company, listed in Annexure C, who process it only on our documented instructions and for the purposes of the Services; (b) employers and HR agencies, only where your Plan includes Referral Assistance and you have consented; (c) any person or authority, including a government department or body, with a lawful entitlement to obtain the information, or where disclosure is required by law, court order or to protect the rights, property or safety of the Company, its users or the public; and (d) a successor to the Company's business in the event of a merger, acquisition, reorganisation or sale of assets, subject to the successor honouring this Policy." },
        { t: "clause", text: "We require our Data Processors to implement appropriate security safeguards and to process personal data only on our instructions." },
        { t: "clause", text: "A public WhatsApp channel is linked from the landing page. The Website sends no data to WhatsApp. If you choose to follow the link, WhatsApp's own terms and privacy policy apply." },
      ],
    },
    {
      id: "referrals",
      number: "11",
      heading: "Employers and HR agencies (Referral Assistance)",
      blocks: [
        { t: "clause", text: "Where your Plan includes Referral Assistance, and subject to your consent, the Company may disclose your Dossier to HR agencies and employers in its network. The Dossier may contain your name, contact details, domain, experience, city, photograph, resume and Assessment results." },
        { t: "clause", text: "Each recipient is an independent Data Fiduciary and handles your data under its own privacy policy. The Company does not control its further use." },
        { t: "clause", text: "You may ask us to stop sharing your Dossier at any time. We cannot recall data already disclosed, but we will ask recipients to delete it where practicable." },
      ],
    },
    {
      id: "transfers",
      number: "12",
      heading: "Transfers outside India",
      blocks: [
        { t: "clause", text: "Some of our Data Processors, such as providers of cloud hosting, database, email delivery and analytics, may store or process your personal data on servers located outside India." },
        { t: "clause", text: "We transfer personal data outside India only to the extent permitted by section 16 of the DPDP Act and any restriction notified by the Central Government." },
      ],
    },
    {
      id: "cookies",
      number: "13",
      heading: "Cookies and device storage",
      blocks: [
        { t: "clause", text: "Cookies are small text files saved on your device when you visit a website. CareerLoop itself sets no first-party cookies." },
        { t: "clause", text: "The Website stores the following in your browser's local storage: (a) a cached copy of your candidate profile (including name, email, phone number, links to your photograph and resume, domain and city), and (b) session tokens that keep you signed in. These remain until you sign out, clear your browser data or they expire." },
        { t: "clause", text: "Google Tag Manager tags and the third-party chat assistant may set cookies or use local storage of their own, depending on how they are configured. You can control cookies through your browser settings. Blocking them may affect parts of the Website." },
        { t: "clause", text: "Cached profile data in local storage is accessible to anyone who uses the same browser profile. Please sign out on shared devices." },
      ],
    },
    {
      id: "retention",
      number: "14",
      heading: "How long do we keep your personal data?",
      blocks: [
        { t: "clause", text: "We keep personal data only for as long as needed for the purpose for which it was collected, or for as long as the law requires, and then erase it or cause it to be erased, as section 8(7) of the DPDP Act requires. Annexure B records the categories and current retention." },
        { t: "clause", text: "Payment and order records are retained as financial records for the period required by tax, accounting and other applicable laws." },
        { t: "clause", text: "We may retain data for longer where needed in connection with an actual or potential dispute, to establish, exercise or defend legal claims, in which case we retain it until the end of the dispute, or where we are required to do so by law." },
        { t: "clause", text: "Where processing rests on your consent, we will stop that processing when you withdraw consent, subject to the retention clauses above." },
      ],
    },
    {
      id: "security",
      number: "15",
      heading: "Reasonable security safeguards",
      blocks: [
        { t: "clause", text: "We implement reasonable technical and organisational safeguards to protect personal data against unauthorised access, disclosure, alteration, loss and destruction, including the following: (a) all traffic to the Website is encrypted in transit using TLS; (b) row-level security restricts each user's access to their own records, and payment, assessment and OTP tables deny direct access from the browser; (c) privileged service keys are used only on the server and are never exposed to the browser; (d) passwords are stored only as hashes by the authentication provider; (e) OTP codes are stored only as peppered hashes and each verified code creates one account; (f) Assessment answer keys never reach the browser; and (g) payment signatures are generated and verified on the server." },
        { t: "clause", text: "No method of transmission or storage is completely secure, and we cannot guarantee absolute security. If you believe your account has been compromised, write to us immediately." },
      ],
    },
    {
      id: "breach",
      number: "16",
      heading: "Personal data breach",
      blocks: [
        { t: "clause", text: "In the event of a personal data breach affecting you, the Company will notify the Data Protection Board of India and you, in the form and within the time prescribed by the DPDP Act and the rules made under it." },
      ],
    },
    {
      id: "children",
      number: "17",
      heading: "Children",
      blocks: [
        { t: "clause", text: "The Services are intended only for individuals aged eighteen (18) years and above. We do not knowingly process the personal data of a child." },
        { t: "clause", text: "If you believe that a child has provided personal data to us, please write to us and we will delete it." },
      ],
    },
    {
      id: "rights",
      number: "18",
      heading: "Your rights as a Data Principal",
      blocks: [
        { t: "p", text: "You have the following rights regarding your personal data. These rights are subject to the conditions and exceptions in the DPDP Act and the rules made under it." },
        {
          t: "defs",
          items: [
            { term: "Right to be informed", text: "the right to clear, transparent and understandable information about how we use your personal data and your rights. This Policy is provided for that purpose." },
            { term: "Right of access", text: "you may ask for a summary of the personal data we process about you and the processing activities undertaken, the identities of the other Data Fiduciaries and Data Processors with whom we have shared it, a description of the personal data shared, and other information related to you and its processing as prescribed." },
            { term: "Right to correction and completion", text: "if your personal data is inaccurate, misleading or incomplete, you may ask us to correct, complete or update it. You can already edit your name, contact details and resume from your dashboard." },
            { term: "Right to erasure", text: "you may ask us to erase your personal data. This is not an absolute right. We will erase the data unless its retention is necessary for the purpose for which it was collected or for compliance with law, for example payment and tax records, or for a legal claim." },
            { term: "Right to withdraw consent", text: "where processing is based on your consent, you may withdraw it at any time, as explained in section 6." },
            { term: "Right to grievance redressal", text: "you have a right to readily available means of grievance redressal in respect of any act or omission of the Company regarding the performance of its obligations in relation to your personal data or the exercise of your rights. See section 19." },
            { term: "Right to nominate", text: `you may nominate any other individual who shall, in the event of your death or incapacity, exercise your rights on your behalf. To nominate, write to ${M.supportEmail} with the nominee's name and contact details.` },
          ],
        },
        { t: "p", text: "We will handle your requests with care so that your rights can be exercised effectively. We may ask for proof of identity to make sure that we are not disclosing your data to anyone other than you. In particular cases, for instance where the law requires us to retain data, we may not be able to give effect to a request immediately or in full. In every case we will tell you what action we have taken and, if we decline, why." },
      ],
    },
    {
      id: "grievance",
      number: "19",
      heading: "Grievance redressal mechanism",
      blocks: [
        { t: "clause", text: `Level 1: write to ${M.supportEmail} with the subject "Privacy Request" or "Privacy Complaint".` },
        { t: "clause", text: `Level 2: if you are not satisfied or do not receive a response, write to the Grievance Officer, ${M.grievanceOfficerName}, at ${M.grievanceOfficerEmail} (Annexure E). We will acknowledge within forty-eight (48) hours and endeavour to resolve within the period prescribed under the DPDP Rules, which in any event shall not exceed thirty (30) days.` },
        { t: "clause", text: "Level 3: if your grievance is not resolved or you are not satisfied with the outcome, you may make a complaint to the Data Protection Board of India under the DPDP Act, after exhausting the redressal mechanism above." },
        { t: "clause", text: "The Company will not retaliate against any person who raises a good-faith concern." },
      ],
    },
    {
      id: "exercise-rights",
      number: "20",
      heading: "How to exercise your rights: contact us",
      blocks: [
        { t: "clause", text: `To exercise any right, write from your registered email address to ${M.supportEmail} or to the Grievance Officer at ${M.grievanceOfficerEmail}, stating the right you wish to exercise and the details needed to identify your account.` },
        { t: "clause", text: "We aim to respond within thirty (30) days." },
        { t: "clause", text: `Registered office: ${M.registeredOffice}.` },
      ],
    },
    {
      id: "duties",
      number: "21",
      heading: "Your duties as a Data Principal",
      blocks: [
        { t: "clause", text: "As the DPDP Act requires, you must comply with all applicable laws, must not impersonate another person, must not suppress any material information when providing personal data, must not register a false or frivolous grievance or complaint, and must furnish only verifiably authentic information when exercising your rights." },
      ],
    },
    {
      id: "communications",
      number: "22",
      heading: "Communications",
      blocks: [
        { t: "clause", text: "We send you transactional emails that are necessary for the Services, such as OTPs and account or payment messages. You cannot opt out of these while your account is active." },
        { t: "clause", text: `Emails are delivered by our email service provider from ${M.senderEmail}. If you reply, your reply is received at ${M.paymentEmail}.` },
      ],
    },
    {
      id: "third-party-sites",
      number: "23",
      heading: "Third-party websites",
      blocks: [
        { t: "clause", text: "The Website may contain links to third-party services. This Policy does not apply to them and we are not responsible for their privacy practices." },
      ],
    },
    {
      id: "changes",
      number: "24",
      heading: "Changes to this Policy",
      blocks: [
        { t: "clause", text: "We may update this Policy to reflect changes in the Services or the law. The date of the latest update and the version appear at the end. Where a change is material, we will notify you on the Website or by email and, where the law requires, seek fresh consent." },
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
            ["Account identity (name, email, phone, password hash)", "Authentication service", "Login and account identity", "Until account deletion or as required by law"],
            ["Candidate profile (domain, experience, city, resume, photograph, scores, status, integrity flags, plan route)", "Candidates table and file storage", "Dossier, Assessments, Referral Assistance", "Until account deletion or as required by law"],
            ["Assessment attempts and responses", "Exam attempts and responses tables", "Delivery, scoring and history", "While the account is active, then erased or anonymised unless needed for a legal claim"],
            ["Demo completion", "Demo completions table", "Gate before scored tests", "While the account is active"],
            ["Email OTP challenge records", "OTP table", "Email verification and abuse limits", "For the period needed for verification and abuse prevention, after which they are deleted"],
            ["Payment orders (plan, amount, status, references, timestamps)", "Payment orders table", "Payment record and access control", "As required by tax and accounting law"],
            ["Temporary signup payload", "Payment orders table", "Hold signup data between checkout and payment confirmation", "Cleared on success, failure or supersession"],
            ["Browser cache (profile) and session tokens", "Your browser local storage", "Convenience and login persistence", "Until sign-out, clearing or expiry"],
            ["Server logs", "Hosting provider", "Operation, security and payment verification records", "As per the provider's configuration and our security needs"],
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
            ["Supabase", "Database, authentication and file storage", "All application data"],
            ["Vercel", "Website hosting and serverless functions", "Request metadata, IP addresses and server logs, including payment transaction reference and status"],
            ["PayU India", "Payment processing and hosted checkout", "Name, email, phone, amount, product name and transaction reference. Payment instrument data is collected directly by PayU"],
            ["Resend", "Transactional email delivery", "Recipient email address and message content"],
            ["Ethora", "AI chat assistant on the landing page", "Text entered by the visitor and technical data collected by the widget"],
            ["Google Tag Manager (container GTM-W7L22656)", "Tag management and analytics", "Page views, clicks, device and browser data, IP address"],
            ["Cloudflare", "DNS for careerloop.co.in only", "No end-user data beyond DNS resolution"],
            ["WhatsApp (Meta)", "Outbound link to a public announcement channel", "None sent by the Website"],
            ["Employers and HR agencies", "Referral Assistance (independent Data Fiduciaries)", "Dossier, with your consent"],
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
            { term: "Grievance Officer", text: `${M.grievanceOfficerName}, ${M.grievanceOfficerDesignation}. Email: ${M.grievanceOfficerEmail}. Postal address: ${M.grievanceOfficerAddress}.` },
          ],
        },
        {
          t: "table",
          head: ["Level", "Channel", "Acknowledgement", "Target resolution"],
          rows: [
            ["1", `${M.supportEmail} (payment matters: ${M.paymentEmail})`, "48 hours", "7 business days"],
            ["2", "Grievance Officer", "48 hours", "One month from receipt, and within 30 days for personal data complaints"],
            ["3", "Data Protection Board of India (personal data); Consumer Disputes Redressal Commission or National Consumer Helpline 1915 (consumer disputes)", "Not applicable", "As per the forum"],
          ],
        },
      ],
    },
  ],
};
