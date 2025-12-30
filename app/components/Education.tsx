"use client";

interface EducationEntry {
  name: string;
  degree: string;
  years: string;
  location: string;
  color: string;
}

const educationData: EducationEntry[] = [
  {
    name: "Worcester Polytechnic Institute",
    degree: "BS in Computer Science",
    years: "2022 - 2026",
    location: "Massachusetts, USA",
    color: "red"
  },
  {
    name: "United World College",
    degree: "IBDP",
    years: "2020 - 2022",
    location: "Pune, India",
    color: "blue"
  },
  {
    name: "Ullens School",
    degree: "National Examinations Board (NEB)",
    years: "2012 - 2020",
    location: "Kathmandu, Nepal",
    color: "green"
  }
];

const colorClasses: Record<string, string> = {
  red: "border-red-500",
  blue: "border-blue-500",
  green: "border-green-500"
};

const dotColorClasses: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500"
};

export default function Education() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-serif mb-1">
          <span className="italic">Education</span>
        </h2>
        <p className="text-[10px] sm:text-xs text-zinc-500">Academic background.</p>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {educationData.map((edu, index) => (
          <div
            key={index}
            className={`relative pl-4 border-l-2 ${colorClasses[edu.color]}`}
          >
            <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${dotColorClasses[edu.color]}`}></div>
            <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{edu.name}</h4>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{edu.degree}</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{edu.years}</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{edu.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
