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

    const userInAnotherTeam = await this.dao.findOne({
      awid,
      tournamentId: dtoIn.tournamentId,
      players: dtoIn.players.id,
    });

    if (userInAnotherTeam?.id && userInAnotherTeam?.id !== dtoIn.id) {
      await Promise.allSettled([
        this.dao.update(
          { awid, id: userInAnotherTeam.id },
          {
            players: userInAnotherTeam.players.filter((p) => p !== dtoIn.players.id),
          },
        ),

        this.dao.update(
          { awid, id: dtoIn.id },
          {
            players: [...team.players, dtoIn.players.id],
          },
        )
      ])
      return 
    }

    const updatedPlayers = [...team.players];

    // add player to team
    if (!updatedPlayers.includes(dtoIn.players.id)) {
      updatedPlayers.push(dtoIn.players.id);
    } else {
      // remove player from team
      const index = updatedPlayers.indexOf(dtoIn.players.id);
      if (index > -1) {
        updatedPlayers.splice(index, 1);
        const u = this.dao.update(
          { awid, id: dtoIn.id },
          {
            players: updatedPlayers,
          },
        );
        return u;
      }

      return;
    }

    if (dtoIn.teamSize && updatedPlayers.length > parseInt(dtoIn.teamSize)) {
      throw new Error("TeamIsFull");
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
