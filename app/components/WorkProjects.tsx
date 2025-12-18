"use client";

import { useState, useEffect } from "react";
import { Github, ExternalLink, Calendar, MapPin, ChevronRight } from "lucide-react";

interface WorkProjectsProps {
  onSkillHighlight: (skills: string[]) => void;
}

interface Experience {
  id: string;
  title: string;
  role: string;
  date: string;
  location: string;
  description: string;
  skills: string[];
  link?: string;
  github?: string;
}

const professionalExperiences: Experience[] = [
  {
    id: "wpi-web",
    title: "WPI Marketing & Communications",
    role: "Web Developer",
    date: "Dec 2023 - Present",
    location: "Worcester, MA",
    description: "Managed 100+ wpi.edu pages serving 60K+ visitors monthly using Drupal and Laravel. Migrated codebase from JS to TypeScript, reducing runtime errors by 98%.",
    skills: ["Drupal", "Laravel", "TypeScript", "JavaScript", "CI/CD", "HTML/CSS", "SASS", "PHP"],
    link: "https://wpi.edu"
  },
  {
    id: "wpi-cloud",
    title: "WPI Marketing & Communications",
    role: "Cloud Software Engineer",
    date: "Dec 2023 - Present",
    location: "Worcester, MA",
    description: "Built WPI Alexa skill using Node.js and AWS serving real-time news and announcements to the community. Implemented Jest test suite with +90% coverage.",
    skills: ["JavaScript", "Node.js", "AWS Lambda", "Jest", "ASK SDKs", "CI/CD", "AWS Lambda"],
    link: "https://www.amazon.com/Worcester-Polytechnic-Institute-WPI/dp/B0CVJFBK1X"
  },
  {
    id: "baato",
    title: "Baato Maps",
    role: "Market Researcher",
    date: "Oct 2024 - Dec 2024",
    location: "Kathmandu, Nepal",
    description: "Led 30+ user interviews identifying critical UX gaps in local digital map adoption, resulting in 5+ feature recommendations. Studied digital behavior of Nepali users and co-authored a research paper focusing on the local use of digital maps.",
    skills: ["User Research", "Data Analysis"],
    link: "https://digital.wpi.edu/concern/student_works/ht24wp732?locale=en"
  },
  {
    id: "stem",
    title: "Tufts University & Teach for Nepal",
    role: "STEM Education Facilitator",
    date: "Jun 2023 - Aug 2023",
    location: "Medford, MA & Kathmandu, Nepal",
    description: "Facilitated collaboration between Tufts CEEO & 20 Nepalese teachers in co-creation of engaging educational activities. Developed teaching materials and trained 20+ educators in Nepal, empowering them with practical STEM teaching techniques.",
    skills: ["Curriculum Development", "Teacher Training"]
  }
];

const startupExperiences: Experience[] = [
  {
    id: "sirkoi",
    title: "Sirkoi",
    role: "Tech Lead",
    date: "May 2025 - Present",
    location: "Remote",
    description: "Secured $20,000 credits to scale a tutor discovery platform serving 1000+ users. Reduced infrastructure costs by 95% through AWS migration and managed development across 4 time zones.",
    skills: ["React", "TypeScript", "Next.js", "AWS EC2", "RDS", "CI/CD", "PostgreSQL"],
    link: "https://sirkoi.com"
  },
  {
    id: "foundercloud",
    title: "FounderCloud",
    role: "Tech Lead",
    date: "July 2025 - Present",
    location: "Remote",
    description: "Led full rebrand from Starthawk to FounderCloud with website migration, logo design, and built an interactive feed for 30,000+ users to post and engage with startup ideas.",
    skills: ["Next.js", "GraphQL", "SEO", "Analytics"],
    link: "https://foundercloud.com"
  }
];

const projectExperiences: Experience[] = [
  {
    id: "flashnews",
    title: "Flash News",
    role: "Personal Project",
    date: "2024",
    location: "",
    description: "Developed a mobile-first, TikTok-style news feed in React with reusable components and hook-based state management. Built an Express API backed by Python ETL pipelines with Gemini API to continuously ingest and serve fresh news content.",
    skills: ["React", "Node.js", "Python"],
    github: "https://github.com/aarogyarijal/flash-news"
  },
  {
    id: "coderot",
    title: "Coderot",
    role: "Personal Project",
    date: "2024",
    location: "",
    description: "Implemented an AI-driven question generation pipeline using DeepSeek API, and per-question analytics to track user performance.",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    github: "https://github.com/aarogyarijal/coderot"
  },
  {
    id: "hospital",
    title: "Hospital Service Manager",
    role: "Group Project",
    date: "2024",
    location: "WPI",
    description: "Built indoor map and service request system with team of 10 using Agile Scrum, completing 40+ user stories over 7 sprints.",
    skills: ["React", "TypeScript", "PostgreSQL", "Agile/Scrum"]
  },
  {
    id: "smartpark",
    title: "SmartPark",
    role: "HackHarvard Best Use of Google Cloud",
    date: "HackHarvard 2022",
    location: "Harvard University",
    description: "Engineered OpenCV pipeline for real-time spot detection and Django frontend displaying live parking availability across lots.",
    skills: ["Django", "OpenCV", "Firebase"],
    github: "https://github.com/aarogyarijal/smartpark"
  }
];

