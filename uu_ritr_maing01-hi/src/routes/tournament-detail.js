import { useState, useEffect, useMemo } from "react";
import Calls from "../calls.js";
import { Card, CardTitle, CardDescription, CardFooter } from "../bricks/cards.js";
import { useRoute } from "uu5g05";
import "../styles/tournamentDetail.css";
import { DoubleEliminationBracket, Match, SingleEliminationBracket, SVGViewer, createTheme } from "@g-loot/react-tournament-brackets"
import OwnerControls from "../bricks/ownerControls.js";
import OngoingTournamentNav from "../bricks/OngoingTournamentNav.js";


const OrangeTheme = createTheme({
  textColor: { main: '#FFFFFF', highlighted: '#CCCCCC', dark: '#AAAAAA' },
  matchBackground: { wonColor: '#1A1A1A', lostColor: '#2A2A2A' },
  score: {
    background: { wonColor: '#333333', lostColor: '#333333' },
    text: { highlightedWonColor: '#FFFFFF', highlightedLostColor: '#FFFFFF' },
  },
  border: {
    color: '#444444',
    highlightedColor: '#555555',
  },
  roundHeader: { backgroundColor: '#222222', fontColor: '#FFFFFF' },
  connectorColor: '#FFA500',
  connectorColorHighlight: '#FF8C00',
  svgBackground: '#000000',
});




export default function TournamentDetailPage() {
  const [info, setInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [joiningTeam, setJoiningTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const id = new URLSearchParams(window.location.search).get("id");
  const [, setRoute] = useRoute();
  const [activeTab, setActiveTab] = useState('current-match');


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

  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await Calls.getMatches({ tournamentId: id });


        setMatches(prev => {
          // Check if this is a double bracket tournament
          const hasBrackets = response.some(match => match.bracket);

          let processedData;

          if (hasBrackets) {
            // Double bracket - group by bracket
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
    }

    fetchMatches();

  }, [info, setInfo]);



  async function joinTeam(tournamentId, teamId, userId) {
    if (!userId || info.status !== "upcoming") return;
    setJoiningTeam(teamId);

    try {
      await Calls.joinTeam({ tournamentId, id: teamId, players: { id: userId }, teamSize: info.teamSize });
      const updatedTournament = await Calls.getTournament({ id });
      setInfo(updatedTournament);
    } catch (error) {
      console.error("Error joining team:", error);
      alert("Failed to join the team.");
    } finally {
      setJoiningTeam(null);
    }
  }


  // Renamed class "loading" to "tournament-detail-loading"
  if (!info || !user) return <p className="tournament-detail-loading">Loading...</p>;

  const isOwner = info?.owner === user?.id;
  const bracketsType = info?.bracketType

  if (info.status === "ongoing") {
    // current-match brackets  owner-controls
    return (
      <div>
        <OngoingTournamentNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOwner={isOwner}
        />

        {activeTab == "current-match" && (
          <div>

          </div>
        )}

        {activeTab == "brackets" && (
          bracketsType == 'double' ? (
            <div>
              <DoubleEliminationBracket
                matches={matches}
                matchComponent={Match}
                theme={OrangeTheme}
                options={{
                  style: {
                    roundHeader: {
                      backgroundColor: OrangeTheme.roundHeader.backgroundColor,
                      fontColor: OrangeTheme.roundHeader.fontColor,
                    },
                    connectorColor: OrangeTheme.connectorColor,
                    connectorColorHighlight: OrangeTheme.connectorColorHighlight,
                  },
                }}
                svgWrapper={({ children, ...props }) => (
                  <SVGViewer width={window.innerWidth} height={window.innerHeight} background={OrangeTheme.svgBackground} SVGBackground={OrangeTheme.svgBackground} {...props}>
                    {children}
                  </SVGViewer>
                )}
              />
            </div>
          ) : (
            <div>
              <SingleEliminationBracket
                matches={matches}
                matchComponent={Match}
                theme={OrangeTheme}
                options={{
                  style: {
                    roundHeader: {
                      backgroundColor: OrangeTheme.roundHeader.backgroundColor,
                      fontColor: OrangeTheme.roundHeader.fontColor,
                    },
                    connectorColor: OrangeTheme.connectorColor,
                    connectorColorHighlight: OrangeTheme.connectorColorHighlight,
                  },
                }}
                svgWrapper={({ children, ...props }) => (
                  <SVGViewer width={window.innerWidth} height={window.innerHeight} background={OrangeTheme.svgBackground} SVGBackground={OrangeTheme.svgBackground} {...props}>
                    {children}
                  </SVGViewer>
                )}
              />
            </div>
          )
        )}

        {activeTab == "owner-controls" && (
          <div>

          </div>
        )}


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
      <p><strong>Start Date:</strong> {new Date(info.startDate).toLocaleString()}</p>
      <p><strong>End Date:</strong> {new Date(info.endDate).toLocaleString()}</p>
      <p><strong>Status:</strong> {info.status}</p>
      <p><strong>Team Size:</strong> {info.teamSize}</p>

      {/* Renamed class "team-grid" to "tournament-detail-team-grid" */}
      <div className="tournament-detail-team-grid">
        {info.teams.map(team => {
          const isJoined = team.players?.includes(user.id)
          console.log(team)
          return (
            <Card
              key={team.id}
              // Renamed class "team-card" to "tournament-detail-team-card"
              className={`tournament-detail-team-card ${joiningTeam === team.id ? "joining" : ""} ${isJoined ? "joined" : ""}`}
              onClick={() => joinTeam(id, team.id, user.id)}
            >
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>
                Players: {team.players?.length || 0} / {info.teamSize}
              </CardDescription>
              {/* Note: CardFooter content doesn't have a direct class change, 
                  but its container selector was updated in the CSS. */}
              <CardFooter>{joiningTeam === team.id ? "Joining..." : ""}</CardFooter>
            </Card>
          )

        })}
      </div>

      {isOwner && (
        <OwnerControls id={id} info={info} setInfo={setInfo} setRoute={setRoute} key={"owner-controls"} />
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
          backgroundColor: 'orange',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
        aria-label="Go back to tournaments"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}