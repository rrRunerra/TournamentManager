import { useRoulette, RouletteWheel, RouletteTable, ChipList } from "react-casino-roulette";
import { useState, useEffect, useRef } from "react";
import "react-casino-roulette/dist/index.css";
import { Button } from "../bricks/atom/Button";
import { Card, CardTitle, CardIcon, CardDetails, CardStatus } from "../bricks/atom/Card";
import "../styles/routes/casino.css";
import Calls from "../calls";
import useUser from "../hooks/useUser";
import { useNotification } from "../bricks/NotificationProvider";
import { useConfirm } from "../bricks/ConfirmProvider";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi";
import Poker from "./poker";
import "../styles/routes/poker.css";
import { useRoute } from "uu5g05";

const chips = {
  1: "../assets/white-chip.png",
  10: "../assets/blue-chip.png",
  100: "../assets/black-chip.png",
  500: "../assets/cyan-chip.png",
};

export const getRandomRouletteWinBet = (layoutType = "european") => {
  const possibleWinBets = ["0", ...Array.from({ length: 36 }, (_, i) => `${i + 1}`)];

  if (layoutType === "american") possibleWinBets.push("00");

  const randomIndex = window.crypto.getRandomValues(new Uint32Array(1))[0] % possibleWinBets.length;

  return possibleWinBets[randomIndex];
};

// Roulette from : https://github.com/dozsolti/react-casino-roulette

// Poker from : https://github.com/ethanbrook-dev/TexasHoldEm-poker-multiplayer (Modified a bit)
export default function CasinoPage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [credits, setCredits] = useState(0);
  const { showError } = useNotification();
  const [, setRoute] = useRoute();

  const [user] = useUser();
  const lsi = useLsi(importLsi, ["Casino"]);

  useEffect(() => {
    if (!user) return;

    const fetchPlayer = async () => {
      try {
        const userId = user.id;
        const player = await Calls.player.get({ id: userId });
        setCredits(player.credits || 0);
      } catch (e) {
        console.error("Failed to fetch player credits", e);
      }
    };
    fetchPlayer();
  }, [user, selectedGame]);

  const updateCredits = (newCredits) => {
    setCredits(newCredits);
  };

  return (
    <div className={`casino-container ${!selectedGame ? "game-selection-bg" : ""}`}>
      <div className="right-controls">
        <div className="credits-container">
          <div className="coin-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
          </div>
          <div className="credits-amount">
            <span className="currency-symbol">$</span>
            <span className="amount-value">{credits}</span>
          </div>
        </div>
        <div
          className="shop-button"
          onClick={() => showError("Shop Coming Soon!", "The shop is under construction.")}
          title={lsi.shop || "Shop"}
        >
          <svg viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
      </div>
      {selectedGame ? (
        <>
          <div className="back-button-container">
            <Button onClick={() => setSelectedGame(null)} type="secondary">
              {lsi.backToMenu}
            </Button>
          </div>
          {selectedGame === "european-roulette" && (
            <RouletteGame layoutType="european" credits={credits} updateCredits={updateCredits} userId={user.id} />
          )}
          {selectedGame === "american-roulette" && (
            <RouletteGame layoutType="american" credits={credits} updateCredits={updateCredits} userId={user.id} />
          )}
          {selectedGame === "betting" && <BettingGame setCredits={setCredits} />}
          {selectedGame === "poker" && <Poker />}
        </>
      ) : (
        <GameMenu onSelect={setSelectedGame} />
      )}
    </div>
  );
}

function GameMenu({ onSelect }) {
  const lsi = useLsi(importLsi, ["Casino"]);
  return (
    <>
      <h1 className="casino-title">{lsi.title}</h1>
      <div className="game-menu">
        <GameCard
          title={lsi.games.europeanRoulette.title}
          description={lsi.games.europeanRoulette.description}
          onClick={() => onSelect("european-roulette")}
        />
        <GameCard
          title={lsi.games.americanRoulette.title}
          description={lsi.games.americanRoulette.description}
          onClick={() => onSelect("american-roulette")}
        />
        <GameCard
          title={lsi.games.poker.title}
          description={lsi.games.poker.description}
          onClick={() => onSelect("poker")}
        />
        <GameCard title={"betting"} description={"betting"} onClick={() => onSelect("betting")} />
      </div>
    </>
  );
}

function GameCard({ title, description, onClick }) {
  const lsi = useLsi(importLsi, ["Casino"]);
  return (
    <div className="game-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Button type="primary-outline">{lsi.playNow}</Button>
    </div>
  );
}

function PlaceholderGame({ title }) {
  const lsi = useLsi(importLsi, ["Casino"]);
  return (
    <div className="placeholder-screen">
      <h2>{title}</h2>
      <p>{lsi.comingSoon}</p>
    </div>
  );
}

