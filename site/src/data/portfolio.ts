export const CV_URL = "/Okitha_Kaluthotage_CV.pdf"; // Put file in /public

export const SOCIAL = {
  email: "okithask@gmail.com",
  github: "https://github.com/okithaeske",
  linkedin: "https://www.linkedin.com/in/okitha-kaluthotage-a666b5331/",
};

export type Project = {
  name: string;
  description: string;
  tech: string[];
  gradient: string;
  url?: string;
  slug: string;
  highlights?: string[];
};

export const PROJECTS: Project[] = [
  {
    name: "Traveloute",
    description:
      "Gamified travel companion app with real-time event discovery, route planning, and social features. Built with microservices architecture.",
    tech: ["Flutter", "Node.js", "PostgreSQL", "AWS", "Kafka"],
    gradient: "from-cyan-500 to-teal-500",
    url: "https://your-live-url-or-repo/traveloute",
    slug: "traveloute",
    highlights: [
      "Real-time events & routing with scalable microservices",
      "Async pipelines on Kafka",
      "Cloud infra on AWS with IaC",
    ],
  },
  {
    name: "Zentara",
    description:
      "Mental wellness platform featuring mood tracking, meditation guides, and AI-powered insights for better mental health.",
    tech: ["Flutter", "Laravel", "MongoDB", "Docker"],
    gradient: "from-purple-500 to-blue-500",
    url: "https://your-live-url-or-repo/zentara",
    slug: "zentara",
  },
  {
    name: "H Connect",
    description:
      "Healthcare connectivity platform enabling seamless patient-provider communication and appointment management.",
    tech: ["Angular", ".NET", "PostgreSQL", "Azure"],
    gradient: "from-pink-500 to-rose-500",
    url: "https://your-live-url-or-repo/h-connect",
    slug: "h-connect",
  },
  {
    name: "Student API",
    description:
      "RESTful API for student management system with authentication, role-based access, and comprehensive documentation.",
    tech: ["Node.js", "Express", "MongoDB", "JWT"],
    gradient: "from-emerald-500 to-green-500",
    url: "https://your-live-url-or-repo/student-api",
    slug: "student-api",
  },
];

export const SKILLS = [
  "Flutter",
  "Angular",
  ".NET",
  "Node.js",
  "Laravel",
  "Next.js",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kafka",
  "TypeScript",
  // Added from user request
  "Redis",
  "C#",
  "Dart",
  "Java",
  "HTML5",
  "JavaScript",
  "PHP",
  "Python",
  "Firebase",
  "TailwindCSS",
  "React",
  "MySQL",
  "MicrosoftSQLServer",
  "Canva",
  "Figma",
  "Matplotlib",
  "NumPy",
  "Pandas",
  "scikit-learn",
  "TensorFlow",
  "GitHub",
  "Postman",
  "Trello",
];


