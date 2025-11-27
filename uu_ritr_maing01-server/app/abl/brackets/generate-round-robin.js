"use strict";

/**
 * Generates a Round Robin bracket for a tournament
 * @param {Array} teams - Array of team objects with id and name properties
 * @returns {Promise<Array>} Array of match objects
 */
async function generateRoundRobin(teams) {
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

    const matches = [];
    let participants = [...teams];

    // If odd number of teams, add a dummy "Bye" team
    if (participants.length % 2 !== 0) {
        participants.push({ id: "BYE", name: "BYE" });
    }

    const numTeams = participants.length;
    const numRounds = numTeams - 1;
    const halfSize = numTeams / 2;

    // Generate rounds using Circle Method
    for (let round = 0; round < numRounds; round++) {
        const roundMatches = [];
        const roundNumber = round + 1;

        for (let i = 0; i < halfSize; i++) {
            const team1 = participants[i];
            const team2 = participants[numTeams - 1 - i];

            // Skip match if one of the teams is "BYE"
            if (team1.id === "BYE" || team2.id === "BYE") {
                continue;
            }

            const match = {
                id: generateMatchId(),
                name: `Round ${roundNumber} - Match ${i + 1}`,
                nextMatchId: null, // Round Robin matches don't progress to next match
                nextLooserMatchId: null,
                tournamentRoundText: `Round ${roundNumber}`,
                startTime: null,
                state: "SCHEDULED",
                participants: []
            };

            match.participants.push({
                id: team1.id || generateParticipantId(),
                resultText: null,
                isWinner: false,
                status: null,
                name: team1.name
            });

            match.participants.push({
                id: team2.id || generateParticipantId(),
                resultText: null,
                isWinner: false,
                status: null,
                name: team2.name
            });

            matches.push(match);
        }

        // Rotate teams for next round (keep first team fixed, rotate others)
        // [0, 1, 2, 3] -> [0, 3, 1, 2]
        participants = [
            participants[0],
            participants[numTeams - 1],
            ...participants.slice(1, numTeams - 1)
        ];
    }

    return matches;
}

module.exports = generateRoundRobin;
