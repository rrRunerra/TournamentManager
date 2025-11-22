import React, { useMemo, useState } from "react";
import "../styles/customBracket.css";
import Calls from "../calls.js";

const STATUS_OPTIONS = ['PLAYED', 'NO_SHOW', 'WALK_OVER', 'NO_PARTY', null];

const MatchDetailPopup = ({ match, onClose, isOwner }) => {
    const [score1, setScore1] = useState(match.participants[0]?.resultText || "0");
    const [score2, setScore2] = useState(match.participants[1]?.resultText || "0");
    const [status1, setStatus1] = useState(match.participants[0]?.status || null);
    const [status2, setStatus2] = useState(match.participants[1]?.status || null);
    console.log(match)
    // Determine initial winner
    const initialWinnerId = match.participants.find(p => p.isWinner)?.id || null;
    const [winnerId, setWinnerId] = useState(initialWinnerId);

    const [loading, setLoading] = useState(false);

    // Check if both participants are present
    const isMatchReady = match.participants && match.participants[0]?.id && match.participants[1]?.id;

    const handleScoreChange = (participantIndex, increment) => {
        if (!isMatchReady) return;

        if (participantIndex === 0) {
            const currentScore = parseInt(score1);
            const newScoreVal = increment ? currentScore + 1 : Math.max(0, currentScore - 1);
            setScore1(String(newScoreVal));
            if (newScoreVal >= 1) {
                setStatus1('PLAYED');
            }
        } else {
            const currentScore = parseInt(score2);
            const newScoreVal = increment ? currentScore + 1 : Math.max(0, currentScore - 1);
            setScore2(String(newScoreVal));
            if (newScoreVal >= 1) {
                setStatus2('PLAYED');
            }
        }
    };

    const handleWinnerChange = (id) => {
        if (!isMatchReady) return;
        setWinnerId(prev => prev === id ? null : id);
    };

    const handleSave = async () => {
        if (!isMatchReady) return;

        // Validation: Check if winner has lower score
        if (winnerId) {
            const s1 = parseInt(score1) || 0;
            const s2 = parseInt(score2) || 0;
            const p1Name = match.participants[0]?.name || "Participant 1";
            const p2Name = match.participants[1]?.name || "Participant 2";

            if (winnerId === match.participants[0]?.id && s1 < s2) {
                if (!window.confirm(`${p1Name} is marked as winner but has a lower score (${s1} vs ${s2}). Are you sure you want to save?`)) {
                    return;
                }
            } else if (winnerId === match.participants[1]?.id && s2 < s1) {
                if (!window.confirm(`${p2Name} is marked as winner but has a lower score (${s2} vs ${s1}). Are you sure you want to save?`)) {
                    return;
                }
            }
        }

        setLoading(true);
        try {
            await Calls.updateMatchScore({
                matchId: match.id,
                tournamentId: match.tournamentId,
                participants: [
                    {
                        ...match.participants[0],
                        resultText: score1,
                        status: status1,
                        isWinner: match.participants[0]?.id === winnerId
                    },
                    {
                        ...match.participants[1],
                        resultText: score2,
                        status: status2,
                        isWinner: match.participants[1]?.id === winnerId
                    }
                ]
            });
            // Ideally, we should trigger a refresh of the matches here.
            // For now, we'll just close the popup and let the user refresh or rely on live updates if implemented.
            // A better approach would be to pass a refresh callback.
            window.location.reload(); // Simple reload to fetch new data
        } catch (error) {
            console.error("Failed to update score", error);
            alert("Failed to update score");
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <div className="match-popup-overlay" onClick={onClose}>
            <div className="match-popup-content" onClick={e => e.stopPropagation()}>
                <h3>{match.name || `Match #${match.id}`}</h3>
                {!isMatchReady && <div className="match-not-ready-warning">Waiting for opponent</div>}
                <div className="match-popup-teams">
                    <div className="match-popup-team">
                        <span className="team-name">{match.participants[0]?.name || "TBD"}</span>
                        {isOwner ? (
                            <>
                                <div className="score-control">
                                    <button onClick={() => handleScoreChange(0, false)} disabled={!isMatchReady}>-</button>
                                    <span className="score-value">{score1}</span>
                                    <button onClick={() => handleScoreChange(0, true)} disabled={!isMatchReady}>+</button>
                                </div>
                                <div className="winner-selection">
                                    <label style={{ opacity: isMatchReady ? 1 : 0.5, cursor: isMatchReady ? 'pointer' : 'not-allowed' }}>
                                        <input
                                            type="checkbox"
                                            checked={winnerId === match.participants[0]?.id}
                                            onChange={() => handleWinnerChange(match.participants[0]?.id)}
                                            disabled={!isMatchReady}
                                        />
                                        Winner
                                    </label>
                                </div>
                                <select
                                    className="status-select"
                                    value={status1 || ""}
                                    onChange={(e) => setStatus1(e.target.value || null)}
                                    disabled={!isMatchReady}
                                >
                                    <option value="">Status: None</option>
                                    {STATUS_OPTIONS.filter(s => s).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <span className="score-display">{score1}</span>
                                {status1 && <span className="status-display">{status1}</span>}
                                {match.participants[0]?.isWinner && <span className="winner-badge">WINNER</span>}
                            </>
                        )}
                    </div>
                    <div className="match-popup-vs">VS</div>
                    <div className="match-popup-team">
                        <span className="team-name">{match.participants[1]?.name || "TBD"}</span>
                        {isOwner ? (
                            <>
                                <div className="score-control">
                                    <button onClick={() => handleScoreChange(1, false)} disabled={!isMatchReady}>-</button>
                                    <span className="score-value">{score2}</span>
                                    <button onClick={() => handleScoreChange(1, true)} disabled={!isMatchReady}>+</button>
                                </div>
                                <div className="winner-selection">
                                    <label style={{ opacity: isMatchReady ? 1 : 0.5, cursor: isMatchReady ? 'pointer' : 'not-allowed' }}>
                                        <input
                                            type="checkbox"
                                            checked={winnerId === match.participants[1]?.id}
                                            onChange={() => handleWinnerChange(match.participants[1]?.id)}
                                            disabled={!isMatchReady}
                                        />
                                        Winner
                                    </label>
                                </div>
                                <select
                                    className="status-select"
                                    value={status2 || ""}
                                    onChange={(e) => setStatus2(e.target.value || null)}
                                    disabled={!isMatchReady}
                                >
                                    <option value="">Status: None</option>
                                    {STATUS_OPTIONS.filter(s => s).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <span className="score-display">{score2}</span>
                                {status2 && <span className="status-display">{status2}</span>}
                                {match.participants[1]?.isWinner && <span className="winner-badge">WINNER</span>}
                            </>
                        )}
                    </div>
                </div>
                <div className="match-popup-actions">
                    {isOwner && (
                        <button className="save-btn" onClick={handleSave} disabled={loading || !isMatchReady}>
                            {loading ? "Saving..." : "Save Score"}
                        </button>
                    )}
                    <button className="close-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const MatchCard = ({ match, onClick }) => {
    const { participants, id, startTime, name } = match;
    const topParticipant = participants[0] || {};
    const bottomParticipant = participants[1] || {};

    const isTopWinner = topParticipant.isWinner;
    const isBottomWinner = bottomParticipant.isWinner;

    return (
        <div className="match-card" onClick={() => onClick(match)}>
            <div className="match-header">
                <span>Match #{id}</span>
                <span>{startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span>
            </div>

            <div className={`match-team ${isTopWinner ? "winner" : ""} ${!topParticipant.name ? "placeholder" : ""}`}>
                <span>{topParticipant.name || "TBD"}</span>
                {topParticipant.resultText && <span className="team-score-box">{topParticipant.resultText}</span>}
            </div>

            <div className={`match-team ${isBottomWinner ? "winner" : ""} ${!bottomParticipant.name ? "placeholder" : ""}`}>
                <span>{bottomParticipant.name || "TBD"}</span>
                {bottomParticipant.resultText && <span className="team-score-box">{bottomParticipant.resultText}</span>}
            </div>
        </div>
    );
};

const MatchPair = ({ matches, isLastRound, onMatchClick }) => {
    if (matches.length === 0) return <div className="match-pair"></div>;

    return (
        <div className="match-pair">
            {matches.map(match => (
                <MatchCard key={match.id} match={match} onClick={onMatchClick} />
            ))}
            {!isLastRound && matches.length > 1 && <div className="match-pair-connector"></div>}
            {!isLastRound && matches.length === 1 && <div className="match-connector-straight"></div>}
        </div>
    );
};

const RoundColumn = ({ title, matches, roundIndex, totalRounds, nextRoundMatches, onMatchClick }) => {
    const pairs = useMemo(() => {
        if (roundIndex === totalRounds - 1) {
            return matches.map(m => [m]);
        }

        const pairsMap = new Map();

        matches.forEach(match => {
            const nextId = match.nextMatchId;
            if (!nextId) {
                pairsMap.set(`standalone-${match.id}`, [match]);
            } else {
                if (!pairsMap.has(nextId)) {
                    pairsMap.set(nextId, []);
                }
                pairsMap.get(nextId).push(match);
            }
        });

        if (nextRoundMatches) {
            const orderedPairs = [];
            const remainingPairs = new Map(pairsMap);

            nextRoundMatches.forEach(nextMatch => {
                if (remainingPairs.has(nextMatch.id)) {
                    orderedPairs.push(remainingPairs.get(nextMatch.id));
                    remainingPairs.delete(nextMatch.id);
                }
            });

            remainingPairs.forEach(pair => orderedPairs.push(pair));
            return orderedPairs;
        }

        return Array.from(pairsMap.values());
    }, [matches, roundIndex, totalRounds, nextRoundMatches]);

    return (
        <div className="round-column">
            <div className="round-header">
                <div className="round-title">{title}</div>
            </div>
            <div className="round-matches">
                {pairs.map((pair, index) => (
                    <MatchPair
                        key={index}
                        matches={pair}
                        isLastRound={roundIndex === totalRounds - 1}
                        onMatchClick={onMatchClick}
                    />
                ))}
            </div>
        </div>
    );
};

const getRoundName = (roundKey, totalRounds, index) => {
    const roundNum = parseInt(roundKey);
    if (isNaN(roundNum)) return roundKey;

    if (index === totalRounds - 1) return "Grand Final";
    if (index === totalRounds - 2) return "Semifinals";
    if (index === totalRounds - 3) return "Quarterfinals";

    return `Round ${roundKey}`;
};

const processMatches = (matches) => {
    const matchMap = new Map(matches.map(m => [m.id, { ...m }]));

    const sortedMatches = [...matchMap.values()].sort((a, b) => {
        const rA = parseInt(a.tournamentRoundText || a.round);
        const rB = parseInt(b.tournamentRoundText || b.round);
        if (!isNaN(rA) && !isNaN(rB)) return rA - rB;
        return 0;
    });

    sortedMatches.forEach(match => {
        const winner = match.participants.find(p => p.isWinner);

        if (winner && match.nextMatchId) {
            const nextMatch = matchMap.get(match.nextMatchId);
            if (nextMatch) {
                const alreadyIn = nextMatch.participants.some(p => p.id === winner.id);
                if (!alreadyIn) {
                    const emptySlotIndex = nextMatch.participants.findIndex(p => !p.name || p.name === "TBD");
                    if (emptySlotIndex !== -1) {
                        nextMatch.participants[emptySlotIndex] = { ...winner, resultText: null, isWinner: false };
                    } else if (nextMatch.participants.length < 2) {
                        nextMatch.participants.push({ ...winner, resultText: null, isWinner: false });
                    }
                }
            }
        }
    });

    return Array.from(matchMap.values());
};

const BracketView = ({ matches, onMatchClick }) => {
    const processedMatches = useMemo(() => processMatches(matches), [matches]);

    const rounds = useMemo(() => {
        const roundsMap = {};
        processedMatches.forEach(match => {
            const round = match.tournamentRoundText || `${match.round}`;
            if (!roundsMap[round]) roundsMap[round] = [];
            roundsMap[round].push(match);
        });

        const sortedKeys = Object.keys(roundsMap).sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
        });

        return sortedKeys.map((key, index) => ({
            title: getRoundName(key, sortedKeys.length, index),
            matches: roundsMap[key].sort((a, b) => a.id - b.id)
        }));
    }, [processedMatches]);

    return (
        <div className="custom-bracket-container">
            <div className="bracket-rounds">
                {rounds.map((round, index) => (
                    <RoundColumn
                        key={index}
                        title={round.title}
                        matches={round.matches}
                        roundIndex={index}
                        totalRounds={rounds.length}
                        nextRoundMatches={rounds[index + 1]?.matches}
                        onMatchClick={onMatchClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default function CustomBracket({ matches, bracketType, isOwner }) {
    const [selectedMatch, setSelectedMatch] = useState(null);

    if (!matches) return null;

    const handleMatchClick = (match) => {
        setSelectedMatch(match);
    };

    const handleClosePopup = () => {
        setSelectedMatch(null);
    };

    return (
        <>
            {selectedMatch && (
                <MatchDetailPopup
                    match={selectedMatch}
                    onClose={handleClosePopup}
                    isOwner={isOwner}
                />
            )}

            {bracketType === 'double' ? (
                <div className="custom-bracket-container">
                    <div className="bracket-section">
                        <h3 className="bracket-title">Upper Bracket</h3>
                        <div className="bracket-rounds">
                            <BracketInner matches={matches.upper || []} onMatchClick={handleMatchClick} />
                        </div>
                    </div>
                    <div className="bracket-section">
                        <h3 className="bracket-title">Lower Bracket</h3>
                        <div className="bracket-rounds">
                            <BracketInner matches={matches.lower || []} onMatchClick={handleMatchClick} />
                        </div>
                    </div>
                </div>
            ) : (
                <BracketView matches={matches} onMatchClick={handleMatchClick} />
            )}
        </>
    );
}

const BracketInner = ({ matches, onMatchClick }) => {
    const processedMatches = useMemo(() => processMatches(matches), [matches]);

    const rounds = useMemo(() => {
        const roundsMap = {};
        processedMatches.forEach(match => {
            const round = match.tournamentRoundText || `${match.round}`;
            if (!roundsMap[round]) roundsMap[round] = [];
            roundsMap[round].push(match);
        });

        const sortedKeys = Object.keys(roundsMap).sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
        });

        return sortedKeys.map((key, index) => ({
            title: getRoundName(key, sortedKeys.length, index),
            matches: roundsMap[key].sort((a, b) => a.id - b.id)
        }));
    }, [processedMatches]);

    return (
        <>
            {rounds.map((round, index) => (
                <RoundColumn
                    key={index}
                    title={round.title}
                    matches={round.matches}
                    roundIndex={index}
                    totalRounds={rounds.length}
                    nextRoundMatches={rounds[index + 1]?.matches}
                    onMatchClick={onMatchClick}
                />
            ))}
        </>
    );
};