function RouletteGame({ layoutType, credits, updateCredits, userId }) {
  const { bets, total, onBet, clearBets } = useRoulette();
  const { showSuccess, showError, showInfo } = useNotification();
  const lsi = useLsi(importLsi, ["Casino"]);

  const [selectedChip, setSelectedChip] = useState(Object.keys(chips)[0]);
  const [winningBet, setWinningBet] = useState("-1");
  const [wheelStart, setWheelStart] = useState(false);
  const [showBigWin, setShowBigWin] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  // Use ref to access latest bets in handleEndSpin to avoid stale closure
  const betsRef = useRef(bets);
  useEffect(() => {
    betsRef.current = bets;
  }, [bets]);

  const doSpin = async () => {
    if (total > credits) {
      showError("Insufficient credits!");
      return;
    }

    try {
      // Deduct bet
      const removeResult = await Calls.player.removeCredits({ id: userId, amount: total });
      updateCredits(removeResult.credits);

      const winner = getRandomRouletteWinBet(layoutType);
      setWinningBet(winner);
      setWheelStart(true);
    } catch (e) {
      console.error("Failed to place bet", e);
      showError("Error placing bet", "Please try again.");
    }
  };

  const handlePlaceBet = (e) => {
    const chipValue = parseInt(selectedChip, 10);
    if (total + chipValue > credits) {
      showError(lsi.insufficientCredits);
      return;
    }
    onBet(selectedChip)(e);
  };

  const handleEndSpin = async (winner) => {
    setWheelStart(false);

    const currentBets = betsRef.current;

    let winnings = 0;

    Object.keys(currentBets).map((bet) => {
      const b = currentBets[bet];

      if (b.payload.includes(winner)) {
        winnings += b.amount * b.payoutScale;
      }
    });

    if (winnings > 0) {
      try {
        const addResult = await Calls.player.addCredits({ id: userId, amount: winnings });
        updateCredits(addResult.credits);

        if (winnings >= 1000) {
          setWinAmount(winnings);
          setShowBigWin(true);
          setTimeout(() => setShowBigWin(false), 5000); // Hide after 5 seconds
        }

        showSuccess(`${lsi.youWon} $${winnings}!`, `${lsi.ballLanded} ${winner}`);
      } catch (e) {
        console.error("Failed to add winnings", e);
        showError(`${lsi.youWon} $${winnings}!`, `${lsi.errorUpdatingCredits}. ${lsi.ballLanded} ${winner}`);
      }
    } else {
      showInfo(lsi.betterLuck, `${lsi.ballLanded} ${winner}`);
    }
  };

  return (
    <>
      <h1 className="casino-title">
        {layoutType === "american" ? lsi.games.americanRoulette.title : lsi.games.europeanRoulette.title}
      </h1>
      <div className="roulette-container">
        <div className="game-board">
          <div className="wheel-wrapper">
            <RouletteWheel
              start={wheelStart}
              winningBet={winningBet}
              onSpinningEnd={handleEndSpin}
              layoutType={layoutType}
            />
          </div>
          <div className="table-wrapper">
            <RouletteTable
              chips={chips}
              bets={bets}
              onBet={handlePlaceBet}
              readOnly={wheelStart}
              layoutType={layoutType}
            />
          </div>
        </div>

        <div className="controls-area">
          <div className="total-display">
            {lsi.totalBet}: ${total}
          </div>

          <div className="chip-list-wrapper">
            <ChipList chips={chips} selectedChip={selectedChip} onChipPressed={setSelectedChip} />
          </div>

          <div className="action-buttons">
            <Button onClick={clearBets} disabled={wheelStart} type="danger">
              {lsi.clearBets}
            </Button>
            <Button onClick={doSpin} disabled={wheelStart || total > credits} type="primary-fill">
              {lsi.spinWheel}
            </Button>
          </div>
        </div>
      </div>
      {showBigWin && <BigWinOverlay amount={winAmount} />}
    </>
  );
}

function BigWinOverlay({ amount }) {
  const lsi = useLsi(importLsi, ["Casino"]);
  return (
    <div className="big-win-overlay">
      <div className="big-win-content">
        <h1 className="big-win-text">{lsi.bigWin}</h1>
        <h2 className="big-win-amount">${amount}</h2>
      </div>
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="confetti" style={{ "--i": i }}></div>
        ))}
      </div>
    </div>
  );
}

