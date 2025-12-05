import { useState, useEffect } from "react";
import Calls from "../calls.js";
import { useRoute } from "uu5g05";
import "../styles/tournament.css";
import "../styles/history.css";
import Pagination from "../bricks/pagination.js";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";




export default function HistoryPage() {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilter, setShowFilter] = useState(false);

  const [, setRoute] = useRoute();
  const lsi = useLsi(importLsi, ["History"]);

  function goToTournament(id) {
    setRoute("tournamentDetail", { id });
  }

  async function fetchHistory(page = 1, year = "", month = "", search = "") {
    setLoading(true);
    try {
      const dtoIn = {
        limit: 15,
        skip: (page - 1) * 15,
        status: "finished",
        year,
        month,
        search
      };
      const response = await Calls.listTournaments(dtoIn);

      setTournaments(response.itemList);
      setFilteredTournaments(response.itemList);
      setTotalPages(Math.ceil(response.total / 15));
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory(currentPage, selectedYear, selectedMonth, searchQuery);
  }, [currentPage, selectedYear, selectedMonth, searchQuery]);

  const availableYears = [...new Set(tournaments.map((t) => new Date(t.endDate).getFullYear()))]
    .sort((a, b) => b - a);

  // 🔍 APPLY ALL FILTERS (YEAR + MONTH + NAME SEARCH)
  // 🔍 FILTERS ARE NOW HANDLED ON SERVER
  function handleFilterChange(key, value) {
    if (key === "year") setSelectedYear(value);
    if (key === "month") setSelectedMonth(value);
    if (key === "search") setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on filter change
  }

  function resetFilters() {
    setSelectedYear("");
    setSelectedMonth("");
    setSearchQuery("");
  }

  // Pagination logic
  // const itemsPerPage = 12; // Handled on server
  // const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const currentItems = filteredTournaments; // Already paginated from server

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading-spinner">{lsi.loading}</div>;

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
            onChange={(e) => handleFilterChange("year", e.target.value)}
          >
            <option value="">{lsi.year}</option>
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
            onChange={(e) => handleFilterChange("month", e.target.value)}
          >
            <option value="">{lsi.month}</option>
            {Object.entries(lsi.months).map(([num, label]) => (
              <option key={num} value={num}>
                {label}
              </option>
            ))}
          </select>

          {/* 🔍 SEARCH BY NAME */}
          <input
            className="filter-input"
            type="text"
            placeholder={lsi.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />


        </div>
      </div>

      {/* TOURNAMENT LIST */}
      <section className="tournaments-section">
        {filteredTournaments.length === 0 ? (
          <div className="section-header">
            <h2 className="section-title">
              {(selectedYear || selectedMonth || searchQuery)
                ? lsi.noTournaments
                : lsi.noHistory}
            </h2>
          </div>

        ) : (
          currentItems.map((tournament) => (
            <div
              key={tournament.id}
              className="tournament-card"
              onClick={() => goToTournament(tournament.id)}
            >
              <div className="tournament-icon">🏆</div>
              <h2 className="tournament-title" title={tournament.name}>{tournament.name}</h2>

              <p className="tournament-details">
                📅 {new Date(tournament.startDate).getDate()}. –
                {new Date(tournament.endDate).getDate()}{" "}
                {lsi.months[new Date(tournament.endDate).getMonth() + 1]}{" "}
                {new Date(tournament.endDate).getFullYear()}
                <br />
                👥 {tournament.teams?.length || 0} {lsi.teamsCount}
              </p>

              <div className="tournament-status">{lsi.finished}</div>
            </div>
          ))
        )}
      </section>

      {filteredTournaments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}