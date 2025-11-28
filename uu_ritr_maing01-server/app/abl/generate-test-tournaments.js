/**
 * Generate 27 test tournaments: 3 bracket types × 9 team counts
 */


const BRACKET_TYPES = ['single', 'double', 'robin'];
const TEAM_COUNTS = Array.from({ length: 27 }, (_, i) => i + 4); // 4 to 30 = 27 team counts


async function generateTestTournaments(tournamentAbl, awid) {
    console.log("Starting test tournament generation...");
    let successCount = 0;
    let failCount = 0;

    for (const bracketType of BRACKET_TYPES) {
        for (const teamCount of TEAM_COUNTS) {
            const dtoIn = {
                name: `Test ${bracketType} - ${teamCount} teams`,
                description: `Auto-generated test tournament with ${teamCount} teams using ${bracketType} elimination`,
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: "upcoming",
                teamSize: "1",
                bracketType: bracketType,
                teams: Array.from({ length: teamCount }, (_, i) => `Team ${i + 1}`),
                owner: "408089" // Default test owner ID
            };

            try {
                await tournamentAbl.create(awid, dtoIn);
                successCount++;
                console.log(`✓ Created: ${dtoIn.name} (${successCount}/${BRACKET_TYPES.length * TEAM_COUNTS.length})`);
            } catch (error) {
                failCount++;
                console.error(`✗ Failed: ${dtoIn.name} - ${error.message}`);
            }
        }
    }

    console.log(`\nDone! Success: ${successCount}, Failed: ${failCount}`);
    return { successCount, failCount };
}

module.exports = { generateTestTournaments };
