const GITHUB_USERNAME = "delightsheriff";

type ContributionDay = {
  date: string;
  count: number;
};

export type ContributionData = {
  totalContributions: number;
  weeks: ContributionDay[][];
};

const QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

// Requires a GITHUB_TOKEN env var (any token works — this only reads public
// contribution data, no scopes needed). Returns null if unset or the request
// fails, so the UI can fall back gracefully instead of crashing the page.
export async function getContributions(): Promise<ContributionData | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USERNAME } }),
      next: { revalidate: 60 * 60 * 6 }, // 6h — this doesn't need to be real-time
    });

    if (!res.ok) return null;

    const json = await res.json();
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    const weeks: ContributionDay[][] = calendar.weeks.map(
      (week: { contributionDays: { date: string; contributionCount: number }[] }) =>
        week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount }))
    );

    return { totalContributions: calendar.totalContributions, weeks };
  } catch {
    return null;
  }
}
