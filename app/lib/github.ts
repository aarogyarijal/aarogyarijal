// Server-only helpers for pulling GitHub contribution + activity data.
//
// Data sources, in order of preference:
// - Heatmap: GraphQL `contributionsCollection.contributionCalendar` (needs GITHUB_TOKEN,
//   includes private contribution counts if enabled on the profile). Falls back to parsing
//   the public https://github.com/users/<user>/contributions fragment, which needs no auth.
// - Recent activity: REST `/users/<user>/events/public`. Since Oct 2025 GitHub trims
//   PushEvent/PullRequestEvent payloads (no commit list, no PR title), so the top items are
//   enriched with a follow-up request for the commit message / PR title.

export const GITHUB_USERNAME = "aarogyarijal";
const REVALIDATE_SECONDS = 3600;

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ActivityItem {
  id: string;
  type: "push" | "pr" | "issue" | "review" | "release" | "create" | "star" | "fork" | "other";
  title: string;
  detail?: string;
  repo: string;
  url: string;
  createdAt: string;
}

export interface GitHubOverview {
  username: string;
  totalContributions: number;
  currentStreak: number;
  weeks: ContributionDay[][];
  activity: ActivityItem[];
  source: "graphql" | "html";
  fetchedAt: string;
}

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "aarogyarijal.com",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...headers(), ...init?.headers },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json() as Promise<T>;
}

// ---------- Heatmap ----------

const LEVELS: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

interface GraphQLCalendar {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
}

async function calendarFromGraphQL(): Promise<{ total: number; weeks: ContributionDay[][] }> {
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`;
  const json = await getJson<GraphQLCalendar>("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
  });
  const calendar = json.data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) throw new Error(json.errors?.[0]?.message ?? "No calendar returned");
  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVELS[d.contributionLevel] ?? 0,
      }))
    ),
  };
}

// The public fragment renders each day as
//   <td ... data-date="2026-10-12" id="contribution-day-component-0-0" data-level="1" ...>
//   <tool-tip for="contribution-day-component-0-0">3 contributions on October 12th.</tool-tip>
async function calendarFromHtml(): Promise<{ total: number; weeks: ContributionDay[][] }> {
  const res = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions`, {
    headers: { "User-Agent": "aarogyarijal.com" },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`contributions page -> ${res.status}`);
  const html = await res.text();

  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^(\d+)\s+contribution/);
    counts.set(m[1], n ? Number(n[1]) : 0);
  }

  const days: ContributionDay[] = [];
  for (const m of html.matchAll(/<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g)) {
    const tag = m[0];
    const date = tag.match(/data-date="([^"]+)"/)?.[1];
    const id = tag.match(/id="([^"]+)"/)?.[1];
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    if (!date) continue;
    days.push({ date, count: (id && counts.get(id)) || 0, level: Math.min(4, level) as ContributionDay["level"] });
  }
  if (days.length === 0) throw new Error("Could not parse contributions page");

  // Cells are emitted row-by-row (weekday), so rebuild Sunday-first weeks by date.
  days.sort((a, b) => a.date.localeCompare(b.date));
  const weeks: ContributionDay[][] = [];
  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weekday === 0 || weeks.length === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
  }

  const totalText = html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1];
  const total = totalText
    ? Number(totalText.replace(/,/g, ""))
    : days.reduce((sum, d) => sum + d.count, 0);
  return { total, weeks };
}

function currentStreak(weeks: ContributionDay[][]): number {
  const days = weeks.flat();
  let i = days.length - 1;
  // Today not having contributions yet shouldn't break the streak.
  if (i >= 0 && days[i].count === 0) i--;
  let streak = 0;
  for (; i >= 0 && days[i].count > 0; i--) streak++;
  return streak;
}

// ---------- Recent activity ----------

interface RawEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    head?: string;
    size?: number;
    commits?: { message: string; sha: string }[];
    pull_request?: { number: number; title?: string; html_url?: string; merged?: boolean };
    issue?: { number: number; title?: string; html_url?: string };
    release?: { name?: string; tag_name?: string; html_url?: string };
    review?: { html_url?: string };
    forkee?: { full_name?: string; html_url?: string };
  };
}

const firstLine = (s: string) => s.split("\n")[0].trim();

