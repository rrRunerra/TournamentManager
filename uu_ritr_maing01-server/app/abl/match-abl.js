"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/match-error.js");

const WARNINGS = {

};

class MatchAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("match");
  }

  async update(awid, dtoIn) {
    //     {
    //   matchId: 246615,
    //   tournamentId: 'w8ndm3fulg7odhm6zd7fi',
    //   participants: [
    //     { id: '1nfmv5ijednr1agyj26r2l', resultText: '5', status: 'PLAYED' },
    //     { id: 'u52cw6x9axznqlntikhl', resultText: '6', status: 'NO_SHOW' }
    //   ]
    // }

    const match = await this.dao.get(awid, dtoIn.matchId, dtoIn.tournamentId)

    //     {
    //   awid: '22222222222222222222222222222222',
    //   matchId: 246615,
    //   name: 'Upper Round 1 - Match 3',
    //   nextMatchId: 560472,
    //   nextLooserMatchId: 783396,
    //   tournamentRoundText: '1',
    //   startTime: null,
    //   state: 'SCHEDULED',
    //   participants: [
    //     {
    //       id: '1nfmv5ijednr1agyj26r2l',
    //       resultText: null,
    //       isWinner: false,
    //       status: null,
    //       name: '五番'
    //     },
    //     {
    //       id: 'u52cw6x9axznqlntikhl',
    //       resultText: null,
    //       isWinner: false,
    //       status: null,
    //       name: '六番'
    //     }
    //   ],
    //   tournamentId: 'w8ndm3fulg7odhm6zd7fi',
    //   bracket: 'upper',
    //   sys: {
    //     cts: 2025-11-22T18:23:11.428Z,
    //     mts: 2025-11-22T18:23:11.428Z,
    //     rev: 0
    //   },
    //   id: 6921ff8fac2b9978e794d9d8
    // }

    match.participants = dtoIn.participants
    await this.dao.update(match)

    // Propagate winner and loser
    const winner = dtoIn.participants.find(p => p.isWinner);
    const loser = dtoIn.participants.find(p => !p.isWinner && p.id); // Ensure loser has an ID (not empty slot)

    // console.log("Propagating match result:");
    // console.log("Winner:", winner);
    // console.log("Loser:", loser);
    // console.log("Next Match ID:", match.nextMatchId);
    // console.log("Next Loser Match ID:", match.nextLooserMatchId);
    // console.log(match)

    if (winner && match.nextMatchId) {
      try {
        const nextMatch = await this.dao.get(awid, match.nextMatchId, dtoIn.tournamentId);
        // console.log("Found next match:", nextMatch ? nextMatch.id : "null");
        if (nextMatch) {
          // Add winner to next match participants if not already there
          const isAlreadyIn = nextMatch.participants.some(p => p.id === winner.id);
          if (!isAlreadyIn) {
            // Find first empty slot or push if less than 2
            if (nextMatch.participants.length < 2) {
              nextMatch.participants.push({
                id: winner.id,
                resultText: null,
                isWinner: false,
                status: null,
                name: winner.name
              });
              console.log("Adding winner to next match");
            } else {
              console.log("Next match full, cannot add winner");
            }
            await this.dao.update(nextMatch);
          } else {
            console.log("Winner already in next match");
          }
        }
      } catch (e) {
        console.error("Error propagating winner:", e);
      }
    }

    if (loser && match.nextLooserMatchId) {
      try {
        const nextLooserMatch = await this.dao.get(awid, match.nextLooserMatchId, dtoIn.tournamentId);
        console.log(nextLooserMatch)
        console.log("Found next loser match:", nextLooserMatch ? nextLooserMatch.id : "null");
        if (nextLooserMatch) {
          const isAlreadyIn = nextLooserMatch.participants.some(p => p.id === loser.id);
          if (!isAlreadyIn) {
            if (nextLooserMatch.participants.length < 2) {
              nextLooserMatch.participants.push({
                id: loser.id,
                resultText: null,
                isWinner: false,
                status: null,
                name: loser.name
              });
              console.log("Adding loser to next loser match");
              await this.dao.update(nextLooserMatch);
            } else {
              console.log("Next loser match full, cannot add loser");
            }
          } else {
            console.log("Loser already in next loser match");
          }
        }
      } catch (e) {
        console.error("Error propagating loser:", e);
      }
    }

  }

  async list(awid, dtoIn) {


    if (dtoIn.tournamentId) {
      const out = await this.dao.getAll(awid, dtoIn.tournamentId)
      return out.itemList
    }
  }

  async create(awid, dtoIn) {

  }

}

module.exports = new MatchAbl();
