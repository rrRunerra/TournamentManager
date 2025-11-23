import { useState, useEffect } from "react";
import Calls from "../calls.js";
import { useRoute } from "uu5g05";
import "../styles/tournament.css";

const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

export default function HistoryPage() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setRoute] = useRoute();

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await Calls.listTournaments();
                // Filter for finished tournaments and sort by endDate descending
                const finishedTournaments = response.itemList
                    .filter(t => t.status === "finished")
                    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

                setTournaments(finishedTournaments);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    if (loading) return <div className="loading-spinner">Loading history...</div>;

    return (
        <div className="background">
            <section className="tournaments-section">

                {tournaments.length === 0 ? (
                    <div className="section-header">
                        <h2 className="section-title">No past tournaments found.</h2>
                    </div>
                ) : (
                    tournaments.map((tournament) => (
                        <div
                            key={tournament.id}
                            className="tournament-card"
                            onClick={() => setRoute("tournamentDetail", { id: tournament.id })}
                        >
                            <div className="tournament-icon">🏆</div>
                            <h2 className="tournament-title">{tournament.name}</h2>
                            <p className="tournament-details">
                                📅 {new Date(tournament.startDate).getDate()}. - {new Date(tournament.endDate).getDate()}. {months[new Date(tournament.endDate).getMonth() + 1]}. {new Date(tournament.endDate).getFullYear()}<br />
                                👥 {tournament.teams?.length || 0} tímov v súťaži
                            </p>
                            <div className="tournament-status">Ukončený</div>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}