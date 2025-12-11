import { useRoulette, RouletteWheel, RouletteTable, ChipList } from "react-casino-roulette";
import { useState } from "react";
import "react-casino-roulette/dist/index.css";
import { Button } from "../bricks/atom/Button";
import "../styles/routes/casino.css";

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

  return (
    <div className="casino-container">
      {selectedGame ? (
        <>
          <div className="back-button-container">
            <Button onClick={() => setSelectedGame(null)} type="secondary">
              Back to Menu
            </Button>
          </div>
          {selectedGame === "european-roulette" && <RouletteGame layoutType="european" />}
          {selectedGame === "american-roulette" && <RouletteGame layoutType="american" />}
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

function RouletteGame({ layoutType }) {
  const { bets, total, onBet, clearBets } = useRoulette();

  const [selectedChip, setSelectedChip] = useState(Object.keys(chips)[0]);
  const [winningBet, setWinningBet] = useState("-1");
  const [wheelStart, setWheelStart] = useState(false);

  const doSpin = () => {
    const winner = getRandomRouletteWinBet(layoutType);

    setWinningBet(winner);
    setWheelStart(true);
  };

  const handleEndSpin = (winner) => {
    alert("The ball landed on " + winner);
    setWheelStart(false);
  };

  return (
    <>
      <h1 className="casino-title">{layoutType === "american" ? "American" : "European"} Roulette</h1>
      <div className="roulette-container">
        <div className="game-area">
          <div className="wheel-wrapper">
            <RouletteWheel start={wheelStart} winningBet={winningBet} onSpinningEnd={handleEndSpin} />
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
            <Button onClick={doSpin} disabled={wheelStart} type="primary-fill">
              Spin Wheel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
