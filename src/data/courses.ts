export interface Course {
  id: string;
  title: string;
  category: "AI & Data" | "Full-Stack" | "Cloud & DevOps" | "Product & UI";
  level: "Beginner Friendly" | "Intermediate" | "Advanced";
  duration: string;
  format: "Hands-on Sprint";
  avgSalary: string;
  placementRate: string;
  rating: number;
  reviewsCount: number;
  partnerAgencies: string[];
  skills: string[];
  description: string;
  keyProjects: string[];
  syllabusWeeks: { week: string; title: string; topics: string[] }[];
  badge?: string;
}

export const COURSES: Course[] = [
  {
    id: "fullstack-modern-web",
    title: "Full-Stack Next.js 15 & Cloud Systems Mastery",
    category: "Full-Stack",
    level: "Beginner Friendly",
    duration: "12 Weeks",
    format: "Hands-on Sprint",
    avgSalary: "₹8.5L - ₹14.5L / yr",
    placementRate: "95.1%",
    rating: 4.94,
    reviewsCount: 640,
    badge: "Highest Placement Demand",
    partnerAgencies: ["TalentPulse", "Horizon Talent", "Vanguard HR", "ApexHire"],
    skills: ["TypeScript", "Next.js 15", "React 19", "PostgreSQL", "Prisma", "Tailwind CSS", "Redis"],
    description: "Master modern full-stack web development. Build high-concurrency microservices, real-time collaboration engines, and graduate with a verified Skills Passport for guaranteed HR interview calls.",
    keyProjects: [
      "Real-time Collaborative SaaS Workspace with WebSockets",
      "High-Concurrency Marketplace with Stripe & Postgres",
      "Distributed Task Queue with Redis & Next.js Turbopack"
    ],
    syllabusWeeks: [
      { week: "Weeks 1-3", title: "Modern TypeScript Architecture", topics: ["Async programming", "Generics", "Type safety & design patterns"] },
      { week: "Weeks 4-6", title: "Frontend Engineering with React 19 & Next.js", topics: ["Server Actions", "SSR & Streaming", "Tailwind UI systems"] },
      { week: "Weeks 7-9", title: "Backend, Databases & Distributed State", topics: ["PostgreSQL schemas", "Prisma ORM", "Redis caching & rate limits"] },
      { week: "Weeks 10-12", title: "DevOps, Security & Backend Recruiter Dispatch", topics: ["CI/CD pipelines", "AWS deployment", "Agency mock technical rounds"] }
    ]
  },
  {
    id: "ai-data-engineering",
    title: "Generative AI, LLMs & Data Engineering Bootcamp",
    category: "AI & Data",
    level: "Intermediate",
    duration: "12 Weeks",
    format: "Hands-on Sprint",
    avgSalary: "₹12.0L - ₹22.0L / yr",
    placementRate: "96.4%",
    rating: 4.96,
    reviewsCount: 382,
    badge: "Top Sourced by AI Agencies",
    partnerAgencies: ["ApexHire Global", "TalentPulse", "NextGen Staffing"],
    skills: ["Python", "PyTorch", "LangChain", "Vector DBs", "RAG Systems", "FastAPI", "Docker"],
    description: "Master enterprise AI engineering, autonomous agent loops, fine-tuning open-weights models, and scalable vector retrieval pipelines vetted by leading AI staffing agencies.",
    keyProjects: [
      "Autonomous Multi-Agent Enterprise Research Assistant",
      "Production-Grade RAG Pipeline on Pinecone & FastAPI",
      "Fine-tuned Small Language Model (SLM) for Financial Parsing"
    ],
    syllabusWeeks: [
      { week: "Weeks 1-3", title: "Advanced Python, PyTorch & Vector Mathematics", topics: ["Vectorized computation", "Tensors & autograd", "Data pipelines"] },
      { week: "Weeks 4-6", title: "LLM Orchestration, Embeddings & RAG Architectures", topics: ["LangChain/LlamaIndex", "Hybrid search", "Chunking strategies"] },
      { week: "Weeks 7-9", title: "Agentic Systems & Function Calling in Production", topics: ["Multi-agent loops", "Tool use", "Evaluation & benchmarking"] },
      { week: "Weeks 10-12", title: "Deployment, MLOps & Agency Portfolio Defense", topics: ["Docker/Kubernetes", "Cost optimization", "Live technical recruiter dry-runs"] }
    ]
  },
  {
    id: "cloud-devops-sre",
    title: "Cloud Architecture, Kubernetes & DevOps Pro",
    category: "Cloud & DevOps",
    level: "Intermediate",
    duration: "10 Weeks",
    format: "Hands-on Sprint",
    avgSalary: "₹10.5L - ₹18.0L / yr",
    placementRate: "93.8%",
    rating: 4.91,
    reviewsCount: 290,
    badge: "Enterprise SRE Roles",
    partnerAgencies: ["ApexHire Global", "BlueChip Search", "InnovateHR"],
    skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Prometheus", "CI/CD GitHub Actions", "Linux"],
    description: "Build robust infrastructure as code, automate zero-downtime deployments, and master high-availability Kubernetes clusters tailored for backend agency hiring mandates.",
    keyProjects: [
      "Multi-Region Zero-Downtime AWS EKS Cluster with Terraform",
      "End-to-End GitOps Continuous Delivery Engine with ArgoCD",
      "Observability & Incident Response Dashboard with Grafana"
    ],
    syllabusWeeks: [
      { week: "Weeks 1-2", title: "Linux Deep Dive & Cloud Networking Fundamentals", topics: ["Kernel basics", "VPCs, subnets & routing", "Security groups"] },
      { week: "Weeks 3-5", title: "Infrastructure as Code with Terraform & AWS", topics: ["Modular IaC", "State management", "Auto-scaling policies"] },
      { week: "Weeks 6-8", title: "Container Orchestration with Kubernetes", topics: ["Pods, Deployments & Services", "Ingress controllers", "Helm charts"] },
      { week: "Weeks 9-10", title: "SRE Monitoring & Backend Recruiter Clearing", topics: ["Prometheus/Grafana", "SLIs/SLOs", "Live infrastructure audits"] }
    ]
  },
  {
    id: "product-uiux-design",
    title: "Product Design (UI/UX) & Design Systems",
    category: "Product & UI",
    level: "Beginner Friendly",
    duration: "8 Weeks",
    format: "Hands-on Sprint",
    avgSalary: "₹7.5L - ₹12.0L / yr",
    placementRate: "92.3%",
    rating: 4.89,
    reviewsCount: 215,
    badge: "Portfolio-Driven",
    partnerAgencies: ["Horizon Talent", "EliteTalent Group", "Vanguard HR"],
    skills: ["Figma", "Design Systems", "User Research", "Wireframing", "Prototyping", "Design Tokens", "WCAG 2.2"],
    description: "Craft enterprise-grade UI/UX systems and interactive prototypes in Figma. Build 3 production case studies directly evaluated by design headhunters.",
    keyProjects: [
      "Complete Enterprise Fintech Design System in Figma",
      "Mobile Healthcare Teleconsultation App UX Flow",
      "AI Productivity Workspace with Micro-interactions"
    ],
    syllabusWeeks: [
      { week: "Weeks 1-2", title: "Design Fundamentals & User Psychology", topics: ["Typography & color theory", "Information architecture", "Mental models"] },
      { week: "Weeks 3-4", title: "Figma Mastery & Scalable Design Systems", topics: ["Auto-layout & components", "Design tokens", "Variables & modes"] },
      { week: "Weeks 5-6", title: "UX Research & Usability Audits", topics: ["User testing", "Heuristic evaluation", "Interactive prototypes"] },
      { week: "Weeks 7-8", title: "Recruiter Portfolio Polishing & Agency Pitch", topics: ["Case study storytelling", "Figma slides", "Live portfolio defense"] }
    ]
  }
];
