"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/tournament-error.js");



const WARNINGS = {};
// double bracket data
// const matches = {
//     upper: [  
//     {  
//       id: 1,  
//       name: 'UB Round 1 - Match 1',  
//       nextMatchId: 5,  
//       nextLooserMatchId: 9,  
//       tournamentRoundText: 'UB R1',  
//       startTime: '2025-11-15T14:00:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-1',  
//           name: 'Player 1',  
//           isWinner: true,  
//           status: 'PLAYED',  
//           resultText: '2'  
//         },  
//         {  
//           id: 'player-8',  
//           name: 'Player 8',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '0'  
//         }  
//       ]  
//     },  
//     {  
//       id: 2,  
//       name: 'UB Round 1 - Match 2',  
//       nextMatchId: 5,  
//       nextLooserMatchId: 9,  
//       tournamentRoundText: 'UB R1',  
//       startTime: '2025-11-15T14:00:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-4',  
//           name: 'Player 4',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '1'  
//         },  
//         {  
//           id: 'player-5',  
//           name: 'Player 5',  
//           isWinner: true,  
//           status: 'PLAYED',  
//           resultText: '2'  
//         }  
//       ]  
//     },  
//     {  
//       id: 3,  
//       name: 'UB Round 1 - Match 3',  
//       nextMatchId: 6,  
//       nextLooserMatchId: 10,  
//       tournamentRoundText: 'UB R1',  
//       startTime: '2025-11-15T15:00:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-2',  
//           name: 'Player 2',  
//           isWinner: true,  
//           status: 'PLAYED',  
//           resultText: '2'  
//         },  
//         {  
//           id: 'player-7',  
//           name: 'Player 7',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '1'  
//         }  
//       ]  
//     },  
//     {  
//       id: 4,  
//       name: 'UBthrow new Error("stop") Round 1 - Match 4',  
//       nextMatchId: 6,  
//       nextLooserMatchId: 10,  
//       tournamentRoundText: 'UB R1',  
//       startTime: '2025-11-15T15:00:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-3',  
//           name: 'Player 3',  
//           isWinner: true,  
//           status: 'PLAYED',  
//           resultText: '2'  
//         },  
//         {  
//           id: 'player-6',  
//           name: 'Player 6',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '0'  
//         }  
//       ]  
//     },  
//     {  
//       id: 5,  
//       name: 'UB Semi Final 1',  
//       nextMatchId: 7,  
//       nextLooserMatchId: 11,  
//       tournamentRoundText: 'UB R2',  
//       startTime: '2025-11-15T16:00:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-1',  
//           name: 'Player 1',  
//           isWinner: true,  
//           status: 'PLAYED',  
//           resultText: '2'  
//         },  
//         {  
//           id: 'player-5',  
//           name: 'Player 5',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '1'  
//         }  
//       ]  
//     },  
//     {  
//       id: 6,  
//       name: 'UB Semi Final 2',  
//       nextMatchId: 7,  
//       nextLooserMatchId: 11,  
//       tournamentRoundText: 'UB R2',  
//       startTime: '2025-11-15T16:00:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-2',  
//           name: 'Player 2',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '0'  
//         },  
//         {  
//           id: 'player-3',  
//           name: 'Player 3',  
//           isWinner: true,  
//           status: 'PLAYED',  
//           resultText: '2'  
//         }  
//       ]  
//     },  
//     {  
//       id: 7,  
//       name: 'UB Final',  
//       nextMatchId: 13,  
//       nextLooserMatchId: 12,  
//       tournamentRoundText: 'UB R3',  
//       startTime: '2025-11-15T18:00:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-1',  
//           name: 'Player 1',  
//           isWinner: true,  
//           status: 'PLAYED',  
//           resultText: '2'  
//         },  
//         {  
//           id: 'player-3',  
//           name: 'Player 3',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '1'  
//         }  
//       ]  
//     },  
//     {  
//       id: 13,  
//       name: 'Grand Final',  
//       nextMatchId: null,  
//       nextLooserMatchId: null,  
//       tournamentRoundText: 'Final',  
//       startTime: '2025-11-15T20:00:00+00:00',  
//       state: 'SCHEDULED',  
//       participants: []  
//     }  
//   ],  
//   lower: [  
//     {  
//       id: 9,  
//       name: 'LB Round 1 - Match 1',  
//       nextMatchId: 11,  
//       nextLooserMatchId: null,  
//       tournamentRoundText: 'LB R1',  
//       startTime: '2025-11-15T16:30:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-8',  
//           name: 'Player 8',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '0'  
//         },  
//         {  
//           id: 'player-4',  
//           name: 'Player 4',  
//           isWinner: true,  
//           status: 'PLAYED',  
//           resultText: '2'  
//         }  
//       ]  
//     },  
//     {  
//       id: 10,  
//       name: 'LB Round 1 - Match 2',  
//       nextMatchId: 11,  
//       nextLooserMatchId: null,  
//       tournamentRoundText: 'LB R1',  
//       startTime: '2025-11-15T16:30:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-7',  
//           name: 'Player 7',  
//           isWinner: true,  
//           status: 'PLAYED',  
//           resultText: '2'  
//         },  
//         {  
//           id: 'player-6',  
//           name: 'Player 6',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '1'  
//         }  
//       ]  
//     },  
//     {  
//       id: 11,  
//       name: 'LB Round 2',  
//       nextMatchId: 12,  
//       nextLooserMatchId: null,  
//       tournamentRoundText: 'LB R2',  
//       startTime: '2025-11-15T17:30:00+00:00',  
//       state: 'SCORE_DONE',  
//       participants: [  
//         {  
//           id: 'player-5',  
//           name: 'Player 5',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '1'  
//         },  
//         {  
//           id: 'player-2',  
//           name: 'Player 2',  
//           isWinner: false,  
//           status: 'PLAYED',  
//           resultText: '1'  
//         }  
//       ]  
//     },  
//     {  
//       id: 12,  
//       name: 'LB Final',  
//       nextMatchId: 13,  
//       nextLooserMatchId: null,  
//       tournamentRoundText: 'LB R3',  
//       startTime: '2025-11-15T19:00:00+00:00',  
//       state: 'SCHEDULED',  
//       participants: []  
//     }  
//   ]  
// };

