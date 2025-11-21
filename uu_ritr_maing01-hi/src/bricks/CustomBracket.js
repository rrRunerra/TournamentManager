import React, { useMemo } from "react";
import "../styles/customBracket.css";

const MatchCard = ({ match }) => {
    const { participants, id, startTime, name } = match;
    const topParticipant = participants[0] || {};
    const bottomParticipant = participants[1] || {};

    const isTopWinner = topParticipant.isWinner;
    const isBottomWinner = bottomParticipant.isWinner;

    return (
        <div className="match-card">
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

const MatchPair = ({ matches, isLastRound }) => {
    // matches is an array of 1 or 2 matches that feed into the same next match
    // If it's a single match (e.g. final or weird structure), we render it without the pair connector

    if (matches.length === 0) return <div className="match-pair"></div>;

    return (
        <div className="match-pair">
            {matches.map(match => (
                <MatchCard key={match.id} match={match} />
            ))}
            {!isLastRound && matches.length > 1 && <div className="match-pair-connector"></div>}
            {!isLastRound && matches.length === 1 && <div className="match-connector-straight"></div>}
        </div>
    );
};

const RoundColumn = ({ title, matches, roundIndex, totalRounds, nextRoundMatches }) => {
    // Group matches into pairs based on nextMatchId
    const pairs = useMemo(() => {
        if (roundIndex === totalRounds - 1) {
            // Last round (Finals), just return matches as single items in a pair wrapper
            return matches.map(m => [m]);
        }

        const pairsMap = new Map();

        // Initialize map with next round match IDs to preserve order if possible
        // But we don't know the order of next round matches easily without looking ahead
        // So let's just group by nextMatchId

        matches.forEach(match => {
            const nextId = match.nextMatchId;
            if (!nextId) {
                // No next match (e.g. final or loose end), treat as standalone
                // Use a unique key
                pairsMap.set(`standalone-${match.id}`, [match]);
            } else {
                if (!pairsMap.has(nextId)) {
                    pairsMap.set(nextId, []);
                }
                pairsMap.get(nextId).push(match);
            }
        });

        // We need to sort these pairs to match the visual order of the next round
        // If nextRoundMatches is provided, we can use it to order our pairs
        if (nextRoundMatches) {
            const orderedPairs = [];
            const remainingPairs = new Map(pairsMap);

            nextRoundMatches.forEach(nextMatch => {
                if (remainingPairs.has(nextMatch.id)) {
                    orderedPairs.push(remainingPairs.get(nextMatch.id));
                    remainingPairs.delete(nextMatch.id);
                }
            });

            // Add any remaining pairs (orphans)
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

// Progression Logic Helper
const processMatches = (matches) => {
    // Create a map of matches by ID
    const matchMap = new Map(matches.map(m => [m.id, { ...m }])); // Shallow copy to mutate participants

    // Sort matches by round to process progression in order
    // Assuming round is numeric or sortable
    const sortedMatches = [...matchMap.values()].sort((a, b) => {
        // Try numeric round
        const rA = parseInt(a.tournamentRoundText || a.round);
        const rB = parseInt(b.tournamentRoundText || b.round);
        if (!isNaN(rA) && !isNaN(rB)) return rA - rB;
        return 0;
    });

    sortedMatches.forEach(match => {
        // Check if this match has a winner or walkover
        const winner = match.participants.find(p => p.isWinner);

        // If no explicit winner but one participant is missing/null and the other is present? 
        // Actually, walkovers usually have isWinner=true.

        if (winner && match.nextMatchId) {
            const nextMatch = matchMap.get(match.nextMatchId);
            if (nextMatch) {
                // Check if winner is already in next match
                const alreadyIn = nextMatch.participants.some(p => p.id === winner.id);
                if (!alreadyIn) {
                    // Find an empty slot or placeholder
                    const emptySlotIndex = nextMatch.participants.findIndex(p => !p.name || p.name === "TBD");
                    if (emptySlotIndex !== -1) {
                        nextMatch.participants[emptySlotIndex] = { ...winner, resultText: null, isWinner: false }; // Reset winner status for next round
                    } else if (nextMatch.participants.length < 2) {
                        nextMatch.participants.push({ ...winner, resultText: null, isWinner: false });
                    }
                }
            }
        }
    });

    return Array.from(matchMap.values());
};


const BracketView = ({ matches }) => {
    // Process matches for progression (optional, if backend doesn't handle it fully)
    // For now, let's assume backend data might be incomplete for walkovers as per user request
    // But strictly speaking, modifying props is bad. We should compute derived state.

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
                    />
                ))}
            </div>
        </div>
    );
};

export default function CustomBracket({ matches, bracketType }) {
    if (!matches) return null;

    if (bracketType === 'double') {
        // For double elimination, we have upper and lower arrays.
        // We can render two BracketViews.
        return (
            <div className="custom-bracket-container">
                <div className="bracket-section">
                    <h3 className="bracket-title">Upper Bracket</h3>
                    {/* We need to extract the inner BracketView logic to reuse it properly without the container wrapper if we want them stacked */}
                    {/* But BracketView returns a container. Let's just use it. */}
                    <div className="bracket-rounds">
                        {/* We need to duplicate the logic or refactor BracketView to be a pure component that takes rounds */}
                        {/* Let's just instantiate BracketView's logic here for Upper */}
                        <BracketInner matches={matches.upper || []} />
                    </div>
                </div>
                <div className="bracket-section">
                    <h3 className="bracket-title">Lower Bracket</h3>
                    <div className="bracket-rounds">
                        <BracketInner matches={matches.lower || []} />
                    </div>
                </div>
            </div>
        )
    }

    return <BracketView matches={matches} />;
}

// Extracted inner component to reuse logic without the container
const BracketInner = ({ matches }) => {
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
                />
            ))}
        </>
    );
};
