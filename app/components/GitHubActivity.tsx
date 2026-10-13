"use client";

import { useEffect, useState } from "react";
import { GitCommit, GitPullRequest, CircleDot, Eye, Tag, FolderPlus, Star, GitFork, Github, ExternalLink } from "lucide-react";
import type { ActivityItem, GitHubOverview } from "../lib/github";

const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;
const LABEL_HEIGHT = 12;

// Matches the site's green accent; light/dark handled with Tailwind fill utilities.
const levelClasses = [
  "fill-zinc-100 dark:fill-zinc-800",
  "fill-green-200 dark:fill-green-900",
  "fill-green-400 dark:fill-green-700",
  "fill-green-600 dark:fill-green-500",
  "fill-green-800 dark:fill-green-300",
];

const activityIcons: Record<ActivityItem["type"], typeof GitCommit> = {
  push: GitCommit,
  pr: GitPullRequest,
  issue: CircleDot,
  review: Eye,
  release: Tag,
  create: FolderPlus,
  star: Star,
  fork: GitFork,
  other: Github,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const units: [number, string][] = [
    [60 * 60 * 24 * 365, "y"],
    [60 * 60 * 24 * 30, "mo"],
    [60 * 60 * 24 * 7, "w"],
    [60 * 60 * 24, "d"],
    [60 * 60, "h"],
    [60, "m"],
  ];
  for (const [size, label] of units) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${label} ago`;
  }
  return "just now";
}

function formatDay(date: string, count: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  const label = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  return `${count === 0 ? "No" : count} contribution${count === 1 ? "" : "s"} on ${label}`;
}

function calendarStats(weeks: GitHubOverview["weeks"]) {
  const days = weeks.flat();
  let longest = 0;
  let run = 0;
  let best = days[0];
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
    if (!best || day.count > best.count) best = day;
  }
  return [
    { label: "Active days", value: days.filter((d) => d.count > 0).length.toString() },
    { label: "Longest streak", value: `${longest}d` },
    { label: "Best day", value: best ? best.count.toString() : "0" },
  ];
}

function Heatmap({ weeks }: { weeks: GitHubOverview["weeks"] }) {
  const width = weeks.length * STEP - GAP;
  const height = LABEL_HEIGHT + 7 * STEP - GAP;

  // Label a month at the first week whose first day falls in a new month.
  const monthLabels: { x: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = new Date(`${week[0].date}T00:00:00Z`).getUTCMonth();
    if (month !== lastMonth) {
      monthLabels.push({ x: i * STEP, label: MONTHS[month] });
      lastMonth = month;
    }
  });
  // The partial first week often yields a label that collides with the next one.
  if (monthLabels.length > 1 && monthLabels[1].x - monthLabels[0].x < STEP * 3) monthLabels.shift();

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="GitHub contribution heatmap for the last year">
      {monthLabels.map((m) => (
        <text key={`${m.label}-${m.x}`} x={m.x} y={8} className="fill-zinc-500 text-[9px]">
          {m.label}
        </text>
      ))}
      {weeks.map((week, wi) =>
        week.map((day) => {
          const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
          return (
            <rect
              key={day.date}
              x={wi * STEP}
              y={LABEL_HEIGHT + weekday * STEP}
              width={CELL}
              height={CELL}
              rx={2}
              className={levelClasses[day.level]}
            >
              <title>{formatDay(day.date, day.count)}</title>
            </rect>
          );
        })
      )}
    </svg>
  );
}

export default function GitHubActivity() {
  const [data, setData] = useState<GitHubOverview | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json: GitHubOverview) => !cancelled && setData(json))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const profileUrl = `https://github.com/${data?.username ?? "aarogyarijal"}`;

  return (
    <div className="bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-lg shadow-md w-full border border-gray-200 dark:border-zinc-800 flex flex-col gap-3 md:h-full md:min-h-0 md:overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-serif mb-1">
            <span className="text-zinc-700 dark:text-zinc-400">GitHub</span> <span className="italic">Activity</span>
          </h2>
          <p className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-500">
            {data
              ? `${data.totalContributions.toLocaleString()} contributions in the last year${data.currentStreak > 0 ? ` · ${data.currentStreak}-day streak` : ""}`
              : error
                ? "Couldn't load activity right now."
                : "Loading contributions…"}
          </p>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub profile"
          className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Github size={18} />
        </a>
      </div>

      {/* Heatmap */}
      {data ? (
        <div>
          <Heatmap weeks={data.weeks} />
          <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-zinc-500">
            <span>Less</span>
            {levelClasses.map((cls, i) => (
              <svg key={i} width={9} height={9} aria-hidden="true">
                <rect width={9} height={9} rx={2} className={cls} />
              </svg>
            ))}
            <span>More</span>
          </div>
        </div>
      ) : (
        <div className={`w-full aspect-[634/94] rounded bg-zinc-100 dark:bg-zinc-800 ${error ? "" : "animate-pulse"}`} />
      )}

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-2">
          {calendarStats(data.weeks).map((stat) => (
            <div key={stat.label} className="rounded-md border border-gray-200 dark:border-zinc-800 px-2 py-1.5">
              <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent activity */}
      <div>
        <p className="text-[10px] sm:text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-500 mb-2">Latest</p>
        {data && data.activity.length > 0 ? (
          <ul className="space-y-2">
            {data.activity.map((item) => {
              const Icon = activityIcons[item.type];
              return (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2.5 p-2 -mx-2 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors"
                  >
                    <span className="mt-0.5 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                      <Icon size={13} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {item.title} <span className="font-normal text-zinc-600 dark:text-zinc-400">in {item.repo.split("/")[1] ?? item.repo}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 flex-shrink-0">{timeAgo(item.createdAt)}</span>
                      </span>
                      {item.detail && (
                        <span className="block text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 truncate">{item.detail}</span>
                      )}
                    </span>
                    <ExternalLink size={12} className="mt-1 flex-shrink-0 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : data || error ? (
          <p className="text-xs text-zinc-600 dark:text-zinc-500">
            No recent public activity.{" "}
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 dark:text-green-400 underline">
              See GitHub
            </a>
          </p>
        ) : (
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
