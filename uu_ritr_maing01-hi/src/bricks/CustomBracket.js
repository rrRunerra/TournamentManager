import { useEffect, useMemo, useState } from "react";
import Calls from "../calls.js";
import "../styles/customBracket.css";
import { useNotification } from "./NotificationProvider.js";
import { useConfirm } from "./ConfirmProvider.js";

const STATUS_OPTIONS = ['PLAYED', 'NO_SHOW', 'WALK_OVER', 'NO_PARTY', null];

const Confetti = ({ isFadingOut }) => {
    const confettiPieces = useMemo(() => {
        const colors = [
            '#ff8e53', '#ffa733', '#ffcc00', '#ff6b6b', '#4ecdc4', '#45b7d1',
            '#a29bfe', '#fd79a8', '#fdcb6e', '#00b894', '#e17055', '#74b9ff',
            '#ff7675', '#fab1a0', '#55efc4', '#81ecec', '#ffeaa7', '#dfe6e9'
        ];
        const shapes = ['square', 'circle', 'triangle', 'rectangle'];

        return Array.from({ length: 150 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDelay: (Math.random() * 12).toFixed(2),
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)]
        }));
    }, []);

    return (
        <div className={`confetti-container ${isFadingOut ? 'confetti-fade-out' : ''}`}>
            {confettiPieces.map(piece => (
                <div
                    key={piece.id}
                    className={`confetti-piece confetti-${piece.shape}`}
                    style={{
                        left: `${piece.left}%`,
                        animationDelay: `${piece.animationDelay}s`,
                        ...(piece.shape === 'triangle'
                            ? { borderBottomColor: piece.backgroundColor }
                            : { backgroundColor: piece.backgroundColor }
                        )
                    }}
                />
            ))}
        </div>
    );
};

