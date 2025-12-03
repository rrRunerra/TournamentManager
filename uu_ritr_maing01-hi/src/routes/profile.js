import { useRoute, useLsi } from "uu5g05";
import { useEffect, useState } from "react";
import Calls from "../calls.js"
import importLsi from "../lsi/import-lsi.js";
import "../styles/profile.css";

const StatCard = ({ label, value, color }) => (
    <div
        className="stat-card"
        style={{
            borderColor: color || 'rgba(255, 255, 255, 0.1)',
            boxShadow: color ? `0 0 20px ${color}20` : 'none'
        }}
    >
        <div
            className="stat-card-value"
            style={{
                color: color || '#fff',
                textShadow: color ? `0 0 10px ${color}40` : 'none'
            }}
        >
            {value}
        </div>
        <div className="stat-card-label">
            {label}
        </div>
    </div>
);

export default function ProfilePage() {
    const id = new URLSearchParams(window.location.search).get("id");
    const [stats, setStats] = useState(null);
    const lsi = useLsi(importLsi, ["Profile"]);

    useEffect(() => {
        async function fetchData() {
            const s = await Calls.getPlayer({ id });
            setStats(s)
        }
        fetchData()
    }, [id])

    if (!stats) return <div style={{ padding: '2rem', color: '#fff' }}>Loading...</div>;

    const playerStats = stats.stats || {
        finals_firstPlace: 0,
        finals_secondPlace: 0,
        finals_thirdPlace: 0,
        finals_fourthPlace: 0,
        matchesWon: 0,
        matchesLost: 0,
        tournamentsPlayed: 0,
        flappyBirdHighScore: 0
    };

    const totalTournaments =
        (playerStats.finals_firstPlace || 0) +
        (playerStats.finals_secondPlace || 0) +
        (playerStats.finals_thirdPlace || 0) +
        (playerStats.finals_fourthPlace || 0);

    return (
        <div className="profile-container">
            {/* Header Section */}
            <div className="profile-header">
                <div className="profile-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" height="120" width="120">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
                <h1 className="profile-name">
                    {stats.name}
                </h1>
                <div className="profile-details">
                    <span>{stats.role}</span>
                    <span>•</span>
                    <span>{stats.school}</span>
                </div>
            </div>

            {/* Stats Section */}
            <div>
                <h2 className="stats-title">
                    {lsi.statsTitle}
                </h2>

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
                    <StatCard
                        label={lsi.flappyBirdHighScore}
                        value={playerStats.flappyBirdHighScore || 0}
                        color="#fdcb6e" // Yellow
                    />
                </div>

                <div className="total-stats-card">
                    <div className="total-stats-label">
                        {lsi.totalTournaments}
                    </div>
                    <div className="total-stats-value">
                        {totalTournaments}
                    </div>
                </div>
            </div>
        </div>
    )
}