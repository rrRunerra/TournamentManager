import React, { useState, useEffect } from "react";
import Calls from "../calls.js";
import Plus4U5App from "uu_plus4u5g02-app";
import { useRoute } from "uu5g05";
import DarkVeil from "../bricks/DarkVeil.js";
import { Card, CardDescription, CardTitle, CardFooter } from "../bricks/cards.js";
import "../styles/tournament.css";
import CreateModal from "../bricks/createTournamentModal.js";

const createTournament = ({ name, description, startDate, endDate, teamSize, teams, owner, bracketType }) => {
  console.log("Creating tournament with data:", { name, description, startDate, endDate, teamSize, owner, bracketType });
  const status = "upcoming";

  return Calls.createTournament({ name, description, startDate, endDate, teamSize, status, teams, owner, bracketType });
};

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

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [route, setRoute] = useRoute();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // fetch tournaments
  const fetchTournaments = async () => {
    try {
      const response = await Calls.listTournaments();
      setTournaments(response.itemList.filter((t) => {
        return t.status == "ongoing" || t.status == "upcoming"
      }));
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
          <div className="section-header">
            <h2 className="section-title">No tournaments available.</h2>
          </div>
        ) : (
          tournaments.map((tournament) => (
            <div class="tournament-card" onClick={() => {
              setRoute("tournamentDetail", { id: tournament.id })
            }}>
              <div class="tournament-icon">🏆</div>
              <h2 class="tournament-title">{tournament.name}</h2>
              <p class="tournament-details">
                📅 {new Date(tournament.startDate).getDay()}. - {new Date(tournament.endDate).getDay()}. {months[new Date(tournament.endDate).getMonth() + 1]}. {new Date(tournament.endDate).getFullYear()}<br />
                👥 {tournament.teams.length} tímov v súťaži
              </p>
              <div class="tournament-status">
                {tournament.status === "ongoing" ? (
                  <>
                    <span className="status-dot"></span>
                    Prebieha
                  </>
                ) : tournament.status === "finished" ? (
                  "Ukončený"
                ) : (
                  "Prebieha prihlasovanie"
                )}
              </div>
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
