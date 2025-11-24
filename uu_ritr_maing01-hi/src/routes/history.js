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

  // ROUTER for opening tournament detail
  const [, setRoute] = useRoute();

  function goToTournament(id) {
    setRoute("tournamentDetail", { id });
  }

  // Fetch tournaments
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

  // Dynamické roky z turnajov
  const availableYears = [...new Set(tournaments.map((t) => new Date(t.endDate).getFullYear()))].sort((a, b) => b - a);

  // Auto-filter when selection changes
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

  // Reset filters
  function resetFilters() {
    setSelectedYear("");
    setSelectedMonth("");
  }

  if (loading) return <div className="loading-spinner">Loading history...</div>;

  return (
    <div className="background">
      {/* FILTER SECTION - Auto-filter, only reset button */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: 'fit-content'
      }}>
        <h3 style={{
          margin: '0',
          fontSize: '0.95rem',
          fontWeight: '600',
          color: '#333',
          whiteSpace: 'nowrap'
        }}>
          🔍 Filter:
        </h3>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: '6px 8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: 'white',
            fontSize: '0.85rem',
            fontWeight: '500',
            color: '#333',
            outline: 'none',
            minWidth: '70px'
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
            padding: '6px 8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: 'white',
            fontSize: '0.85rem',
            fontWeight: '500',
            color: '#333',
            outline: 'none',
            minWidth: '90px'
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
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          Reset
        </button>
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
                {new Date(tournament.endDate).getDate()}.{" "}
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
