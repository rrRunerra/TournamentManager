import { useCallback, useEffect, useState } from "react";
import { useRoute, useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import { Card, CardDescription, CardFooter, CardTitle } from "../bricks/cards.js";
import CustomBracket from "../bricks/CustomBracket.js";
import OngoingOwnerControls from "../bricks/OngoingOwnerControls.js";
import OwnerControls from "../bricks/ownerControls.js";
import Calls from "../calls.js";
import "../styles/tournamentDetail.css";
import { useNotification } from "../bricks/NotificationProvider.js";
import ImgEditor from "../bricks/image-editor.js";




export default function TournamentDetailPage() {
  const [info, setInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [joiningTeam, setJoiningTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isImgEditorShown, setIsImgEditorShown] = useState(false);
  const id = new URLSearchParams(window.location.search).get("id");
  const [, setRoute] = useRoute();
  const [activeTab, setActiveTab] = useState('current-match');
  const { showError } = useNotification();
  const lsi = useLsi(importLsi, ["TournamentDetail"]);


  useEffect(() => {
    async function fetchTournamentDetail() {
      try {
        const response = await Calls.getTournament({ id });
        setInfo(response);
      } catch (error) {
        console.error("Error fetching tournament detail:", error);
      }
    }
    fetchTournamentDetail();

    const storedUser = localStorage.getItem("player");
    if (storedUser) setUser(JSON.parse(storedUser));


  }, [id]);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await Calls.getMatches({ tournamentId: id });

      setMatches(prev => {
        // Check if this is a double bracket tournament
        const hasBrackets = response.some(match => match.bracket);

        let processedData;

        if (hasBrackets) {
          // Double bracket - group by bracket

          // USELESS
          processedData = response.reduce((acc, match) => {
            if (match.bracket) {
              const bracket = match.bracket;
              const updatedMatch = {
                ...match,
                id: match.matchId
              };

              if (!acc[bracket]) {
                acc[bracket] = [];
              }
              acc[bracket].push(updatedMatch);
            }
            return acc;
          }, { upper: [], lower: [] });
        } else {
          // Single bracket - just replace id with matchId
          processedData = response.map(match => ({
            ...match,
            id: match.matchId
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
      await Calls.joinTeam({ tournamentId, id: teamId, players: { id: userId }, teamSize: info.teamSize });
      const updatedTournament = await Calls.getTournament({ id });
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

  const bracketsType = info?.bracketType

  if (info.status === "ongoing" || info.status === "finished") {
    return (
      <div>

        <h2 className="tournament-detail-title" style={{ textAlign: "center", marginBottom: "2rem", marginTop: "2rem" }}>{info.name}</h2>
        <CustomBracket
          matches={matches}
          bracketType={bracketsType}
          isOwner={isOwner}
          currentUserId={user?.id}
          tournamentInfo={info}
          onMatchUpdate={fetchMatches}
        />

        {isOwner && info.status === "ongoing" && (
          <div style={{ marginTop: "2rem" }}>
            <OngoingOwnerControls info={info} id={id} setInfo={setInfo} setRoute={setRoute} />
          </div>
        )}

        {/* Diploma Editor Button - only for finished tournaments and owner */}
        {isOwner && info.status === "finished" && (
          <button
            onClick={() => setIsImgEditorShown(true)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '80px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#ff8e53',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              zIndex: 1
            }}
            aria-label="Create Diploma"
            title="Create Diploma"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        )}

        {/* Image Editor Modal */}
        <ImgEditor
          isImgEditorShown={isImgEditorShown}
          closeImgEditor={() => setIsImgEditorShown(false)}
        />

      </div>
    )


  }

  return (
    // Renamed class "tournament-container" to "tournament-detail-container"
    <div className="tournament-detail-container">
      {/* Renamed class "tournament-title" to "tournament-detail-title" */}
      <h2 className="tournament-detail-title">{info.name}</h2>
      {/* Renamed class "tournament-description" to "tournament-detail-description" */}
      <p className="tournament-detail-description">{info.description}</p>
      <p><strong>{lsi.startDate}</strong> {new Date(info.startDate).toLocaleString()}</p>
      <p><strong>{lsi.endDate}</strong> {new Date(info.endDate).toLocaleString()}</p>
      <p><strong>{lsi.status}</strong> {info.status}</p>
      <p><strong>{lsi.teamSize}</strong> {info.teamSize}</p>

      {/* Renamed class "team-grid" to "tournament-detail-team-grid" */}
      <div className="tournament-detail-team-grid">
        {info.teams.map(team => {
          const isJoined = team.players?.includes(user.id)

          return (
            <Card
              key={team.id}
              // Renamed class "team-card" to "tournament-detail-team-card"
              className={`tournament-detail-team-card ${joiningTeam === team.id ? "joining" : ""} ${isJoined ? "joined" : ""}`}
              onClick={() => joinTeam(id, team.id, user.id)}
            >
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>
                {lsi.players} {team.players?.length || 0} / {info.teamSize}
              </CardDescription>
              {/* Note: CardFooter content doesn't have a direct class change,
                  but its container selector was updated in the CSS. */}
              <CardFooter>{joiningTeam === team.id ? lsi.joining : ""}</CardFooter>
            </Card>
          )

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

      <button
        onClick={() => setRoute("tournaments")}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#ff8e53',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
        aria-label="Späť na turnaje"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
