import { useRoulette, RouletteWheel, RouletteTable, ChipList } from "react-casino-roulette";
import { useState, useEffect, useRef } from "react";
import "react-casino-roulette/dist/index.css";
import { Button } from "../bricks/atom/Button";
import "../styles/routes/casino.css";
import Calls from "../calls";
import useUser from "../hooks/useUser";
import { useNotification } from "../bricks/NotificationProvider";
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
    <div className="casino-container">
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
      {selectedGame ? (
        <>
          <div className="back-button-container">
            <Button onClick={() => setSelectedGame(null)} type="secondary">
              Back to Menu
            </Button>
          </div>
          {selectedGame === "european-roulette" && (
            <RouletteGame layoutType="european" credits={credits} updateCredits={updateCredits} userId={user.id} />
          )}
          {selectedGame === "american-roulette" && (
            <RouletteGame layoutType="american" credits={credits} updateCredits={updateCredits} userId={user.id} />
          )}
          {selectedGame === "slots" && <PlaceholderGame title="Slots" />}
          {selectedGame === "poker" && <Poker />}
        </>
      ) : (
        <GameMenu onSelect={setSelectedGame} />
      )}
    </div>
  );
}

function GameMenu({ onSelect }) {
  return (
    <>
      <h1 className="casino-title">Casino Royale</h1>
      <div className="game-menu">
        <GameCard
          title="European Roulette"
          description="Classic single-zero roulette."
          onClick={() => onSelect("european-roulette")}
        />
        <GameCard
          title="American Roulette"
          description="Double-zero roulette for high stakes."
          onClick={() => onSelect("american-roulette")}
        />
        <GameCard
          title="Texas Hold'em"
          description="Test your skills against the house."
          onClick={() => onSelect("poker")}
        />
      </div>
    </>
  );
}

function GameCard({ title, description, onClick }) {
  return (
    <div className="game-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Button type="primary-outline">Play Now</Button>
    </div>
  );
}

function PlaceholderGame({ title }) {
  return (
    <div className="placeholder-screen">
      <h2>{title}</h2>
      <p>Coming Soon...</p>
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

        showSuccess(`You won $${winnings}!`, `The ball landed on ${winner}`);
      } catch (e) {
        console.error("Failed to add winnings", e);
        showError(`You won $${winnings}!`, `Error updating credits. The ball landed on ${winner}`);
      }
    } else {
      showInfo("Better luck next time!", `The ball landed on ${winner}`);
    }
  };

  return (
    <>
      <h1 className="casino-title">{layoutType === "american" ? "American" : "European"} Roulette</h1>
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
          <div className="total-display">Total Bet: ${total}</div>

          <div className="chip-list-wrapper">
            <ChipList chips={chips} selectedChip={selectedChip} onChipPressed={setSelectedChip} />
          </div>

          <div className="action-buttons">
            <Button onClick={clearBets} disabled={wheelStart} type="danger">
              Clear Bets
            </Button>
            <Button onClick={doSpin} disabled={wheelStart || total > credits} type="primary-fill">
              Spin Wheel
            </Button>
          </div>
        </div>
      </div>
      {showBigWin && <BigWinOverlay amount={winAmount} />}
    </>
  );
}

function BigWinOverlay({ amount }) {
  return (
    <div className="big-win-overlay">
      <div className="big-win-content">
        <h1 className="big-win-text">BIG WIN</h1>
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

