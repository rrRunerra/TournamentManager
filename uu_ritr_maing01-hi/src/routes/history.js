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
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(30);

  const [, setRoute] = useRoute();

  function goToTournament(id) {
    setRoute("tournamentDetail", { id });
  }

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await Calls.listTournaments({
          limit: 30,
          skip: 0,
          status: "finished"
        });

        // Sort by end date (descending)
        const sorted = response.itemList.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

        setTournaments(sorted);
        setFilteredTournaments(sorted);
        setHasMore(response.hasMore);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  // Fetch more history (server-side pagination)
  const fetchMoreHistory = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      // Note: If filters are active, we can't easily use server pagination unless backend supports all filters.
      // For now, we only paginate the main list. If filters are active, we might need to fetch all or handle differently.
      // Assuming infinite scroll is primarily for the main list.
      if (selectedYear || selectedMonth || searchQuery) {
        // If filters are active, we don't fetch more from server in this simple implementation
        // Ideally, backend should support these filters.
        setLoadingMore(false);
        return;
      }

      const response = await Calls.listTournaments({
        limit: 10,
        skip: tournaments.length ?? 0,
        status: "finished"
      });

      const sorted = response.itemList.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

      setTournaments(prev => {
        const updated = [...prev, ...sorted];
        setFilteredTournaments(updated); // Update filtered list too if no filters active
        return updated;
      });
      setHasMore(response.hasMore);
    } catch (err) {
      console.error("Error fetching more history:", err);
    } finally {
      setLoadingMore(false);
    }
  };

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
    setDisplayedCount(30); // Reset displayed count when filters change
  }, [selectedYear, selectedMonth, searchQuery, tournaments]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= documentHeight - 300) {
        fetchMoreHistory();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, tournaments.length, selectedYear, selectedMonth, searchQuery]);

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
        {loadingMore && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            Načítavam...
          </div>
        )}
      </section>
    </div>
  );
}
