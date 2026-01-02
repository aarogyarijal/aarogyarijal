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
    <main className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_2fr_1fr] gap-4 w-full max-w-7xl mx-auto">
        {/* Left Column - Profile & Education */}
        <section className="flex flex-col gap-4 md:col-span-1" aria-label="Profile and Education">
          <ProfileCard />
          <Education />
        </section>

        {/* Middle Column - Work/Projects */}
        <section className="md:col-span-1 lg:col-span-1 min-h-[400px] md:min-h-0" aria-label="Work Experience and Projects">
          <WorkProjects onSkillHighlight={setHighlightedSkills} />
        </section>

        {/* Right Column - Skills & Chat */}
        <section className="flex flex-col gap-4 md:col-span-2 lg:col-span-1" aria-label="Skills and AI Assistant">
          <TechnicalArsenal highlightedSkills={highlightedSkills} />
          <div className="min-h-[320px]">
            <AarogyaBot />
          </div>
        </section>
      </div>
    </main>
  );
}
