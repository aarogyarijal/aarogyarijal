"use client";

import { useState, useEffect } from "react";
import { Github, ExternalLink, Calendar, MapPin, ChevronRight } from "lucide-react";
import Image from "next/image";

interface WorkProjectsProps {
  onSkillHighlight: (skills: string[]) => void;
}

interface Experience {
  id: string;
  title: string;
  role: string;
  date?: string;
  location: string;
  description: string;
  skills: string[];
  link?: string;
  github?: string;
  logo?: string;
}

const professionalExperiences: Experience[] = [
  {
    id: "one-million-solutions",
    title: "1M Solutions Pvt. Ltd.",
    role: "Co-Founder & Head of Engineering",
    date: "Jan 2026 - Present",
    location: "Kathmandu, Nepal",
    description: "Co-founded and scaled a software company building proprietary products and delivering software solutions to 7+ external clients. Lead a 10-person cross-functional team across engineering, product, operations, and marketing.",
    skills: ["React", "Node.js", "TypeScript", "AWS EC2", "PostgreSQL", "Agile/Scrum"]
  },
  {
    id: "wpi",
    title: "WPI Marketing & Communications",
    role: "Student Software Developer",
    date: "Dec 2023 - May 2026",
    location: "Worcester, MA",
    description: "Maintained 100+ production wpi.edu pages serving 60K+ monthly users using Drupal, Laravel, TypeScript, SASS, and GitLab. Resolved 900+ production errors and migrated JavaScript to TypeScript, reducing runtime errors by 98%. Built reusable Drupal components, automated profile-change alerts and reports, and deployed WPI's Alexa skill to AWS for live campus news and media.",
    skills: ["Drupal", "Laravel", "TypeScript", "JavaScript", "SASS", "Git", "AWS Lambda", "Node.js", "Jest"],
    link: "https://wpi.edu",
    logo: "/worcester_polytechnic_institute_logo.jpeg"
  },
  {
    id: "baato",
    title: "Baato Maps & WPI",
    role: "Product Research & Analyst",
    date: "Oct 2024 - Dec 2024",
    location: "Kathmandu, Nepal",
    description: "Sampled and interviewed 30+ users from a 100K+ user base to identify market gaps, resulting in implementation of 5 new features. Co-authored market research on the competitive advantages and challenges of building a locally relevant mapping platform.",
    skills: ["User Research", "Data Analysis"],
    link: "https://digital.wpi.edu/concern/student_works/ht24wp732?locale=en",
    logo: "/baato_maps_logo.jpeg"
  }
];

const startupExperiences: Experience[] = [
  {
    id: "sirkoi",
    title: "Sirkoi",
    role: "Co-Founder & Tech Lead",
    location: "Remote",
    description: "Secured $20,000 for a tutor discovery platform and AI-native LMS, scaling it to 1,000+ tutors and students. Reduced cloud costs by 95% through an AWS EC2 and RDS migration with automated CI/CD, while leading 100+ issues, 75+ PRs, and 500+ commits across four time zones.",
    skills: ["React", "TypeScript", "AWS EC2", "RDS", "CI/CD", "PostgreSQL", "Git"],
    link: "https://sirkoi.com",
    logo: "/sirkoi_logo.webp"
  },
  {
    id: "foundercloud",
    title: "FounderCloud",
    role: "Tech Lead",
    location: "Remote",
    description: "Migrated a production domain with 30K+ active users, including redirects, DNS, analytics, and SEO configuration. Led the full rebrand of 20+ pages from Starthawk to FounderCloud and built an interactive feed for startup-idea posts, likes, and comments.",
    skills: ["React", "TypeScript", "Node.js", "Git"],
    link: "https://foundercloud.com",
    logo: "/starthawk_logo.jpeg"
  },
  {
    id: "khel",
    title: "Khel",
    role: "Co-Founder & Tech Lead",
    location: "Startup",
    description: "Co-founded a sports platform connecting 200+ users with 110+ venues, owning product development from MVP through launch.",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    link: "https://khel.it"
  }
];

