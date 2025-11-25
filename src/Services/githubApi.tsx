import axios from "axios";


export interface ContributionItem {
  date: string;
  count: number;
}

export interface ContributionResult {
  items: [string, number][];
  total: number;
}

export interface Repo {
  id: number;
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  description: string | null;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
}

const REST_BASE = "https://api.github.com";
const GRAPHQL_URL = "https://api.github.com/graphql";

export const getUser = async (username: string) => {
  try {
    return await axios.get(`${REST_BASE}/users/${username}`);
  } catch (err) {
    throw err;
  }
};

export const getUserEvents = async (username: string) => {
  try {
    return await axios.get<GitHubEvent[]>(
      `${REST_BASE}/users/${username}/events/public`
    );
  } catch (err) {
    throw err;
  }
};

export const getContributionsFromGraphQL = async (
  username: string,
  token: string
): Promise<ContributionResult> => {
  const query = `
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

  try {
    const resp = await axios.post(
      GRAPHQL_URL,
      { query, variables: { login: username } },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const weeks =
      resp.data?.data?.user?.contributionsCollection?.contributionCalendar
        ?.weeks || [];

    const items: [string, number][] = [];

    for (const w of weeks) {
      for (const d of w.contributionDays) {
        items.push([d.date, d.contributionCount]);
      }
    }

    items.sort((a, b) => +new Date(a[0]) - +new Date(b[0]));

    const total =
      resp.data?.data?.user?.contributionsCollection?.contributionCalendar
        ?.totalContributions || 0;

    return { items, total };
  } catch (err) {
    throw err;
  }
};

export const getContributionsFromSVG = async (
  username: string
): Promise<ContributionResult> => {
  try {
    const url = `https://github.com/users/${username}/contributions`;
    const resp = await axios.get(url, { responseType: "text" });

    const parser = new DOMParser();
    const doc = parser.parseFromString(resp.data, "image/svg+xml");

    const rects = Array.from(doc.querySelectorAll("rect"));

    const items: [string, number][] = rects
      .map((r) => {
        const date = r.getAttribute("data-date") || r.getAttribute("date");
        const count = r.getAttribute("data-count") || r.getAttribute("count") || "0";
        return date ? [date, parseInt(count, 10)] : null;
      })
      .filter(Boolean) as [string, number][];

    items.sort((a, b) => +new Date(a[0]) - +new Date(b[0]));

    const total = items.reduce((sum, d) => sum + d[1], 0);

    return { items, total };
  } catch (err) {
    throw err;
  }
};

export const getContributions = async (
  username: string
): Promise<ContributionResult> => {
  const token = import.meta.env.VITE_GITHUB_TOKEN || "";

  try {
    if (token) return await getContributionsFromGraphQL(username, token);
    return await getContributionsFromSVG(username);
  } catch (err) {
    try {
      return await getContributionsFromSVG(username);
    } catch {
      return { items: [], total: 0 };
    }
  }
};

export const getPopularRepos = async (
  username: string,
  limit: number = 6
): Promise<Repo[]> => {
  console.log("Fetching popular repos for:", username);

  const token = import.meta.env.VITE_GITHUB_TOKEN;

  try {
    const resp = await axios.get<Repo[]>(
      `${REST_BASE}/users/${username}/repos?sort=stars&direction=desc&per_page=${limit}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    console.log("Popular Repos API Response:", resp.data);
    console.log("Stars:", resp.data.map((r) => r.stargazers_count));

    return resp.data;
  } catch (err) {
    console.error("Popular Repos Error:", err);
    throw err;
  }
};
