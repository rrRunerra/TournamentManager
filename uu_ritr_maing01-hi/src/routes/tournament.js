import { useEffect, useState } from "react";
import { useRoute, useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import CreateModal from "../bricks/createTournamentModal.js";
import Calls from "../calls.js";
import "../styles/routes/tournament.css";
import { useNotification } from "../bricks/components/notifications/NotificationProvider.js";
import useUser from "../hooks/useUser.js";
import { Button } from "../bricks/components/ui/Button.js";
import { Card, CardTitle, CardIcon, CardDetails, CardStatus } from "../bricks/components/ui/Card.js";
import Grid from "../bricks/components/ui/Grid.js";
import LoginRequired from "../bricks/LoginRequired.js";

const createTournament = async ({
  name,
  description,
  startDate,
  endDate,
  teamSize,
  teams,
  owner,
  bracketType,
  school,
}) => {
  const status = "upcoming";

  return await Calls.tournament.create({
    name,
    description,
    startDate,
    endDate,
    teamSize,
    status,
    teams,
    owner,
    bracketType,
    school,
  });
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useRoute();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useUser();
  const { showError, showSuccess } = useNotification();
  const lsi = useLsi(importLsi, ["Tournaments"]);

  const isTeacher = user?.role.toLowerCase() === "teacher";

  const fetchTournaments = async (pageNum) => {
    if (loading || !user) return;
    setLoading(true);

    try {
      const dtoIn = {
        limit: 20,
        skip: (pageNum - 1) * 10,
        status: ["ongoing", "upcoming"],
        school: user?.school,
      };
      const response = await Calls.tournament.list(dtoIn);

      setTournaments((prev) => (pageNum === 1 ? response.itemList : [...prev, ...response.itemList]));
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    fetchTournaments(page);
  }, [page, user]);

  if (!user) {
    return <LoginRequired lsi={lsi} />;
  }

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
      showError(lsi.createErrorTitle, lsi.createErrorMessage);
      return;
    }

    data.school = user.school;

    await createTournament(data);
    setPage(1); // Reset to first page to reload
    fetchTournaments(1);
    showSuccess(lsi.createSuccessTitle, lsi.createSuccessMessage);
  };

  const ongoingTournaments = tournaments.filter((t) => t.status === "ongoing");
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming");

  const renderTournamentCard = (tournament) => (
    <Card
      type="tournament"
      key={tournament.id}
      onClick={() => {
        setRoute("tournamentDetail", { id: tournament.id });
      }}
      style={{ cursor: "pointer" }}
    >
      <CardIcon>🏆</CardIcon>
      <CardTitle type="tournament" title={tournament.name}>
        {tournament.name}
      </CardTitle>
      <CardDetails>
        📅 {new Date(tournament.startDate).getDate()}. - {new Date(tournament.endDate).getDate()}.{" "}
        {lsi.months[new Date(tournament.endDate).getMonth() + 1]}. {new Date(tournament.endDate).getFullYear()}
        <br />
        👥 {tournament.teams?.length} {lsi.teamsCount}
      </CardDetails>
      <CardStatus>
        {tournament.status === "ongoing" ? (
          <>
            <span className="status-dot"></span>
            {lsi.ongoing}
          </>
        ) : tournament.status === "finished" ? (
          lsi.finished
        ) : (
          lsi.upcoming
        )}
      </CardStatus>
    </Card>
  );

  return (
    user && (
      <div className="background">
        <section className="tournaments-section">
          {tournaments.length === 0 ? (
            <div className="section-header">
              <h2 className="section-title">{lsi.noTournaments}</h2>
            </div>
          ) : (
            <Grid type="5x6" className="tournaments-section">
              {ongoingTournaments.map(renderTournamentCard)}
              {ongoingTournaments.length > 0 && upcomingTournaments.length > 0 && (
                <hr className="tournament-separator" />
              )}
              {upcomingTournaments.map(renderTournamentCard)}
            </Grid>
          )}
        </section>

        {isTeacher && (
          <Button
            onClick={() => setIsOpen(true)}
            type="fab-primary"
            style={{ position: "fixed", bottom: "20px", right: "20px", fontSize: "24px" }}
          >
            +
          </Button>
        )}

        <CreateModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={handleCreateTournament} owner={user.id} />
      </div>
    )
  );
}
