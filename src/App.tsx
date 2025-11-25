import { useEffect, useState } from "react";
import {
  getUser,
  getContributions,
  getUserEvents,
  getPopularRepos,
} from "./Services/githubApi";
import SearchUser from "./components/SearchUser";
import LeftPanel from "./components/LeftPannel";
import ContributionHeatmap from "./components/ContribuitionHeatmap";
import ActivityOverview from "./components/ActivityOverview";
import RecentActivity from "./components/RecentActivity";
import PopularRepos from "./components/PopularRepo";
import Navbar from "./components/Navbar";
import { BsGithub } from "react-icons/bs";

export default function ProfilePage() {
  const [username, setUsername] = useState<string>("shreeramk");
  const [user, setUser] = useState<any>(null);
  const [activeTab, ] = useState<string>("Overview");

  const [contribData, setContribData] = useState<{ items: any[]; total: number }>({
    items: [],
    total: 0,
  });

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const [filteredContribs, setFilteredContribs] = useState<any[]>([]);
  const [yearRange, setYearRange] = useState<[string, string] | undefined>(undefined);

  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  const [repos, setRepos] = useState<any[]>([]);

  const years = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    if (!username) return;

    getUser(username)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));

    (async () => {
      const contribution = await getContributions(username);
      setContribData(contribution);

      if (contribution.items?.length) {
        const dates = contribution.items.map((c: any) => c[0]).sort();
        setYearRange([dates[0], dates[dates.length - 1]]);
      }

      try {
        const eventsRes = await getUserEvents(username);
        setEvents(eventsRes.data || []);
      } catch {
        setEvents([]);
      }

      try {
        const popular = await getPopularRepos(username, 6);
        setRepos(popular || []);
      } catch {
        setRepos([]);
      }
    })();
  }, [username]);

  useEffect(() => {
    if (!contribData.items.length) return;
    const filtered = contribData.items.filter(([date]) => {
      return new Date(date).getFullYear() === selectedYear;
    });
    setFilteredContribs(filtered);
  }, [selectedYear, contribData]);

  useEffect(() => {
    if (!events.length) return;
    const filtered = events.filter((ev) => {
      const d = new Date(ev.created_at);
      return d.getFullYear() === selectedYear;
    });
    setFilteredEvents(filtered);
  }, [selectedYear, events]);

  return (
    <div className="page">
      <Navbar username={username} />

      <div className="topbar">
        <SearchUser onSearch={setUsername} />
      </div>

      <div className="layout">
        <LeftPanel user={user} />

        <main className="main">
          <section className="content">
            {activeTab === "Overview" && (
              <>
                <div className="cards-row">
                  <div className="popular-repo">
                    <PopularRepos repos={repos} />
                  </div>
                </div>

                <div className="stats-row">
                  <div className="heatmap-column">
                    <div className="card">
                      <div className="card-header">
                        <div>
                          {filteredContribs
                            .reduce((sum, d) => sum + d[1], 0)
                            .toLocaleString()} contributions in {selectedYear}
                        </div>
                        <div className="contrib-settings">Contribution settings ▾</div>
                      </div>

                      <ContributionHeatmap
                        username={username}
                        data={filteredContribs}
                        yearRange={yearRange}
                      />
                    </div>

                    <div className="card">
                      <ActivityOverview events={filteredEvents} />
                    </div>
                  </div>

                  <div className="right-column">
                    <div className="card years-list">
                      {years.map((yr) => (
                        <div
                          key={yr}
                          className={`year-pill ${selectedYear === yr ? "active" : ""}`}
                          onClick={() => setSelectedYear(yr)}
                        >
                          {yr}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card contribution-activity">
                  <RecentActivity events={filteredEvents} />
                </div>
              </>
            )}

            {activeTab === "Repositories" && <div className="card">Repositories content (mock)</div>}
            {activeTab === "Projects" && <div className="card">Projects content (mock)</div>}
            {activeTab === "Packages" && <div className="card">Packages content (mock)</div>}
          </section>
        </main>
      </div>

<div className="site-footer" role="contentinfo">
    <div className="inner">

      <div className="helper">
        Seeing something unexpected? Take a look at the <a href="#">GitHub profile guide</a>.
      </div>

      <div className="footer-row">

        <div className="branding" aria-hidden="false">
          <BsGithub size={25}/>
          <div className="brand-text">© 2025 GitHub, Inc.</div>
        </div>

        <nav className="links" aria-label="Footer links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Security</a>
          <a href="#">Status</a>
          <a href="#">Community</a>
          <a href="#">Docs</a>
          <a href="#">Contact</a>
          <a href="#">Manage cookies</a>
          <a href="#">Do not share my personal information</a>
        </nav>

      </div>
    </div>
  </div>
    </div>
  );
}