// TYSM DEEPSEEK
function generateDoubleBracket(teams) {
  // Helper function to generate unique IDs
  function generateMatchId() {
    return Math.floor(Math.random() * 1000000);
  }

  function generateParticipantId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Validate input
  if (!teams || !Array.isArray(teams) || teams.length < 2) {
    throw new Error('Teams array must contain at least 2 teams');
  }

  // Determine bracket size (next power of 2)
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(teams.length)));
  
  // Create brackets
  const upperBracket = [];
  const lowerBracket = [];
  
  // Generate first round of upper bracket
  const firstRoundMatches = bracketSize / 2;
  const firstRoundUpper = [];
  
  for (let i = 0; i < firstRoundMatches; i++) {
    const team1 = i * 2 < teams.length ? teams[i * 2] : null;
    const team2 = i * 2 + 1 < teams.length ? teams[i * 2 + 1] : null;
    
    const match = {
      id: generateMatchId(),
      name: `Upper Round 1 - Match ${i + 1}`,
      nextMatchId: null,
      nextLooserMatchId: null,
      tournamentRoundText: "1",
      startTime: null,
      state: team1 && team2 ? "SCHEDULED" : "WALK_OVER",
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
    
    // If only one team, they automatically win
    if (team1 && !team2) {
      match.participants[0].resultText = "WALK_OVER";
      match.participants[0].isWinner = true;
      match.participants[0].status = "WALK_OVER";
      match.state = "WALK_OVER";
    }
    
    firstRoundUpper.push(match);
  }
  
  upperBracket.push(...firstRoundUpper);

  // Generate subsequent upper bracket rounds
  let currentUpperMatches = firstRoundMatches / 2;
  let upperRoundNumber = 2;
  
  while (currentUpperMatches >= 1) {
    const upperRoundMatches = [];
    
    for (let i = 0; i < currentUpperMatches; i++) {
      const match = {
        id: generateMatchId(),
        name: `Upper Round ${upperRoundNumber} - Match ${i + 1}`,
        nextMatchId: null,
        nextLooserMatchId: null,
        tournamentRoundText: upperRoundNumber.toString(),
        startTime: null,
        state: "SCHEDULED",
        participants: []
      };
      
      upperRoundMatches.push(match);
    }
    
    // Connect previous upper round to current upper round
    const previousUpperRound = upperBracket.filter(m => 
      parseInt(m.tournamentRoundText) === upperRoundNumber - 1
    );
    
    for (let i = 0; i < previousUpperRound.length; i++) {
      const nextMatchIndex = Math.floor(i / 2);
      previousUpperRound[i].nextMatchId = upperRoundMatches[nextMatchIndex].id;
    }
    
    upperBracket.push(...upperRoundMatches);
    currentUpperMatches /= 2;
    upperRoundNumber++;
  }

  // Generate lower bracket
  let lowerRoundNumber = 1;
  
  // First lower round - losers from first upper round play each other
  const firstLowerRoundMatches = firstRoundMatches / 2;
  const firstLowerRound = [];
  
  for (let i = 0; i < firstLowerRoundMatches; i++) {
    const match = {
      id: generateMatchId(),
      name: `Lower Round ${lowerRoundNumber} - Match ${i + 1}`,
      nextMatchId: null,
      nextLooserMatchId: null,
      tournamentRoundText: lowerRoundNumber.toString(),
      startTime: null,
      state: "SCHEDULED",
      participants: []
    };
    
    firstLowerRound.push(match);
  }
  
  // Connect first upper round losers to first lower round
  const firstUpperRound = upperBracket.filter(m => m.tournamentRoundText === "1");
  for (let i = 0; i < firstUpperRound.length; i++) {
    const lowerMatchIndex = Math.floor(i / 2);
    firstUpperRound[i].nextLooserMatchId = firstLowerRound[lowerMatchIndex].id;
  }
  
  lowerBracket.push(...firstLowerRound);
  lowerRoundNumber++;

  // Generate remaining lower bracket rounds
  let currentLowerMatches = firstLowerRoundMatches;
  
  for (let upperRound = 2; upperRound < upperRoundNumber; upperRound++) {
    const lowerRoundMatches = [];
    const matchesThisRound = currentLowerMatches;
    
    for (let i = 0; i < matchesThisRound; i++) {
      const match = {
        id: generateMatchId(),
        name: `Lower Round ${lowerRoundNumber} - Match ${i + 1}`,
        nextMatchId: null,
        nextLooserMatchId: null,
        tournamentRoundText: lowerRoundNumber.toString(),
        startTime: null,
        state: "SCHEDULED",
        participants: []
      };
      
      lowerRoundMatches.push(match);
    }
    
    // Connect previous lower round winners to current lower round
    const previousLowerRound = lowerBracket.filter(m => 
      parseInt(m.tournamentRoundText) === lowerRoundNumber - 1
    );
    
    for (let i = 0; i < previousLowerRound.length; i++) {
      const nextMatchIndex = Math.floor(i / 2);
      previousLowerRound[i].nextMatchId = lowerRoundMatches[nextMatchIndex].id;
    }
    
    // Connect current upper round losers to current lower round
    const currentUpperRound = upperBracket.filter(m => 
      parseInt(m.tournamentRoundText) === upperRound
    );
    
    for (let i = 0; i < currentUpperRound.length; i++) {
      const lowerMatchIndex = Math.floor(i / 2);
      currentUpperRound[i].nextLooserMatchId = lowerRoundMatches[lowerMatchIndex].id;
    }
    
    lowerBracket.push(...lowerRoundMatches);
    currentLowerMatches = matchesThisRound / 2;
    lowerRoundNumber++;
  }

  // Create final matches
  const upperFinal = upperBracket[upperBracket.length - 1];
  upperFinal.name = "Upper Bracket Final";
  
  const lowerFinal = lowerBracket[lowerBracket.length - 1];
  lowerFinal.name = "Lower Bracket Final";
  lowerFinal.nextMatchId = upperFinal.id; // Winner of lower final goes to grand final

  // Rename the upper final to Grand Final since it will include the lower bracket winner
  upperFinal.name = "Grand Final";

  return {
    upper: upperBracket,
    lower: lowerBracket
  };
}

