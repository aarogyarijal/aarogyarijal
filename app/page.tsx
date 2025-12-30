"use client";

import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import Education from "./components/Education";
import WorkProjects from "./components/WorkProjects";
import TechnicalArsenal from "./components/TechnicalArsenal";
import AarogyaBot from "./components/AarogyaBot";

export default function Home() {
  const [highlightedSkills, setHighlightedSkills] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_2fr_1fr] gap-4 w-full max-w-7xl mx-auto">
        {/* Left Column - Profile & Education */}
        <div className="flex flex-col gap-4 md:col-span-1">
          <ProfileCard />
          <Education />
        </div>

        {/* Middle Column - Work/Projects */}
        <div className="md:col-span-1 lg:col-span-1 min-h-[400px] md:min-h-0">
          <WorkProjects onSkillHighlight={setHighlightedSkills} />
        </div>

        {/* Right Column - Skills & Chat */}
        <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
          <TechnicalArsenal highlightedSkills={highlightedSkills} />
          <div className="min-h-[320px]">
            <AarogyaBot />
          </div>
        </div>
      </div>
    </div>
  );
}
