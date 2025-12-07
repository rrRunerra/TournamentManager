/**
 * Constants and utility functions for bracket components
 */

export const STATUS_OPTIONS = ['PLAYED', 'NO_SHOW', 'WALK_OVER', 'NO_PARTY', null];

export const getRoundName = (roundKey, totalRounds, index, lsi) => {
    const roundNum = parseInt(roundKey);
    if (isNaN(roundNum)) return roundKey;

    if (index === totalRounds - 1) return lsi.grandFinal;
    if (index === totalRounds - 2) return lsi.semifinal;
    if (index === totalRounds - 3) return lsi.quarterfinal;

    return `${lsi.roundPrefix} ${roundKey}`;
};

export const processMatches = (matches) => {
    const matchMap = new Map(matches.map(m => [m.id, { ...m }]));
    console.log("Processing matches")

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

    // Auto-assign winners and advance them through WALK_OVER chains
    // Keep looping until no more changes occur
    let changesOccurred = true;
    let iterations = 0;
    const maxIterations = 20; // Prevent infinite loops

    while (changesOccurred && iterations < maxIterations) {
        changesOccurred = false;
        iterations++;

        // Pass 1: Mark winners in WALK_OVER matches
        sortedMatches.forEach(match => {
            if (match.state == 'WALK_OVER') {
                // Case 1: Match has only 1 participant total
                if (match.participants.length === 1 && match.participants[0].id && !match.participants[0].isWinner) {
                    console.log(`[Iteration ${iterations}] Setting single participant as winner:`, match.participants[0].name, "in match", match.id);
                    match.participants[0].isWinner = true;
                    changesOccurred = true;
                }
                // Case 2: Match has 2 slots but only 1 valid participant (other is TBD/WALK_OVER)
                else {
                    const validParticipants = match.participants.filter(p => p.id && p.name && p.name !== "TBD" && p.resultText !== "WALK_OVER");
                    if (validParticipants.length === 1) {
                        const walkoverWinner = match.participants.find(p => p.id === validParticipants[0].id);
                        if (walkoverWinner && !walkoverWinner.isWinner) {
                            console.log(`[Iteration ${iterations}] Setting valid participant as winner:`, walkoverWinner.name, "in match", match.id);
                            walkoverWinner.isWinner = true;
                            changesOccurred = true;
                        }
                    }
                }
            }
        });

        // Pass 2: Advance walkover winners to next round
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
                                console.log(`[Iteration ${iterations}] Advancing ${winner.name} from match ${match.id} to match ${nextMatch.id}`);
                                nextMatch.participants[emptySlotIndex] = { ...winner, resultText: null, isWinner: false };
                                changesOccurred = true;
                            } else if (nextMatch.participants.length < 2) {
                                console.log(`[Iteration ${iterations}] Adding ${winner.name} to match ${nextMatch.id}`);
                                nextMatch.participants.push({ ...winner, resultText: null, isWinner: false });
                                changesOccurred = true;
                            }
                        }
                    }
                }
            }
        });
    }

    console.log(`WALK_OVER processing completed after ${iterations} iterations`);

    return Array.from(matchMap.values());
};
