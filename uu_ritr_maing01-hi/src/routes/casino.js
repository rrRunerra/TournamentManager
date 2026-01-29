import { useRoulette, RouletteWheel, RouletteTable, ChipList } from "react-casino-roulette";
import { useState, useEffect, useRef } from "react";
import "react-casino-roulette/dist/index.css";
import { Button } from "../bricks/components/ui/Button";
import { Card, CardTitle, CardIcon, CardDetails, CardStatus } from "../bricks/components/ui/Card";
import "../styles/routes/casino.css";
import Calls from "../calls";
import useUser from "../hooks/useUser";
import { useNotification } from "../hooks/useNotification.js";
import { useConfirm } from "../bricks/components/confirm/ConfirmProvider";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi";
import Poker from "./poker";
import "../styles/routes/poker.css";
import Shop from "../bricks/shop/shop.js";
import darkShopItems from "../bricks/shop/dark_shop_items.json";
import { useRoute } from "uu5g05";
import LoginRequired from "../bricks/LoginRequired.js";

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
// Shop items - placeholder for profile pictures to be added later

export default function CasinoPage(props) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [credits, setCredits] = useState(0);
  const [ownedProfilePics, setOwnedProfilePics] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(false);
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
        setOwnedProfilePics(player.ownedProfilePics || []);
      } catch (e) {
        console.error("Failed to fetch player credits", e);
      }
    };
    fetchPlayer();
  }, [user, selectedGame]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (props.shop === "true" || params.get("shop") === "true") {
      setIsShopOpen(true);
    }
  }, [props.shop]);

  const updateCredits = (newCredits) => {
    setCredits(newCredits);
  };

  const handleShopPurchase = (newCredits, newOwnedProfilePics) => {
    setCredits(newCredits);
    setOwnedProfilePics(newOwnedProfilePics);
  };

  if (!user) {
    return <LoginRequired lsi={lsi}></LoginRequired>;
  }

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
        <div className="shop-button" onClick={() => setIsShopOpen(true)} title={lsi.shop || "Shop"}>
          <svg viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
      </div>

      <Shop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        user={user}
        items={darkShopItems}
        title={lsi.shopTitle || "Profile Shop"}
        onPurchase={handleShopPurchase}
      />
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

          {selectedGame === "poker" && <Poker />}
          {selectedGame === "slots" && <SlotMachine credits={credits} updateCredits={updateCredits} userId={user.id} />}
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
        <GameCard
          title={lsi.games.slots.title}
          description={lsi.games.slots.description}
          onClick={() => onSelect("slots")}
        />
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

// Slot Machine Symbols
const SLOT_SYMBOLS = ["🍒", "🍋", "🔔", "💎", "7️⃣", "⭐", "🍀", "🍉"];

// Payout table (multipliers for matching symbols)
const PAYOUTS = {
  "🍒🍒🍒": 5,
  "🍋🍋🍋": 10,
  "🔔🔔🔔": 15,
  "💎💎💎": 25,
  "⭐⭐⭐": 50,
  "7️⃣7️⃣7️⃣": 100,
  // Two matching
  "🍒🍒": 2,
  "🍋🍋": 2,
  "🔔🔔": 3,
  "💎💎": 4,
  "⭐⭐": 5,
  "7️⃣7️⃣": 10,
  "🍀🍀🍀": 15,
  "🍉🍉🍉": 20,
  "🍀🍀": 3,
  "🍉🍉": 4,
};

