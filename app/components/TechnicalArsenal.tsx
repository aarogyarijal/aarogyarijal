"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type SkillFilter = "all" | "frontend" | "backend" | "cloud" | "database" | "tools" | "other";

interface TechnicalArsenalProps {
  highlightedSkills?: string[];
}

// Primary skills shown by default (from resume)
const primarySkills = new Set([
  "React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS",
  "Node.js", "Python", "PHP", "Laravel",
  "AWS Lambda", "AWS EC2", "PostgreSQL", "MySQL",
  "Jest", "Agile/Scrum", "CI/CD"
]);

// All skills organized by category
const skillsData = {
  frontend: { color: "blue", skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS", "SASS"] },
  backend: { color: "green", skills: ["Node.js", "PHP", "Laravel", "Python", "Django", "Express", "Drupal", "GraphQL"] },
  cloud: { color: "orange", skills: ["AWS Lambda", "AWS EC2", "RDS", "Firebase", "CI/CD"] },
  database: { color: "purple", skills: ["PostgreSQL", "MySQL"] },
  tools: { color: "red", skills: ["Jest", "OpenCV", "GitLab", "Agile/Scrum", "ASK SDKs"] },
  other: { color: "pink", skills: ["User Research", "Data Analysis", "SEO", "Analytics", "Curriculum Development", "Teacher Training"] }
};

const colorClasses: Record<string, string> = {
  // Light-mode: use pale background with darker text/borders
  // Dark-mode: use the original tinted dark backgrounds with lighter text
  blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
  green: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30",
  orange: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30",
  purple: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30",
  red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30",
  pink: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-500/30"
};

const highlightedClasses: Record<string, string> = {
  blue: "bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/50 ring-2 ring-blue-400 z-10",
  green: "bg-green-500 text-white border-green-400 shadow-lg shadow-green-500/50 ring-2 ring-green-400 z-10",
  orange: "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/50 ring-2 ring-orange-400 z-10",
  purple: "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/50 ring-2 ring-purple-400 z-10",
  red: "bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/50 ring-2 ring-red-400 z-10",
  pink: "bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/50 ring-2 ring-pink-400 z-10"
};

export default function TechnicalArsenal({ highlightedSkills = [] }: TechnicalArsenalProps) {
  const [skillFilter, setSkillFilter] = useState<SkillFilter>("all");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const hasHighlights = highlightedSkills.length > 0;

  // Get all skills with their category info
  const allSkills = skillFilter === "all"
    ? Object.entries(skillsData).flatMap(([category, data]) =>
      data.skills.map(skill => ({ skill, category, color: data.color }))
    )
    : skillsData[skillFilter]?.skills.map(skill => ({
      skill,
      category: skillFilter,
      color: skillsData[skillFilter].color
    })) || [];

  // When highlighting, show highlighted skills + primary skills
  // When not highlighting, show only primary skills
  const visibleSkills = hasHighlights
    ? allSkills.filter(s => highlightedSkills.includes(s.skill) || primarySkills.has(s.skill))
    : allSkills.filter(s => primarySkills.has(s.skill));

  return (
    <div className="bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 overflow-visible">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-serif mb-1">
          <span className="text-zinc-700 dark:text-zinc-400">Technical</span> <span className="italic">Arsenal</span>
        </h2>
        <p className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-500">
          {hasHighlights
            ? `Showing ${highlightedSkills.length} experience skill${highlightedSkills.length > 1 ? 's' : ''}`
            : "Core technologies."}
        </p>
      </div>

      {/* Filter Toggle Button */}
      <div className="mb-2">
        <button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 text-zinc-900 border border-gray-200 rounded-md text-[10px] sm:text-xs font-medium hover:bg-gray-100 dark:bg-zinc-800/70 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white transition-all"
        >
          <span>Filter Skills</span>
          <ChevronDown size={12} className={`transition-transform ${isFilterExpanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Collapsible Filter Buttons */}
      {isFilterExpanded && (
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4 animate-in slide-in-from-top-2 duration-200">
          {[
            { key: "all" as SkillFilter, label: "All", active: "bg-gray-50 text-zinc-900 border-gray-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800", inactive: "bg-transparent text-zinc-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/60" },
            { key: "frontend" as SkillFilter, label: "Frontend", active: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500 dark:text-white dark:border-blue-500", inactive: "bg-transparent text-zinc-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-blue-50 dark:hover:bg-blue-500/10" },
            { key: "backend" as SkillFilter, label: "Backend", active: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500 dark:text-white dark:border-green-500", inactive: "bg-transparent text-zinc-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-green-50 dark:hover:bg-green-500/10" },
            { key: "cloud" as SkillFilter, label: "Cloud", active: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500 dark:text-white dark:border-orange-500", inactive: "bg-transparent text-zinc-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-orange-50 dark:hover:bg-orange-500/10" },
            { key: "database" as SkillFilter, label: "Database", active: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500 dark:text-white dark:border-purple-500", inactive: "bg-transparent text-zinc-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-purple-50 dark:hover:bg-purple-500/10" },
            { key: "tools" as SkillFilter, label: "Tools", active: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500 dark:text-white dark:border-red-500", inactive: "bg-transparent text-zinc-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-500/10" },
            { key: "other" as SkillFilter, label: "Other", active: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500 dark:text-white dark:border-pink-500", inactive: "bg-transparent text-zinc-700 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-pink-50 dark:hover:bg-pink-500/10" },
          ].map(({ key, label, active, inactive }) => (
            <button
              key={key}
              onClick={() => setSkillFilter(key)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all border ${skillFilter === key ? active : inactive}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Skills Grid */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-y-auto overflow-x-visible p-1 -m-1 transition-all max-h-[200px] sm:max-h-[250px]">
        {visibleSkills.map(({ skill, category, color }) => {
          const isHighlighted = highlightedSkills.includes(skill);
          const isDimmed = hasHighlights && !isHighlighted;

          return (
            <span
              key={skill}
              className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border transition-all duration-300 ${isHighlighted
                  ? highlightedClasses[color]
                  : isDimmed
                    ? `${colorClasses[color]} opacity-40`
                    : `${colorClasses[color]} hover:scale-105`
                }`}
              title={`Category: ${category}`}
            >
              {skill}
            </span>
          );
        })}
      </div>

      {/* Skills Count */}
      <div className="mt-2 sm:mt-3 pt-2 border-t border-zinc-800">
        <p className="text-[10px] sm:text-xs text-zinc-500">
          {visibleSkills.length} skill{visibleSkills.length !== 1 ? "s" : ""}
          {hasHighlights && <span className="text-zinc-400"> • {highlightedSkills.length} from experience</span>}
        </p>
      </div>
    </div>
  );
}
