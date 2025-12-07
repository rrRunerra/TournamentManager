import { useEffect, useState } from "react";
import Calls from "../../calls.js";
import { useNotification } from "../NotificationProvider.js";
import { useConfirm } from "../ConfirmProvider.js";
import { useLsi, useRoute } from "uu5g05";
import importLsi from "../../lsi/import-lsi.js";
import { STATUS_OPTIONS } from "./bracketUtils.js";

const MatchDetailPopup = ({ match, onClose, isOwner, onMatchUpdate, tournamentInfo }) => {
  const [score1, setScore1] = useState(match.participants[0]?.resultText || "0");
  const [score2, setScore2] = useState(match.participants[1]?.resultText || "0");
  const [status1, setStatus1] = useState(match.participants[0]?.status || null);
  const [status2, setStatus2] = useState(match.participants[1]?.status || null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const { showError } = useNotification();
  const { confirm } = useConfirm();
  const lsi = useLsi(importLsi, ["CustomBracket"]);
  const [, setRoute] = useRoute();

  const isFinal = match.name.toLowerCase().includes("final");
  const isFinishedTournament = tournamentInfo?.status === "finished";

  // Determine initial winner
  const initialWinnerId = match.participants.find((p) => p.isWinner)?.id || null;
  const [winnerId, setWinnerId] = useState(initialWinnerId);

  const [loading, setLoading] = useState(false);

  // Check if both participants are present
  const isMatchReady = match.participants && match.participants[0]?.id && match.participants[1]?.id;

  // Fetch team players when tournament is finished
  useEffect(() => {
    if (isFinishedTournament && tournamentInfo?.teams && match.participants) {
      // Get players for team 1
      const team1 = tournamentInfo.teams.find((t) => t.id === match.participants[0]?.id);
      if (team1?.players) {
        // Fetch player details
        Promise.all(team1.players.map((playerId) => Calls.player.get({ id: playerId }).catch(() => null))).then(
          (players) => setTeam1Players(players.filter((p) => p)),
        );
      }

      // Get players for team 2
      const team2 = tournamentInfo.teams.find((t) => t.id === match.participants[1]?.id);
      if (team2?.players) {
        Promise.all(team2.players.map((playerId) => Calls.player.get({ id: playerId }).catch(() => null))).then(
          (players) => setTeam2Players(players.filter((p) => p)),
        );
      }
    }
  }, [isFinishedTournament, tournamentInfo, match.participants]);

  const handlePlayerClick = (playerId) => {
    if (playerId) {
      setRoute("profile", { id: playerId });
    }
  };

  const handleScoreChange = (participantIndex, increment) => {
    if (!isMatchReady) return;

    if (participantIndex === 0) {
      const currentScore = parseInt(score1);
      const newScoreVal = increment ? currentScore + 1 : Math.max(0, currentScore - 1);
      setScore1(String(newScoreVal));
      if (newScoreVal >= 1) {
        setStatus1("PLAYED");
      }
    } else {
      const currentScore = parseInt(score2);
      const newScoreVal = increment ? currentScore + 1 : Math.max(0, currentScore - 1);
      setScore2(String(newScoreVal));
      if (newScoreVal >= 1) {
        setStatus2("PLAYED");
      }
    }
  };

  const handleWinnerChange = (id) => {
    if (!isMatchReady) return;
    setWinnerId((prev) => (prev === id ? null : id));
  };

  const handleSave = async () => {
    if (!isMatchReady) return;

    // Validation: Check if winner has lower score
    if (winnerId) {
      const s1 = parseInt(score1) || 0;
      const s2 = parseInt(score2) || 0;

      const p1Name = match.participants[0]?.name || lsi.participant1 || "Účastník 1";
      const p2Name = match.participants[1]?.name || lsi.participant2 || "Účastník 2";

      if (winnerId === match.participants[0]?.id && s1 < s2) {
        const confirmed = await confirm({
          title: lsi.scoreWarningTitle,
          message: `${p1Name} ${lsi.scoreWarningMessage} (${s1} vs ${s2}). ${lsi.scoreWarningConfirm}`,
          confirmText: lsi.yesSave,
          cancelText: lsi.cancel,
          danger: false,
        });
        if (!confirmed) {
          return;
        }
      } else if (winnerId === match.participants[1]?.id && s2 < s1) {
        const confirmed = await confirm({
          title: lsi.scoreWarningTitle,
          message: `${p2Name} ${lsi.scoreWarningMessage} (${s2} vs ${s1}). ${lsi.scoreWarningConfirm}`,
          confirmText: lsi.yesSave,
          cancelText: lsi.cancel,
          danger: false,
        });
        if (!confirmed) {
          return;
        }
      }
    }

    setLoading(true);
    try {
      await Calls.match.updateScore({
        matchId: match.id,
        tournamentId: match.tournamentId,
        participants: [
          {
            ...match.participants[0],
            resultText: score1,
            status: status1,
            isWinner: match.participants[0]?.id === winnerId,
          },
          {
            ...match.participants[1],
            resultText: score2,
            status: status2,
            isWinner: match.participants[1]?.id === winnerId,
          },
        ],
      });

      if (onMatchUpdate) {
        await onMatchUpdate();
      }

      // Update match stats for both participants
      if (winnerId && match.participants[0]?.id && match.participants[1]?.id) {
        // Update winner stats
        const winnerParticipant = match.participants.find((p) => p.id === winnerId);
        if (winnerParticipant) {
          const o = await Calls.player.updateMatchStat({
            participantId: winnerParticipant.id,
            won: true,
          });
        }

        // Update loser stats
        const loserParticipant = match.participants.find((p) => p.id !== winnerId);
        if (loserParticipant) {
          await Calls.player.updateMatchStat({
            participantId: loserParticipant.id,
            won: false,
          });
        }
      }

      // Check if this is a final match and update player stats
      if (isFinal && winnerId) {
        if (match.name.toLowerCase().includes("upper")) {
          const winner = match.participants.find((p) => p.id === winnerId);
          const loser = match.participants.find((p) => p.id !== winnerId);
          await Calls.player.updateStats({
            tournamentId: match.tournamentId,
            finalsFirstPlaceParticipantId: winner.id,
            finalsSecondPlaceParticipantId: loser.id,
            finalsThirdPlaceParticipantId: null,
            finalsFourthPlaceParticipantId: null,
          });
        }
        if (match.name.toLowerCase().includes("lower")) {
          const winner = match.participants.find((p) => p.id === winnerId);
          const loser = match.participants.find((p) => p.id !== winnerId);
          await Calls.player.updateStats({
            tournamentId: match.tournamentId,
            finalsFirstPlaceParticipantId: null,
            finalsSecondPlaceParticipantId: null,
            finalsThirdPlaceParticipantId: winner.id,
            finalsFourthPlaceParticipantId: loser.id,
          });
        }

        // Signle elim. bracket
        if (
          match.name.toLowerCase().includes("final") &&
          !match.name.toLowerCase().includes("lower") &&
          !match.name.toLowerCase().includes("upper")
        ) {
          const winner = match.participants.find((p) => p.id === winnerId);
          const loser = match.participants.find((p) => p.id !== winnerId);
          const o = await Calls.player.updateStats({
            tournamentId: match.tournamentId,
            finalsFirstPlaceParticipantId: winner.id,
            finalsSecondPlaceParticipantId: loser.id,
            finalsThirdPlaceParticipantId: null,
            finalsFourthPlaceParticipantId: null,
          });
        }
      }

      onClose();
    } catch (error) {
      console.error("Failed to update score", error);
      showError(lsi.updateErrorTitle, lsi.updateErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="match-popup-overlay" onClick={onClose}>
      <div className="match-popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>{match.name || `${lsi.matchPrefix}${match.id}`}</h3>
        {!isMatchReady && !isFinishedTournament && (
          <div className="match-not-ready-warning">{lsi.waitingForOpponent}</div>
        )}
        <div className="match-popup-teams">
          <div className="match-popup-team">
            <span className="team-name">{match.participants[0]?.name || lsi.tbd}</span>
            {isOwner && !isFinishedTournament ? (
              <>
                <div className="score-control">
                  <button onClick={() => handleScoreChange(0, false)} disabled={!isMatchReady}>
                    -
                  </button>
                  <span className="score-value">{score1}</span>
                  <button onClick={() => handleScoreChange(0, true)} disabled={!isMatchReady}>
                    +
                  </button>
                </div>
                <div className="winner-selection">
                  <label style={{ opacity: isMatchReady ? 1 : 0.5, cursor: isMatchReady ? "pointer" : "not-allowed" }}>
                    <input
                      type="checkbox"
                      checked={winnerId === match.participants[0]?.id}
                      onChange={() => handleWinnerChange(match.participants[0]?.id)}
                      disabled={!isMatchReady}
                    />
                    {lsi.winner}
                  </label>
                </div>
                <select
                  className="status-select"
                  value={status1 || ""}
                  onChange={(e) => setStatus1(e.target.value || null)}
                  disabled={!isMatchReady}
                >
                  <option value="">{lsi.statusNone}</option>
                  {STATUS_OPTIONS.filter((s) => s).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div className="score-display-container">
                <span className="score-display">{score1}</span>
                {status1 && <span className="status-display">{status1}</span>}
                {match.participants[0]?.isWinner && <span className="winner-badge">{lsi.winnerBadge}</span>}
              </div>
            )}
            {isFinishedTournament && (
              <div className="team-players-list">
                {Array.from({ length: tournamentInfo?.teamSize || 1 }).map((_, index) => {
                  const player = team1Players[index];
                  return (
                    <div
                      key={index}
                      className={`player-item ${!player ? "empty" : "clickable"}`}
                      onClick={() => player && handlePlayerClick(player.id)}
                    >
                      👤 {player?.name || "---"}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="match-popup-vs">{lsi.vs}</div>
          <div className="match-popup-team">
            <span className="team-name">{match.participants[1]?.name || lsi.tbd}</span>
            {isOwner && !isFinishedTournament ? (
              <>
                <div className="score-control">
                  <button onClick={() => handleScoreChange(1, false)} disabled={!isMatchReady}>
                    -
                  </button>
                  <span className="score-value">{score2}</span>
                  <button onClick={() => handleScoreChange(1, true)} disabled={!isMatchReady}>
                    +
                  </button>
                </div>
                <div className="winner-selection">
                  <label style={{ opacity: isMatchReady ? 1 : 0.5, cursor: isMatchReady ? "pointer" : "not-allowed" }}>
                    <input
                      type="checkbox"
                      checked={winnerId === match.participants[1]?.id}
                      onChange={() => handleWinnerChange(match.participants[1]?.id)}
                      disabled={!isMatchReady}
                    />
                    {lsi.winner}
                  </label>
                </div>
                <select
                  className="status-select"
                  value={status2 || ""}
                  onChange={(e) => setStatus2(e.target.value || null)}
                  disabled={!isMatchReady}
                >
                  <option value="">{lsi.statusNone}</option>
                  {STATUS_OPTIONS.filter((s) => s).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div className="score-display-container">
                <span className="score-display">{score2}</span>
                {status2 && <span className="status-display">{status2}</span>}
                {match.participants[1]?.isWinner && <span className="winner-badge">{lsi.winnerBadge}</span>}
              </div>
            )}
            {isFinishedTournament && (
              <div className="team-players-list">
                {Array.from({ length: tournamentInfo?.teamSize || 1 }).map((_, index) => {
                  const player = team2Players[index];
                  return (
                    <div
                      key={index}
                      className={`player-item ${!player ? "empty" : "clickable"}`}
                      onClick={() => player && handlePlayerClick(player.id)}
                    >
                      👤 {player?.name || "---"}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="match-popup-actions">
          {isOwner && !isFinishedTournament && (
            <button className="save-btn" onClick={handleSave} disabled={loading || !isMatchReady}>
              {loading ? lsi.saving : lsi.saveScore}
            </button>
          )}
          <button className="save-btn" onClick={onClose} disabled={loading}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailPopup;
