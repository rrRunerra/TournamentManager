import React, { useState, useMemo } from "react";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import "../styles/bricks/LeaderboardTable.css";

const LeaderboardTable = ({ players = [], currentUser }) => {
    const lsi = useLsi(importLsi, ["Leaderboard"]);
    const [sortConfig, setSortConfig] = useState({ key: "stats.matchesWon", direction: "desc" });

    const sortedPlayers = useMemo(() => {
        let sortableItems = [...players];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const getValue = (obj, path) => path.split('.').reduce((o, i) => (o ? o[i] : 0), obj);

                let aValue = getValue(a, sortConfig.key);
                let bValue = getValue(b, sortConfig.key);

                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [players, sortConfig]);

    const requestSort = (key) => {
        let direction = "desc";
        if (sortConfig.key === key && sortConfig.direction === "desc") {
            direction = "ascending";
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (name) => {
        if (sortConfig.key !== name) return "↕";
        return sortConfig.direction === "ascending" ? "↑" : "↓";
    };

    return (
        <div className="leaderboard-table-container">
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th onClick={() => requestSort("name")}>{lsi.name} {getSortIndicator("name")}</th>
                        {/* <th onClick={() => requestSort("school")}>{lsi.school} {getSortIndicator("school")}</th> */}
                        <th onClick={() => requestSort("class")}>{lsi.class} {getSortIndicator("class")}</th>
                        <th onClick={() => requestSort("stats.matchesWon")}>{lsi.matchesWon} {getSortIndicator("stats.matchesWon")}</th>
                        <th onClick={() => requestSort("stats.matchesLost")}>{lsi.matchesLost} {getSortIndicator("stats.matchesLost")}</th>
                        <th onClick={() => requestSort("stats.tournamentsPlayed")}>{lsi.tournamentsPlayed} {getSortIndicator("stats.tournamentsPlayed")}</th>
                        <th onClick={() => requestSort("stats.finals_firstPlace")}>{lsi.firstPlace} {getSortIndicator("stats.finals_firstPlace")}</th>
                        <th onClick={() => requestSort("stats.finals_secondPlace")}>{lsi.secondPlace} {getSortIndicator("stats.finals_secondPlace")}</th>
                        <th onClick={() => requestSort("stats.finals_thirdPlace")}>{lsi.thirdPlace} {getSortIndicator("stats.finals_thirdPlace")}</th>
                        <th onClick={() => requestSort("stats.finals_fourthPlace")}>{lsi.fourthPlace} {getSortIndicator("stats.finals_fourthPlace")}</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPlayers.map((player) => (
                        <tr key={player.id} className={player.id === currentUser?.id ? "current-user-row" : ""}>
                            <td>{player.name}</td>
                            {/* <td>{player.school}</td> */}
                            <td>{player.class}</td>
                            <td>{player.stats?.matchesWon || 0}</td>
                            <td>{player.stats?.matchesLost || 0}</td>
                            <td>{player.stats?.tournamentsPlayed || 0}</td>
                            <td>{player.stats?.finals_firstPlace || 0}</td>
                            <td>{player.stats?.finals_secondPlace || 0}</td>
                            <td>{player.stats?.finals_thirdPlace || 0}</td>
                            <td>{player.stats?.finals_fourthPlace || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;
