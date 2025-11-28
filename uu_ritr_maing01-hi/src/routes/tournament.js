import { useEffect, useState } from "react";
import { useRoute } from "uu5g05";
import CreateModal from "../bricks/createTournamentModal.js";
import Calls from "../calls.js";
import "../styles/tournament.css";

const createTournament = ({ name, description, startDate, endDate, teamSize, teams, owner, bracketType }) => {
  const status = "upcoming";

  return Calls.createTournament({ name, description, startDate, endDate, teamSize, status, teams, owner, bracketType });
};

const months = {
  1: "Január",
  2: "Február",
  3: "Marec",
  4: "Apríl",
  5: "Máj",
  6: "Jún",
  7: "Júl",
  8: "August",
  9: "September",
  10: "Október",
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

  if (!user) {
    return (
      <div>
        <p>No</p>
      </div>
    )
  }
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
      alert("Všetky polia sú povinné a musia byť pridané aspoň 2 tímy.");
      return;
    }

    await createTournament(data);
    await fetchTournaments();
  };

  const ongoingTournaments = tournaments.filter(t => t.status === "ongoing");
  const upcomingTournaments = tournaments.filter(t => t.status === "upcoming");

  const renderTournamentCard = (tournament) => (





    <div className="tournament-card" key={tournament.id} onClick={() => {
      setRoute("tournamentDetail", { id: tournament.id })
    }}>
      <div className="tournament-icon">🏆</div>
      <h2 className="tournament-title" title={tournament.name}>{tournament.name}</h2>
      <p className="tournament-details">
        📅 {new Date(tournament.startDate).getDate()}. - {new Date(tournament.endDate).getDate()}. {months[new Date(tournament.endDate).getMonth() + 1]}. {new Date(tournament.endDate).getFullYear()}<br />
        👥 {tournament.teams.length} tímov v súťaži
      </p>
      <div className="tournament-status">
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
  );

  return (
    <div className="background">
      <section className="tournaments-section">
        {tournaments.length === 0 ? (
          <div className="section-header">
            <h2 className="section-title">Žiadne turnaje nie sú k dispozícii.</h2>
          </div>
        ) : (
          <>
            {ongoingTournaments.map(renderTournamentCard)}
            {ongoingTournaments.length > 0 && upcomingTournaments.length > 0 && (
              <hr className="tournament-separator" />
            )}
            {upcomingTournaments.map(renderTournamentCard)}
          </>
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