function BettingGame({ setCredits }) {
  const [tournaments, setTournaments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [, setRoute] = useRoute();
  const lsi = useLsi(importLsi, ["Tournaments"]);
  const lsiCasino = useLsi(importLsi, ["Casino"]);

  const [selectedTournament, setSelectedTournament] = useState(null);

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
    if (!selectedTournament) {
      fetchTournaments(page);
    }
  }, [page, user, selectedTournament]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const renderTournamentCard = (tournament) => (
    <Card
      type="tournament"
      key={tournament.id}
      onClick={() => setSelectedTournament(tournament)}
      style={{ cursor: "pointer" }}
    >
      <CardIcon>🏆</CardIcon>
      <CardTitle type="tournament" title={tournament.name}>
        {tournament.name}
      </CardTitle>
      <CardDetails>
        📅 {new Date(tournament.startDate).getDate()}. - {new Date(tournament.endDate).getDate()}.{" "}
        {lsi.months && lsi.months[new Date(tournament.endDate).getMonth() + 1]}.{" "}
        {new Date(tournament.endDate).getFullYear()}
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

  const ongoingTournaments = tournaments.filter((t) => t.status === "ongoing");
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming");

  if (selectedTournament) {
    return (
      <TournamentBetting
        tournament={selectedTournament}
        onBack={() => setSelectedTournament(null)}
        setCredits={setCredits}
      />
    );
  }

  return (
    <div className="betting-game-container" onScroll={handleScroll}>
      <h1 className="casino-title">Match Betting</h1>
      <div className="tournaments-list">
        {tournaments.length === 0 && !loading ? (
          <div className="no-tournaments">{lsi.noTournaments}</div>
        ) : (
          <>
            {ongoingTournaments.map(renderTournamentCard)}
            {ongoingTournaments.length > 0 && upcomingTournaments.length > 0 && <hr className="tournament-separator" />}
            {upcomingTournaments.map(renderTournamentCard)}
          </>
        )}
        {loading && <div className="loading-spinner">{lsiCasino.loading || "Loading..."}</div>}
      </div>
    </div>
  );
}

function TournamentBetting({ tournament, setCredits }) {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState(10);
  const [bets, setBets] = useState({});
  const [user] = useUser();
  const { showSuccess, showError } = useNotification();
  const { confirm } = useConfirm();
  const lsi = useLsi(importLsi, ["Casino"]);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const matchesData = await Calls.match.list({ tournamentId: tournament.id });
        setMatches(matchesData);

        const info = await Calls.tournament.get({ id: tournament.id });
        setTeams(info.teams);

        // Restore bets
        const restoredBets = {};

        // Restore match bets
        matchesData.forEach((match) => {
          if (match.bets) {
            const userBet = match.bets.find((b) => b.userId === user.id);
            if (userBet) {
              restoredBets[match.matchId] = { teamId: userBet.teamId, type: userBet.bet };
            }
          }
        });

        // Restore upcoming bets
        if (info.bets) {
          info.bets.forEach((bet) => {
            if (bet.userId === user.id) {
              restoredBets[`${tournament.id}-${bet.teamId}`] = bet.position;
            }
          });
        }

        setBets(restoredBets);
      } catch (e) {
        console.error("Failed to fetch details", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [tournament.id]);

  const handleBet = async (matchId, teamId, type, position) => {
    // Check if bet already placed for this context
    if (matchId && bets[matchId]) return;
    if (!matchId && bets[`${tournament.id}-${teamId}`]) return;

    let teamName = "Team";
    let message = "";

    if (matchId) {
      const match = matches.find((m) => m.matchId === matchId);
      teamName = match?.participants.find((p) => p.id === teamId)?.name || "Team";
      message = `${lsi.confirmBetMessage || "Are you sure you want to bet"} $${betAmount} on ${teamName} to ${type}?`;
    } else {
      // Upcoming tournament bet
      const team = teams.find((t) => t.id === teamId);
      teamName = team?.name || "Team";
      message = `${lsi.confirmBetMessage || "Are you sure you want to bet"} $${betAmount} on ${teamName} for position ${position}?`;
    }

    const isConfirmed = await confirm({
      title: lsi.confirmBetTitle || "Confirm Bet",
      message: message,
      confirmText: lsi.placeBet || "Place Bet",
      cancelText: lsi.cancel || "Cancel",
    });

    if (!isConfirmed) return;

    try {
      await Calls.player.removeCredits({ id: user.id, amount: betAmount });
      setCredits((prev) => prev - betAmount);

      if (matchId) {
        await Calls.match.setBet({
          matchId: matchId,
          tournamentId: tournament.id,
          userId: user.id,
          teamId: teamId,
          bet: type,
          betAmount: betAmount,
        });
        showSuccess(lsi.betPlaced || "Bet Placed!", `You bet $${betAmount} on ${teamName} to ${type}`);
        setBets((prev) => ({ ...prev, [matchId]: { teamId, type } }));
      } else {
        await Calls.tournament.setBet({
          tournamentId: tournament.id,
          userId: user.id,
          teamId: teamId,
          matchId: matchId,
          position: position,
          betAmount: betAmount,
        });
        showSuccess(lsi.betPlaced || "Bet Placed!", `You bet $${betAmount} on ${teamName} for position ${position}`);
        setBets((prev) => ({ ...prev, [`${tournament.id}-${teamId}`]: position }));
      }
    } catch (e) {
      console.error("Failed to place bet", e);
      showError(lsi.insufficientCredits || "Insufficient Credits or Error");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="betting-interface">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ color: "white", margin: 0 }}>
          {tournament.name} {matches.length === 0 && "(Upcoming)"}
        </h2>
      </div>
      <div className="bet-controls">
        <label style={{ color: "white", marginRight: "1rem" }}>Bet Amount: $</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
          className="bet-input"
          style={{
            padding: "0.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #d4af37",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            width: "100px",
          }}
        />
      </div>
      <div
        className="teams-betting-grid"
        style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}
      >
        {matches.length > 0
          ? matches.map((match) => {
            const currentBet = bets[match.matchId];
            const participants = match.participants || [];
            if (participants.length < 2) return null;

            return (
              <Card key={match.matchId} type="team">
                <CardTitle type="orange">{match.name}</CardTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span style={{ color: "white", fontWeight: "bold" }}>{participant.name}</span>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Button
                          onClick={() => handleBet(match.matchId, participant.id, "win")}
                          disabled={!!currentBet}
                          type={
                            currentBet?.teamId === participant.id && currentBet?.type === "win"
                              ? "primary-fill"
                              : "primary-outline"
                          }
                          style={{
                            opacity:
                              currentBet && (currentBet.teamId !== participant.id || currentBet.type !== "win")
                                ? 0.5
                                : 1,
                          }}
                        >
                          Win
                        </Button>
                        <Button
                          onClick={() => handleBet(match.matchId, participant.id, "lose")}
                          disabled={!!currentBet}
                          type={
                            currentBet?.teamId === participant.id && currentBet?.type === "lose"
                              ? "danger"
                              : "danger-outline"
                          }
                          style={{
                            opacity:
                              currentBet && (currentBet.teamId !== participant.id || currentBet.type !== "lose")
                                ? 0.5
                                : 1,
                          }}
                        >
                          Lose
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })
          : teams.map((team) => {
            const currentBet = bets[`${tournament.id}-${team.id}`];
            const takenPositions = Object.values(bets).filter((v) => typeof v === "number");

            return (
              <Card key={team.id} type="team" style={{ width: "250px" }}>
                <CardTitle type="orange">{team.name}</CardTitle>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                  {tournament.bracketType === "robin" ? (
                    <div style={{ textAlign: "center", color: "#aaa", fontSize: "0.9rem", width: "100%" }}>
                      Only available to bet when tournament is ongoing
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleBet(null, team.id, null, 1)}
                        disabled={!!currentBet || (takenPositions.includes(1) && currentBet !== 1)}
                        type={currentBet === 1 ? "primary-fill" : "primary-outline"}
                        style={{
                          flex: 1,
                          opacity: !!currentBet || (takenPositions.includes(1) && currentBet !== 1) ? 0.5 : 1,
                        }}
                      >
                        1st
                      </Button>
                      <Button
                        onClick={() => handleBet(null, team.id, null, 2)}
                        disabled={!!currentBet || (takenPositions.includes(2) && currentBet !== 2)}
                        type={currentBet === 2 ? "primary-fill" : "primary-outline"}
                        style={{
                          flex: 1,
                          opacity: !!currentBet || (takenPositions.includes(2) && currentBet !== 2) ? 0.5 : 1,
                        }}
                      >
                        2nd
                      </Button>
                      {tournament.bracketType === "double" && (
                        <>
                          <Button
                            onClick={() => handleBet(null, team.id, null, 3)}
                            disabled={!!currentBet || (takenPositions.includes(3) && currentBet !== 3)}
                            type={currentBet === 3 ? "primary-fill" : "primary-outline"}
                            style={{
                              flex: 1,
                              opacity: !!currentBet || (takenPositions.includes(3) && currentBet !== 3) ? 0.5 : 1,
                            }}
                          >
                            3rd
                          </Button>
                          <Button
                            onClick={() => handleBet(null, team.id, null, 4)}
                            disabled={!!currentBet || (takenPositions.includes(4) && currentBet !== 4)}
                            type={currentBet === 4 ? "primary-fill" : "primary-outline"}
                            style={{
                              flex: 1,
                              opacity: !!currentBet || (takenPositions.includes(4) && currentBet !== 4) ? 0.5 : 1,
                            }}
                          >
                            4th
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
