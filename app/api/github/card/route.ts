import { getGitHubOverview, type ActivityItem, type GitHubOverview } from "../../../lib/github";

// Live activity card embedded in the GitHub profile README via
// <img src="https://aarogyarijal.com/api/github/card?theme=dark">.
// GitHub proxies README images through camo, which honours Cache-Control.
export const dynamic = "force-dynamic";

const THEMES = {
  light: {
    bg: "#ffffff",
    border: "#e4e4e7",
    title: "#18181b",
    text: "#3f3f46",
    muted: "#71717a",
    levels: ["#f4f4f5", "#bbf7d0", "#4ade80", "#16a34a", "#166534"],
    accent: "#15803d",
  },
  dark: {
    bg: "#0d1117",
    border: "#30363d",
    title: "#f4f4f5",
    text: "#d4d4d8",
    muted: "#a1a1aa",
    levels: ["#1f2937", "#14532d", "#15803d", "#22c55e", "#86efac"],
    accent: "#4ade80",
  },
};

const WIDTH = 760;
const PAD = 24;
const CELL = 10;
const STEP = 13;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const truncate = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [604800, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [size, label] of units) if (seconds >= size) return `${Math.floor(seconds / size)}${label} ago`;
  return "just now";
}

function activityLine(item: ActivityItem): string {
  const where = item.repo ? `in ${item.repo}` : "in a private repo";
  const detail = item.detail ? ` — ${item.detail}` : "";
  return truncate(`${item.title} ${where}${detail}`, 82);
}

function renderCard(data: GitHubOverview, theme: (typeof THEMES)["light"]): string {
  const days = data.weeks.flat();
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  const activeDays = days.filter((d) => d.count > 0).length;

  const heatTop = 92;
  const cells = data.weeks
    .map((week, wi) =>
      week
        .map((day) => {
          const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
          return `<rect x="${PAD + wi * STEP}" y="${heatTop + weekday * STEP}" width="${CELL}" height="${CELL}" rx="2" fill="${theme.levels[day.level]}"/>`;
        })
        .join("")
    )
    .join("");

  const months: string[] = [];
  let lastMonth = -1;
  let lastX = -100;
  data.weeks.forEach((week, wi) => {
    const month = new Date(`${week[0].date}T00:00:00Z`).getUTCMonth();
    const x = PAD + wi * STEP;
    if (month !== lastMonth && x - lastX >= STEP * 3) {
      months.push(`<text x="${x}" y="${heatTop - 6}" class="small">${MONTHS[month]}</text>`);
      lastX = x;
    }
    lastMonth = month;
  });

  const activityTop = heatTop + 7 * STEP + 34;
  const activity = data.activity.slice(0, 3);
  const rows = activity
    .map((item, i) => {
      const y = activityTop + 20 + i * 24;
      return `<circle cx="${PAD + 4}" cy="${y - 4}" r="3" fill="${item.isPrivate ? theme.muted : theme.accent}"/>
      <text x="${PAD + 16}" y="${y}" class="body">${escape(activityLine(item))}</text>
      <text x="${WIDTH - PAD}" y="${y}" class="small" text-anchor="end">${timeAgo(item.createdAt)}</text>`;
    })
    .join("");
  const height = activityTop + 20 + Math.max(activity.length, 1) * 24 + 8;

  const stats = `${data.totalContributions.toLocaleString("en-US")} contributions in the last year · ${activeDays} active days · ${longest}-day longest streak${data.currentStreak > 0 ? ` · ${data.currentStreak}-day current streak` : ""}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" role="img" aria-label="${escape(stats)}">
  <style>
    text { font-family: ${FONT}; }
    .title { font-size: 18px; font-weight: 600; fill: ${theme.title}; }
    .sub { font-size: 12px; fill: ${theme.muted}; }
    .label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; fill: ${theme.muted}; }
    .body { font-size: 13px; fill: ${theme.text}; }
    .small { font-size: 10px; fill: ${theme.muted}; }
  </style>
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="10" fill="${theme.bg}" stroke="${theme.border}"/>
  <text x="${PAD}" y="40" class="title">What I've been shipping</text>
  <text x="${PAD}" y="60" class="sub">${escape(stats)}</text>
  ${months.join("")}
  ${cells}
  <text x="${PAD}" y="${activityTop}" class="label">LATEST</text>
  ${rows || `<text x="${PAD}" y="${activityTop + 20}" class="body">No recent activity.</text>`}
</svg>`;
}

export async function GET(request: Request) {
  const theme = new URL(request.url).searchParams.get("theme") === "dark" ? THEMES.dark : THEMES.light;
  try {
    const svg = renderCard(await getGitHubOverview(), theme);
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GitHub card error:", error);
    // Still a valid image so the README never shows a broken icon; retried after 5 minutes.
    const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="72" viewBox="0 0 ${WIDTH} 72">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="71" rx="10" fill="${theme.bg}" stroke="${theme.border}"/>
  <text x="${PAD}" y="42" font-family="${FONT}" font-size="13" fill="${theme.muted}">Live activity is taking a break. See aarogyarijal.com</text>
</svg>`;
    return new Response(fallback, {
      headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=300" },
    });
  }
}
