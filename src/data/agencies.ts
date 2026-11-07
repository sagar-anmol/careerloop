export interface Agency {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  specialty: string[];
  activeOpenings: number;
  placedGraduates: number;
  avgTimeToHire: string;
  avgOfferSalary: string;
  locations: string[];
  logoInitials: string;
  accentColor: string;
  description: string;
  recruiterQuote: string;
  recruiterName: string;
  recruiterRole: string;
}

export const PARTNER_AGENCIES: Agency[] = [
  {
    id: "apexhire-global",
    name: "ApexHire Global",
    tagline: "Premier Tech & AI Executive Staffing",
    badge: "Tier-1 Partner",
    specialty: ["Generative AI", "Cloud & DevOps", "Cyber Security"],
    activeOpenings: 142,
    placedGraduates: 480,
    avgTimeToHire: "28 Days",
    avgOfferSalary: "$108,000",
    locations: ["Remote", "San Francisco", "New York", "London"],
    logoInitials: "AH",
    accentColor: "from-blue-600 to-indigo-600",
    description: "Specialized in sourcing high-caliber engineering and AI talent for Series B to enterprise tech leaders across North America and Europe.",
    recruiterQuote: "Graduates from this academy are our first priority. They arrive with verifiable capstone repos and can deploy production systems on day one without hand-holding.",
    recruiterName: "Marcus Vance",
    recruiterRole: "Managing Director of Technical Recruiting"
  },
  {
    id: "talentpulse",
    name: "TalentPulse Staffing",
    tagline: "High-Growth Software & Product Placements",
    badge: "Top Placement Volume",
    specialty: ["Full-Stack Next.js", "Solutions Engineering", "Mobile Development"],
    activeOpenings: 215,
    placedGraduates: 860,
    avgTimeToHire: "22 Days",
    avgOfferSalary: "$92,000",
    locations: ["Remote", "Austin", "Berlin", "Toronto", "Bangalore"],
    logoInitials: "TP",
    accentColor: "from-emerald-600 to-teal-600",
    description: "The preferred staffing partner for hyper-growth scale-ups, connecting pre-assessed developers with venture-backed tech startups worldwide.",
    recruiterQuote: "We stopped conducting traditional first-round algorithmic screenings for these graduates. Their project audits and verified skill passports give us complete confidence.",
    recruiterName: "Elena Rostova",
    recruiterRole: "Head of Engineering Talent Partnerships"
  },
  {
    id: "bluechip-search",
    name: "BlueChip Search & Partners",
    tagline: "Enterprise Cloud, FinTech & SRE Headhunters",
    badge: "Enterprise Network",
    specialty: ["Kubernetes & Cloud", "Data Systems", "Enterprise Architecture"],
    activeOpenings: 98,
    placedGraduates: 310,
    avgTimeToHire: "34 Days",
    avgOfferSalary: "$118,000",
    locations: ["New York", "Chicago", "London", "Remote US"],
    logoInitials: "BC",
    accentColor: "from-purple-600 to-violet-600",
    description: "Exclusively representing Fortune 500 banks, fintech powerhouses, and global cloud providers seeking certified DevOps and infrastructure specialists.",
    recruiterQuote: "Finding infrastructure engineers who actually understand both Terraform and cost telemetry is rare. The graduate talent here fits our banking clients' rigorous criteria.",
    recruiterName: "David Sterling",
    recruiterRole: "Senior VP of Tech Staffing"
  },
  {
    id: "horizon-talent",
    name: "Horizon Talent Collective",
    tagline: "Design, Product & Modern Frontend Recruiting",
    badge: "Creative & Tech",
    specialty: ["Product Design (UI/UX)", "Design Systems", "Full-Stack Web"],
    activeOpenings: 84,
    placedGraduates: 290,
    avgTimeToHire: "26 Days",
    avgOfferSalary: "$85,000",
    locations: ["Remote Global", "Seattle", "Amsterdam"],
    logoInitials: "HT",
    accentColor: "from-amber-600 to-orange-600",
    description: "Curated talent representation for human-centric product teams, creative tech agencies, and modern consumer SaaS firms.",
    recruiterQuote: "The design portfolios created in this program don't look like student exercises—they look like the work of seasoned mid-level product designers with deep systems thinking.",
    recruiterName: "Sarah Chen",
    recruiterRole: "Lead Product & Design Recruiter"
  },
  {
    id: "nextgen-staffing",
    name: "NextGen Tech Staffing",
    tagline: "Rapid Pipeline for Emerging Tech & Security",
    badge: "Fast-Track",
    specialty: ["Cyber Defense", "AI Engineering", "Solutions Architecture"],
    activeOpenings: 110,
    placedGraduates: 420,
    avgTimeToHire: "24 Days",
    avgOfferSalary: "$97,000",
    locations: ["Remote", "Washington D.C.", "Dallas", "Dublin"],
    logoInitials: "NG",
    accentColor: "from-sky-600 to-cyan-600",
    description: "Bridging the cybersecurity and AI defense talent gap by supplying certified analysts and engineers to government defense contractors and high-assurance enterprises.",
    recruiterQuote: "Every student comes through with live SIEM lab experience and hands-on threat hunting. That cuts our client ramp-up time from 3 months down to 2 weeks.",
    recruiterName: "Lt. Col. Greg Morales (Ret.)",
    recruiterRole: "VP of Defense & Cyber Talent"
  },
  {
    id: "vanguard-hr",
    name: "Vanguard HR International",
    tagline: "Cross-Border Technical Recruitment & Visa Sponsorship",
    badge: "Global Relocation",
    specialty: ["Full-Stack", "Cloud & Infra", "Data Analytics"],
    activeOpenings: 130,
    placedGraduates: 510,
    avgTimeToHire: "38 Days",
    avgOfferSalary: "$94,000",
    locations: ["London", "Berlin", "Singapore", "Dubai", "Remote"],
    logoInitials: "VH",
    accentColor: "from-rose-600 to-pink-600",
    description: "International recruitment agency matching skilled engineers with top employers offering visa sponsorship, remote work stipends, and global contracts.",
    recruiterQuote: "Our clients across the UK and Europe love the verified benchmark scores. When we submit candidates from this platform, 78% get invited to the final panel round.",
    recruiterName: "Ananya Sharma",
    recruiterRole: "Director of International Placements"
  }
];