function ExperienceCard({ 
  exp, 
  isExpanded, 
  onToggle 
}: { 
  exp: Experience; 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-zinc-100 truncate mb-1">{exp.title}</h3>
          <p className="text-sm text-zinc-400">{exp.role}</p>
          <div className="flex flex-col text-xs text-zinc-500 font-mono mt-1.5">
            <span className="flex items-center gap-1"><Calendar size={11} />{exp.date}</span>
            {exp.location && (
              <span className="flex items-center gap-1"><MapPin size={11} />{exp.location}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {exp.link && (
              <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-green-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                <ExternalLink size={14} />
              </a>
            )}
            {exp.github && (
              <a href={exp.github} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-green-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                <Github size={14} />
              </a>
            )}
          </div>
          <button
            onClick={onToggle}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all border ${
              isExpanded 
                ? "bg-zinc-700 text-white border-zinc-600" 
                : "bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white hover:border-zinc-600"
            }`}
          >
            <span>{isExpanded ? "Hide" : "Details"}</span>
            <ChevronRight size={10} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-zinc-800 animate-in slide-in-from-top-2 duration-200">
          <p className="text-xs text-zinc-400 leading-relaxed">{exp.description}</p>
          <p className="text-[10px] text-zinc-500 mt-2 italic">
            Skills highlighted in Technical Arsenal →
          </p>
        </div>
      )}
    </div>
  );
}

export default function WorkProjects({ onSkillHighlight }: WorkProjectsProps) {
  const [activeTab, setActiveTab] = useState<"professional" | "startup" | "projects">("professional");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getExperiences = () => {
    switch (activeTab) {
      case "professional": return professionalExperiences;
      case "startup": return startupExperiences;
      case "projects": return projectExperiences;
    }
  };

  // Update highlighted skills when expanded experience changes
  useEffect(() => {
    if (expandedId) {
      const allExperiences = [...professionalExperiences, ...startupExperiences, ...projectExperiences];
      const exp = allExperiences.find(e => e.id === expandedId);
      if (exp) {
        onSkillHighlight(exp.skills);
      }
    } else {
      onSkillHighlight([]);
    }
  }, [expandedId, onSkillHighlight]);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex h-full items-center">
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md h-full w-full border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        <div className="mb-2">
          <h2 className="text-xl font-serif mb-1">
            <span className="text-zinc-400">Work &</span> <span className="italic">Projects</span>
          </h2>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-zinc-800 pb-2">
          <button
            onClick={() => { setActiveTab("professional"); setExpandedId(null); }}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all border ${
              activeTab === "professional"
                ? "bg-red-500/25 text-red-300 border-red-500/40"
                : "text-zinc-500 hover:text-red-300 hover:bg-red-500/10 border-zinc-700 hover:border-red-500/30"
            }`}
          >
            Professional
          </button>
          <button
            onClick={() => { setActiveTab("startup"); setExpandedId(null); }}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all border ${
              activeTab === "startup"
                ? "bg-green-500/25 text-green-300 border-green-500/40"
                : "text-zinc-500 hover:text-green-300 hover:bg-green-500/10 border-zinc-700 hover:border-green-500/30"
            }`}
          >
            Startup
          </button>
          <button
            onClick={() => { setActiveTab("projects"); setExpandedId(null); }}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all border ${
              activeTab === "projects"
                ? "bg-yellow-500/25 text-yellow-300 border-yellow-500/40"
                : "text-zinc-500 hover:text-yellow-300 hover:bg-yellow-500/10 border-zinc-700 hover:border-yellow-500/30"
            }`}
          >
            Projects
          </button>
        </div>
        
        <div className="space-y-2 overflow-y-auto pr-2 flex-1">
          {getExperiences().map((exp) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              isExpanded={expandedId === exp.id}
              onToggle={() => handleToggle(exp.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
