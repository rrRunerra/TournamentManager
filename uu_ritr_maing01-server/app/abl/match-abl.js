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
    console.log(dtoIn)
    //     {
    //   matchId: 246615,
    //   tournamentId: 'w8ndm3fulg7odhm6zd7fi',
    //   participants: [
    //     { id: '1nfmv5ijednr1agyj26r2l', resultText: '5', status: 'PLAYED' },
    //     { id: 'u52cw6x9axznqlntikhl', resultText: '6', status: 'NO_SHOW' }
    //   ]
    // }

    const match = await this.dao.get(awid, dtoIn.matchId, dtoIn.tournamentId)
    console.log(match)
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
