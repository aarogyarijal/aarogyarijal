"use client";

import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import Education from "./components/Education";
import WorkProjects from "./components/WorkProjects";
import TechnicalArsenal from "./components/TechnicalArsenal";
import WordleGame from "./components/WordleGame";

export default function Home() {
  const [highlightedSkills, setHighlightedSkills] = useState<string[]>([]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 w-full h-full max-w-7xl">
        {/* Left Column - 2 divs */}
        <div className="flex flex-col h-full gap-4">
          <ProfileCard />
          <Education />
        </div>
        
        {/* Middle Column - Work/Projects */}
        <WorkProjects onSkillHighlight={setHighlightedSkills} />
        
        {/* Right Column - 2 divs */}
        <div className="flex flex-col h-full gap-4">
          <TechnicalArsenal highlightedSkills={highlightedSkills} />
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md flex-1 border border-gray-200 dark:border-zinc-800 flex flex-col">
            <div className="mb-2">
              <h2 className="text-xl font-serif">
                <span className="italic">Wordle</span>
              </h2>
              <p className="text-[10px] text-zinc-500">Guess the 4-letter word.</p>
            </div>
            <WordleGame />
          </div>
        </div>
      </div>
    </div>
  );
}
