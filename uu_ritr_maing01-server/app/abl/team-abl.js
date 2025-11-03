"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/team-error.js");

const WARNINGS = {};

class TeamAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("team");
  }

  async list(awid) {}

  async get(awid, dtoIn) {
    const validationResult = this.validator.validate("TeamGetDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }

    return this.dao.get(awid, dtoIn.id);
  }

  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("TeamUpdateDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }

    // Get the existing team
    const team = await this.dao.get(awid, dtoIn.id);

    if (!team) {
      throw new Error("TeamNotFound");
    }

    const updatedPlayers = [...team.players];
    if (!updatedPlayers.includes(dtoIn.players.id)) {
      updatedPlayers.push(dtoIn.players.id);
    } else {
      throw new Error("PlayerAlreadyInTeam");
    }

    const updatedTeam = await this.dao.update(
      { awid, id: dtoIn.id },
      {
        name: dtoIn.name || team.name,
        players: updatedPlayers,
        tournamentId: dtoIn.tournamentId || team.tournamentId,
      },
    );

    return updatedTeam;
  }

  async create(awid, dtoIn) {
    const validationResult = this.validator.validate("TeamCreateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }
  }
}

module.exports = new TeamAbl();
