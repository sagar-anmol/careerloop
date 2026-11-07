export interface JobOpening {
  id: string;
  title: string;
  agencyName: string;
  agencyBadge: string;
  hiringIndustry: string;
  workType: "Remote" | "Hybrid" | "On-site";
  location: string;
  salaryRange: string;
  experienceLevel: "Entry-to-Mid" | "Mid-Level" | "Senior Ready";
  targetCourse: string;
  requiredSkills: string[];
  postedTime: string;
  applicantsCount: number;
  featured?: boolean;
  description: string;
}

export const LIVE_JOBS: JobOpening[] = [
  {
    id: "job-1",
    title: "Junior AI & RAG Systems Engineer",
    agencyName: "ApexHire Global",
    agencyBadge: "Tier-1 Partner",
    hiringIndustry: "Enterprise AI & LegalTech",
    workType: "Remote",
    location: "US / Canada / LatAm (Remote)",
    salaryRange: "$95,000 - $115,000",
    experienceLevel: "Entry-to-Mid",
    targetCourse: "AI, LLMs & Data Engineering Bootcamp",
    requiredSkills: ["Python", "LangChain", "Vector DBs", "FastAPI", "Docker"],
    postedTime: "1 hour ago",
    applicantsCount: 14,
    featured: true,
    description: "Seeking an engineer to build and optimize enterprise retrieval-augmented generation pipelines, evaluate hallucination benchmarks, and integrate LLM agents into internal knowledge workflows."
  },
  {
    id: "job-2",
    title: "Full-Stack Software Engineer (Next.js & TypeScript)",
    agencyName: "TalentPulse Staffing",
    agencyBadge: "Top Placement Volume",
    hiringIndustry: "FinTech & Payments",
    workType: "Remote",
    location: "Worldwide Remote",
    salaryRange: "$85,000 - $100,000",
    experienceLevel: "Entry-to-Mid",
    targetCourse: "Full-Stack Next.js & Cloud Systems Mastery",
    requiredSkills: ["Next.js", "TypeScript", "React", "PostgreSQL", "Tailwind CSS"],
    postedTime: "3 hours ago",
    applicantsCount: 22,
    featured: true,
    description: "Build reactive payment checkout flows, analytics dashboards, and modular React components. Fast-track screening granted to candidates holding the Full-Stack Certification."
  },
  {
    id: "job-3",
    title: "Junior Cloud DevOps & Kubernetes Specialist",
    agencyName: "BlueChip Search & Partners",
    agencyBadge: "Enterprise Network",
    hiringIndustry: "Cloud Infrastructure & SaaS",
    workType: "Hybrid",
    location: "New York, NY / Hybrid",
    salaryRange: "$105,000 - $125,000",
    experienceLevel: "Mid-Level",
    targetCourse: "Cloud Architecture, Kubernetes & DevOps Pro",
    requiredSkills: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD"],
    postedTime: "5 hours ago",
    applicantsCount: 9,
    featured: true,
    description: "Maintain multi-cluster Kubernetes deployments on AWS, configure Prometheus metrics alerts, and collaborate with application teams to write clean Helm charts and Terraform modules."
  },
  {
    id: "job-4",
    title: "Product Designer & UI Design Systems Specialist",
    agencyName: "Horizon Talent Collective",
    agencyBadge: "Creative & Tech",
    hiringIndustry: "B2B SaaS & Productivity",
    workType: "Remote",
    location: "North America / Europe (Remote)",
    salaryRange: "$80,000 - $95,000",
    experienceLevel: "Entry-to-Mid",
    targetCourse: "Product Design (UI/UX) & Design Systems",
    requiredSkills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    postedTime: "1 day ago",
    applicantsCount: 18,
    featured: false,
    description: "Partner with product managers and engineers to craft high-conversion user onboarding flows and maintain the design token library in Figma."
  },
  {
    id: "job-5",
    title: "SOC Tier-1 Cyber Security Analyst",
    agencyName: "NextGen Tech Staffing",
    agencyBadge: "Fast-Track",
    hiringIndustry: "Government Contractor / Defense",
    workType: "Hybrid",
    location: "Washington D.C. / Hybrid",
    salaryRange: "$90,000 - $110,000",
    experienceLevel: "Entry-to-Mid",
    targetCourse: "Cyber Security & SOC Defense Specialist",
    requiredSkills: ["Splunk", "Wireshark", "Incident Response", "Linux", "Zero Trust"],
    postedTime: "1 day ago",
    applicantsCount: 11,
    featured: false,
    description: "Monitor security operations center telemetry, analyze suspicious alerts, execute triage runbooks, and participate in blue team adversary simulations."
  },
  {
    id: "job-6",
    title: "Technical Solutions Architect / Associate SE",
    agencyName: "TalentPulse Staffing",
    agencyBadge: "Top Placement Volume",
    hiringIndustry: "Cloud Security & DevTools",
    workType: "Remote",
    location: "US Remote",
    salaryRange: "$95,000 + $25k Commission",
    experienceLevel: "Entry-to-Mid",
    targetCourse: "Solutions Architecture & Tech Sales Accelerator",
    requiredSkills: ["Cloud Architecture", "Solution Demos", "Salesforce", "Customer Discovery"],
    postedTime: "2 days ago",
    applicantsCount: 15,
    featured: false,
    description: "Collaborate with Account Executives to deliver technical proof-of-concepts, answer security RFPs, and guide prospective CTOs through API integrations."
  }
];
