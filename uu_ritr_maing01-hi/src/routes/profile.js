import { useRoute, useLsi } from "uu5g05";
import { useEffect, useState } from "react";
import Calls from "../calls.js"
import importLsi from "../lsi/import-lsi.js";

const StatCard = ({ label, value, color, icon }) => (
    <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${color || 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: color ? `0 0 20px ${color}20` : 'none',
        transition: 'transform 0.2s ease',
        minWidth: '140px',
        flex: 1
    }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: color || '#fff',
            marginBottom: '0.5rem',
            textShadow: color ? `0 0 10px ${color}40` : 'none'
        }}>
            {value}
        </div>
        <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textAlign: 'center'
        }}>
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
        firstPlace: 0,
        secondPlace: 0,
        thirdPlace: 0,
        fourthPlace: 0
    };

    const totalTournaments =
        (playerStats.firstPlace || 0) +
        (playerStats.secondPlace || 0) +
        (playerStats.thirdPlace || 0) +
        (playerStats.fourthPlace || 0);

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            color: '#fff'
        }}>
            {/* Header Section */}
            <div style={{
                marginBottom: '3rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '2rem'
            }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(45deg, #fff, #a5a5a5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {stats.name}
                </h1>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '1.1rem',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}>
                    <span>{stats.role}</span>
                    <span>•</span>
                    <span>{stats.school}</span>
                </div>
            </div>

            {/* Stats Section */}
            <div>
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    color: '#ff8e53',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {lsi.statsTitle}
                </h2>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <StatCard
                        label={lsi.firstPlace}
                        value={playerStats.firstPlace || 0}
                        color="#FFD700" // Gold
                    />
                    <StatCard
                        label={lsi.secondPlace}
                        value={playerStats.secondPlace || 0}
                        color="#C0C0C0" // Silver
                    />
                    <StatCard
                        label={lsi.thirdPlace}
                        value={playerStats.thirdPlace || 0}
                        color="#CD7F32" // Bronze
                    />
                    <StatCard
                        label={lsi.fourthPlace}
                        value={playerStats.fourthPlace || 0}
                        color="#4ecdc4" // Teal
                    />
                </div>

                <div style={{
                    background: 'linear-gradient(45deg, rgba(255, 142, 83, 0.1), rgba(255, 142, 83, 0.05))',
                    borderRadius: '16px',
                    padding: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255, 142, 83, 0.2)'
                }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                        {lsi.totalTournaments}
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#ff8e53'
                    }}>
                        {totalTournaments}
                    </div>
                </div>
            </div>
        </div>
    )
}