const projectExperiences: Experience[] = [
  {
    id: "seven-factor",
    title: "7Factor & WPI",
    role: "Software Engineering Project",
    location: "Sandy Springs, GA",
    description: "Built a Webhooks-as-a-Service application for secure, real-time event delivery with Next.js and deployed it to AWS.",
    skills: ["React", "TypeScript", "AWS Lambda", "REST APIs"]
  },
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
    <div className="rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-zinc-800 hover:dark:border-zinc-700 transition-all">
      <div className="flex items-start gap-3">
        {/* Logo */}
        {exp.logo && (
          <div className={`flex-shrink-0 w-10 h-10 rounded-md overflow-hidden ${exp.id === 'sirkoi' ? 'bg-white p-1' : ''}`}>
            <Image
              src={exp.logo}
              alt={`${exp.title} logo`}
              width={40}
              height={40}
              className={`w-full h-full ${exp.id === 'baato' ? 'object-cover scale-150' : 'object-contain'}`}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate mb-1">{exp.role}</h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400">{exp.title}</p>
            <div className="flex flex-col text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-500 font-mono mt-1.5">
              {exp.date && (
                <span className="flex items-center gap-1"><Calendar size={10} className="sm:w-[11px] sm:h-[11px]" />{exp.date}</span>
              )}
              {exp.location && (
                <span className="flex items-center gap-1"><MapPin size={10} className="sm:w-[11px] sm:h-[11px]" />{exp.location}</span>
              )}
            </div>
          </div>
          <div className="flex items-center sm:flex-col sm:items-end gap-2 mt-2 sm:mt-0">
            <div className="flex items-center gap-2">
              {exp.link && (
                <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-green-400 transition-colors p-1" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink size={14} />
                </a>
              )}
              {exp.github && (
                <a href={exp.github} target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-green-400 transition-colors p-1" onClick={(e) => e.stopPropagation()}>
                  <Github size={14} />
                </a>
              )}
            </div>
            <button
              onClick={onToggle}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all border ${isExpanded
                  ? "bg-zinc-50 text-zinc-900 border-gray-200 dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
                  : "bg-transparent text-zinc-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white"
                }`}
            >
              <span>{isExpanded ? "Hide" : "Details"}</span>
              <ChevronRight size={10} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-200">
          <p className="text-xs text-zinc-700 dark:text-zinc-400 leading-relaxed">{exp.description}</p>
          <p className="text-[10px] text-zinc-600 dark:text-zinc-500 mt-2 italic">
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
      <div className="bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-lg shadow-md h-full w-full border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        <div className="mb-2">
          <h2 className="text-lg sm:text-xl font-serif mb-1">
            <span className="text-zinc-700 dark:text-zinc-400">Work &</span> <span className="italic">Projects</span>
          </h2>
        </div>

        {/* Tabs - scrollable on mobile */}
        <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-zinc-800 pb-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => { setActiveTab("professional"); setExpandedId(null); }}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all border whitespace-nowrap flex-shrink-0 ${activeTab === "professional"
                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/25 dark:text-red-300 dark:border-red-500/40"
                : "text-zinc-700 dark:text-zinc-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 border-gray-200 dark:border-zinc-700 hover:border-red-500/30"
              }`}
          >
            Professional
          </button>
          <button
            onClick={() => { setActiveTab("startup"); setExpandedId(null); }}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all border whitespace-nowrap flex-shrink-0 ${activeTab === "startup"
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/25 dark:text-green-300 dark:border-green-500/40"
                : "text-zinc-700 dark:text-zinc-400 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-500/10 border-gray-200 dark:border-zinc-700 hover:border-green-500/30"
              }`}
          >
            Startup
          </button>
          <button
            onClick={() => { setActiveTab("projects"); setExpandedId(null); }}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all border whitespace-nowrap flex-shrink-0 ${activeTab === "projects"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/25 dark:text-yellow-300 dark:border-yellow-500/40"
                : "text-zinc-700 dark:text-zinc-400 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 border-gray-200 dark:border-zinc-700 hover:border-yellow-500/30"
              }`}
          >
            Projects
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto pr-1 sm:pr-2 flex-1">
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
