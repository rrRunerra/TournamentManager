"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const TOURNAMENTS = [
  // 5 Finished
  {
    name: "Winter Championship 2024",
    description: "The biggest winter event of the year.",
    startDate: "2024-01-10T09:00:00.000Z",
    endDate: "2024-01-12T18:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Spring Rookie Cup",
    description: "A tournament for newcomers to show their skills.",
    startDate: "2024-03-15T10:00:00.000Z",
    endDate: "2024-03-16T16:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "double",
    teamsCount: 4,
  },
  {
    name: "Summer Heat Wave",
    description: "Intense competition under the summer sun.",
    startDate: "2024-07-20T09:00:00.000Z",
    endDate: "2024-07-22T20:00:00.000Z",
    teamSize: "3",
    status: "finished",
    bracketType: "robin",
    teamsCount: 6,
  },
  {
    name: "Autumn Legends",
    description: "Where legends are born.",
    startDate: "2024-10-05T12:00:00.000Z",
    endDate: "2024-10-07T18:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "single",
    teamsCount: 16,
  },
  {
    name: "Midnight Madness",
    description: "Late night gaming session.",
    startDate: "2024-11-11T20:00:00.000Z",
    endDate: "2024-11-12T04:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "single",
    teamsCount: 8,
  },
  // 2 Ongoing
  {
    name: "Pro League Season 1",
    description: "The professional league for top tier players.",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
    teamSize: "5",
    status: "ongoing",
    bracketType: "double",
    teamsCount: 8,
  },
  {
    name: "Community Bash",
    description: "Fun tournament for the community.",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(), // +1 day
    teamSize: "3",
    status: "ongoing",
    bracketType: "single",
    teamsCount: 4,
  },
  // 3 Upcoming
  {
    name: "New Year Open 2026",
    description: "Start the new year with a bang.",
    startDate: "2026-01-01T10:00:00.000Z",
    endDate: "2026-01-03T18:00:00.000Z",
    teamSize: "5",
    status: "upcoming",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Valentine's Duos",
    description: "Grab a partner and compete.",
    startDate: "2026-02-14T14:00:00.000Z",
    endDate: "2026-02-14T22:00:00.000Z",
    teamSize: "2",
    status: "upcoming",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Easter Egg Hunt Cup",
    description: "Find the hidden prizes.",
    startDate: "2026-04-04T09:00:00.000Z",
    endDate: "2026-04-05T17:00:00.000Z",
    teamSize: "3",
    status: "upcoming",
    bracketType: "robin",
    teamsCount: 6,
  },
];

const generateTestTournaments = async (tournamentAbl, awid) => {
  console.log("Starting test data generation...");
  const playerDao = DaoFactory.getDao("player");
  const teamDao = DaoFactory.getDao("team");

  for (const tConfig of TOURNAMENTS) {
    console.log(`Generating tournament: ${tConfig.name}`);

    // 1. Create Players and Teams
    const teamNames = [];
    const playerIds = [];

    for (let i = 0; i < tConfig.teamsCount; i++) {
      const teamName = `Team ${String.fromCharCode(65 + i)}`; // Team A, Team B...
      teamNames.push(teamName);

      // Create players for the team
      const teamSize = parseInt(tConfig.teamSize);
      for (let j = 0; j < teamSize; j++) {
        const playerId = Math.random().toString(36).substring(2, 15);
        const playerName = `TEST Player ${String.fromCharCode(65 + i)}${j + 1}`;

        // Create player directly in DB to bypass auth
        await playerDao.create({
          awid,
          id: playerId,
          name: playerName,
          school: "sps-snina",
          role: "student",
          stats: {
            finals_firstPlace: 0,
            finals_secondPlace: 0,
            finals_thirdPlace: 0,
            finals_fourthPlace: 0,
            matchesWon: 0,
            matchesLost: 0,
            tournamentsPlayed: 0,
            flappyBirdHighScore: 0,
          },
        });
        playerIds.push(playerId);
      }
    }

    // 2. Create Tournament (Upcoming)
    // We create it as upcoming first, then update to ongoing/finished to trigger match generation
    const createDtoIn = {
      name: tConfig.name,
      description: tConfig.description,
      startDate: tConfig.startDate,
      endDate: tConfig.endDate,
      teamSize: tConfig.teamSize,
      status: "upcoming",
      teams: teamNames,
      owner: "408089",
      bracketType: tConfig.bracketType,
      school: "sps-snina",
    };

    const createdTournament = await tournamentAbl.create(awid, createDtoIn);
    console.log(`  Created tournament ID: ${createdTournament.id}`);

    // 3. Assign Players to Teams
    // tournamentAbl.create creates teams but without players. We need to update them.
    // We need to fetch the teams created for this tournament.
    // The create method returns the tournament object, which has a list of team IDs.

    // Re-fetch tournament to get team IDs (create returns object, but let's be safe)
    // Actually create returns the object with team IDs in .teams property

    const teamIds = createdTournament.teams;

    let playerIdx = 0;
    for (const teamId of teamIds) {
      const team = await teamDao.get({ awid, id: teamId });
      const teamPlayers = [];
      const size = parseInt(tConfig.teamSize);
      for (let k = 0; k < size; k++) {
        if (playerIdx < playerIds.length) {
          teamPlayers.push(playerIds[playerIdx]);
          playerIdx++;
        }
      }

      await teamDao.update({ awid, id: teamId }, { ...team, players: teamPlayers });
    }

    // 4. Update Status if needed
    if (tConfig.status === "ongoing" || tConfig.status === "finished") {
      console.log(`  Updating status to ongoing...`);
      await tournamentAbl.update(awid, { id: createdTournament.id, status: "ongoing" });

      if (tConfig.status === "finished") {
        console.log(`  Updating status to finished...`);
        await tournamentAbl.update(awid, { id: createdTournament.id, status: "finished" });
      }
    }
  }
  console.log("Test data generation complete!");
};

module.exports = { generateTestTournaments };
