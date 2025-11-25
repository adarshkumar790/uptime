import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";

interface GithubEvent {
  type: string;
  repo?: { name?: string };
  payload?: {
    commits?: { message?: string }[];
    pull_request?: { title?: string };
    issue?: { title?: string };
  };
}

interface ActivityOverviewProps {
  events?: GithubEvent[];
}

export default function ActivityOverview({ events = [] }: ActivityOverviewProps) {
  const [openRepo, setOpenRepo] = useState<string | null>(null);

  const { summary, repoMap } = useMemo(() => {
    const counts = { commits: 0, prs: 0, issues: 0, reviews: 0 };

    const repoMap: Record<string, GithubEvent[]> = {};

    events.forEach((ev) => {
      const repoName = ev.repo?.name;
      if (!repoName) return;

      if (!repoMap[repoName]) repoMap[repoName] = [];
      repoMap[repoName].push(ev);
      
      switch (ev.type) {
        case "PushEvent":
          counts.commits += ev.payload?.commits?.length || 0;
          break;
        case "PullRequestEvent":
          counts.prs += 1;
          break;
        case "IssuesEvent":
          counts.issues += 1;
          break;
        case "PullRequestReviewEvent":
        case "PullRequestReviewCommentEvent":
          counts.reviews += 1;
          break;
      }
    });

    const total =
      counts.commits + counts.prs + counts.issues + counts.reviews || 1;

    return {
      summary: {
        labels: ["Commits", "PRs", "Issues", "Code review"],
        values: [
          Math.round((counts.commits / total) * 100),
          Math.round((counts.prs / total) * 100),
          Math.round((counts.issues / total) * 100),
          Math.round((counts.reviews / total) * 100),
        ],
        raw: counts,
      },
      repoMap,
    };
  }, [events]);

  const option = {
    tooltip: {},
    radar: {
      indicator: summary.labels.map((l) => ({ name: l, max: 100 })),
      center: ["50%", "50%"],
      radius: 70,
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: summary.values,
            name: "Activity",
            areaStyle: { color: "rgba(36,139,83,0.15)" },
            lineStyle: { color: "#239a3b" },
            itemStyle: { color: "#239a3b" },
          },
        ],
      },
    ],
  };

  const repos = Object.keys(repoMap);

  return (
    <div>
      <h4 style={{ marginTop: 0 }}>Activity overview</h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "16px",
          marginTop: "12px",
          alignItems: "start",
        }}
      >
        <div style={{ fontSize: 13, color: "#586069" }}>
          <h4 style={{ margin: "0 0 6px", fontSize: 14 }}>Contributed to</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {repos.map((repo) => (
              <div
                key={repo}
                style={{
                  cursor: "pointer",
                  color: "#0366d6",
                  fontWeight: 600,
                }}
                onClick={() =>
                  setOpenRepo(openRepo === repo ? null : repo)
                }
              >
                {repo}

                {openRepo === repo && (
                  <div
                    style={{
                      marginTop: 6,
                      paddingLeft: 10,
                      fontWeight: 400,
                      color: "#444",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {repoMap[repo].map((ev, idx) => (
                      <div key={idx}>
                        {ev.type === "PushEvent" &&
                          ev.payload?.commits?.map((c, i) => (
                            <div key={i}>• Commit: {c?.message}</div>
                          ))}

                        {ev.type === "PullRequestEvent" && (
                          <div>• Pull Request: {ev.payload?.pull_request?.title}</div>
                        )}

                        {ev.type === "IssuesEvent" && (
                          <div>• Issue: {ev.payload?.issue?.title}</div>
                        )}

                        {(ev.type === "PullRequestReviewEvent" ||
                          ev.type === "PullRequestReviewCommentEvent") && (
                          <div>• Code review activity</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <ReactECharts option={option} style={{ height: 240, width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
