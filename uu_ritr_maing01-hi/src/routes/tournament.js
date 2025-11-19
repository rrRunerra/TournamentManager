import React, { useState, useEffect } from "react";
import Calls from "../calls.js";
import Plus4U5App from "uu_plus4u5g02-app";
import { useRoute } from "uu5g05";
import DarkVeil from "../bricks/DarkVeil.js";
import { Card, CardDescription, CardTitle, CardFooter } from "../bricks/cards.js";
import "../styles/tournament.css";
import CreateModal from "../bricks/createTournamentModal.js";

const createTournament = ({ name, description, startDate, endDate, teamSize, teams, owner, bracketType }) => {
  console.log("Creating tournament with data:", { name, description, startDate, endDate, teamSize, owner, bracketType  });
  const status = "upcoming";

  return Calls.createTournament({ name, description, startDate, endDate, teamSize, status, teams, owner, bracketType  });
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
    const user = JSON.parse(localStorage.getItem("player"));
    if (!user) {
      setRoute("login");
      return;
    }
    setUser(user);
    fetchTournaments();
  }, []);

  if (!user) return null;
  const isTeacher = user?.role.toLowerCase() === "teacher";

  const handleCreateTournament = async (data) => {
    if (
      !data.name?.trim() ||
      !data.description?.trim() ||
      !data.startDate ||
      !data.endDate ||
      !data.teamSize ||
      !Array.isArray(data.teams) ||
      data.teams.length < 2
    ) {
      alert("All fields are required and at least 2 teams must be added.");
      return;
    }

    await createTournament(data);
    await fetchTournaments();
  };

  return (
    <div class="background">
      <section class="tournaments-section">
      {tournaments.length === 0 ? (
        <p>No tournaments available.</p>
      ) : (
        tournaments.map((tournament) => (
          <div class="tournament-card">
            <div class="tournament-icon">🏆</div>
            <h2 class="tournament-title">Aktuálny turnaj</h2>
            <p class="tournament-details">
                <strong>{tournament.name}</strong><br/>
                {/* finish date */}
                📅 {new Date(tournament.startDate).getDay()}. - {new Date(tournament.endDate).getDay()}. november 2025<br/>
                👥 {tournament.teams.length} tímov v súťaži
            </p>
            <div class="tournament-status">Prebieha prihlasovanie</div>
        </div>
        ))
      )}
    </section>

      {isTeacher && (
        <button className="fab" onClick={() => setIsOpen(true)}>
          +
        </button>
      )}

      <CreateModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={handleCreateTournament} owner={user.id} />
    </div>
  );
}
