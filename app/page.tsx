"use client";

import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import Education from "./components/Education";
import Leadership from "./components/Leadership";
import WorkProjects from "./components/WorkProjects";
import TechnicalArsenal from "./components/TechnicalArsenal";
import AarogyaBot from "./components/AarogyaBot";

export default function Home() {
  const [highlightedSkills, setHighlightedSkills] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-4 md:h-screen md:overflow-hidden lg:p-6">
      <div className="grid grid-cols-1 gap-4 w-full max-w-7xl mx-auto md:h-full md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.55fr)_minmax(0,0.95fr)]">
        {/* Left Column - Profile & Education */}
        <section className="flex flex-col gap-4 md:h-full md:min-h-0 md:overflow-y-auto md:pr-1" aria-label="Profile, education, and leadership">
          <ProfileCard />
          <Education />
          <Leadership />
        </section>

        {/* Middle Column - Work/Projects */}
        <section className="min-h-[400px] md:h-full md:min-h-0" aria-label="Work Experience and Projects">
          <WorkProjects onSkillHighlight={setHighlightedSkills} />
        </section>

        {/* Right Column - Skills & Chat */}
        <section className="flex flex-col gap-4 md:h-full md:min-h-0" aria-label="Skills and AI Assistant">
          <TechnicalArsenal highlightedSkills={highlightedSkills} />
          <div className="min-h-[320px] md:min-h-0 md:flex-1">
            <AarogyaBot />
          </div>
        </section>
      </div>
    </main>
  );
}
