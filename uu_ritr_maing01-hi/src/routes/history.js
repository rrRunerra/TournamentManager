import { useState, useEffect, useRef } from "react";
import Calls from "../calls.js";
import { useRoute } from "uu5g05";
import "../styles/routes/tournament.css";
import "../styles/routes/history.css";
import Pagination from "../bricks/pagination.js";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import useUser from "../hooks/useUser.js";
import { Button } from "../bricks/components/ui/Button.js";
import { Card, CardTitle, CardIcon, CardDetails, CardStatus } from "../bricks/components/ui/Card.js";
import Grid from "../bricks/components/ui/Grid.js";
import LoginRequired from "../bricks/LoginRequired.js";

export default function HistoryPage() {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useUser();

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);
  const buttonRef = useRef(null);

  const [, setRoute] = useRoute();
  const lsi = useLsi(importLsi, ["History"]);

  function goToTournament(id) {
    setRoute("tournamentDetail", { id });
  }

  async function fetchHistory(page = 1, year = "", month = "", search = "") {
    setLoading(true);
    if (!user) return;
    try {
      const dtoIn = {
        limit: 15,
        skip: (page - 1) * 15,
        status: "finished",
        school: user.school,
        year,
        month,
        search,
      };
      const response = await Calls.tournament.list(dtoIn);

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
  }, [currentPage, selectedYear, selectedMonth, searchQuery, user]);

  // Close filter when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showFilter &&
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  if (!user) {
    return <LoginRequired lsi={lsi} />;
  }

  const availableYears = [...new Set(tournaments.map((t) => new Date(t.endDate).getFullYear()))].sort((a, b) => b - a);

  // 🔍 APPLY ALL FILTERS (YEAR + MONTH + NAME SEARCH)
  // 🔍 FILTERS ARE NOW HANDLED ON SERVER
  function handleFilterChange(key, value) {
    if (key === "year") setSelectedYear(value);
    if (key === "month") setSelectedMonth(value);
    if (key === "search") setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on filter change
  }

  // Pagination logic
  // const itemsPerPage = 12; // Handled on server
  // const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const currentItems = filteredTournaments; // Already paginated from server

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="loading-spinner">{lsi.loading}</div>;

  return (
    user && (
      <div className="background history-background">
        {/* 🔍 ALWAYS VISIBLE SEARCH BUTTON */}
        <button ref={buttonRef} className="filter-toggle-btn" onClick={() => setShowFilter(!showFilter)}>
          🔍
        </button>

        {/* FILTER PANEL */}
        <div ref={filterRef} className={`filter-panel-container ${showFilter ? "visible" : "hidden"}`}>
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
        {filteredTournaments.length === 0 ? (
          <div className="section-header no-tournaments-message">
            <h2 className="section-title">
              {selectedYear || selectedMonth || searchQuery ? lsi.noTournaments : lsi.noHistory}
            </h2>
          </div>
        ) : (
          <Grid type="5x3" className="tournaments-section">
            {currentItems.map((tournament) => (
              <Card
                type="tournament"
                key={tournament.id}
                onClick={() => goToTournament(tournament.id)}
                style={{ cursor: "pointer" }}
              >
                <CardIcon>🏆</CardIcon>
                <CardTitle type="tournament" title={tournament.name}>
                  {tournament.name}
                </CardTitle>

                <CardDetails>
                  📅 {new Date(tournament.startDate).getDate()}. –{new Date(tournament.endDate).getDate()}{" "}
                  {lsi.months[new Date(tournament.endDate).getMonth() + 1]} {new Date(tournament.endDate).getFullYear()}
                  <br />
                  👥 {tournament.teams?.length || 0} {lsi.teamsCount}
                </CardDetails>

                <CardStatus>{lsi.finished}</CardStatus>
              </Card>
            ))}
          </Grid>
        )}

        {filteredTournaments.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    )
  );
}
