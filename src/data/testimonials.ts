export interface GraduateStory {
  id: string;
  name: string;
  avatar: string;
  previousRole: string;
  currentRole: string;
  currentCompany: string;
  placedViaAgency: string;
  courseCompleted: string;
  salaryIncrease: string;
  timeToPlaced: string;
  quote: string;
  skillsAcquired: string[];
}

export const SUCCESS_STORIES: GraduateStory[] = [
  {
    id: "story-1",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
    previousRole: "Customer Support Rep ($38k)",
    currentRole: "AI Solutions Engineer ($108k)",
    currentCompany: "ScaleForge AI",
    placedViaAgency: "ApexHire Global",
    courseCompleted: "AI, LLMs & Data Engineering Bootcamp",
    salaryIncrease: "+184% Salary Increase",
    timeToPlaced: "Placed in 21 days",
    quote: "I had zero formal computer science degree. The hands-on multi-agent capstone gave me a portfolio that actually impressed senior engineers. ApexHire matched me with 3 interviews in my first week after graduation!",
    skillsAcquired: ["LangChain", "Vector DBs", "PyTorch", "FastAPI"]
  },
  {
    id: "story-2",
    name: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80",
    previousRole: "Self-Taught Coder stuck in tutorial hell",
    currentRole: "Full-Stack Software Engineer ($94k)",
    currentCompany: "NexusPay Cloud",
    placedViaAgency: "TalentPulse Staffing",
    courseCompleted: "Full-Stack Next.js & Cloud Systems Mastery",
    salaryIncrease: "+135% Salary Increase",
    timeToPlaced: "Placed in 18 days",
    quote: "Building real multi-tenant apps with Prisma, Redis, and WebSockets broke me out of basic todo-list projects. TalentPulse submitted my verified repository directly to the VP of Engineering without any generic screening call.",
    skillsAcquired: ["Next.js", "PostgreSQL", "Docker", "Redis"]
  },
  {
    id: "story-3",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    previousRole: "IT Helpdesk Technician ($46k)",
    currentRole: "DevOps & Cloud Engineer ($114k)",
    currentCompany: "FinCore Systems",
    placedViaAgency: "BlueChip Search & Partners",
    courseCompleted: "Cloud Architecture, Kubernetes & DevOps Pro",
    salaryIncrease: "+147% Salary Increase",
    timeToPlaced: "Placed in 31 days",
    quote: "The live Terraform and Kubernetes cluster projects were exact duplicates of what financial institutions use in production. BlueChip represented me to their banking clients and negotiated a top-bracket offer with full relocation.",
    skillsAcquired: ["Kubernetes", "AWS Terraform", "Prometheus", "CI/CD"]
  },
  {
    id: "story-4",
    name: "Camila Duarte",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
    previousRole: "Graphic Designer ($42k)",
    currentRole: "Lead Product Designer ($88k)",
    currentCompany: "Aura Health Tech",
    placedViaAgency: "Horizon Talent Collective",
    courseCompleted: "Product Design (UI/UX) & Design Systems",
    salaryIncrease: "+110% Salary Increase",
    timeToPlaced: "Placed in 26 days",
    quote: "Learning design tokens and Figma architecture shifted me from just making things pretty to solving real product retention problems. Horizon Talent connected me with an innovative healthtech startup that matched my values.",
    skillsAcquired: ["Figma Design Systems", "User Research", "WCAG 2.2", "Interactive Prototyping"]
  }
];
