"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const TOURNAMENTS = [
  // 28 Finished
  {
    name: "Zimné majstrovstvá 2024",
    description: "Najväčšia zimná udalosť roka.",
    startDate: "2024-01-10T09:00:00.000Z",
    endDate: "2024-01-12T18:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Jarný pohár nováčikov",
    description: "Turnaj pre nováčikov, aby ukázali svoje schopnosti.",
    startDate: "2024-03-15T10:00:00.000Z",
    endDate: "2024-03-16T16:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "double",
    teamsCount: 4,
  },
  {
    name: "Letná horúčava",
    description: "Intenzívna súťaž pod letným slnkom.",
    startDate: "2024-07-20T09:00:00.000Z",
    endDate: "2024-07-22T20:00:00.000Z",
    teamSize: "3",
    status: "finished",
    bracketType: "robin",
    teamsCount: 6,
  },
  {
    name: "Jesenné legendy",
    description: "Kde sa rodia legendy.",
    startDate: "2024-10-05T12:00:00.000Z",
    endDate: "2024-10-07T18:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "single",
    teamsCount: 16,
  },
  {
    name: "Polnočné šialenstvo",
    description: "Neskorá nočná herná session.",
    startDate: "2024-11-11T20:00:00.000Z",
    endDate: "2024-11-12T04:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Školský pohár 2023",
    description: "Tradičný turnaj medzi triedami.",
    startDate: "2023-09-15T08:00:00.000Z",
    endDate: "2023-09-15T16:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "single",
    teamsCount: 4,
  },
  {
    name: "Halloween Gaming Night",
    description: "Strašidelné herné súboje.",
    startDate: "2023-10-31T18:00:00.000Z",
    endDate: "2023-11-01T02:00:00.000Z",
    teamSize: "1",
    status: "finished",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Mikulášsky turnaj",
    description: "Sladké odmeny pre víťazov.",
    startDate: "2023-12-06T14:00:00.000Z",
    endDate: "2023-12-06T20:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "double",
    teamsCount: 4,
  },
  {
    name: "Vianočný kapor Cup",
    description: "Predvianočná herná pohoda.",
    startDate: "2023-12-20T10:00:00.000Z",
    endDate: "2023-12-22T18:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "robin",
    teamsCount: 6,
  },
  {
    name: "Retro Night 2023",
    description: "Súboj v klasických hrách.",
    startDate: "2023-11-20T17:00:00.000Z",
    endDate: "2023-11-20T23:00:00.000Z",
    teamSize: "1",
    status: "finished",
    bracketType: "single",
    teamsCount: 16,
  },
  {
    name: "Maturitný oddych",
    description: "Turnaj pre štvrtákov pred skúškami.",
    startDate: "2024-05-10T09:00:00.000Z",
    endDate: "2024-05-10T15:00:00.000Z",
    teamSize: "3",
    status: "finished",
    bracketType: "single",
    teamsCount: 4,
  },
  {
    name: "Deň detí Cup",
    description: "Oslávme deň detí hraním.",
    startDate: "2024-06-01T09:00:00.000Z",
    endDate: "2024-06-01T18:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "double",
    teamsCount: 8,
  },
  {
    name: "Open-Air Arena",
    description: "Prvý turnaj pod holým nebom.",
    startDate: "2024-06-15T10:00:00.000Z",
    endDate: "2024-06-16T22:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "single",
    teamsCount: 4,
  },
  {
    name: "Summer Speedrun",
    description: "Kto bude najrýchlejší?",
    startDate: "2024-08-05T14:00:00.000Z",
    endDate: "2024-08-05T20:00:00.000Z",
    teamSize: "1",
    status: "finished",
    bracketType: "single",
    teamsCount: 16,
  },
  {
    name: "Back to School Bash",
    description: "Privítanie nového školského roka.",
    startDate: "2024-09-02T12:00:00.000Z",
    endDate: "2024-09-02T20:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "double",
    teamsCount: 8,
  },
  {
    name: "Jesenný bootcamp",
    description: "Týždenný maratón tréningov a zápasov.",
    startDate: "2024-10-14T08:00:00.000Z",
    endDate: "2024-10-18T16:00:00.000Z",
    teamSize: "3",
    status: "finished",
    bracketType: "robin",
    teamsCount: 4,
  },
  {
    name: "Piatok trinásteho",
    description: "Turnaj plný prekvapení.",
    startDate: "2024-09-13T20:00:00.000Z",
    endDate: "2024-09-14T02:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Weekend Warriors",
    description: "Víkendový turnaj o prestíž.",
    startDate: "2024-11-23T10:00:00.000Z",
    endDate: "2024-11-24T18:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "double",
    teamsCount: 4,
  },
  {
    name: "Final Boss Challenge",
    description: "Súboj proti najlepším z minulého roka.",
    startDate: "2024-12-15T15:00:00.000Z",
    endDate: "2024-12-15T21:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "single",
    teamsCount: 2,
  },
  {
    name: "New Year Eve 2024",
    description: "Herná oslava konca roka.",
    startDate: "2024-12-31T18:00:00.000Z",
    endDate: "2025-01-01T04:00:00.000Z",
    teamSize: "1",
    status: "finished",
    bracketType: "single",
    teamsCount: 16,
  },
  {
    name: "Breznová bitka",
    description: "Súboj o titul jarného kráľa.",
    startDate: "2025-03-20T10:00:00.000Z",
    endDate: "2025-03-21T18:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "double",
    teamsCount: 8,
  },
  {
    name: "Aprílový žartík Cup",
    description: "Turnaj s vtipnými pravidlami.",
    startDate: "2025-04-01T14:00:00.000Z",
    endDate: "2025-04-01T20:00:00.000Z",
    teamSize: "3",
    status: "finished",
    bracketType: "single",
    teamsCount: 4,
  },
  {
    name: "Májový kvet Cup",
    description: "Jarná herná súťaž.",
    startDate: "2025-05-15T09:00:00.000Z",
    endDate: "2025-05-15T17:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "robin",
    teamsCount: 6,
  },
  {
    name: "Summer Kickoff 2025",
    description: "Otvorenie letnej sezóny.",
    startDate: "2025-06-25T10:00:00.000Z",
    endDate: "2025-06-27T18:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Beach Gaming 2025",
    description: "Pohodový letný turnaj.",
    startDate: "2025-07-15T12:00:00.000Z",
    endDate: "2025-07-16T20:00:00.000Z",
    teamSize: "1",
    status: "finished",
    bracketType: "double",
    teamsCount: 16,
  },
  {
    name: "Augustový blesk",
    description: "Rýchly turnaj v bleskovkách.",
    startDate: "2025-08-20T14:00:00.000Z",
    endDate: "2025-08-20T18:00:00.000Z",
    teamSize: "2",
    status: "finished",
    bracketType: "single",
    teamsCount: 4,
  },
  {
    name: "Podzimný vietor",
    description: "Súťaž o jesenný pohár.",
    startDate: "2025-09-30T10:00:00.000Z",
    endDate: "2025-10-01T17:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "robin",
    teamsCount: 8,
  },
  {
    name: "Precedatenský Cup",
    description: "Tradičný turnaj pre starších žiakov.",
    startDate: "2025-11-05T09:00:00.000Z",
    endDate: "2025-11-05T15:00:00.000Z",
    teamSize: "5",
    status: "finished",
    bracketType: "single",
    teamsCount: 4,
  },

  // 3 Ongoing
  {
    name: "Pro Liga - 1. sezóna",
    description: "Profesionálna liga pre špičkových hráčov.",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
    teamSize: "5",
    status: "ongoing",
    bracketType: "double",
    teamsCount: 8,
  },
  {
    name: "Komunitná akcia",
    description: "Zábavný turnaj pre komunitu.",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(), // +1 day
    teamSize: "3",
    status: "ongoing",
    bracketType: "single",
    teamsCount: 4,
  },
  {
    name: "Denná výzva LIVE",
    description: "Priebežná súťaž o najlepšieho hráča dňa.",
    startDate: new Date(Date.now() - 3600000).toISOString(), // -1 hour
    endDate: new Date(Date.now() + 43200000).toISOString(), // +12 hours
    teamSize: "1",
    status: "ongoing",
    bracketType: "single",
    teamsCount: 8,
  },

  // 10 Upcoming
  {
    name: "Novoročný Open 2026",
    description: "Odštartujte nový rok vo veľkom štýle.",
    startDate: "2026-01-01T10:00:00.000Z",
    endDate: "2026-01-03T18:00:00.000Z",
    teamSize: "5",
    status: "upcoming",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Valentínske dvojice",
    description: "Zober partnera a poď súťažiť.",
    startDate: "2026-02-14T14:00:00.000Z",
    endDate: "2026-02-14T22:00:00.000Z",
    teamSize: "2",
    status: "upcoming",
    bracketType: "single",
    teamsCount: 8,
  },
  {
    name: "Veľkonočný pohár",
    description: "Hľadanie skrytých cien.",
    startDate: "2026-04-04T09:00:00.000Z",
    endDate: "2026-04-05T17:00:00.000Z",
    teamSize: "3",
    status: "upcoming",
    bracketType: "robin",
    teamsCount: 6,
  },
  {
    name: "Májový turnaj nádejí",
    description: "Hľadáme nové talenty.",
    startDate: "2026-05-10T10:00:00.000Z",
    endDate: "2026-05-10T18:00:00.000Z",
    teamSize: "5",
    status: "upcoming",
    bracketType: "single",
    teamsCount: 4,
  },
  {
    name: "Letná liga 2026",
    description: "Najväčšia letná udalosť budúceho roka.",
    startDate: "2026-07-01T09:00:00.000Z",
    endDate: "2026-08-31T18:00:00.000Z",
    teamSize: "5",
    status: "upcoming",
    bracketType: "double",
    teamsCount: 16,
  },
  {
    name: "Nočný maratón",
    description: "Turnaj pre nočné sovy.",
    startDate: "2026-06-20T22:00:00.000Z",
    endDate: "2026-06-21T06:00:00.000Z",
    teamSize: "1",
    status: "upcoming",
    bracketType: "single",
    teamsCount: 32,
  },
  {
    name: "Duo Battle Royale",
    description: "Súboj dvojíc v režime eliminácie.",
    startDate: "2026-08-15T14:00:00.000Z",
    endDate: "2026-08-15T22:00:00.000Z",
    teamSize: "2",
    status: "upcoming",
    bracketType: "single",
    teamsCount: 16,
  },
  {
    name: "Jesenná odveta",
    description: "Vráť súperovi prehru z minulého roka.",
    startDate: "2026-10-10T10:00:00.000Z",
    endDate: "2026-10-11T18:00:00.000Z",
    teamSize: "5",
    status: "upcoming",
    bracketType: "double",
    teamsCount: 8,
  },
  {
    name: "Finálový turnaj roka",
    description: "Súboj o absolútneho víťaza sezóny 2026.",
    startDate: "2026-12-15T09:00:00.000Z",
    endDate: "2026-12-17T18:00:00.000Z",
    teamSize: "5",
    status: "upcoming",
    bracketType: "single",
    teamsCount: 4,
  },
  {
    name: "Zimný Warm-up",
    description: "Príprava na zimnú sezónu.",
    startDate: "2026-11-20T13:00:00.000Z",
    endDate: "2026-11-20T21:00:00.000Z",
    teamSize: "1",
    status: "upcoming",
    bracketType: "robin",
    teamsCount: 12,
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
          profilePicture: "https://matchup.runerra.org/public/0.1.0/assets/profiles/2.png",
          stats: {
            finals_firstPlace: Math.floor(Math.random() * 100),
            finals_secondPlace: Math.floor(Math.random() * 100),
            finals_thirdPlace: Math.floor(Math.random() * 100),
            finals_fourthPlace: Math.floor(Math.random() * 100),
            matchesWon: Math.floor(Math.random() * 100),
            matchesLost: Math.floor(Math.random() * 100),
            tournamentsPlayed: Math.floor(Math.random() * 100),
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
