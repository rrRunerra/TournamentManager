import { useState, useEffect, useMemo } from "react";
import Calls from "../calls.js";
import { Card, CardTitle, CardDescription, CardFooter } from "../bricks/cards.js";
import { useRoute } from "uu5g05";
import "../styles/tournamentDetail.css";
import { DoubleEliminationBracket, Match, SingleEliminationBracket, SVGViewer } from "@g-loot/react-tournament-brackets"
import OwnerControls from "../bricks/ownerControls.js";
import OngoingTournamentNav from "../bricks/OngoingTournamentNav.js";



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


  if (!info || !user) return <p className="loading">Loading...</p>;

  const isOwner = info?.owner === user?.id;
  const bracketsType = info?.bracketType

  console.log(info)


  if (info.status === "ongoing") {
    // current-match brackets  owner-controls

    const double_matches = {
      upper: [
        {
          id: 252203,
          name: "Upper Round 1 - Match 1",
          nextMatchId: 671199,
          nextLooserMatchId: 59536,
          tournamentRoundText: "1",
          startTime: null,
          state: "SCHEDULED",
          participants: [
            {
              id: "somuwfq39hda48n5v83l",
              resultText: null,
              isWinner: false,
              status: null,
              name: "1"
            },
            {
              id: "76xmmdkdwesntok92frlug",
              resultText: null,
              isWinner: false,
              status: null,
              name: "2"
            }
          ]
        },
        {
          id: 301254,
          name: "Upper Round 1 - Match 2",
          nextMatchId: 671199,
          nextLooserMatchId: 59536,
          tournamentRoundText: "1",
          startTime: null,
          state: "SCHEDULED",
          participants: [
            {
              id: "rp6h2vsvwirunj5szrudf8",
              resultText: null,
              isWinner: false,
              status: null,
              name: "3"
            },
            {
              id: "wyxnrpu3541ea3xxhrwvy",
              resultText: null,
              isWinner: false,
              status: null,
              name: "4"
            }
          ]
        },
        {
          id: 522043,
          name: "Upper Round 1 - Match 3",
          nextMatchId: 566145,
          nextLooserMatchId: 637037,
          tournamentRoundText: "1",
          startTime: null,
          state: "SCHEDULED",
          participants: [
            {
              id: "5j5m2d0w9i4d12oqyidrhn",
              resultText: null,
              isWinner: false,
              status: null,
              name: "5"
            },
            {
              id: "mp0s8g7y3rf5u6tlt69j9t",
              resultText: null,
              isWinner: false,
              status: null,
              name: "6"
            }
          ]
        },
        {
          id: 240901,
          name: "Upper Round 1 - Match 4",
          nextMatchId: 566145,
          nextLooserMatchId: 637037,
          tournamentRoundText: "1",
          startTime: null,
          state: "SCHEDULED",
          participants: [
            {
              id: "rcsxdfwvw0r9mi6u0fd3s",
              resultText: null,
              isWinner: false,
              status: null,
              name: "7"
            },
            {
              id: "rv281yo4pjejhakci5far",
              resultText: null,
              isWinner: false,
              status: null,
              name: "8"
            }
          ]
        },
        {
          id: 671199,
          name: "Upper Round 2 - Match 1",
          nextMatchId: 947302,
          nextLooserMatchId: 546758,
          tournamentRoundText: "2",
          startTime: null,
          state: "SCHEDULED",
          participants: []
        },
        {
          id: 566145,
          name: "Upper Round 2 - Match 2",
          nextMatchId: 947302,
          nextLooserMatchId: 546758,
          tournamentRoundText: "2",
          startTime: null,
          state: "SCHEDULED",
          participants: []
        },
        {
          id: 947302,
          name: "Grand Final",
          nextMatchId: null,
          nextLooserMatchId: 503581,
          tournamentRoundText: "3",
          startTime: null,
          state: "SCHEDULED",
          participants: []
        }
      ],
      lower: [
        {
          id: 59536,
          name: "Lower Round 1 - Match 1",
          nextMatchId: 546758,
          nextLooserMatchId: null,
          tournamentRoundText: "1",
          startTime: null,
          state: "SCHEDULED",
          participants: []
        },
        {
          id: 637037,
          name: "Lower Round 1 - Match 2",
          nextMatchId: 546758,
          nextLooserMatchId: null,
          tournamentRoundText: "1",
          startTime: null,
          state: "SCHEDULED",
          participants: []
        },
        {
          id: 546758,
          name: "Lower Round 2 - Match 1",
          nextMatchId: 503581,
          nextLooserMatchId: null,
          tournamentRoundText: "2",
          startTime: null,
          state: "SCHEDULED",
          participants: []
        },
        {
          id: 417799,
          name: "Lower Round 2 - Match 2",
          nextMatchId: 503581,
          nextLooserMatchId: null,
          tournamentRoundText: "2",
          startTime: null,
          state: "SCHEDULED",
          participants: []
        },
        {
          id: 503581,
          name: "Lower Bracket Final",
          nextMatchId: 947302,
          nextLooserMatchId: null,
          tournamentRoundText: "3",
          startTime: null,
          state: "SCHEDULED",
          participants: []
        }
      ]
    }

    const single_matches = [
      {
        id: 995887,
        name: "Round 1 - Match 1",
        nextMatchId: 776344,
        tournamentRoundText: "1",
        startTime: null,
        state: "SCHEDULED",
        participants: [
          {
            id: "somuwfq39hda48n5v83l",
            resultText: null,
            isWinner: false,
            status: null,
            name: "1"
          },
          {
            id: "76xmmdkdwesntok92frlug",
            resultText: null,
            isWinner: false,
            status: null,
            name: "2"
          }
        ]
      },
      {
        id: 961894,
        name: "Round 1 - Match 2",
        nextMatchId: 776344,
        tournamentRoundText: "1",
        startTime: null,
        state: "SCHEDULED",
        participants: [
          {
            id: "rp6h2vsvwirunj5szrudf8",
            resultText: null,
            isWinner: false,
            status: null,
            name: "3"
          },
          {
            id: "wyxnrpu3541ea3xxhrwvy",
            resultText: null,
            isWinner: false,
            status: null,
            name: "4"
          }
        ]
      },
      {
        id: 650876,
        name: "Round 1 - Match 3",
        nextMatchId: 278235,
        tournamentRoundText: "1",
        startTime: null,
        state: "SCHEDULED",
        participants: [
          {
            id: "5j5m2d0w9i4d12oqyidrhn",
            resultText: null,
            isWinner: false,
            status: null,
            name: "5"
          },
          {
            id: "mp0s8g7y3rf5u6tlt69j9t",
            resultText: null,
            isWinner: false,
            status: null,
            name: "6"
          }
        ]
      },
      {
        id: 742437,
        name: "Round 1 - Match 4",
        nextMatchId: 278235,
        tournamentRoundText: "1",
        startTime: null,
        state: "SCHEDULED",
        participants: [
          {
            id: "rcsxdfwvw0r9mi6u0fd3s",
            resultText: null,
            isWinner: false,
            status: null,
            name: "7"
          },
          {
            id: "rv281yo4pjejhakci5far",
            resultText: null,
            isWinner: false,
            status: null,
            name: "8"
          }
        ]
      },
      {
        id: 776344,
        name: "Round 2 - Match 1",
        nextMatchId: 675111,
        tournamentRoundText: "2",
        startTime: null,
        state: "SCHEDULED",
        participants: []
      },
      {
        id: 278235,
        name: "Round 2 - Match 2",
        nextMatchId: 675111,
        tournamentRoundText: "2",
        startTime: null,
        state: "SCHEDULED",
        participants: []
      },
      {
        id: 675111,
        name: "Final - Match",
        nextMatchId: null,
        tournamentRoundText: "3",
        startTime: null,
        state: "SCHEDULED",
        participants: []
      }
    ]

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
                matches={double_matches}
                matchComponent={Match}
                svgWrapper={({ children, ...props }) => (
                  <SVGViewer width={window.innerWidth} height={window.innerHeight} {...props}>
                    {children}
                  </SVGViewer>
                )}
              />
            </div>
          ) : (
            <div>
              <SingleEliminationBracket
                matches={single_matches}
                matchComponent={Match}
                svgWrapper={({ children, ...props }) => (
                  <SVGViewer width={window.innerWidth} height={window.innerHeight} {...props}>
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
