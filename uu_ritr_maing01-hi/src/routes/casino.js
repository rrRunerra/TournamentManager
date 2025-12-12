import { useRoulette, RouletteWheel, RouletteTable, ChipList } from "react-casino-roulette";
import { useState, useEffect, useRef } from "react";
import "react-casino-roulette/dist/index.css";
import { Button } from "../bricks/atom/Button";
import "../styles/routes/casino.css";
import Calls from "../calls";
import useUser from "../hooks/useUser";
import { useNotification } from "../bricks/NotificationProvider";

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

// https://github.com/dozsolti/react-casino-roulette
export default function CasinoPage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [credits, setCredits] = useState(0);

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
  }, [user]);

  const updateCredits = (newCredits) => {
    setCredits(newCredits);
  };

  return (
    <div className="casino-container">
      <div className="credits-display">Credits: ${credits}</div>
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
          {selectedGame === "poker" && <PlaceholderGame title="Poker" />}
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

// ... (imports)

function RouletteGame({ layoutType, credits, updateCredits, userId }) {
  const { bets, total, onBet, clearBets } = useRoulette();
  const { showSuccess, showError, showInfo } = useNotification();

  const [selectedChip, setSelectedChip] = useState(Object.keys(chips)[0]);
  const [winningBet, setWinningBet] = useState("-1");
  const [wheelStart, setWheelStart] = useState(false);

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
        <div className="game-area">
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
              onBet={onBet(selectedChip)}
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
    </>
  );
}
