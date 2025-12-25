import { useEffect, useState } from "react";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import "../styles/routes/leaderboard.css";

import Calls from "../calls.js";
import LeaderboardTable from "../bricks/LeaderboardTable.js";
import useUser from "../hooks/useUser.js";

export default function Leaderboard() {
    const lsi = useLsi(importLsi, ["Leaderboard"]);
    const [user] = useUser();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPlayers() {
            try {
                // In a real scenario, we might want to filter by the current user's school if applicable
                // For now, we fetch all (or let backend handle default filtering)
                const dtoIn = {};
                if (user?.school) {
                    dtoIn.school = user.school;
                }

                const response = await Calls.player.list(dtoIn);
                setPlayers(response.itemList || []);
            } catch (e) {
                console.error("Error fetching leaderboard:", e);
                // Optional: Set some mock data if call fails during development
                // setPlayers(mockData);
            } finally {
                setLoading(false);
            }
        }

        fetchPlayers();
    }, [user]);

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-content">
                <h1 className="leaderboard-title">
                    {lsi.title || "Leaderboard"}
                </h1>

                {loading ? (
                    <div className="leaderboard-loading">{lsi.loading || "Loading..."}</div>
                ) : (
                    <LeaderboardTable players={players} currentUser={user} />
                )}
            </div>
        </div>
    );
}