function toActivity(e: RawEvent): ActivityItem | null {
  const repo = e.repo.name;
  const repoUrl = `https://github.com/${repo}`;
  const base = { id: e.id, repo, createdAt: e.created_at };
  const p = e.payload;

  switch (e.type) {
    case "PushEvent": {
      const msg = p.commits?.length ? firstLine(p.commits[p.commits.length - 1].message) : undefined;
      return {
        ...base,
        type: "push",
        title: p.size && p.size > 1 ? `Pushed ${p.size} commits` : "Pushed a commit",
        detail: msg,
        url: p.head ? `${repoUrl}/commit/${p.head}` : repoUrl,
      };
    }
    case "PullRequestEvent": {
      const pr = p.pull_request;
      if (!pr) return null;
      const verb = p.action === "closed" ? (pr.merged ? "Merged" : "Closed") : p.action === "opened" ? "Opened" : null;
      if (!verb) return null;
      return {
        ...base,
        type: "pr",
        title: `${verb} PR #${pr.number}`,
        detail: pr.title,
        url: pr.html_url ?? `${repoUrl}/pull/${pr.number}`,
      };
    }
    case "PullRequestReviewEvent": {
      const pr = p.pull_request;
      if (!pr) return null;
      return {
        ...base,
        type: "review",
        title: `Reviewed PR #${pr.number}`,
        detail: pr.title,
        url: p.review?.html_url ?? `${repoUrl}/pull/${pr.number}`,
      };
    }
    case "IssuesEvent": {
      const issue = p.issue;
      if (!issue || (p.action !== "opened" && p.action !== "closed")) return null;
      return {
        ...base,
        type: "issue",
        title: `${p.action === "opened" ? "Opened" : "Closed"} issue #${issue.number}`,
        detail: issue.title,
        url: issue.html_url ?? `${repoUrl}/issues/${issue.number}`,
      };
    }
    case "ReleaseEvent":
      return {
        ...base,
        type: "release",
        title: "Published a release",
        detail: p.release?.name || p.release?.tag_name,
        url: p.release?.html_url ?? `${repoUrl}/releases`,
      };
    case "CreateEvent":
      // Branch/tag creation is noise next to the push that follows it.
      if (p.ref_type !== "repository") return null;
      return { ...base, type: "create", title: "Created a repository", url: repoUrl };
    case "PublicEvent":
      return { ...base, type: "create", title: "Open-sourced a repository", url: repoUrl };
    case "ForkEvent":
      return { ...base, type: "fork", title: "Forked a repository", url: p.forkee?.html_url ?? repoUrl };
    case "WatchEvent":
      return { ...base, type: "star", title: "Starred a repository", url: repoUrl };
    default:
      return null;
  }
}

// Fill in commit messages / PR titles that the trimmed Events API payloads no longer carry.
async function enrich(item: ActivityItem, event: RawEvent): Promise<ActivityItem> {
  if (item.detail) return item;
  try {
    if (item.type === "push" && event.payload.head) {
      const commit = await getJson<{ commit: { message: string } }>(
        `https://api.github.com/repos/${item.repo}/commits/${event.payload.head}`
      );
      return { ...item, detail: firstLine(commit.commit.message) };
    }
    if ((item.type === "pr" || item.type === "review") && event.payload.pull_request) {
      const pr = await getJson<{ title: string; merged_at: string | null }>(
        `https://api.github.com/repos/${item.repo}/pulls/${event.payload.pull_request.number}`
      );
      const title =
        item.title.startsWith("Closed") && pr.merged_at ? item.title.replace("Closed", "Merged") : item.title;
      return { ...item, title, detail: pr.title };
    }
  } catch {
    // Enrichment is best-effort; the item still renders without detail.
  }
  return item;
}

async function recentActivity(limit: number): Promise<ActivityItem[]> {
  const events = await getJson<RawEvent[]>(
    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=50`
  );

  const picked: { item: ActivityItem; event: RawEvent }[] = [];
  for (const event of events) {
    const item = toActivity(event);
    if (!item) continue;
    // Collapse back-to-back pushes to the same repo into one entry.
    const prev = picked[picked.length - 1];
    if (prev && prev.item.type === "push" && item.type === "push" && prev.item.repo === item.repo) continue;
    picked.push({ item, event });
    if (picked.length === limit) break;
  }
  return Promise.all(picked.map(({ item, event }) => enrich(item, event)));
}

// ---------- Public entry point ----------

export async function getGitHubOverview(): Promise<GitHubOverview> {
  const calendarPromise = (async () => {
    if (process.env.GITHUB_TOKEN) {
      try {
        return { ...(await calendarFromGraphQL()), source: "graphql" as const };
      } catch (err) {
        console.error("GitHub GraphQL calendar failed, falling back to HTML:", err);
      }
    }
    return { ...(await calendarFromHtml()), source: "html" as const };
  })();

  const [calendar, activity] = await Promise.all([
    calendarPromise,
    recentActivity(2).catch((err) => {
      console.error("GitHub events fetch failed:", err);
      return [] as ActivityItem[];
    }),
  ]);

  return {
    username: GITHUB_USERNAME,
    totalContributions: calendar.total,
    currentStreak: currentStreak(calendar.weeks),
    weeks: calendar.weeks,
    activity,
    source: calendar.source,
    fetchedAt: new Date().toISOString(),
  };
}