const MatchDetailPopup = ({ match, onClose, isOwner, onMatchUpdate }) => {
    const [score1, setScore1] = useState(match.participants[0]?.resultText || "0");
    const [score2, setScore2] = useState(match.participants[1]?.resultText || "0");
    const [status1, setStatus1] = useState(match.participants[0]?.status || null);
    const [status2, setStatus2] = useState(match.participants[1]?.status || null);
    const { showError } = useNotification();
    const { confirm } = useConfirm();

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
            const p1Name = match.participants[0]?.name || "Účastník 1";
            const p2Name = match.participants[1]?.name || "Účastník 2";

            if (winnerId === match.participants[0]?.id && s1 < s2) {
                const confirmed = await confirm({
                    title: "Neštandardné skóre",
                    message: `${p1Name} je označený ako víťaz, ale má nižšie skóre (${s1} vs ${s2}). Ste si istí, že chcete uložiť?`,
                    confirmText: "Áno, uložiť",
                    cancelText: "Zrušiť",
                    danger: false
                });
                if (!confirmed) {
                    return;
                }
            } else if (winnerId === match.participants[1]?.id && s2 < s1) {
                const confirmed = await confirm({
                    title: "Neštandardné skóre",
                    message: `${p2Name} je označený ako víťaz, ale má nižšie skóre (${s2} vs ${s1}). Ste si istí, že chcete uložiť?`,
                    confirmText: "Áno, uložiť",
                    cancelText: "Zrušiť",
                    danger: false
                });
                if (!confirmed) {
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

            if (onMatchUpdate) {
                await onMatchUpdate();
            }
            onClose();
        } catch (error) {
            console.error("Failed to update score", error);
            showError("Nepodarilo sa aktualizovať skóre", "Skúste to prosím znova.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="match-popup-overlay" onClick={onClose}>
            <div className="match-popup-content" onClick={e => e.stopPropagation()}>
                <h3>{match.name || `Zápas #${match.id}`}</h3>
                {!isMatchReady && <div className="match-not-ready-warning">Čakanie na súpera</div>}
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
                                        Víťaz
                                    </label>
                                </div>
                                <select
                                    className="status-select"
                                    value={status1 || ""}
                                    onChange={(e) => setStatus1(e.target.value || null)}
                                    disabled={!isMatchReady}
                                >
                                    <option value="">Stav: Žiadny</option>
                                    {STATUS_OPTIONS.filter(s => s).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <span className="score-display">{score1}</span>
                                {status1 && <span className="status-display">{status1}</span>}
                                {match.participants[0]?.isWinner && <span className="winner-badge">VÍŤAZ</span>}
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
                                        Víťaz
                                    </label>
                                </div>
                                <select
                                    className="status-select"
                                    value={status2 || ""}
                                    onChange={(e) => setStatus2(e.target.value || null)}
                                    disabled={!isMatchReady}
                                >
                                    <option value="">Stav: Žiadny</option>
                                    {STATUS_OPTIONS.filter(s => s).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <span className="score-display">{score2}</span>
                                {status2 && <span className="status-display">{status2}</span>}
                                {match.participants[1]?.isWinner && <span className="winner-badge">VÍŤAZ</span>}
                            </>
                        )}
                    </div>
                </div>
                <div className="match-popup-actions">
                    {isOwner && (
                        <button className="save-btn" onClick={handleSave} disabled={loading || !isMatchReady}>
                            {loading ? "Ukladám..." : "Uložiť skóre"}
                        </button>
                    )}
                    <button className="cancel-btn" onClick={onClose} disabled={loading}>Zrušiť</button>
                </div>
            </div>
        </div>
    );
};

const MatchCard = ({ match, onClick, style }) => {
    const { participants, id, startTime, name } = match;
    const topParticipant = participants[0] || {};
    const bottomParticipant = participants[1] || {};

    const isTopWinner = topParticipant.isWinner;
    const isBottomWinner = bottomParticipant.isWinner;

    return (
        <div className="match-card" style={style} onClick={() => onClick(match)}>
            <div className="match-header">
                <span>Zápas #{id}</span>
                {/* <span>{startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span> */}
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

const getRoundName = (roundKey, totalRounds, index) => {
    const roundNum = parseInt(roundKey);
    if (isNaN(roundNum)) return roundKey;

    if (index === totalRounds - 1) return "Veľké finále";
    if (index === totalRounds - 2) return "Semifinále";
    if (index === totalRounds - 3) return "Štvrťfinále";

    return `Kolo ${roundKey}`;
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
                const alreadyIn = nextMatch.participants.some(p => p.id === winner.id && p.resultText !== "WALK_OVER");
                if (!alreadyIn) {
                    const emptySlotIndex = nextMatch.participants.findIndex(p => !p.name || p.name === "TBD" || p.resultText === "WALK_OVER");
                    if (emptySlotIndex !== -1) {
                        nextMatch.participants[emptySlotIndex] = { ...winner, resultText: null, isWinner: false };
                    } else if (nextMatch.participants.length < 2) {
                        nextMatch.participants.push({ ...winner, resultText: null, isWinner: false });
                    }
                }
            }
        }
    });

    // Auto-assign winner for matches with WALK_OVER state
    sortedMatches.forEach(match => {
        if (match.state === 'WALK_OVER') {
            const validParticipants = match.participants.filter(p => p.id && p.name && p.name !== "TBD" && p.resultText !== "WALK_OVER");
            if (validParticipants.length === 1) {
                const walkoverWinner = match.participants.find(p => p.id === validParticipants[0].id);
                if (walkoverWinner) {
                    walkoverWinner.isWinner = true;
                }
            }
        }
    });

    // Third pass: Advance walkover winners to next round
    sortedMatches.forEach(match => {
        if (match.state === 'WALK_OVER') {
            const winner = match.participants.find(p => p.isWinner && p.resultText !== "WALK_OVER");

            if (winner && match.nextMatchId) {
                const nextMatch = matchMap.get(match.nextMatchId);
                if (nextMatch) {
                    const alreadyIn = nextMatch.participants.some(p => p.id === winner.id);
                    if (!alreadyIn) {
                        const emptySlotIndex = nextMatch.participants.findIndex(p => !p.name || p.name === "TBD" || p.resultText === "WALK_OVER");
                        if (emptySlotIndex !== -1) {
                            nextMatch.participants[emptySlotIndex] = { ...winner, resultText: null, isWinner: false };
                        } else if (nextMatch.participants.length < 2) {
                            nextMatch.participants.push({ ...winner, resultText: null, isWinner: false });
                        }
                    }
                }
            }
        }
    });

    return Array.from(matchMap.values());
};

