import { LEGAL_META as M } from "./meta";
import type { LegalDocumentData } from "./types";

export const termsDocument: LegalDocumentData = {
  slug: "/terms",
  title: "Terms and Conditions of Use",
  shortTitle: "Terms & Conditions",
  version: M.version,
  lastUpdated: M.lastUpdated,
  effectiveDate: M.effectiveDate,
  draft: M.draft,
  intro: [
    `These Terms and Conditions ("Terms") are a legally binding agreement between you ("User", "you") and ${M.entityName}, the owner and operator of ${M.website} ("Company", "we", "us", "our"). They govern your access to and use of the website, the candidate dashboard, the assessment engine and all related services.`,
    "Please read them together with the Refund and Cancellation Policy and the Privacy Policy, each of which forms part of this agreement. By using the website or any service, you accept these Terms.",
    "These Terms are published in accordance with the Information Technology Act, 2000 and the rules made under it, and constitute an electronic record that does not require any physical, electronic or digital signature.",
  ],
  sections: [
    {
      id: "definitions",
      number: "1",
      heading: "Definitions and interpretation",
      blocks: [
        {
          t: "defs",
          items: [
            { term: "Assessment", text: "any mock test, demo orientation, set, section or exam delivered through the Website, including aptitude and reasoning, core or technical, English and comprehension, and mains exam categories." },
            { term: "Dossier", text: "the consolidated candidate profile maintained by the Company for a User, which may include name, contact details, career domain, experience, city, photograph, resume and Assessment results." },
            { term: "Fees", text: "the one-time amount in Indian Rupees payable for a Plan." },
            { term: "Payment Gateway", text: "PayU India, or any successor gateway notified by the Company, which hosts the checkout page and processes payments." },
            { term: "Plan", text: "a paid offering listed in Annexure A." },
            { term: "Referral Assistance", text: "complimentary, best-efforts introduction of a User's Dossier to employers and HR agencies in the Company's network." },
            { term: "Services", text: "the Assessments, mentorship, resume curation, Dossier management and Referral Assistance made available under a Plan through the Website." },
            { term: "User Content", text: "all information, photographs, files and other material you submit to the Website, including your resume." },
            { term: "Website", text: `${M.website} and all of its sub-domains and pages.` },
          ],
        },
        { t: "clause", text: "Headings are for convenience only and do not affect interpretation. The words \"include\" and \"including\" are to be read without limitation. A reference to a statute includes its amendments, re-enactments and any rules or notifications made under it." },
        { t: "clause", text: "Annexures A and D form part of these Terms." },
      ],
    },
    {
      id: "acceptance",
      number: "2",
      heading: "Acceptance of these Terms",
      blocks: [
        { t: "clause", text: "By accessing the Website, creating an account, making a payment or using any Service, you confirm that you have read, understood and agree to be bound by these Terms, the Refund and Cancellation Policy and the Privacy Policy." },
        { t: "clause", text: "If you do not agree with any part of these Terms, you must not use the Website or the Services." },
        { t: "clause", text: "At signup you are asked to tick a consent checkbox before payment. That action records your acceptance of these Terms and your consent to the processing described in the Privacy Policy." },
      ],
    },
    {
      id: "eligibility",
      number: "3",
      heading: "Eligibility and capacity",
      blocks: [
        { t: "clause", text: "The Services are offered only to individuals who are at least eighteen (18) years of age and competent to contract under the Indian Contract Act, 1872." },
        { t: "clause", text: "By registering, you represent and warrant that you meet this requirement and that all information you provide is true, accurate, current and complete." },
        { t: "clause", text: "The Company may suspend or terminate an account where it has reason to believe that this section has been breached." },
      ],
    },
    {
      id: "nature-of-services",
      number: "4",
      heading: "Nature of the Services and statutory disclosure",
      blocks: [
        { t: "clause", text: `${M.brand} is an independent career acceleration and skill preparation platform. It is not a government agency, a recruitment agency authorised to guarantee placement, or a guaranteed employment provider.` },
        { t: "clause", text: "The Fees are consideration for preparation Services only, namely mock testing, mentorship, resume curation and Dossier management, in each case as described for your Plan." },
        { t: "clause", text: "Referral Assistance, and assistance with interview scheduling, are complimentary benefits offered on a best-efforts basis. They are not a deliverable for which Fees are charged and they are not guaranteed." },
        { t: "clause", text: "The Company does not represent or warrant that you will receive any interview, job offer, placement, designation, salary or other employment outcome. Final hiring decisions and compensation rest solely with the respective employers." },
        { t: "clause", text: "Any reference on the Website to a number of HR agencies, employers or partners describes the extent of the Company's outreach network at the time of publication. It is not an assurance that any particular employer or agency will review, shortlist, interview or hire you." },
      ],
    },
    {
      id: "accounts",
      number: "5",
      heading: "Registration, account and security",
      blocks: [
        { t: "clause", text: "Registration requires your name, email address, a ten-digit Indian mobile number, a password, your career domain, experience and city. Your email address must be verified through a one-time password (OTP) sent to it." },
        { t: "clause", text: "OTPs are valid for ten (10) minutes, may be attempted a limited number of times, and may be requested only subject to resend and hourly limits. These limits prevent abuse and may change from time to time." },
        { t: "clause", text: "An account is created only after your payment has been verified by the Payment Gateway and by the Company's servers. If a payment fails, no account is created and no credentials are retained." },
        { t: "clause", text: "One account is permitted per email address and per ten-digit mobile number. Duplicate accounts will be refused." },
        { t: "clause", text: `You are solely responsible for maintaining the confidentiality of your password and for all activity under your account. Notify the Company immediately at ${M.supportEmail} if you become aware of unauthorised use.` },
        { t: "clause", text: "You must not share, sell, lease, transfer or permit any other person to use your account, and you must not take an Assessment on behalf of another person." },
      ],
    },
    {
      id: "plans-fees",
      number: "6",
      heading: "Plans, Fees and taxes",
      blocks: [
        { t: "clause", text: "The Plans and Fees in force on the date of these Terms are set out in Annexure A. The Fee displayed at checkout at the time of payment is the Fee that applies to that purchase." },
        { t: "clause", text: "All Fees are quoted in Indian Rupees. Every Plan is a single, one-time payment. There is no subscription, no automatic renewal and no recurring payment mandate." },
        { t: "clause", text: "The Company may revise Plans, Fees or the features included in a Plan at any time with prospective effect. A revision does not affect a purchase for which payment has already been verified." },
        { t: "clause", text: "No coupon, promotional code or discount is currently offered. If any is introduced, it will be subject to the conditions published with it." },
        { t: "clause", text: "Taxes, if applicable, are charged as required by law and are reflected in the amount shown at checkout." },
        { t: "clause", text: "If you move from one Plan to another, the new Plan is purchased at its full Fee. No credit, set-off or proration is applied for an earlier Plan." },
      ],
    },
    {
      id: "payments",
      number: "7",
      heading: "Payment processing",
      blocks: [
        { t: "clause", text: "Payments are made on the hosted checkout page of the Payment Gateway. Available payment methods are those the Payment Gateway makes available from time to time, such as UPI, debit and credit cards, net banking and wallets." },
        { t: "clause", text: "The Company does not receive, view or store your card number, UPI PIN, bank credentials or other payment instrument details. These are collected and processed by the Payment Gateway under its own terms and privacy policy." },
        { t: "clause", text: "Each checkout is signed by the Company's server using a cryptographic signature. On return from the Payment Gateway, the Company verifies the response signature and the amount, and confirms the transaction through the Payment Gateway's verification service. A payment is treated as completed only after these checks succeed." },
        { t: "clause", text: "You are responsible for ensuring that you are authorised to use the chosen payment method." },
        { t: "clause", text: "Any issue arising from a payment is governed by the Refund and Cancellation Policy." },
      ],
    },
    {
      id: "access",
      number: "8",
      heading: "Access and duration",
      blocks: [
        { t: "clause", text: "Your access starts when the Company's server records verification of your payment, and not when you begin signup." },
        { t: "clause", text: "Every Plan is a one-time purchase and no Plan currently carries a fixed expiry date. Access to the Services continues for as long as the Company operates them, subject to these Terms." },
        { t: "clause", text: "The Company may retire or replace an Assessment set, feature or Service. Where a Service included in your Plan is retired, the Company will provide a reasonable alternative within the Plan or apply the Refund and Cancellation Policy." },
        { t: "clause", text: "Access is personal and subject to fair use. The Company may apply reasonable technical limits to prevent abuse, including limits on automated access, scraping and simultaneous sessions." },
      ],
    },
    {
      id: "assessments",
      number: "9",
      heading: "Assessments: conduct rules and proctoring",
      blocks: [
        { t: "clause", text: "Before taking any scored Assessment, you must complete a short unscored demo orientation. This requirement is enforced by the Company's servers." },
        { t: "clause", text: "Each Assessment set may be attempted up to two (2) times. Each attempt is timed, and the deadline is enforced by the Company's servers subject to a short grace period of thirty (30) seconds. An attempt submitted after the deadline is scored from your last autosaved responses." },
        { t: "clause", text: "Scoring is performed on the Company's servers. Incorrect answers attract negative marking. The pass mark is forty per cent (40%) of the total marks. Results are released after submission." },
        { t: "clause", text: "To protect the integrity of Assessments, the Company (a) captures one still photograph of you through your webcam at enrolment, (b) applies browser-based face detection to check that a single face is present and aligned, and (c) records integrity indicators and device or browser information for each attempt." },
        { t: "clause", text: "The Company does not use a live human proctor, does not record or store video, does not record your screen and does not create or store a biometric template. Only the captured still photograph is stored." },
        { t: "clause", text: "You must attempt every Assessment personally and without assistance from any other person, device, tool, website or answer source. You must not copy, record, scrape, circulate, leak or tamper with questions, answer keys, timers, scoring logic or the Assessment interface." },
        { t: "clause", text: "Question content and answer keys are the confidential and proprietary information of the Company." },
        { t: "clause", text: "The Company may review integrity indicators. Where it concludes on a reasonable basis that an attempt was not taken in accordance with these rules, it may void the result and, in serious or repeated cases, suspend the account. You may contest such a decision by writing to the grievance contact in section 26." },
      ],
    },
    {
      id: "mentorship",
      number: "10",
      heading: "Mentorship and resume curation",
      blocks: [
        { t: "clause", text: "Mentorship, including live mentorship sessions, and resume curation are provided in the manner and to the extent described for your Plan in Annexure A and on the pricing page at the time of purchase." },
        { t: "clause", text: "Advice, feedback and suggestions given by mentors or through the Website are for guidance and preparation only. You remain solely responsible for your career decisions and for the accuracy of your resume." },
        { t: "clause", text: "Mentors are required to treat your information as confidential, and you must not record a mentorship session without the prior written consent of the Company." },
      ],
    },
    {
      id: "referrals",
      number: "11",
      heading: "Dossier management and Referral Assistance",
      blocks: [
        { t: "clause", text: "Where your Plan includes Referral Assistance, the Company may, with your consent, share your Dossier with HR agencies and employers in its network for the purpose of introducing you for suitable openings. Referral Assistance is complimentary and is included in every Plan." },
        { t: "clause", text: "Referral Assistance is provided on a best-efforts basis. The Company does not control, and is not responsible for, whether any employer or agency contacts you, schedules an interview, extends an offer or negotiates compensation." },
        { t: "clause", text: "Employers and HR agencies are independent third parties who determine the purposes and means of their own processing and are responsible for their own handling of your data." },
        { t: "clause", text: `You may ask the Company at any time to stop sharing your Dossier by writing to ${M.supportEmail}. This will not affect disclosures already made.` },
      ],
    },
    {
      id: "user-content",
      number: "12",
      heading: "User Content and licence",
      blocks: [
        { t: "clause", text: "You retain all rights in your User Content." },
        { t: "clause", text: "You grant the Company a non-exclusive, royalty-free, worldwide licence, revocable subject to the next clause, to host, store, reproduce, process, display and, where you have consented, disclose your User Content solely to provide the Services to you and to comply with law." },
        { t: "clause", text: "You represent and warrant that (a) you own or are authorised to submit the User Content, (b) it is accurate and not misleading, (c) it does not infringe the rights of any person, and (d) it does not contain unlawful, defamatory, obscene or malicious material." },
        { t: "clause", text: "The licence ends when your User Content is deleted from the Website, except for copies the Company is required by law to retain and copies already disclosed to third parties with your consent." },
      ],
    },
    {
      id: "prohibited-conduct",
      number: "13",
      heading: "Prohibited conduct",
      blocks: [
        { t: "clause", text: "You must not: (a) provide false information or impersonate any person; (b) upload a photograph of any person other than yourself; (c) upload viruses, malware or code intended to damage or interfere with the Website; (d) attempt to gain unauthorised access to any account, system, database or network; (e) probe, scan or test the vulnerability of the Website; (f) use bots, scrapers or automated means to access the Website; (g) bypass timers, attempt limits, the demo requirement or any other control; (h) resell, sublicense, publish or distribute Assessment content, mentorship material or other proprietary content; (i) use the Services for any unlawful purpose; or (j) harass, abuse or threaten any mentor, staff member or other User." },
        { t: "clause", text: "The Company may remove content, restrict access and report unlawful activity to the appropriate authorities." },
      ],
    },
    {
      id: "ip",
      number: "14",
      heading: "Intellectual property rights",
      blocks: [
        { t: "clause", text: "All intellectual property rights in the Website and the Services, including software, source code, design, layout, text, graphics, logos, trade names, question banks, answer keys, scoring methodologies and mentorship material, are owned by or licensed to the Company." },
        { t: "clause", text: "Subject to these Terms, the Company grants you a limited, personal, non-exclusive, non-transferable and revocable licence to access and use the Services for your own career preparation. No other right is granted." },
        { t: "clause", text: "No part of the Website or the Services may be reproduced, transmitted, stored in any other website or retrieval system, or disseminated in any form without the prior written permission of the Company. Any infringement entitles the Company to all remedies available in law and equity." },
      ],
    },
    {
      id: "third-parties",
      number: "15",
      heading: "Third-party services and links",
      blocks: [
        { t: "clause", text: "The Website relies on third-party service providers for payments, hosting, database and storage, email delivery, analytics and an AI chat assistant, and contains links to third-party destinations such as a public WhatsApp channel. They are listed in Annexure C of the Privacy Policy." },
        { t: "clause", text: "The Company does not control and is not responsible for the content, availability, practices or policies of third parties. Your use of them is at your own risk and subject to their terms." },
        { t: "clause", text: "The AI chat assistant is provided by a third party. Do not enter sensitive or confidential personal information into it. Responses are informational and may be inaccurate." },
      ],
    },
    {
      id: "privacy",
      number: "16",
      heading: "Privacy and data protection",
      blocks: [
        { t: "clause", text: "Your personal data is collected and processed in accordance with the Privacy Policy, which forms part of these Terms." },
        { t: "clause", text: `The signup consent checkbox records your consent to the processing of your data, including proctoring data and Assessment scores, as described in the Privacy Policy.` },
      ],
    },
    {
      id: "termination",
      number: "17",
      heading: "Suspension and termination",
      blocks: [
        { t: "clause", text: "The Company may suspend or terminate your access, with or without notice, where (a) you breach these Terms, (b) you provide false information, (c) the Company suspects fraud, impersonation or Assessment misconduct, (d) the Company is required to do so by law or by a competent authority, or (e) your continued use poses a security risk." },
        { t: "clause", text: "You may stop using the Services at any time. A request to delete your account and data is handled under the Privacy Policy." },
        { t: "clause", text: "Termination for your breach does not by itself entitle you to a refund. Refund entitlements are determined solely under the Refund and Cancellation Policy." },
        { t: "clause", text: "Where the Company terminates a Plan for reasons other than your breach, it will apply the Refund and Cancellation Policy to the Fee for that Plan." },
        { t: "clause", text: "Sections 9.7, 12, 14, 18 to 21, 25 and 27 survive termination or expiry." },
      ],
    },
    {
      id: "disclaimer",
      number: "18",
      heading: "General disclaimer",
      blocks: [
        { t: "clause", text: "Every effort is made to keep the Website accurate and up to date. The information on the Website is provided for general guidance, and you accept full responsibility for its use." },
        { t: "clause", text: "The Website may contain inaccuracies or typographical errors. The Company reserves the right to correct, change or remove any content, representation or clause on the Website at any time." },
        { t: "clause", text: "Assessment scores, rankings, analyses of candidate performance metrics and mentor feedback are indicative and for preparation only. They do not predict performance in any employer's selection process." },
      ],
    },
    {
      id: "warranties",
      number: "19",
      heading: "No warranties",
      blocks: [
        { t: "clause", text: "Except as expressly stated in these Terms and to the fullest extent permitted by law, the Website and the Services are provided on an \"as is\" and \"as available\" basis, and the Company makes no warranty of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose and non-infringement." },
        { t: "clause", text: "The Company does not warrant that the Website will operate without interruption or error, that it will be free of viruses or other harmful components, or that any defect will be corrected within a particular time." },
      ],
    },
    {
      id: "liability",
      number: "20",
      heading: "Limitation of liability",
      blocks: [
        { t: "clause", text: "To the fullest extent permitted by law, the Company shall not be liable for any indirect, incidental, special, exemplary, punitive or consequential loss or damage, including loss of employment opportunity, income, profit, goodwill, use or data, arising out of or in connection with the Website or the Services, even if advised of the possibility of such loss." },
        { t: "clause", text: "Subject to the next clause, the Company's aggregate liability for all claims arising out of or in connection with a Plan shall not exceed the Fees actually paid by you for that Plan." },
        { t: "clause", text: "Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under applicable law, including liability for fraud, and nothing affects your statutory rights as a consumer." },
        { t: "clause", text: "The Company is not responsible for any act or omission of any user, visitor, mentor engaged on an independent basis, employer, HR agency or other third party, and is not obliged to resolve or mediate any dispute between users or between a user and a third party." },
      ],
    },
    {
      id: "indemnity",
      number: "21",
      heading: "Indemnity",
      blocks: [
        { t: "clause", text: "You agree to indemnify and hold harmless the Company, its directors, officers, employees, mentors, affiliates and service providers from and against any third-party claim, demand, loss, liability, damage and reasonable legal costs arising out of (a) your User Content, (b) your breach of these Terms, (c) your violation of any law or of the rights of any person, or (d) your misuse of the Website." },
      ],
    },
    {
      id: "force-majeure",
      number: "22",
      heading: "Force majeure",
      blocks: [
        { t: "clause", text: "The Company shall not be liable for failure or delay in performance caused by events beyond its reasonable control, including natural disaster, epidemic, war, civil disturbance, government action, failure of power, internet, cloud or telecommunication services, failure of the Payment Gateway or another third-party provider, or cyber attack." },
      ],
    },
    {
      id: "notices",
      number: "23",
      heading: "Notices and electronic communication",
      blocks: [
        { t: "clause", text: "You consent to receive notices and communications from the Company by email at the address you registered and by display on the Website. Notices are deemed received on sending or display." },
        { t: "clause", text: `Notices to the Company shall be sent to ${M.supportEmail}, and, for legal notices, to the registered office at ${M.registeredOffice}.` },
        { t: "clause", text: "You must keep your email address and mobile number up to date." },
      ],
    },
    {
      id: "amendments",
      number: "24",
      heading: "Amendments",
      blocks: [
        { t: "clause", text: "The Company may amend these Terms from time to time. The \"last updated\" date shows the current version. Material changes will be notified on the Website and, where required, by email." },
        { t: "clause", text: "Your continued use of the Services after the changes take effect constitutes acceptance of the amended Terms. If you do not agree, you must stop using the Services." },
      ],
    },
    {
      id: "law",
      number: "25",
      heading: "Governing law, jurisdiction and disputes",
      blocks: [
        { t: "clause", text: "These Terms are governed by and construed in accordance with the laws of India." },
        { t: "clause", text: "The parties shall first attempt to settle any dispute amicably through the grievance process in section 26." },
        { t: "clause", text: `Subject to applicable law, the courts at ${M.jurisdictionCity}, India shall have exclusive jurisdiction over any dispute arising out of or in connection with these Terms.` },
        { t: "clause", text: "Nothing in this section prevents you from approaching a Consumer Disputes Redressal Commission or any other forum that applicable law makes available to you." },
      ],
    },
    {
      id: "grievance",
      number: "26",
      heading: "Grievance redressal",
      blocks: [
        { t: "clause", text: `Complaints about the Services, Fees, content or conduct on the Website may be sent to ${M.supportEmail}. Unresolved complaints may be escalated to the Grievance Officer, ${M.grievanceOfficerName}, at ${M.grievanceOfficerEmail} (details in Annexure E of the Privacy Policy).` },
        { t: "clause", text: "The Company will acknowledge a complaint within forty-eight (48) hours of receipt and will endeavour to redress it within one (1) month of receipt." },
        { t: "clause", text: "Complaints about the processing of personal data are handled under the Privacy Policy." },
      ],
    },
    {
      id: "general",
      number: "27",
      heading: "General provisions",
      blocks: [
        { t: "clause", text: "Entire agreement. These Terms, the Refund and Cancellation Policy and the Privacy Policy together constitute the entire agreement between you and the Company concerning the Services and supersede all prior communications." },
        { t: "clause", text: "Severability. If any provision is held invalid or unenforceable, the remaining provisions continue in full force and the affected provision shall be modified to the minimum extent necessary." },
        { t: "clause", text: "No waiver. Failure or delay by the Company in exercising any right does not waive that right." },
        { t: "clause", text: "Assignment. You may not assign or transfer your rights or obligations under these Terms. The Company may assign them to an affiliate or to a successor to its business." },
        { t: "clause", text: "Relationship. Nothing in these Terms creates a partnership, agency, joint venture or employment relationship between you and the Company, or between you and any employer or HR agency." },
        { t: "clause", text: "Language. These Terms are made in English. A translation is for convenience, and the English text prevails." },
      ],
    },
    {
      id: "contact",
      number: "28",
      heading: "Contact and registered office",
      blocks: [
        { t: "clause", text: `${M.entityName}, ${M.registeredOffice}. Email: ${M.supportEmail}. Payment and account help: ${M.paymentEmail}.` },
      ],
    },
    {
      id: "annexure-a",
      number: "A",
      heading: "Annexure A — Plan Schedule",
      blocks: [
        { t: "p", text: "The Plans and Fees in force on the date of these Terms are: all prices in Indian Rupees, one-time payment, no subscription and no auto-renewal." },
        {
          t: "table",
          head: ["Plan", "Fee", "What it includes"],
          rows: [
            [
              "Starter Practice Pass",
              "₹999",
              "Basic version of limited tests; standard resume diagnostic checklist; community Q&A and knowledge base. Complimentary Referral Assistance to the Company's HR network.",
            ],
            [
              "CareerLoop Pro All-Access Pass",
              "₹4,999",
              "Everything in the Starter Practice Pass, plus unlimited weekly mock test series, live expert mentorship and interview preparation sessions, professional resume analysis and curation, and performance tracking.",
            ],
            [
              "1-on-1 Intensive Mentorship Track",
              "₹8,999",
              "Everything in the CareerLoop Pro All-Access Pass, plus dedicated one-to-one senior industry mock interviews, tailored ATS resume customisation for target companies, priority dispatch to enterprise HR recruiters, and post-interview debrief and offer negotiation guidance.",
            ],
            [
              "Placement Cells and Organisations",
              "Custom quote",
              "Everything in the 1-on-1 Intensive Mentorship Track, plus a dedicated institutional proctored testing portal, custom mock series, bulk verified dossier exports and analytics, co-branded campus drives, and a dedicated account manager.",
            ],
          ],
        },
        { t: "note", text: "The authoritative prices are the Plan records maintained by the Company. This Annexure is updated whenever a price or inclusion changes." },
      ],
    },
    {
      id: "annexure-d",
      number: "D",
      heading: "Annexure D — Assessment rules at a glance",
      blocks: [
        {
          t: "table",
          head: ["Item", "Rule"],
          rows: [
            ["Categories", "Aptitude and reasoning; core or technical; English and comprehension; mains exam"],
            ["Attempts per set", "Two"],
            ["Time control", "Server-enforced deadline with a 30-second grace period; late submissions are scored from the last autosave"],
            ["Scoring", "Server-side, with negative marking; pass mark is 40% of total marks"],
            ["Demo requirement", "A short unscored demo must be completed before any scored test"],
            ["Photograph", "One still photograph captured at enrolment"],
            ["Face detection", "Browser-based; verifies that a single face is present and aligned"],
            ["Integrity indicators", "Recorded for each attempt"],
            ["Live human proctor", "None"],
            ["Video or screen recording", "None"],
            ["Biometric template", "None"],
          ],
        },
      ],
    },
  ],
};