async function generateSingleBracket(teams) {
  // Helper function to generate unique IDs
  function generateMatchId() {
    return Math.floor(Math.random() * 1000000);
  }

  function generateParticipantId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Validate input
  if (!teams || !Array.isArray(teams) || teams.length < 2) {
    throw new Error('Teams array must contain at least 2 teams');
  }

  // Determine bracket size (next power of 2)
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(teams.length)));
  const totalRounds = Math.log2(bracketSize);
  
  // Create matches array
  const matches = [];
  
  // Generate all rounds
  const rounds = [];
  let currentRoundSize = bracketSize;
  let roundNumber = 1;
  
  // Only generate rounds until we reach 1 match (the final)
  while (currentRoundSize > 1) {
    const roundMatches = [];
    const matchesInRound = currentRoundSize / 2;
    
    for (let i = 0; i < matchesInRound; i++) {
      const isFinalRound = currentRoundSize === 2;
      const matchName = isFinalRound ? 
        `Final - Match` : 
        `Round ${roundNumber} - Match ${i + 1}`;
      
      const tournamentRoundText = isFinalRound ? 
        totalRounds.toString() : 
        roundNumber.toString();
      
      const match = {
        id: generateMatchId(),
        name: matchName,
        nextMatchId: null,
        tournamentRoundText: tournamentRoundText,
        startTime: null,
        state: "SCHEDULED",
        participants: []
      };
      
      // For first round, add teams
      if (roundNumber === 1) {
        const team1Index = i * 2;
        const team2Index = i * 2 + 1;
        
        if (team1Index < teams.length) {
          match.participants.push({
            id: teams[team1Index].id || generateParticipantId(),
            resultText: null,
            isWinner: false,
            status: null,
            name: teams[team1Index].name
          });
        }
        
        if (team2Index < teams.length) {
          match.participants.push({
            id: teams[team2Index].id || generateParticipantId(),
            resultText: null,
            isWinner: false,
            status: null,
            name: teams[team2Index].name
          });
        }
        
        // Handle byes (only one team)
        if (match.participants.length === 1) {
          match.participants[0].resultText = "WALK_OVER";
          match.participants[0].isWinner = true;
          match.participants[0].status = "WALK_OVER";
          match.state = "WALK_OVER";
        } else if (match.participants.length === 0) {
          // Empty match (shouldn't happen but for safety)
          match.state = "NO_PARTY";
        }
      }
      
      roundMatches.push(match);
      matches.push(match);
    }
    
    rounds.push(roundMatches);
    currentRoundSize = matchesInRound; // Set to number of matches for next round
    roundNumber++;
  }
  
  // Connect matches with nextMatchId
  for (let roundIndex = 0; roundIndex < rounds.length - 1; roundIndex++) {
    const currentRound = rounds[roundIndex];
    const nextRound = rounds[roundIndex + 1];
    
    for (let matchIndex = 0; matchIndex < currentRound.length; matchIndex++) {
      const nextMatch = nextRound[Math.floor(matchIndex / 2)];
      currentRound[matchIndex].nextMatchId = nextMatch.id;
    }
  }
  
  // Final match should have nextMatchId: null
  if (rounds.length > 0) {
    const finalRound = rounds[rounds.length - 1];
    if (finalRound.length > 0) {
      finalRound[0].nextMatchId = null;
    }
  }
  
  return matches;
}

class TournamentAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("tournament");
  }

  async delete(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentDeleteDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }

    //dtoIn.id
    const out = await this.dao.remove({ awid, id: dtoIn.id });
    return out;
  }

  async list(awid) {
    return this.dao.list(awid);
  }

  async get(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentGetDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }

    const teamdb = DaoFactory.getDao("team");
    const data = await this.dao.get(awid, dtoIn.id);

    // Resolve team details
    const teams = await Promise.all(
      data.teams.map(async (team) => {
        const t = await teamdb.findOne({ awid, id: team });
        return {
          name: t?.name,
          id: t?.id,
          players: t?.players
        };
      }),
    );

    data.teams = teams;

    return data;
  }

  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentUpdateDtoInType", dtoIn)
    if (!validationResult.isValid()) throw new Error("InvalidDtoIn")

    const tournament = await this.dao.get(awid, dtoIn.id)
    if (!tournament) throw new Error("TournamentNotFound")
    

    if (dtoIn?.status) {
      tournament.status = dtoIn.status

      //  bracketType 'double' 'single'
      if (dtoIn.status === "ongoing") {
        const teams = tournament.teams || []
        if (teams.length < 2) throw new Error("NotEnoughTeams")

        const teamdb = DaoFactory.getDao("team");
        const t = await Promise.all(
          teams.map(team => teamdb.get(awid, team))
        )
        //signle
        if (tournament.bracketType == 'single') {
          const a = await generateSingleBracket(t)
          
          return a;


          // split them, add to db

        }

        
        if (tournament.bracketType == 'double') {
          const a = await generateDoubleBracket(t)
          
          return a

          // split them, add to db

          const upper = a.upper
          const lower = a.lower

          const matchdb = DaoFactory.getDao("match")

          for (const match of upper) {
            await matchdb.create({
              awid,
              ...match,
              tournamentId: tournament.id,
              bracket: "upper",
            })
          }

          for (const match of lower) {
            await matchdb.create({
              awid,
              ...match,
              tournamentId: tournament.id,
              bracket: "lower",
            })
          }
        }



      }
    }

    throw new Error("stop")

    const out = await this.dao.update({ awid, tournament })
    return out
  }


  async create(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentCreateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error(Errors.Create.InvalidDtoIn);
    }
    if (!dtoIn.name) {
      throw new Error(Errors.Create.NameMissing);
    }
    if (!dtoIn.description) {
      throw new Error(Errors.Create.DescriptionMissing);
    }
    if (!dtoIn.startDate) {
      throw new Error(Errors.Create.StartDateMissing);
    }
    if (!dtoIn.endDate) {
      throw new Error(Errors.Create.EndDateMissing);
    }
    if (!dtoIn.status) {
      throw new Error(Errors.Create.StatusMissing);
    }
    if (!dtoIn.teamSize) {
      throw new Error(Errors.Create.TeamSizeMissing);
    }
    if (!dtoIn.teams) {
      throw new Error(Errors.Create.TeamsMissing);
    }
    if (!dtoIn.bracketType) {
      throw new Error(Errors.Create.BracketTypeMissing)
    }

    const tId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const teams = dtoIn.teams.map((team) => {
      return {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name: team,
        players: [],
        tournamentId: tId
      };
    });

    const teamdb = DaoFactory.getDao("team");

    for (const team of teams) {
      await teamdb.create({
        awid,
        ...team,
      });
    }

    dtoIn.teams = teams.map((team) => team.id);
    dtoIn.id = tId;


    console.log("Creating tournament with data:", dtoIn);
    const out = await this.dao.create({
      awid,
      ...dtoIn,
    });
    return out;
  }
}

module.exports = new TournamentAbl();
