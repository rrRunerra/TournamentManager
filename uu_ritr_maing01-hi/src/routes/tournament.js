import React, { useState, useEffect } from "react";
import Calls from "../calls.js";
import Plus4U5App from "uu_plus4u5g02-app";
import { useRoute } from "uu5g05";
import DarkVeil from "../bricks/DarkVeil.js";
import { Card, CardDescription, CardTitle, CardFooter } from "../bricks/cards.js";
import "../styles/tournament.css";
import CreateModal from "../bricks/createTournamentModal.js";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [route, setRoute] = useRoute();
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("player"));

  const isTeacher = user.role === "teacher";

  console.log(user);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const response = await Calls.listTournaments();
        setTournaments(response.itemList);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    }
    fetchTournaments();
  }, []);

  return (
    <div>
      <h2>Tournaments</h2>
      {tournaments.length === 0 ? (
        <p>No tournaments available.</p>
      ) : (
        tournaments.map((tournament) => {
          return (
            <Card
              key={tournament.id}
              className="tournament-card"
              onClick={() => setRoute("tournamentDetail", { id: tournament.id })}
            >
              <CardTitle className="tournament-title">{tournament.name}</CardTitle>
              <CardDescription className="tournament-description">{tournament.description}</CardDescription>
              <CardFooter className="tournament-footer">
                {new Date(tournament.startDate).toLocaleDateString()} –{" "}
                {new Date(tournament.endDate).toLocaleDateString()}
              </CardFooter>
            </Card>
          );
        })
      )}

      {isTeacher && (
        <button className="create-tournament-button" onClick={() => setIsOpen(true)}>
          Create New Tournament
        </button>
      )}
              <button className="create-tournament-button" onClick={() => setIsOpen(false)}>a </button>


      <CreateModal key=" create"isOpen={isOpen} onClose={() => {setIsOpen(false)}} onSave={() => {console.log("save")}} />
    </div>
  );
}
