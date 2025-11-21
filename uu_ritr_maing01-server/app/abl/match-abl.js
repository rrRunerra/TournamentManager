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

  async list(awid, dtoIn) {


    if (dtoIn.tournamentId) {
      const out = await this.dao.getAll(awid, dtoIn.tournamentId)

      console.log(out.itemList)
      return out.itemList
    }
  }

  async create(awid, dtoIn) {

  }

}

module.exports = new MatchAbl();
