import { useEffect, useState } from "react";
import "../Navbar.css";

import { FiSearch } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { GoOrganization, GoBell, GoGitPullRequest, GoIssueOpened } from "react-icons/go";
import { IoMdArrowDropdown } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";

import {
  getUser,
  getContributions,
  getPopularRepos,
} from "../Services/githubApi";

interface NavbarProps {
  username: string;
}

export default function Navbar({ username }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [popularRepos, setPopularRepos] = useState<any[]>([]);
  const [contributionsTotal, setContributionsTotal] = useState(0);

  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        const userResp = await getUser(username);
        setUser(userResp.data);

        const contrib = await getContributions(username);
        setContributionsTotal(contrib.total);

        const popular = await getPopularRepos(username, 6);
        setPopularRepos(popular);
      } catch (err) {
        console.error("Navbar Fetch Error:", err);
      }
    })();
  }, [username]);

  return (
    <>
      <div className="nav-container">

        <div className="nav-left">
          <button className="menu-btn">
            <span className="menu-icon">☰</span>
          </button>

          <FaGithub className="github-logo" />

          <span className="username">
            {user ? user.login : "loading..."}
          </span>
        </div>

        <div className="nav-right">

          <div className="search-box">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Type ⌘K to search" />
          </div>

          <button className="icon-btn"><GoOrganization /></button>
          <button className="icon-btn"><IoMdArrowDropdown /></button>

          <button className="icon-btn"><AiOutlinePlus /></button>

          <button className="icon-btn"><GoBell /></button>
          <button className="icon-btn"><GoGitPullRequest /></button>
          <button className="icon-btn"><GoIssueOpened /></button>

          {user?.avatar_url && (
            <img className="profile-pic" src={user.avatar_url} alt="profile" />
          )}
        </div>
      </div>

      <div className="tabs-container full-width">
        <div className="tab active">Overview</div>

        <div className="tab">
          Repositories
          <span className="count">{user?.public_repos ?? 0}</span>
        </div>

        <div className="tab">
          Projects
          <span className="count">0</span>
        </div>

        <div className="tab">
          Packages
          <span className="count">{popularRepos.length}</span>
        </div>

        <div className="tab">
          Stars
          <span className="count">{contributionsTotal}</span>
        </div>
      </div>
    </>
  );
}