function SlotMachine({ credits, updateCredits, userId }) {
  const lsi = useLsi(importLsi, ["Casino"]);
  const { showSuccess, showError, showInfo } = useNotification();

  const [reels, setReels] = useState(["🍒", "🍒", "🍒"]);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [bet, setBet] = useState(10);
  const [showBigWin, setShowBigWin] = useState(false);
  const [lastWin, setLastWin] = useState(0);

  const getRandomSymbol = () => {
    const randomIndex = window.crypto.getRandomValues(new Uint32Array(1))[0] % SLOT_SYMBOLS.length;
    return SLOT_SYMBOLS[randomIndex];
  };

  const calculateWin = (result) => {
    const key3 = result.join("");
    if (PAYOUTS[key3]) {
      return bet * PAYOUTS[key3];
    }

    // Check for two matching (first two or last two)
    if (result[0] === result[1]) {
      const key2 = result[0] + result[1];
      if (PAYOUTS[key2]) {
        return bet * PAYOUTS[key2];
      }
    }
    if (result[1] === result[2]) {
      const key2 = result[1] + result[2];
      if (PAYOUTS[key2]) {
        return bet * PAYOUTS[key2];
      }
    }

    return 0;
  };

  const spin = async () => {
    if (bet > credits) {
      showError(lsi.insufficientCredits);
      return;
    }

    try {
      // Deduct bet
      const removeResult = await Calls.player.removeCredits({ id: userId, amount: bet });
      updateCredits(removeResult.credits);

      // Start spinning all reels
      setSpinning([true, true, true]);
      setLastWin(0);

      // Generate final results
      const finalResults = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

      // Stop reels one by one
      setTimeout(() => {
        setReels((prev) => [finalResults[0], prev[1], prev[2]]);
        setSpinning((prev) => [false, prev[1], prev[2]]);
      }, 1000);

      setTimeout(() => {
        setReels((prev) => [prev[0], finalResults[1], prev[2]]);
        setSpinning((prev) => [prev[0], false, prev[2]]);
      }, 1500);

      setTimeout(async () => {
        setReels(finalResults);
        setSpinning([false, false, false]);

        // Calculate winnings
        const winnings = calculateWin(finalResults);
        setLastWin(winnings);

        if (winnings > 0) {
          try {
            const addResult = await Calls.player.addCredits({ id: userId, amount: winnings });
            updateCredits(addResult.credits);

            if (winnings >= bet * 25) {
              setWinAmount(winnings);
              setShowBigWin(true);
              setTimeout(() => setShowBigWin(false), 5000);
            }

            showSuccess(`${lsi.youWon} $${winnings}!`);
          } catch (e) {
            console.error("Failed to add winnings", e);
            showError(lsi.errorUpdatingCredits);
          }
        } else {
          showInfo(lsi.betterLuck);
        }
      }, 2000);
    } catch (e) {
      console.error("Failed to place bet", e);
      showError(lsi.errorPlacingBet);
      setSpinning([false, false, false]);
    }
  };

  const isSpinning = spinning.some((s) => s);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!isSpinning) {
          spin();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSpinning, spin]);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const adjustBet = (amount) => {
    setBet((prev) => {
      const next = prev + amount;
      return Math.max(10, Math.min(credits, next));
    });
  };

  const startChangingBet = (amount) => {
    if (isSpinning) return;
    adjustBet(amount);

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        adjustBet(amount);
      }, 50);
    }, 400);
  };

  const stopChangingBet = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => stopChangingBet();
  }, []);

  return (
    <>
      <h1 className="casino-title">{lsi.games.slots.title}</h1>
      <div className="slot-machine-container">
        <div className="slot-machine">
          <div className="slot-machine-frame">
            <div className="slot-reels">
              {reels.map((symbol, index) => (
                <div key={index} className={`slot-reel ${spinning[index] ? "spinning" : ""}`}>
                  <div className="slot-reel-inner">
                    {spinning[index] ? (
                      <>
                        {SLOT_SYMBOLS.map((s, i) => (
                          <div key={i} className="slot-symbol">
                            {s}
                          </div>
                        ))}
                        {SLOT_SYMBOLS.map((s, i) => (
                          <div key={`dup-${i}`} className="slot-symbol">
                            {s}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="slot-symbol result">{symbol}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="slot-payline"></div>
          </div>

          {lastWin > 0 && !isSpinning && (
            <div className="slot-last-win">
              {lsi.games.slots.lastWin}: <span>${lastWin}</span>
            </div>
          )}

          <div className="slot-controls">
            <div className="slot-bet-control">
              <span>{lsi.games.slots.bet}:</span>
              <button
                className="bet-btn"
                onMouseDown={() => startChangingBet(-10)}
                onMouseUp={stopChangingBet}
                onMouseLeave={stopChangingBet}
                disabled={isSpinning}
              >
                -
              </button>
              <span className="bet-amount">${bet}</span>
              <button
                className="bet-btn"
                onMouseDown={() => startChangingBet(10)}
                onMouseUp={stopChangingBet}
                onMouseLeave={stopChangingBet}
                disabled={isSpinning}
              >
                +
              </button>
            </div>

            <button
              className={`spin-btn ${isSpinning ? "disabled" : ""}`}
              onClick={spin}
              disabled={isSpinning || bet > credits}
            >
              {isSpinning ? lsi.games.slots.spinning : lsi.games.slots.spin}
            </button>
          </div>
        </div>

        <div className="slot-paytable">
          <h3>{lsi.games.slots.paytable}</h3>
          <div className="paytable-columns">
            <div className="paytable-items">
              <div className="paytable-item">
                <span>7️⃣ 7️⃣ 7️⃣</span>
                <span>x100</span>
              </div>
              <div className="paytable-item">
                <span>⭐ ⭐ ⭐</span>
                <span>x50</span>
              </div>
              <div className="paytable-item">
                <span>💎 💎 💎</span>
                <span>x25</span>
              </div>
              <div className="paytable-item">
                <span>🍉 🍉 🍉</span>
                <span>x20</span>
              </div>
              <div className="paytable-item">
                <span>🍀 🍀 🍀</span>
                <span>x15</span>
              </div>
              <div className="paytable-item">
                <span>🔔 🔔 🔔</span>
                <span>x15</span>
              </div>
              <div className="paytable-item">
                <span>🍋 🍋 🍋</span>
                <span>x10</span>
              </div>
              <div className="paytable-item">
                <span>🍒 🍒 🍒</span>
                <span>x5</span>
              </div>
            </div>
            <div className="paytable-items two-match-column">
              <div className="paytable-item two-match">
                <span>7️⃣ 7️⃣</span>
                <span>x10</span>
              </div>
              <div className="paytable-item two-match">
                <span>⭐ ⭐</span>
                <span>x5</span>
              </div>
              <div className="paytable-item two-match">
                <span>💎 💎</span>
                <span>x4</span>
              </div>
              <div className="paytable-item two-match">
                <span>🍉 🍉</span>
                <span>x4</span>
              </div>
              <div className="paytable-item two-match">
                <span>🍀 🍀</span>
                <span>x3</span>
              </div>
              <div className="paytable-item two-match">
                <span>🔔 🔔</span>
                <span>x3</span>
              </div>
              <div className="paytable-item two-match">
                <span>🍋 🍋</span>
                <span>x2</span>
              </div>
              <div className="paytable-item two-match">
                <span>🍒 🍒</span>
                <span>x2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showBigWin && <BigWinOverlay amount={winAmount} />}
    </>
  );
}
