import { useEffect, useState } from "react";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import "../styles/routes/leaderboard.css";

import Calls from "../calls.js";
import LeaderboardTable from "../bricks/LeaderboardTable.js";
import useUser from "../hooks/useUser.js";
import LoginRequired from "../bricks/LoginRequired.js";

export default function Leaderboard() {
  const lsi = useLsi(importLsi, ["Leaderboard"]);
  const [user] = useUser();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const dtoIn = {};
        if (user?.school) {
          dtoIn.school = user.school;
        }

        const response = await Calls.player.list(dtoIn);
        setPlayers(response.itemList || []);
      } catch (e) {
        console.error("Error fetching leaderboard:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, [user]);

  if (!user) {
    return <LoginRequired lsi={lsi} />;
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-content">
        <h1 className="leaderboard-title">{lsi.title || "Leaderboard"}</h1>

        {loading ? (
          <div className="leaderboard-loading">{lsi.loading || "Loading..."}</div>
        ) : (
          <LeaderboardTable players={players} currentUser={user} />
        )}
      </div>
    </div>
  );
}
