import React, { useState, useEffect } from "react";
import Calls from "../calls.js";
import Plus4U5App from "uu_plus4u5g02-app";
import { useRoute } from "uu5g05";
import DarkVeil from "../bricks/DarkVeil.js";
import { Card, CardDescription, CardTitle, CardFooter } from "../bricks/cards.js";
import "../styles/tournament.css";
import CreateModal from "../bricks/createTournamentModal.js";

const createTournament = ({ name, description, startDate, endDate, teamSize, teams, owner }) => {
  console.log("Creating tournament with data:", { name, description, startDate, endDate, teamSize, owner });
  const status = "upcoming";

  return Calls.createTournament({ name, description, startDate, endDate, teamSize, status, teams, owner });
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [route, setRoute] = useRoute();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // fetch tournaments
  const fetchTournaments = async () => {
    try {
      const response = await Calls.listTournaments();
      setTournaments(response.itemList);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("player"));
    if (!user) {
      setRoute("login");
      return;
    }
    setUser(user);
    fetchTournaments();
  }, []);

  if (!user) return null;
  const isTeacher = user?.role === "teacher";

  const handleCreateTournament = async (data) => {
    await createTournament(data);
    await fetchTournaments(); // refresh after saving
  };

  return (
    <div>
      <h2>Tournaments</h2>
      {tournaments.length === 0 ? (
        <p>No tournaments available.</p>
      ) : (
        tournaments.map((tournament) => (
          <Card
            key={tournament.id}
            className="tournament-card"
            onClick={() => setRoute("tournamentDetail", { id: tournament.id })}
          >
            <CardTitle className="tournament-title">{tournament.name}</CardTitle>
            <CardDescription className="tournament-description">
              {tournament.description}
            </CardDescription>
            <CardFooter className="tournament-footer">
              {new Date(tournament.startDate).toLocaleDateString()} –{" "}
              {new Date(tournament.endDate).toLocaleDateString()}
            </CardFooter>
          </Card>
        ))
      )}

      {isTeacher && (
        <button className="create-tournament-button" onClick={() => setIsOpen(true)}>
          Create New Tournament
        </button>
      )}

      <CreateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleCreateTournament}
        owner={user.id}
      />
    </div>
  );
}


