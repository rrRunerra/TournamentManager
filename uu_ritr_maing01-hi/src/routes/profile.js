import { useRoute, useLsi } from "uu5g05";
import { useEffect, useState } from "react";
import Calls from "../calls.js";
import importLsi from "../lsi/import-lsi.js";
import "../styles/routes/profile.css";

const StatCard = ({ label, value, color }) => (
  <div
    className="stat-card"
    style={{
      borderColor: color || "rgba(255, 255, 255, 0.1)",
      boxShadow: color ? `0 0 20px ${color}20` : "none",
    }}
  >
    <div
      className="stat-card-value"
      style={{
        color: color || "#fff",
        textShadow: color ? `0 0 10px ${color}40` : "none",
      }}
    >
      {value}
    </div>
    <div className="stat-card-label">{label}</div>
  </div>
);

export default function ProfilePage() {
  const id = new URLSearchParams(window.location.search).get("id");
  const [stats, setStats] = useState(null);
  const [lastTournaments, setLastTournaments] = useState([]);
  const lsi = useLsi(importLsi, ["Profile"]);
  const [route, setRoute] = useRoute();

  useEffect(() => {
    async function fetchData() {
      const s = await Calls.player.get({ id: id });
      setStats(s);

      const playerId = id || s.id;

      try {
        const tournamentsResponse = await Calls.tournament.listUserTournaments({
          userId: playerId,
          limit: 3,
          status: "finished",
        });
        const userTournaments = tournamentsResponse.itemList || [];

        setLastTournaments(userTournaments);
      } catch (e) {
        console.error("Error fetching tournaments for profile", e);
      }
    }
    fetchData();
  }, [id]);

  if (!stats) return <div style={{ padding: "2rem", color: "#fff" }}>Loading...</div>;

  const playerStats = stats.stats || {
    finals_firstPlace: 0,
    finals_secondPlace: 0,
    finals_thirdPlace: 0,
    finals_fourthPlace: 0,
    matchesWon: 0,
    matchesLost: 0,
    tournamentsPlayed: 0,
    flappyBirdHighScore: 0,
  };

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" height="120" width="120">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <h1 className="profile-name">{stats.name}</h1>
        <div className="profile-details">
          <span>{stats.role}</span>
          <span>•</span>
          <span>{stats.school}</span>
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="stats-title">{lsi.statsTitle}</h2>

        <div className="stats-grid">
          <StatCard
            label={lsi.firstPlace}
            value={playerStats.finals_firstPlace || 0}
            color="#FFD700" // Gold
          />
          <StatCard
            label={lsi.secondPlace}
            value={playerStats.finals_secondPlace || 0}
            color="#C0C0C0" // Silver
          />
          <StatCard
            label={lsi.thirdPlace}
            value={playerStats.finals_thirdPlace || 0}
            color="#CD7F32" // Bronze
          />
          <StatCard
            label={lsi.fourthPlace}
            value={playerStats.finals_fourthPlace || 0}
            color="#4ecdc4" // Teal
          />
          <StatCard
            label={lsi.matchesWon}
            value={playerStats.matchesWon || 0}
            color="#00b894" // Green
          />
          <StatCard
            label={lsi.matchesLost}
            value={playerStats.matchesLost || 0}
            color="#e17055" // Red
          />
          <StatCard
            label={lsi.tournamentsPlayed}
            value={playerStats.tournamentsPlayed || 0}
            color="#a29bfe" // Purple
          />
        </div>
      </div>

      {/* Last Played Tournaments Section */}
      {lastTournaments.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2 className="stats-title">{lsi.lastTournaments}</h2>
          <div className="stats-grid">
            {lastTournaments.map((t) => {
              const playerId = id || stats.id;

              return (
                <div
                  key={t.id}
                  className="profile-tournament-card"
                  onClick={() => {
                    setRoute("tournamentDetail", { id: t.id });
                  }}
                >
                  <div className="profile-tournament-card-name">{t.name}</div>
                  <div className="profile-tournament-card-date">{new Date(t.endDate).toLocaleDateString()}</div>
                  <div style={{ marginTop: "1rem" }}>
                    <div className="profile-tournament-card-team-label">Tím</div>
                    <div className="profile-tournament-card-team-name">{t.teamName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
