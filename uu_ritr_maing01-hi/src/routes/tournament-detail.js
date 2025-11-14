import { useState, useEffect, useMemo } from "react";
import Calls from "../calls.js";
import { Card, CardTitle, CardDescription, CardFooter } from "../bricks/cards.js";
import { useRoute } from "uu5g05";
import "../styles/tournamentDetail.css";
import { DoubleEliminationBracket, Match, SVGViewer } from "@g-loot/react-tournament-brackets"



export default function TournamentDetailPage() {
  const [info, setInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [joiningTeam, setJoiningTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const id = new URLSearchParams(window.location.search).get("id");
  const [, setRoute] = useRoute();

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
        setMatches(prev => JSON.stringify(prev) === JSON.stringify(response) ? prev : response);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    }
    fetchMatches();
  }, [id]);

  

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

  const handleBack = () => setRoute("tournaments");

  if (!info || !user) return <p className="loading">Loading...</p>;

  const isOwner = info?.owner === user?.id;

  if (info.status === "ongoing") {
    const matches = {
    upper: [  
    {  
      id: 1,  
      name: 'UB Round 1 - Match 1',  
      nextMatchId: 5,  
      nextLooserMatchId: 9,  
      tournamentRoundText: 'UB R1',  
      startTime: '2025-11-15T14:00:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-1',  
          name: 'Player 1',  
          isWinner: true,  
          status: 'PLAYED',  
          resultText: '2'  
        },  
        {  
          id: 'player-8',  
          name: 'Player 8',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '0'  
        }  
      ]  
    },  
    {  
      id: 2,  
      name: 'UB Round 1 - Match 2',  
      nextMatchId: 5,  
      nextLooserMatchId: 9,  
      tournamentRoundText: 'UB R1',  
      startTime: '2025-11-15T14:00:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-4',  
          name: 'Player 4',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '1'  
        },  
        {  
          id: 'player-5',  
          name: 'Player 5',  
          isWinner: true,  
          status: 'PLAYED',  
          resultText: '2'  
        }  
      ]  
    },  
    {  
      id: 3,  
      name: 'UB Round 1 - Match 3',  
      nextMatchId: 6,  
      nextLooserMatchId: 10,  
      tournamentRoundText: 'UB R1',  
      startTime: '2025-11-15T15:00:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-2',  
          name: 'Player 2',  
          isWinner: true,  
          status: 'PLAYED',  
          resultText: '2'  
        },  
        {  
          id: 'player-7',  
          name: 'Player 7',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '1'  
        }  
      ]  
    },  
    {  
      id: 4,  
      name: 'UB Round 1 - Match 4',  
      nextMatchId: 6,  
      nextLooserMatchId: 10,  
      tournamentRoundText: 'UB R1',  
      startTime: '2025-11-15T15:00:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-3',  
          name: 'Player 3',  
          isWinner: true,  
          status: 'PLAYED',  
          resultText: '2'  
        },  
        {  
          id: 'player-6',  
          name: 'Player 6',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '0'  
        }  
      ]  
    },  
    {  
      id: 5,  
      name: 'UB Semi Final 1',  
      nextMatchId: 7,  
      nextLooserMatchId: 11,  
      tournamentRoundText: 'UB R2',  
      startTime: '2025-11-15T16:00:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-1',  
          name: 'Player 1',  
          isWinner: true,  
          status: 'PLAYED',  
          resultText: '2'  
        },  
        {  
          id: 'player-5',  
          name: 'Player 5',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '1'  
        }  
      ]  
    },  
    {  
      id: 6,  
      name: 'UB Semi Final 2',  
      nextMatchId: 7,  
      nextLooserMatchId: 11,  
      tournamentRoundText: 'UB R2',  
      startTime: '2025-11-15T16:00:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-2',  
          name: 'Player 2',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '0'  
        },  
        {  
          id: 'player-3',  
          name: 'Player 3',  
          isWinner: true,  
          status: 'PLAYED',  
          resultText: '2'  
        }  
      ]  
    },  
    {  
      id: 7,  
      name: 'UB Final',  
      nextMatchId: 13,  
      nextLooserMatchId: 12,  
      tournamentRoundText: 'UB R3',  
      startTime: '2025-11-15T18:00:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-1',  
          name: 'Player 1',  
          isWinner: true,  
          status: 'PLAYED',  
          resultText: '2'  
        },  
        {  
          id: 'player-3',  
          name: 'Player 3',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '1'  
        }  
      ]  
    },  
    {  
      id: 13,  
      name: 'Grand Final',  
      nextMatchId: null,  
      nextLooserMatchId: null,  
      tournamentRoundText: 'Final',  
      startTime: '2025-11-15T20:00:00+00:00',  
      state: 'SCHEDULED',  
      participants: []  
    }  
  ],  
  lower: [  
    {  
      id: 9,  
      name: 'LB Round 1 - Match 1',  
      nextMatchId: 11,  
      nextLooserMatchId: null,  
      tournamentRoundText: 'LB R1',  
      startTime: '2025-11-15T16:30:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-8',  
          name: 'Player 8',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '0'  
        },  
        {  
          id: 'player-4',  
          name: 'Player 4',  
          isWinner: true,  
          status: 'PLAYED',  
          resultText: '2'  
        }  
      ]  
    },  
    {  
      id: 10,  
      name: 'LB Round 1 - Match 2',  
      nextMatchId: 11,  
      nextLooserMatchId: null,  
      tournamentRoundText: 'LB R1',  
      startTime: '2025-11-15T16:30:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-7',  
          name: 'Player 7',  
          isWinner: true,  
          status: 'PLAYED',  
          resultText: '2'  
        },  
        {  
          id: 'player-6',  
          name: 'Player 6',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '1'  
        }  
      ]  
    },  
    {  
      id: 11,  
      name: 'LB Round 2',  
      nextMatchId: 12,  
      nextLooserMatchId: null,  
      tournamentRoundText: 'LB R2',  
      startTime: '2025-11-15T17:30:00+00:00',  
      state: 'SCORE_DONE',  
      participants: [  
        {  
          id: 'player-5',  
          name: 'Player 5',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '1'  
        },  
        {  
          id: 'player-2',  
          name: 'Player 2',  
          isWinner: false,  
          status: 'PLAYED',  
          resultText: '1'  
        }  
      ]  
    },  
    {  
      id: 12,  
      name: 'LB Final',  
      nextMatchId: 13,  
      nextLooserMatchId: null,  
      tournamentRoundText: 'LB R3',  
      startTime: '2025-11-15T19:00:00+00:00',  
      state: 'SCHEDULED',  
      participants: []  
    }  
  ]  
};

  return (
    <DoubleEliminationBracket
      matches={matches}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={window.innerWidth} height={window.innerHeight - 150} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  )
  }

  return (
    <div className="tournament-container">
      <h2 className="tournament-title">{info.name}</h2>
      <p className="tournament-description">{info.description}</p>
      <p><strong>Start Date:</strong> {new Date(info.startDate).toLocaleString()}</p>
      <p><strong>End Date:</strong> {new Date(info.endDate).toLocaleString()}</p>
      <p><strong>Status:</strong> {info.status}</p>
      <p><strong>Team Size:</strong> {info.teamSize}</p>

      <div className="team-grid">
        {info.teams.map(team => (
          <Card
            key={team.id}
            className={`team-card ${joiningTeam === team.id ? "joining" : ""}`}
            onClick={() => joinTeam(id, team.id, user.id)}
          >
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>
              Players: {team.players?.length || 0} / {info.teamSize}
            </CardDescription>
            <CardFooter>{joiningTeam === team.id ? "Joining..." : ""}</CardFooter>
          </Card>
        ))}
      </div>

      {isOwner && (
        <div className="owner-panel">
          <h3 className="owner-title">Tournament Controls</h3>
          <div className="owner-actions">
            {info.status === "upcoming" && (
              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (window.confirm("Start this tournament? Teams will be locked.")) {
                    try {
                      await Calls.updateTournament({ id, status: "ongoing" });
                      setInfo(await Calls.getTournament({ id }));
                      alert("Tournament started!");
                    } catch (error) {
                      console.error("Error starting tournament:", error);
                      alert("Failed to start tournament.");
                    }
                  }
                }}
              >
                Start Tournament
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={async () => {
                if (window.confirm("Delete this tournament? This cannot be undone.")) {
                  try {
                    await Calls.deleteTournament({ id });
                    alert("Tournament deleted!");
                    setRoute("tournaments");
                  } catch (error) {
                    console.error("Error deleting tournament:", error);
                    alert("Failed to delete tournament.");
                  }
                }
              }}
            >
              Delete Tournament
            </button>
          </div>

          <div className="team-management">
            <h4>Manage Teams</h4>
            {info.teams.map(team => (
              <div key={team.id} className="team-management-item">
                <div className="team-info">
                  <strong>{team.name}</strong>
                  <span className="player-count">({team.players?.length || 0}/{info.teamSize} players)</span>
                </div>
                <button
                  className="btn btn-small btn-outline"
                  onClick={async () => {
                    if (window.confirm(`Remove team "${team.name}"?`)) {
                      try {
                        await Calls.removeTeam({ tournamentId: id, teamId: team.id });
                        setInfo(await Calls.getTournament({ id }));
                      } catch (error) {
                        console.error("Error removing team:", error);
                        alert("Failed to remove team.");
                      }
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleBack}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'white',
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
