import { useMemo, useState } from "react";
import { MdArrowDownward,  MdArrowUpward } from "react-icons/md";

interface Commit {
  message?: string;
}

interface PullRequest {
  title?: string;
}

interface Issue {
  title?: string;
}

interface GithubEvent {
  type: string;
  repo?: { name?: string };
  payload?: {
    action?: string;
    commits?: Commit[];
    pull_request?: PullRequest;
    issue?: Issue;
  };
  created_at: string;
}

interface RecentActivityProps {
  events?: GithubEvent[];
}

export default function RecentActivity({ events = [] }: RecentActivityProps) {
  const [openRepo, setOpenRepo] = useState<string | null>(null);

  const repoMap = useMemo(() => {
    const map: Record<string, GithubEvent[]> = {};

    events.forEach((ev) => {
      const repoName = ev.repo?.name;
      if (!repoName) return;

      if (!map[repoName]) map[repoName] = [];
      map[repoName].push(ev);
    });

    return map;
  }, [events]);

  const repos = Object.keys(repoMap);

  if (!repos.length) {
    return (
      <div>
        <h4>Contribution activity</h4>
        <div style={{ color: "#586069" }}>No recent public activity.</div>
        <ul>
          <li>Created 56 commits in 11 repositories</li>
          <li>Opened 29 pull requests in 5 repositories</li>
        </ul>
        <button className="btn">Show more activity</button>
      </div>
    );
  }

  function formatEvent(ev: GithubEvent) {
    const { type, payload } = ev;

    if (type === "PushEvent") {
      const commits = payload?.commits || [];
      return commits.map((c) => ({
        type: "Commit",
        text: c?.message || "",
      }));
    }

    if (type === "PullRequestEvent") {
      return [
        {
          type: "Pull Request",
          text: payload?.pull_request?.title || "",
        },
      ];
    }

    if (type === "IssuesEvent") {
      return [
        {
          type: "Issue",
          text: payload?.issue?.title || "",
        },
      ];
    }

    return [{ type, text: "" }];
  }

  return (
    <div>
      <h4>Contribution activity</h4>

      {repos.map((repo) => (
        <div
          key={repo}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #e1e4e8",
            cursor: "pointer",
          }}
          onClick={() => setOpenRepo(openRepo === repo ? null : repo)}
        >
          <div
            style={{
              fontWeight: 600,
              color: "#0366d6",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{repo}</span>
            <span>{openRepo === repo ? <MdArrowUpward/> : <MdArrowDownward/>}</span>
          </div>

          {openRepo === repo && (
            <div style={{ marginTop: 10, paddingLeft: 8 }}>
              {repoMap[repo].map((ev, idx) => {
                const formattedList = formatEvent(ev);

                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: 10,
                      padding: "8px",
                      background: "#f6f8fa",
                      borderRadius: 6,
                    }}
                  >
                    {formattedList.map((f, i) => (
                      <div key={i} style={{ marginBottom: 4 }}>
                        <strong>{f.type}:</strong> {f.text}
                      </div>
                    ))}

                    <div style={{ fontSize: 12, color: "#666" }}>
                      {new Date(ev.created_at).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <button className="btn">Show more activity</button>
      </div>
      
    </div>
    
  );
}
