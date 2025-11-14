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
//       name: 'UB Round 1 - Match 4',  
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

async function generateFullBracket(teams, awid) {
  
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

      if (dtoIn.status === "ongoing") {
        // const teams = tournament.teams || []
        // if (teams.length < 2) throw new Error("NotEnoughTeams")

        // const a = await generateFullBracket(teams, awid)
        
        // const upper = a.upper
        // const lower = a.lower

        // const matchdb = DaoFactory.getDao("match")

        // for (const match of upper) {
        //   await matchdb.create({
        //     awid,
        //     ...match,
        //     tournamentId: tournament.id,
        //     bracket: "upper",
        //   })
        // }

        // for (const match of lower) {
        //   await matchdb.create({
        //     awid,
        //     ...match,
        //     tournamentId: tournament.id,
        //     bracket: "lower",
        //   })
        // }

      }
    }

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
