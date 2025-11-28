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
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // fetch initial tournaments
  const fetchTournaments = async () => {
    try {
      const response = await Calls.listTournaments({
        limit: 30,
        skip: 0,
        status: ["ongoing", "upcoming"]
      });
      setTournaments(response.itemList);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  // fetch more tournaments
  const fetchMoreTournaments = async () => {
    if (loadingMore || !hasMore) return;


    setLoadingMore(true);
    try {
      const response = await Calls.listTournaments({
        limit: 10,
        skip: tournaments.length,
        status: ["ongoing", "upcoming"]
      });
      setTournaments(prev => {
        // Filter out duplicates
        const newItems = response.itemList.filter(newItem =>
          !prev.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prev, ...newItems];
      });
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Error fetching more tournaments:", error);
    } finally {
      setLoadingMore(false);
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

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= documentHeight - 300) {
        fetchMoreTournaments();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, tournaments.length]);

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
      alert("Všetky polia sú povinné a musia byť pridané aspoň 2 tímy.");
      return;
    }

    await createTournament(data);
    await fetchTournaments();
  };



  return (
    <div className="background">
      <section className="tournaments-section">
        {tournaments.length === 0 ? (
          <div className="section-header">
            <h2 className="section-title">Žiadne turnaje nie sú k dispozícii.</h2>
          </div>
        ) : (
          tournaments.map((tournament) => (
            <div className="tournament-card" key={tournament.id} onClick={() => {
              setRoute("tournamentDetail", { id: tournament.id })
            }}>
              <div className="tournament-icon">🏆</div>
              <h2 className="tournament-title">{tournament.name}</h2>
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
          ))
        )}
        {loadingMore && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            Načítavam...
          </div>
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