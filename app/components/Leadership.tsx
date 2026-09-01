interface LeadershipEntry {
  role: string;
  organization: string;
  date: string;
}

const leadershipData: LeadershipEntry[] = [
  {
    role: "Treasurer",
    organization: "Table Tennis Team, Worcester Polytechnic Institute",
    date: "Dec 2025 - Dec 2026",
  },
  {
    role: "Peer Well-Being Ambassador",
    organization: "Worcester Polytechnic Institute",
    date: "May 2023 - May 2024",
  },
  {
    role: "UN Speaker on Youth in Technology",
    organization: "Nepal",
    date: "July 2022",
  },
  {
    role: "Finalist & Team Lead, FIRST Tech Challenge",
    organization: "India",
    date: "March 2022",
  },
];

export default function Leadership() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-serif mb-1">
          <span className="italic">Leadership</span>
        </h2>
        <p className="text-[10px] sm:text-xs text-zinc-500">Community and team leadership.</p>
      </div>
      <div className="space-y-3">
        {leadershipData.map((entry) => (
          <div key={entry.role} className="border-l-2 border-green-500 pl-3">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{entry.role}</h3>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">{entry.organization}</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{entry.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
