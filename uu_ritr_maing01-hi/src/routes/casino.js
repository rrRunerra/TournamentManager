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
// Shop items - placeholder for profile pictures to be added later
const SHOP_ITEMS = [
  { id: 1, name: "Profile 1", price: 100, image: null },
  { id: 2, name: "Profile 2", price: 200, image: null },
  { id: 3, name: "Profile 3", price: 300, image: null },
  { id: 4, name: "Profile 4", price: 500, image: null },
  { id: 5, name: "Profile 5", price: 750, image: null },
  { id: 6, name: "Profile 6", price: 1000, image: null },
];

function ShopPopup({ isOpen, onClose, credits, userId, onPurchase }) {
  const { showSuccess, showError } = useNotification();
  const { confirm } = useConfirm();
  const lsi = useLsi(importLsi, ["Casino"]);

  if (!isOpen) return null;

  const handlePurchase = async (item) => {
    if (credits < item.price) {
      showError(lsi.insufficientCredits || "Insufficient Credits", "You don't have enough credits for this item.");
      return;
    }

    const confirmed = await confirm({
      title: lsi.confirmPurchase || "Confirm Purchase",
      message: `${lsi.confirmPurchaseMessage || "Are you sure you want to buy"} "${item.name}" for $${item.price}?`,
      confirmText: lsi.buy || "Buy",
      cancelText: lsi.cancel || "Cancel",
    });

    if (!confirmed) return;

    try {
      await Calls.player.removeCredits({ id: userId, amount: item.price });
      // TODO: Save purchased profile picture to user's account
      onPurchase(item.price);
      showSuccess(lsi.purchaseSuccess || "Purchase Successful!", `You bought "${item.name}"`);
    } catch (e) {
      console.error("Purchase failed", e);
      showError(lsi.purchaseError || "Purchase Failed", "Please try again.");
    }
  };

  return (
    <div className="shop-popup-overlay" onClick={onClose}>
      <div className="shop-popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="shop-popup-header">
          <h2>{lsi.shopTitle || "Profile Shop"}</h2>
          <button className="shop-popup-close" onClick={onClose}>×</button>
        </div>
        <div className="shop-popup-credits">
          <span>{lsi.yourCredits || "Your Credits"}: </span>
          <span className="shop-credits-value">${credits}</span>
        </div>
        <div className="shop-items-grid">
          {SHOP_ITEMS.map((item) => (
            <div key={item.id} className="shop-item-card">
              <div className="shop-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="shop-item-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="shop-item-name">{item.name}</div>
              <div className="shop-item-price">${item.price}</div>
              <Button
                type={credits >= item.price ? "primary-fill" : "secondary"}
                onClick={() => handlePurchase(item)}
                disabled={credits < item.price}
              >
                {lsi.buy || "Buy"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CasinoPage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [credits, setCredits] = useState(0);
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
      } catch (e) {
        console.error("Failed to fetch player credits", e);
      }
    };
    fetchPlayer();
  }, [user, selectedGame]);

  const updateCredits = (newCredits) => {
    setCredits(newCredits);
  };

  const handleShopPurchase = (amount) => {
    setCredits((prev) => prev - amount);
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
          onClick={() => setIsShopOpen(true)}
          title={lsi.shop || "Shop"}
        >
          <svg viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
      </div>

      <ShopPopup
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        credits={credits}
        userId={user?.id}
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
