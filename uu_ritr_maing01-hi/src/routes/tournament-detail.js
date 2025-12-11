import { useCallback, useEffect, useState } from "react";
import { useRoute, useLsi, Environment, useLanguage } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import { Card, CardDescription, CardFooter, CardTitle } from "../bricks/cards.js";
import CustomBracket from "../bricks/brackets/CustomBracket.js";
import OngoingOwnerControls from "../bricks/OngoingOwnerControls.js";
import OwnerControls from "../bricks/ownerControls.js";
import Calls from "../calls.js";
import "../styles/routes/tournamentDetail.css";
import { useNotification } from "../bricks/NotificationProvider.js";
import ImgEditor from "../bricks/image-editor.js";
import useUser from "../hooks/useUser.js";
import { Button } from "../bricks/atom/Button.js";

export default function TournamentDetailPage() {
  const [info, setInfo] = useState(null);
  const [user, setUser] = useUser();
  const [joiningTeam, setJoiningTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isImgEditorShown, setIsImgEditorShown] = useState(false);
  const id = new URLSearchParams(window.location.search).get("id");
  const [, setRoute] = useRoute();
  const { showError } = useNotification();
  const lsiDetail = useLsi(importLsi, ["TournamentDetail"]);
  const lsiTournaments = useLsi(importLsi, ["Tournaments"]);
  const lsi = { ...lsiDetail, ...lsiTournaments };
  const [lang] = useLanguage();

  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    async function fetchTournamentDetail() {
      try {
        const response = await Calls.tournament.get({ id: id });
        setInfo(response);

        // Fetch owner details
        if (response.owner) {
          try {
            const ownerData = await Calls.player.get({ id: response.owner });
            setOwnerName(ownerData.name || ownerData.username || "Unknown");
          } catch (e) {
            console.error("Failed to fetch owner:", e);
            setOwnerName("Unknown");
          }
        }
      } catch (error) {
        console.error("Error fetching tournament detail:", error);
      }
    }
    fetchTournamentDetail();
  }, [id]);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await Calls.match.list({ tournamentId: id });

      setMatches((prev) => {
        // Check if this is a double bracket tournament
        const hasBrackets = response.some((match) => match.bracket);

        let processedData;

        if (hasBrackets) {
          // Double bracket - group by bracket
          processedData = response.reduce(
            (acc, match) => {
              if (match.bracket) {
                const bracket = match.bracket;
                const updatedMatch = {
                  ...match,
                  id: match.matchId,
                };

                if (!acc[bracket]) {
                  acc[bracket] = [];
                }
                acc[bracket].push(updatedMatch);
              }
              return acc;
            },
            { upper: [], lower: [] },
          );
        } else {
          // Single bracket - just replace id with matchId
          processedData = response.map((match) => ({
            ...match,
            id: match.matchId,
          }));
        }

        return JSON.stringify(prev) === JSON.stringify(processedData) ? prev : processedData;
      });
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  async function joinTeam(tournamentId, teamId, userId) {
    if (!userId || info.status !== "upcoming") return;
    setJoiningTeam(teamId);

    try {
      await Calls.team.join({ tournamentId, id: teamId, players: { id: userId }, teamSize: info.teamSize });
      const updatedTournament = await Calls.tournament.get({ id: id });
      setInfo(updatedTournament);
    } catch (error) {
      console.error("Error joining team:", error);
      showError(lsi.joinError, lsi.tryAgain);
    } finally {
      setJoiningTeam(null);
    }
  }

  // Renamed class "loading" to "tournament-detail-loading"
  if (!info) return <div className="loading-spinner">{lsi.loading}</div>;

  const isOwner = user?.id == info.owner;

  const bracketsType = info?.bracketType;

  if (info.status === "ongoing" || info.status === "finished") {
    return (
      <div>
        <h2 className="tournament-detail-title tournament-detail-title-centered">{info.name}</h2>
        <CustomBracket
          matches={matches}
          bracketType={bracketsType}
          isOwner={isOwner}
          currentUserId={user?.id}
          tournamentInfo={info}
          onMatchUpdate={fetchMatches}
        />

        {isOwner && info.status === "ongoing" && (
          <div className="tournament-detail-ongoing-controls">
            <OngoingOwnerControls info={info} id={id} setInfo={setInfo} setRoute={setRoute} />
          </div>
        )}

        {/* Diploma Editor Button - only for finished tournaments and owner */}
        {isOwner && info.status === "finished" && (
          <Button
            onClick={() => setIsImgEditorShown(true)}
            aria-label="Create Diploma"
            title="Create Diploma"
            type="fab-primary"
            style={{ position: "fixed", bottom: "20px", right: "20px", fontSize: "24px" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </Button>
        )}

        {/* Image Editor Modal */}
        <ImgEditor isImgEditorShown={isImgEditorShown} closeImgEditor={() => setIsImgEditorShown(false)} />
      </div>
    );
  }

  console.log();

  return (
    // Renamed class "tournament-container" to "tournament-detail-container"
    <div className="tournament-detail-container">
      {/* Renamed class "tournament-title" to "tournament-detail-title" */}
      <h2 className="tournament-detail-title">{info.name}</h2>
      {/* Renamed class "tournament-description" to "tournament-detail-description" */}
      <p className="tournament-detail-description">{info.description}</p>

      <div className="tournament-detail-info-grid">
        <div className="tournament-detail-info-item">
          <strong>{lsi.startDate}</strong>
          <span>
            {new Intl.DateTimeFormat(lang == "cz" ? "cs" : "en", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(info.startDate))}
          </span>
        </div>
        <div className="tournament-detail-info-item">
          <strong>{lsi.endDate}</strong>
          <span>
            {new Intl.DateTimeFormat(lang == "cz" ? "cs" : "en", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(info.endDate))}
          </span>
        </div>
        <div className="tournament-detail-info-item">
          <strong>{lsi.status}</strong>
          <span className={`status-badge ${info.status}`}>{lsi[info.status]}</span>
        </div>
        <div className="tournament-detail-info-item">
          <strong>{lsi.teamSize}</strong>
          <span>{info.teamSize}</span>
        </div>
        <div className="tournament-detail-info-item">
          <strong>{lsi.bracketType || "Bracket Type"}</strong>
          <span style={{ textTransform: "capitalize" }}>{info.bracketType || "Single"}</span>
        </div>
        <div className="tournament-detail-info-item">
          <strong>{lsi.owner || "Owner"}</strong>
          <span>{ownerName || "Loading..."}</span>
        </div>
      </div>
      {/* Renamed class "team-grid" to "tournament-detail-team-grid" */}
      <div className="tournament-detail-team-grid">
        {info.teams.map((team) => {
          const isJoined = team.players?.includes(user.id);
          const isFull = (team.players?.length || 0) >= info.teamSize;

          return (
            <Card
              key={team.id}
              // Renamed class "team-card" to "tournament-detail-team-card"
              className={`tournament-detail-team-card ${joiningTeam === team.id ? "joining" : ""} ${isJoined ? "joined" : ""} ${isFull ? "full" : ""}`}
              onClick={() => !isFull && joinTeam(id, team.id, user.id)}
            >
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>
                {lsi.players} {team.players?.length || 0} / {info.teamSize}
              </CardDescription>
              {/* Note: CardFooter content doesn't have a direct class change,
                  but its container selector was updated in the CSS. */}
              <CardFooter>{joiningTeam === team.id ? lsi.joining : ""}</CardFooter>
            </Card>
          );
        })}
      </div>

      {isOwner && (
        <OwnerControls
          id={id}
          info={info}
          setInfo={setInfo}
          setRoute={setRoute}
          onTournamentStart={fetchMatches}
          key={"owner-controls"}
        />
      )}

      <Button
        onClick={() => setRoute("tournaments")}
        type="fab-primary"
        aria-label="Späť na turnaje"
        style={{ position: "fixed", bottom: "20px", right: "20px", fontSize: "24px" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </Button>
    </div>
  );
}
