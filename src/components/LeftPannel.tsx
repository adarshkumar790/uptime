import "../LeftPanel.css"

interface User {
  login: string;
  avatar_url: string;
  name?: string;
  bio?: string;
  location?: string;
  company?: string;
  blog?: string;
  email?: string;
  twitter_username?: string;
  followers: number;
  following: number;
  public_repos: number;
}

interface LeftPanelProps {
  user?: User | null;
}

export default function LeftPanel({ user }: LeftPanelProps) {
  if (!user) {
    return (
      <aside className="left-panel placeholder">
        <div style={{ height: 20 }}></div>
      </aside>
    );
  }

  return (
    <aside className="left-panel">
      {/* Avatar */}
      <div className="lp-avatar-wrap">
        <img src={user.avatar_url} alt={user.login} className="lp-avatar" />
      </div>

      {/* Name + username */}
      <h2 className="lp-name">{user.name || user.login}</h2>
      <p className="lp-handle">{user.login}</p>

      {/* Bio */}
      {user.bio && <p className="lp-bio">{user.bio}</p>}

      {/* Edit Profile Button */}
      <button className="lp-edit-btn">Edit profile</button>

      {/* Followers & Following */}
      <p className="lp-follow-row">
        👥 {user.followers} followers · {user.following} following
      </p>

      {/* Info List (company, location, etc.) */}
      <div className="lp-info-list">
        {user.company && (
          <p className="lp-info-row">🏢 {user.company}</p>
        )}

        {user.location && (
          <p className="lp-info-row">📍 {user.location}</p>
        )}

        {user.email && (
          <p className="lp-info-row">
            ✉️ <a href={`mailto:${user.email}`}>{user.email}</a>
          </p>
        )}

        {user.blog && (
          <p className="lp-info-row">
            🔗{" "}
            <a href={user.blog} target="_blank" rel="noreferrer">
              {user.blog}
            </a>
          </p>
        )}

        {user.twitter_username && (
          <p className="lp-info-row">
            🐦 @{user.twitter_username}
          </p>
        )}
      </div>

      {/* Achievements */}
      <div className="lp-section">
        <h4 className="lp-subtitle">Achievements</h4>
        <div className="lp-achievements">
          <img src="/badges/yolo.png" alt="yolo" className="lp-badge" />
          <img src="/badges/medal.png" alt="medal" className="lp-badge" />
          <img src="/badges/star.png" alt="star" className="lp-badge" />
        </div>
      </div>

      {/* Organizations */}
      <div className="lp-section">
        <h4 className="lp-subtitle">Organizations</h4>
        <div className="lp-orgs">
          <img
            src="/orgs/uptimeai.png"
            alt="org logo"
            className="lp-org-avatar"
          />
        </div>
      </div>
    </aside>
  );
}
