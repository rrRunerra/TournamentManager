import { Button } from "../ui/Button.js";

const raiseOptions = [1, 5, 10, 20, 50, 100, 200, 500, 1000, 2000];

function PokerGameInProgress({
  isYourTurn,
  currentTurnPlayerName,
  communityCards,
  hand,
  chipBalance,
  toCall,
  pot,
  loopNum,
  message,
  errorMsg,
  fold,
  call,
  raise,
  isNextTurn,
}) {
  return (
    <>
      <p style={{ fontWeight: "bold", color: "orange" }}>
        {currentTurnPlayerName
          ? isYourTurn
            ? "🎯 It's your turn!"
            : `🕒 Waiting for ${currentTurnPlayerName}...`
          : "Waiting for another player..."}
      </p>

      <div className="game-container">
        <div className="poker-table-container">
          <img src="/poker-table.png" alt="Poker Table" className="table-image" />
          <div className="community-cards-on-table">
            {communityCards.map((card) => (
              <img key={card.code} src={card.image} alt={card.code} className="community-card-img" />
            ))}
          </div>
        </div>

        <div className="player-info">
          <div className="hand">
            {hand.map((card) => (
              <img key={card.code} src={card.image} alt={card.code} />
            ))}
          </div>

          <p>
            Your Chip Balance: {chipBalance}
            <br />
            Amount To Call: {toCall}
            <br />
            Total Pot: {pot}
            <br />
            Current Betting Round: {loopNum}
          </p>

          {message && <p style={{ color: "limegreen" }}>{message}</p>}
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        </div>
      </div>

      <div className="player-actions">
        <Button type="danger" onClick={fold} disabled={isNextTurn}>
          Fold
        </Button>

        <Button type="success" onClick={call} disabled={chipBalance < toCall || toCall < 2 || isNextTurn}>
          Call {toCall}
        </Button>

        {raiseOptions.map((amt) => {
          const totalCost = toCall + amt;
          return (
            <Button key={amt} type="info" onClick={() => raise(amt)} disabled={chipBalance < totalCost || isNextTurn}>
              Raise by {amt}
            </Button>
          );
        })}
      </div>
    </>
  );
}

export default PokerGameInProgress;
