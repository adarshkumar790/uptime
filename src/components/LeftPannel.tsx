import { BsInstagram } from "react-icons/bs";
import "../LeftPanel.css"
import { GiMailbox, GiShadowFollower } from "react-icons/gi";
import { FaXTwitter } from "react-icons/fa6";
import award from "../assets/award1.jpg";
import award1 from "../assets/award5.jpg";
import award2 from "../assets/award6.jpg";
import uptime from "../assets/uptimes.png"


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

      <p className="lp-follow-row">
      <GiShadowFollower/> {user.followers} followers · {user.following} following
      </p>

      <div className="lp-info-list">
        {user.company && (
          <p className="lp-info-row">🏢 {user.company}</p>
        )}

        {user.location && (
          <p className="lp-info-row">📍 {user.location}</p>
        )}

        <p className="lp-info-row">
          <GiMailbox /> <a href={`mailto:${user.email}`}>{user.email} "uptime@gmail.com"</a>
        </p>

        {user.blog && (
          <p className="lp-info-row">
            {" "}
            <a href={user.blog} target="_blank" rel="noreferrer">
              {user.blog}
            </a>
          </p>
        )}
        <p className="lp-info-row">
          <BsInstagram /> kushwaha
        </p>

        {user.twitter_username && (
          <p className="lp-info-row">
            <FaXTwitter /> @{user.twitter_username}
          </p>
        )}
      </div>

      <div className="lp-section">
        <h4 className="lp-subtitle">Achievements</h4>
        <div className="lp-achievements">
          <img src={award} alt="yolo" className="lp-badge" />
          <img src={award1} alt="yolo" className="lp-badge" />

          <img src={award2} alt="yolo" className="lp-badge" />

        </div>
      </div>

      <div className="lp-section">
        <h4 className="lp-subtitle">Organizations</h4>
        <div className="lp-orgs">
          <img
            src={uptime}
            alt="org logo"
            className="lp-org-avatar w-20 h-20"
          />
        </div>
      </div>
    </aside>
  );
}
