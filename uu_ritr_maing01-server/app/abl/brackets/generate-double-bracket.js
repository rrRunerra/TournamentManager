"use strict";

/**
 * Generates a double elimination bracket for a tournament
 * @param {Array} teams - Array of team objects with id and name properties
 * @returns {Promise<Object>} Object with upper and lower bracket arrays
 */
async function generateDoubleBracket(teams) {
    // Helper functions
    function generateMatchId() {
        return Math.floor(Math.random() * 1000000);
    }

    function generateParticipantId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Validate input
    if (!teams || !Array.isArray(teams) || teams.length < 2) {
        throw new Error('Teams array must contain at least 2 teams');
    }

    const upperBracket = [];
    const lowerBracket = [];

    // ===== UPPER BRACKET GENERATION =====
    // Generate standard single elimination bracket
    let currentTeams = [...teams];
    let upperRoundNumber = 1;
    const upperRounds = [];

    while (currentTeams.length > 1) {
        const roundMatches = [];
        const nextRoundTeams = [];

        for (let i = 0; i < currentTeams.length; i += 2) {
            const team1 = currentTeams[i];
            const team2 = currentTeams[i + 1];

            if (team1 || team2) {
                const isFinalRound = currentTeams.length <= 2;
                const matchName = isFinalRound ?
                    "Upper Bracket Final" :
                    `Upper Round ${upperRoundNumber} - Match ${roundMatches.length + 1}`;

                const match = {
                    id: generateMatchId(),
                    name: matchName,
                    nextMatchId: null,
                    nextLooserMatchId: null, // Will be set later
                    tournamentRoundText: upperRoundNumber.toString(),
                    startTime: null,
                    state: "SCHEDULED",
                    participants: []
                };

                if (team1) {
                    match.participants.push({
                        id: team1.id || generateParticipantId(),
                        resultText: null,
                        isWinner: false,
                        status: null,
                        name: team1.name
                    });
                }

                if (team2) {
                    match.participants.push({
                        id: team2.id || generateParticipantId(),
                        resultText: null,
                        isWinner: false,
                        status: null,
                        name: team2.name
                    });
                }

                // Handle byes
                if (match.participants.length === 1) {
                    match.participants[0].resultText = "WALK_OVER";
                    match.participants[0].isWinner = true;
                    match.participants[0].status = "WALK_OVER";
                    match.state = "WALK_OVER";
                }

                roundMatches.push(match);
                upperBracket.push(match);
                nextRoundTeams.push({ type: 'winner', matchId: match.id });
            } else if (i < currentTeams.length) {
                nextRoundTeams.push(currentTeams[i]);
            }
        }

        upperRounds.push({
            roundNumber: upperRoundNumber,
            matches: roundMatches,
            nextRoundTeams
        });

        currentTeams = nextRoundTeams;
        upperRoundNumber++;
    }

    // Connect upper bracket matches with nextMatchId
    for (let i = 0; i < upperRounds.length - 1; i++) {
        const currentRound = upperRounds[i];
        const nextRound = upperRounds[i + 1];
        let nextMatchIndex = 0;

        for (let j = 0; j < currentRound.nextRoundTeams.length; j += 2) {
            if (nextMatchIndex < nextRound.matches.length) {
                const nextMatch = nextRound.matches[nextMatchIndex];
                const team1Ref = currentRound.nextRoundTeams[j];
                const team2Ref = currentRound.nextRoundTeams[j + 1];

                if (team1Ref && team1Ref.type === 'winner') {
                    const sourceMatch = currentRound.matches.find(m => m.id === team1Ref.matchId);
                    if (sourceMatch) {
                        sourceMatch.nextMatchId = nextMatch.id;
                    }
                }

                if (team2Ref && team2Ref.type === 'winner') {
                    const sourceMatch = currentRound.matches.find(m => m.id === team2Ref.matchId);
                    if (sourceMatch) {
                        sourceMatch.nextMatchId = nextMatch.id;
                    }
                }

                nextMatchIndex++;
            }
        }
    }

    // ===== LOWER BRACKET GENERATION =====
    // Lower bracket receives losers from upper bracket
    const lowerRounds = [];
    let lowerRoundNumber = 1;

    // Calculate how many rounds we need in lower bracket
    // For N teams, upper bracket has log2(N) rounds
    // Lower bracket needs approximately 2*log2(N) - 2 rounds
    const numUpperRounds = upperRounds.length;

    // Track which upper bracket matches feed into which lower bracket rounds
    const loserFeeds = []; // Array of arrays, each containing matches that feed losers to that LB round

    // First lower bracket round receives losers from first upper bracket round
    if (upperRounds[0]) {
        loserFeeds.push(upperRounds[0].matches);
    }

    // Subsequent rounds alternate between:
    // 1. "Feed rounds" - receive losers from upper bracket
    // 2. "Merge rounds" - winners from previous LB round play each other
    for (let i = 1; i < numUpperRounds - 1; i++) {
        // Feed round - receives losers from upper bracket round i
        loserFeeds.push(upperRounds[i].matches);
        // Merge round - no new losers, just previous LB winners
        loserFeeds.push([]);
    }

    // Generate lower bracket matches
    let previousLBMatches = [];

    for (let feedIndex = 0; feedIndex < loserFeeds.length; feedIndex++) {
        const upperLosers = loserFeeds[feedIndex];
        const roundMatches = [];

        if (upperLosers.length > 0) {
            // This is a "feed round" - pair losers from upper bracket with winners from previous LB round
            // Total participants = losers dropping down + winners advancing from previous LB round
            const numMatches = (upperLosers.length + previousLBMatches.length) / 2;

            for (let i = 0; i < numMatches; i++) {
                const match = {
                    id: generateMatchId(),
                    name: `Lower Round ${lowerRoundNumber} - Match ${i + 1}`,
                    nextMatchId: null,
                    nextLooserMatchId: null,
                    tournamentRoundText: `LB-${lowerRoundNumber}`,
                    startTime: null,
                    state: "SCHEDULED",
                    participants: []
                };

                roundMatches.push(match);
                lowerBracket.push(match);
            }

            // Set nextLooserMatchId for upper bracket matches
            const losersPerMatch = upperLosers.length / numMatches;
            upperLosers.forEach((upperMatch, idx) => {
                const lbMatchIndex = Math.floor(idx / losersPerMatch);
                if (roundMatches[lbMatchIndex]) {
                    upperMatch.nextLooserMatchId = roundMatches[lbMatchIndex].id;
                }
            });

            // Connect previous LB matches to current round
            if (previousLBMatches.length > 0) {
                const winnersPerMatch = previousLBMatches.length / numMatches;
                previousLBMatches.forEach((prevMatch, idx) => {
                    const nextMatchIndex = Math.floor(idx / winnersPerMatch);
                    if (roundMatches[nextMatchIndex]) {
                        prevMatch.nextMatchId = roundMatches[nextMatchIndex].id;
                    }
                });
            }

        } else if (previousLBMatches.length > 0) {
            // This is a "merge round" - winners from previous LB round play each other
            const numMatches = Math.ceil(previousLBMatches.length / 2);

            for (let i = 0; i < numMatches; i++) {
                const match = {
                    id: generateMatchId(),
                    name: `Lower Round ${lowerRoundNumber} - Match ${i + 1}`,
                    nextMatchId: null,
                    nextLooserMatchId: null,
                    tournamentRoundText: `LB-${lowerRoundNumber}`,
                    startTime: null,
                    state: "SCHEDULED",
                    participants: []
                };

                roundMatches.push(match);
                lowerBracket.push(match);
            }

            // Connect previous LB matches to current round
            previousLBMatches.forEach((prevMatch, idx) => {
                const nextMatchIndex = Math.floor(idx / 2);
                if (roundMatches[nextMatchIndex]) {
                    prevMatch.nextMatchId = roundMatches[nextMatchIndex].id;
                }
            });
        }

        if (roundMatches.length > 0) {
            lowerRounds.push({
                roundNumber: lowerRoundNumber,
                matches: roundMatches
            });
            previousLBMatches = roundMatches;
            lowerRoundNumber++;
        }
    }

    // Lower bracket final - last match in lower bracket
    if (previousLBMatches.length > 1) {
        const lowerFinal = {
            id: generateMatchId(),
            name: "Lower Bracket Final (3rd/4th Place)",
            nextMatchId: null,
            nextLooserMatchId: null,
            tournamentRoundText: `LB-${lowerRoundNumber}`,
            startTime: null,
            state: "SCHEDULED",
            participants: []
        };

        // Connect previous matches to lower final
        previousLBMatches.forEach(match => {
            match.nextMatchId = lowerFinal.id;
        });

        lowerBracket.push(lowerFinal);
        lowerRounds.push({
            roundNumber: lowerRoundNumber,
            matches: [lowerFinal]
        });
    } else if (previousLBMatches.length === 1) {
        // If we ended with a single match, that IS the lower bracket final
        const lastMatch = previousLBMatches[0];
        lastMatch.name = "Lower Bracket Final (3rd/4th Place)";
    }

    // Update Upper Bracket Final name to indicate it determines 1st/2nd place
    const upperFinal = upperRounds[upperRounds.length - 1]?.matches[0];
    if (upperFinal) {
        upperFinal.name = "Upper Bracket Final (1st/2nd Place)";
        upperFinal.nextMatchId = null; // No grand final
    }

    return {
        upper: upperBracket,
        lower: lowerBracket
    };
}

module.exports = generateDoubleBracket;
