"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/tournament-error.js");

const WARNINGS = {};

class TournamentAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("tournament");
  }

  async list(awid) {
    return this.dao.list(awid);
  }

  async get(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentGetDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }
    const out = await this.dao.get(awid, dtoIn.id);

    return out;
  }

  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentUpdateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }
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

    const teams  = dtoIn.teams.map((team) => {
      return {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name: team
      }
    })

    const teamdb = DaoFactory.getDao("team");
    
    for (const team of teams) {
      await teamdb.create({
        awid,
        ...team
      })
    }




    dtoIn.teams = teams.map(team => team.id);
  
    console.log("Creating tournament with data:", dtoIn);
    const out = await this.dao.create({
      awid,
      ...dtoIn
    })
    return out;
  }
}

module.exports = new TournamentAbl();
