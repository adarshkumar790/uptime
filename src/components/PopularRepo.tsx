
interface Repo {
  id: number;
  name: string;
  html_url: string;
  private: boolean;
  description?: string | null;
  language?: string | null;
  stargazers_count: number;
  forks_count: number;
}

interface PopularReposProps {
  repos?: Repo[];
}

export default function PopularRepos({ repos = [] }: PopularReposProps) {
  if (!repos.length) {
    return (
      <div className="card">
        <h3 className="section-heading">Popular repositories</h3>
        <p style={{ color: "#586069" }}>No popular repositories</p>
      </div>
    );
  }

  return (
    <div className="card popular-container">
      <h3 className="section-heading" style={{ marginBottom: "12px" }}>
        Popular repositories
      </h3>

      <div className="popular-repo-grid">
        {repos.map((repo) => (
          <div key={repo.id} className="repo-card">
            
            {/* Repo Title */}
            <div className="repo-header">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-title"
              >
                {repo.name}
              </a>

              <span className="repo-badge">
                {repo.private ? "Private" : "Public"}
              </span>
            </div>

            {/* Repo Description */}
            <p className="repo-desc">
              {repo.description || "No description provided"}
            </p>

            {/* Stats */}
            <div className="repo-stats">
              {repo.language && (
                <div className="language">
                  <span className="lang-dot"></span>
                  {repo.language}
                </div>
              )}

              <div className="stars">★ {repo.stargazers_count}</div>
              <div className="forks">🍴 {repo.forks_count}</div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
