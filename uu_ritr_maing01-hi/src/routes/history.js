import { useState, useEffect } from "react";
import Calls from "../calls.js";
import { useRoute } from "uu5g05";
import "../styles/tournament.css";

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
  12: "December",
};

export default function HistoryPage() {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [showFilter, setShowFilter] = useState(false);

  const [, setRoute] = useRoute();

  function goToTournament(id) {
    setRoute("tournamentDetail", { id });
  }

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await Calls.listTournaments();
        const finished = response.itemList
          .filter((t) => t.status === "finished")
          .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

        setTournaments(finished);
        setFilteredTournaments(finished);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const availableYears = [...new Set(tournaments.map((t) => new Date(t.endDate).getFullYear()))]
    .sort((a, b) => b - a);

  useEffect(() => {
    const filtered = tournaments.filter((t) => {
      const date = new Date(t.endDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (selectedYear && year !== Number(selectedYear)) return false;
      if (selectedMonth && month !== Number(selectedMonth)) return false;

      return true;
    });

    setFilteredTournaments(filtered);
  }, [selectedYear, selectedMonth, tournaments]);

  function resetFilters() {
    setSelectedYear("");
    setSelectedMonth("");
  }

  if (loading) return <div className="loading-spinner">Načítavam históriu...</div>;

  return (
    <div className="background" style={{ position: "relative" }}>

      {/* 🔍 ALWAYS VISIBLE LUPA BUTTON - fixovaná pozícia */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        style={{
          position: "fixed",
          top: "125px", // Fixované pod navigačnou lištou
          left: "16px",
          background: "#2a2a2a",
          border: "none",
          borderRadius: "50%",
          width: "42px",
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          cursor: "pointer",
          zIndex: 30,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        🔍
      </button>

      {/* Filter panel - fixovaná pozícia */}
      <div
        style={{
          position: "fixed",
          top: "121px", // Fixované pod navigačnou lištou
          left: "70px",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: showFilter ? "translateX(0)" : "translateX(-120%)",
          opacity: showFilter ? 1 : 0,
          zIndex: 25,
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(42,42,42)",
            backdropFilter: "blur(8px)",
            borderRadius: "8px",
            padding: "12px 16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "fit-content",
          }}
        >
          <h3
            style={{
              margin: "0",
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            🔍 Filter:
          </h3>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              backgroundColor: "white",
              fontSize: "0.85rem",
              color: "#333",
              outline: "none",
              minWidth: "70px",
            }}
          >
            <option value="">Rok</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              backgroundColor: "white",
              fontSize: "0.85rem",
              color: "#333",
              outline: "none",
              minWidth: "90px",
            }}
          >
            <option value="">Mesiac</option>
            {Object.entries(months).map(([num, label]) => (
              <option key={num} value={num}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              backgroundColor: "#ff8e53",
              color: "white",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Resetovať
          </button>
        </div>
      </div>

      {/* TOURNAMENT LIST - začína nižšie, aby nezakrýval filter */}
      <section className="tournaments-section" style={{ marginTop: "120px" }}>
        {filteredTournaments.length === 0 ? (
          <div className="section-header">
            <h2 className="section-title">Žiadne turnaje pre daný filter.</h2>
          </div>
        ) : (
          filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="tournament-card"
              onClick={() => goToTournament(tournament.id)}
            >
              <div className="tournament-icon">🏆</div>
              <h2 className="tournament-title">{tournament.name}</h2>

              <p className="tournament-details">
                📅 {new Date(tournament.startDate).getDate()}. –
                {new Date(tournament.endDate).getDate()}{" "}
                {months[new Date(tournament.endDate).getMonth() + 1]}{" "}
                {new Date(tournament.endDate).getFullYear()}
                <br />
                👥 {tournament.teams?.length || 0} tímov v súťaži
              </p>

              <div className="tournament-status">Ukončený</div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
