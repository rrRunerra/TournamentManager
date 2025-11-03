import { useState, useEffect } from "react";
import Calls from "../calls.js";
import { Card, CardTitle, CardDescription, CardFooter } from "../bricks/cards.js";
import "../styles/tournamentDetail.css";

export default function TournamentDetailPage() {
  const [info, setInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [joiningTeam, setJoiningTeam] = useState(null);
  const id = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    async function fetchTournamentDetail() {
      try {
        const response = await Calls.getTournament({ id });
        setInfo(response);
      } catch (error) {
        console.error("Error fetching tournament detail:", error);
      }
    }
    fetchTournamentDetail();

    const storedUser = sessionStorage.getItem("player");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [id]);

  async function joinTeam(tournamentId, teamId, userId) {
    if (!userId) return;
    setJoiningTeam(teamId);

    try {
      await Calls.joinTeam({ tournamentId, id: teamId, players: { id: userId } });

      // Refetch the tournament data to update all team counts
      const updatedTournament = await Calls.getTournament({ id });
      setInfo(updatedTournament);

    } catch (error) {
      console.error("Error joining team:", error);
      alert("Failed to join the team.");
    } finally {
      setJoiningTeam(null);
    }
  }

  if (!info || !user) return <p className="loading">Loading...</p>;

  return (
    <div className="tournament-container">
      <h2 className="tournament-title">{info.name}</h2>
      <p className="tournament-description">{info.description}</p>
      <p><strong>Start Date:</strong> {new Date(info.startDate).toLocaleString()}</p>
      <p><strong>End Date:</strong> {new Date(info.endDate).toLocaleString()}</p>
      <p><strong>Status:</strong> {info.status}</p>
      <p><strong>Team Size:</strong> {info.teamSize}</p>

      <div className="team-grid">
        {info.teams.map((team) => (
          <Card
            key={team.id}
            className={`team-card ${joiningTeam === team.id ? "joining" : ""}`}
            onClick={() => joinTeam(id, team.id, user.id)}
          >
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>
              Players: {team.players?.length || 0} / {info.teamSize}
            </CardDescription>
            <CardFooter>{joiningTeam === team.id ? "Joining..." : ""}</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