const TreeBracketView = ({ matches, onMatchClick }) => {
    const processedMatches = useMemo(() => processMatches(matches), [matches]);

    // Group by rounds
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
            id: key,
            title: getRoundName(key, sortedKeys.length, index),
            matches: roundsMap[key].sort((a, b) => a.id - b.id)
        }));
    }, [processedMatches]);

    // Calculate layout
    const layout = useMemo(() => {
        const matchPositions = new Map(); // matchId -> { x, y, roundIndex }
        const CARD_WIDTH = 250;
        const CARD_HEIGHT = 140;
        const GAP_X = 80;
        const GAP_Y = 20;

        // 1. Assign basic round X positions
        rounds.forEach((round, rIndex) => {
            round.matches.forEach(match => {
                matchPositions.set(match.id, {
                    x: rIndex * (CARD_WIDTH + GAP_X),
                    y: 0, // Placeholder
                    roundIndex: rIndex,
                    match
                });
            });
        });

        // 2. Calculate Y positions
        // We work from the first round (leaves) to the last round (root)
        // But wait, for a proper tree, we should probably identify the "slots" in the first round.

        // Helper to find feeders for a match
        const getFeeders = (matchId) => {
            return processedMatches.filter(m => m.nextMatchId === matchId).sort((a, b) => a.id - b.id);
        };

        // We need to assign vertical slots to the first round matches.
        // If a match in round N has no feeders from round N-1, it's a leaf in the tree sense (or a starting match).
        // However, some matches in later rounds might also be "starting" if they have byes.

        // Let's try a recursive approach from the Final (root) backwards.
        // Find the final match(es) - usually the one with no nextMatchId or the last round.
        const lastRound = rounds[rounds.length - 1];
        if (!lastRound) return { positions: new Map(), width: 0, height: 0, rounds: [] };

        const roots = lastRound.matches;

        // We'll assign a "vertical center" to each match.
        // If a match is a leaf (no feeders), it takes the next available vertical slot.
        // If a match has feeders, its Y is the average of its feeders' Ys.

        let currentSlot = 0;
        const calculatedYs = new Map(); // matchId -> y

        const calculateY = (match) => {
            if (calculatedYs.has(match.id)) return calculatedYs.get(match.id);

            const feeders = getFeeders(match.id);

            if (feeders.length === 0) {
                // Leaf node
                const y = currentSlot * (CARD_HEIGHT + GAP_Y);
                currentSlot++;
                calculatedYs.set(match.id, y);
                return y;
            } else {
                // Internal node
                // Recursively calculate feeders
                const feederYs = feeders.map(f => calculateY(f));

                // If we have 2 feeders, average them.
                // If we have 1 feeder (weird, but possible with byes?), take its Y.
                // If we have > 2 feeders (not standard), average min and max.
                const min = Math.min(...feederYs);
                const max = Math.max(...feederYs);
                const y = (min + max) / 2;

                calculatedYs.set(match.id, y);
                return y;
            }
        };

        // We need to process roots. But wait, there might be disconnected components?
        // Usually a tournament is a single tree.
        roots.forEach(root => calculateY(root));

        // Now update matchPositions with calculated Ys
        matchPositions.forEach((pos, id) => {
            if (calculatedYs.has(id)) {
                pos.y = calculatedYs.get(id);
            } else {
                // Fallback for matches not reachable from roots (shouldn't happen in a valid bracket)
                // Just stack them at the bottom
                pos.y = currentSlot * (CARD_HEIGHT + GAP_Y);
                currentSlot++;
            }
        });

        // Calculate total dimensions
        const totalWidth = rounds.length * (CARD_WIDTH + GAP_X);
        const totalHeight = currentSlot * (CARD_HEIGHT + GAP_Y);

        return {
            positions: matchPositions,
            width: totalWidth,
            height: totalHeight,
            rounds
        };

    }, [rounds, processedMatches]);

    return (
        <div className="bracket-scroll-container">
            <div className="bracket-canvas" style={{ width: layout.width, height: layout.height }}>
                {/* Render Round Headers */}
                {layout.rounds.map((round, i) => (
                    <div
                        key={round.id}
                        className="bracket-round-header"
                        style={{
                            left: i * (250 + 80), // CARD_WIDTH + GAP_X
                            width: 250
                        }}
                    >
                        {round.title}
                    </div>
                ))}

                {/* Render Connectors */}
                <svg className="bracket-svg-layer" width={layout.width} height={layout.height}>
                    {Array.from(layout.positions.values()).map(pos => {
                        if (!pos.match.nextMatchId) return null;
                        const nextPos = layout.positions.get(pos.match.nextMatchId);
                        if (!nextPos) return null;

                        // Draw line from right side of current to left side of next
                        const startX = pos.x + 250; // Right edge
                        const startY = pos.y + 70; // Vertical center (CARD_HEIGHT / 2)
                        const endX = nextPos.x; // Left edge
                        const endY = nextPos.y + 70;

                        // Orthogonal path
                        const midX = (startX + endX) / 2;

                        return (
                            <path
                                key={`${pos.match.id}-${pos.match.nextMatchId}`}
                                d={`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`}
                                fill="none"
                                stroke="#ff8e53"
                                strokeWidth="2"
                                className="bracket-connector-path"
                            />
                        );
                    })}
                </svg>

                {/* Render Matches */}
                {Array.from(layout.positions.values()).map(pos => (
                    <MatchCard
                        key={pos.match.id}
                        match={pos.match}
                        onClick={onMatchClick}
                        style={{
                            position: 'absolute',
                            left: pos.x,
                            top: pos.y,
                            width: 250,
                            height: 140
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// Keep RoundColumn and MatchPair for Double Bracket (Legacy support if needed)
// Or we can try to use TreeBracketView for double bracket too?
// Double bracket is essentially two trees + a final.
// For now, let's keep the old components for double bracket to be safe, 
// as the user specifically asked to "remake the single bracket".

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

export default function CustomBracket({ matches, bracketType, isOwner, currentUserId, tournamentInfo, onMatchUpdate }) {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Check if current user won the Grand Finals
    useEffect(() => {
        if (!matches || !currentUserId || !tournamentInfo) return;

        const allMatches = bracketType === 'double'
            ? [...(matches.upper || []), ...(matches.lower || [])]
            : matches;

        // Find all Final matches (nextMatchId === null)
        const finalMatches = allMatches.filter(match => match.nextMatchId === null);

        let shouldShowConfetti = false;

        for (const finalMatch of finalMatches) {
            if (finalMatch && finalMatch.participants) {
                const winningParticipant = finalMatch.participants.find(p => p.isWinner);

                if (winningParticipant && winningParticipant.id) {
                    // Find the winning team from tournament info
                    const winningTeam = tournamentInfo.teams?.find(team => team.id === winningParticipant.id);

                    if (winningTeam && winningTeam.players) {
                        // Check if current user is in the winning team
                        if (winningTeam.players.includes(currentUserId)) {
                            shouldShowConfetti = true;
                            break; // Found a win, no need to check other matches
                        }
                    }
                }
            }
        }

        if (shouldShowConfetti) {
            setShowConfetti(true);
            setIsFadingOut(false);
            // Start fade-out after 13 seconds, then hide after fade completes
            setTimeout(() => setIsFadingOut(true), 13000);
            setTimeout(() => setShowConfetti(false), 15000);
        }
    }, [matches, currentUserId, bracketType, tournamentInfo]);

    if (!matches) return null;

    const handleMatchClick = (match) => {
        if (tournamentInfo?.status === "finished") return;
        setSelectedMatch(match);
    };

    const handleClosePopup = () => {
        setSelectedMatch(null);
    };

    if (bracketType === 'robin') {
        // Group matches by round
        const rounds = {};
        matches.forEach(match => {
            const roundName = match.tournamentRoundText;
            if (!rounds[roundName]) {
                rounds[roundName] = [];
            }
            rounds[roundName].push(match);
        });

        return (
            <div className="bracket-container" style={{ flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                {showConfetti && <Confetti isFadingOut={isFadingOut} />}
                {selectedMatch && (
                    <MatchDetailPopup
                        match={selectedMatch}
                        onClose={() => setSelectedMatch(null)}
                        onMatchUpdate={onMatchUpdate}
                        isOwner={isOwner}
                        tournamentId={tournamentInfo?.id}
                    />
                )}


                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '2rem', width: '100%', marginTop: '2rem', padding: '0 2rem' }}>
                    {Object.entries(rounds).map(([roundName, roundMatches]) => (
                        <div key={roundName} style={{ minWidth: '250px', maxWidth: '250px', flex: '0 0 auto' }}>
                            <h3 style={{ color: '#ff8e53', marginBottom: '1rem', textAlign: 'center' }}>{roundName}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {roundMatches.map(match => (
                                    <div key={match.id} onClick={() => handleMatchClick(match)} style={{ cursor: 'pointer' }}>
                                        <MatchCard match={match} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {showConfetti && <Confetti isFadingOut={isFadingOut} />}

            {selectedMatch && (
                <MatchDetailPopup
                    match={selectedMatch}
                    onClose={handleClosePopup}
                    isOwner={isOwner}
                    onMatchUpdate={onMatchUpdate}
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
                <TreeBracketView matches={matches} onMatchClick={handleMatchClick} />
            )}
        </>
    );
}