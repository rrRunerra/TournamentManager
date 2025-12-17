import { useRoute, useLsi } from "uu5g05";
import { useEffect, useState } from "react";
import Calls from "../calls.js";
import importLsi from "../lsi/import-lsi.js";
import "../styles/routes/profile.css";
import useUser from "../hooks/useUser.js";
import { Button } from "../bricks/atom/Button.js";
import Profile1 from "../assets/profiles/1.png";
import Profile2 from "../assets/profiles/2.png";
import Profile3 from "../assets/profiles/3.png";
import Profile4 from "../assets/profiles/4.png";
import Profile5 from "../assets/profiles/5.png";
import Profile6 from "../assets/profiles/6.png";
import Profile7 from "../assets/profiles/7.png";
import Profile8 from "../assets/profiles/8.png";

const AVATAR_OPTIONS = [
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
  Profile7,
  Profile8,
  null, // Represents "Default" / No Image
];

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

const AvatarModal = ({ isOpen, onClose, onSelect, currentAvatar, title }) => {
  if (!isOpen) return null;

  return (
    <div className="avatar-modal-overlay" onClick={onClose}>
      <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="avatar-modal-title">{title}</h3>
        <div className="avatar-grid">
          {AVATAR_OPTIONS.map((src, index) => (
            <div
              key={index}
              className={`avatar-option ${currentAvatar === src ? "selected" : ""}`}
              onClick={() => onSelect(src)}
              title={src ? "Custom Avatar" : "Default Avatar"}
            >
              {src ? (
                <img src={src} alt={`Avatar ${index + 1}`} />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" height="40" width="40">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="avatar-modal-actions">
          <Button onClick={onClose} type="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const id = new URLSearchParams(window.location.search).get("id");
  const [stats, setStats] = useState(null);
  const [lastTournaments, setLastTournaments] = useState([]);
  const lsi = useLsi(importLsi, ["Profile"]);
  const [route, setRoute] = useRoute();
  const [user] = useUser();

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);

  // Determine if viewing own profile
  // If no ID param, it's my profile (loaded via user object or handled by fetchData)
  // If ID param equals my ID, it's my profile
  const isOwner = user && (id === user.id || !id);

  useEffect(() => {
    async function fetchData() {
      const targetId = id || (user ? user.id : null);
      if (!targetId) return; // Should handle not logged in state better if needed

      // Load avatar from localStorage
      const savedAvatar = localStorage.getItem(`user_avatar_${targetId}`);
      if (savedAvatar) {
        setAvatar(savedAvatar);
      } else {
        setAvatar(null);
      }

      const s = await Calls.player.get({ id: targetId });
      setStats(s);
      setAvatar(s.profilePicture);

      try {
        const tournamentsResponse = await Calls.tournament.listUserTournaments({
          userId: targetId,
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
  }, [id, user]);

  const handleAvatarSelect = (newAvatar) => {
    setAvatar(newAvatar);
    const targetId = id || (user ? user.id : null);
    if (targetId) {
      if (newAvatar) {
        localStorage.setItem(`user_avatar_${targetId}`, newAvatar);
        Calls.player.updateProfilePicture({ id: targetId, profilePicture: newAvatar });
      } else {
        localStorage.removeItem(`user_avatar_${targetId}`);
      }
      // Dispatch event for Navbar
      window.dispatchEvent(new Event("avatarUpdated"));
    }
    setIsAvatarModalOpen(false);
  };

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
        {/* Avatar Section */}
        {avatar ? (
          <div className="profile-avatar-container">
            <img src={avatar} alt="Profile" className="profile-avatar-image" />
            {isOwner && (
              <div className="profile-avatar-edit-icon" onClick={() => setIsAvatarModalOpen(true)}>
                <svg viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div className="profile-icon" style={{ position: "relative" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" height="120" width="120">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            {isOwner && (
              <div
                className="profile-avatar-edit-icon"
                onClick={() => setIsAvatarModalOpen(true)}
                style={{ bottom: "-10px", right: "-10px" }} // Adjust for svg container
              >
                <svg viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </div>
            )}
          </div>
        )}

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

      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={avatar}
        title={lsi.selectProfilePicture}
      />
    </div>
  );
}
