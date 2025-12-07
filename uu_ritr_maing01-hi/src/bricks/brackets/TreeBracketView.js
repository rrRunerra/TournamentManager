import { useMemo } from "react";
import { useLsi } from "uu5g05";
import importLsi from "../../lsi/import-lsi.js";
import MatchCard from "./MatchCard.js";
import { processMatches, getRoundName } from "./bracketUtils.js";

const TreeBracketView = ({ matches, onMatchClick }) => {
    const processedMatches = useMemo(() => processMatches(matches), [matches]);
    const lsi = useLsi(importLsi, ["CustomBracket"]);

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
            title: getRoundName(key, sortedKeys.length, index, lsi),
            matches: roundsMap[key].sort((a, b) => a.id - b.id)
        }));
    }, [processedMatches, lsi]);

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

export default TreeBracketView;
