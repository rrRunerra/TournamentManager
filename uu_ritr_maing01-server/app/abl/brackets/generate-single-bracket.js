"use strict";

/**
 * Generates a single elimination bracket for a tournament
 * @param {Array} teams - Array of team objects with id and name properties
 * @returns {Promise<Array>} Array of match objects representing the bracket
 */
async function generateSingleBracket(teams) {
    // Helper function to generate unique IDs
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

    // Create matches array
    const matches = [];

    // First, create all matches we'll need
    let currentTeams = [...teams];
    let roundNumber = 1;

    // We'll store matches by round for easier connection
    const rounds = [];

    while (currentTeams.length > 1) {
        const roundMatches = [];
        const nextRoundTeams = [];

        // Create matches for this round
        for (let i = 0; i < currentTeams.length; i += 2) {
            // Check if we have a team for this position
            const team1 = currentTeams[i];
            const team2 = currentTeams[i + 1];

            // Only create a match if we have at least one team
            if (team1 || team2) {
                const isFinalRound = currentTeams.length <= 2;
                const matchName = isFinalRound ?
                    "Final - Match" :
                    `Round ${roundNumber} - Match ${roundMatches.length + 1}`;

                const match = {
                    id: generateMatchId(),
                    name: matchName,
                    nextMatchId: null, // Will be set later
                    tournamentRoundText: roundNumber.toString(),
                    startTime: null,
                    state: "SCHEDULED",
                    participants: []
                };

                // Add participants
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

                // Handle byes (only one team)
                if (match.participants.length === 1) {
                    match.participants[0].resultText = "WALK_OVER";
                    match.participants[0].isWinner = true;
                    match.participants[0].status = "WALK_OVER";
                    match.state = "WALK_OVER";
                }

                roundMatches.push(match);
                matches.push(match);

                // Track that a winner will come from this match
                nextRoundTeams.push({ type: 'winner', matchId: match.id });
            } else if (i < currentTeams.length) {
                // This handles the case where we have an odd number and need to advance a team
                nextRoundTeams.push(currentTeams[i]);
            }
        }

        rounds.push({
            roundNumber,
            matches: roundMatches,
            nextRoundTeams
        });

        // Prepare teams for next round
        currentTeams = nextRoundTeams;
        roundNumber++;
    }

    // Now connect the matches with nextMatchId
    for (let i = 0; i < rounds.length - 1; i++) {
        const currentRound = rounds[i];
        const nextRound = rounds[i + 1];

        // For each winner reference in current round, connect it to the appropriate match in next round
        let nextMatchIndex = 0;

        for (let j = 0; j < currentRound.nextRoundTeams.length; j += 2) {
            if (nextMatchIndex < nextRound.matches.length) {
                const nextMatch = nextRound.matches[nextMatchIndex];

                // Connect the two winners from current round to this next match
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

    // Ensure final match has no nextMatchId
    if (rounds.length > 0) {
        const finalRound = rounds[rounds.length - 1];
        if (finalRound.matches.length > 0) {
            finalRound.matches[0].nextMatchId = null;
        }
    }

    return matches;
}

module.exports = generateSingleBracket;
