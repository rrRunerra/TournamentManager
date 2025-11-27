import { useState, useEffect } from "react";
import Calls from "../calls.js";
import { useRoute } from "uu5g05";
import "../styles/tournament.css";
import "../styles/history.css";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // 🔍 APPLY ALL FILTERS (YEAR + MONTH + NAME SEARCH)
  useEffect(() => {
    const filtered = tournaments.filter((t) => {
      const date = new Date(t.endDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (selectedYear && year !== Number(selectedYear)) return false;
      if (selectedMonth && month !== Number(selectedMonth)) return false;

      if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;

      return true;
    });

    setFilteredTournaments(filtered);
  }, [selectedYear, selectedMonth, searchQuery, tournaments]);

  function resetFilters() {
    setSelectedYear("");
    setSelectedMonth("");
    setSearchQuery("");
  }

  if (loading) return <div className="loading-spinner">Loading history...</div>;

  return (
    <div className="background history-background">

      {/* 🔍 ALWAYS VISIBLE SEARCH BUTTON */}
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilter(!showFilter)}
      >
        🔍
      </button>

      {/* FILTER PANEL */}
      <div className={`filter-panel-container ${showFilter ? 'visible' : 'hidden'}`}>
        <div className="filter-panel">


          {/* YEAR SELECT */}
          <select
            className="filter-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Rok</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* MONTH SELECT */}
          <select
            className="filter-select month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Mesiac</option>
            {Object.entries(months).map(([num, label]) => (
              <option key={num} value={num}>
                {label}
              </option>
            ))}
          </select>

          {/* 🔍 SEARCH BY NAME */}
          <input
            className="filter-input"
            type="text"
            placeholder="Hľadať názov..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />


        </div>
      </div>

      {/* TOURNAMENT LIST */}
      <section className="tournaments-section">
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
