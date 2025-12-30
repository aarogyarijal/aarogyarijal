"use client";

import Image from "next/image";
import { Github, Linkedin, Mail, FileText } from "lucide-react";

export default function ProfileCard() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-200 dark:border-zinc-800">
      {/* Profile Picture */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-200 dark:border-zinc-700">
        <Image
          src="/pfp.jpeg"
          alt="Aarogya Rijal Profile Picture"
          width={128}
          height={128}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Name */}
      <h1 className="text-xl sm:text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Aarogya Rijal</h1>

      {/* One-line intro */}
      <p className="text-zinc-700 dark:text-zinc-400 text-center mb-4 sm:mb-6 text-sm sm:text-base">
        Software Engineer & Developer
      </p>

      {/* Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 justify-center w-full sm:w-auto">
        <a
          href="https://github.com/aarogyarijal"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 bg-gray-50 text-zinc-900 rounded-lg hover:bg-gray-100 border border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 dark:border-zinc-700 hover:shadow-lg hover:shadow-zinc-700/50 hover:-translate-y-0.5 text-sm flex items-center gap-1.5"
        >
          <Github size={16} />
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/aarogya-rijal-6166792a7"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 dark:bg-zinc-800 dark:text-blue-400 dark:border-blue-500/30 dark:hover:bg-blue-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 text-sm flex items-center gap-1.5"
        >
          <Linkedin size={16} />
          LinkedIn
        </a>
        <a
          href="mailto:aarogya.rijal@gmail.com"
          className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200 dark:bg-zinc-800 dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 text-sm flex items-center gap-1.5"
        >
          <Mail size={16} />
          Email
        </a>
        <a
          href="/Resume-Aarogya-Rijal-2025_12_15.pdf"
          target="_blank"
          className="px-3 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 border border-pink-200 dark:bg-zinc-800 dark:text-pink-400 dark:border-pink-500/30 dark:hover:bg-pink-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 text-sm flex items-center gap-1.5"
        >
          <FileText size={16} />
          Resume
        </a>
      </div>
    </div>
  );
}
