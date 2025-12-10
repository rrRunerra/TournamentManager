"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/team-error.js");

const WARNINGS = {};

/**
 * @typedef {Object} Team
 * @property {string} id - Team ID
 * @property {string} name - Team name
 * @property {string[]} players - Array of player IDs
 * @property {string} tournamentId - Tournament ID this team belongs to
 * @property {string} awid - Application workspace ID
 * @property {{cts: string, mts: string, rev: number}} sys - System metadata
 */

/**
 * Application Business Logic for Team operations.
 * Handles team management, player joining/leaving, and team removal.
 */
class TeamAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("team");
  }

  /**
   * Removes a team from a tournament.
   * Also removes the team reference from the tournament's teams array.
   *
   * @param {string} awid - Application workspace ID
   * @param {{tournamentId: string, teamId: string}} dtoIn - Team removal data
   * @returns {Promise<void>}
   */
  async remove(awid, dtoIn) {
    const validationResult = this.validator.validate("TeamRemoveDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Remove.InvalidDtoIn();
    }

    // dtoIn.tournamentId
    // dtoIn.teamId

    const tournament = await DaoFactory.getDao("tournament").get({ awid, id: dtoIn.tournamentId });

    tournament.teams = tournament.teams.filter((team) => team !== dtoIn.teamId);

    const o = await DaoFactory.getDao("tournament").update({ awid, tournament });

    const out = await this.dao.remove({ awid, tournamentId: dtoIn.tournamentId, id: dtoIn.teamId });
    return out;
  }

  /**
   * Lists all teams.
   *
   * @param {string} awid - Application workspace ID
   * @returns {Promise<Team[]>} Array of teams
   */
  async list(awid) {}

  /**
   * Gets a team by ID.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string}} dtoIn - Team ID
   * @returns {Promise<Team>} Team data
   */
  async get(awid, dtoIn) {
    const validationResult = this.validator.validate("TeamGetDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Get.InvalidDtoIn();
    }

    return this.dao.get({ awid, id: dtoIn.id });
  }

  /**
   * Updates a team (join/leave team functionality).
   * Handles player joining, leaving, and switching teams.
   *
   * @param {string} awid - Application workspace ID
   * @param {{
   *   tournamentId: string,
   *   id: string,
   *   players: {id: string},
   *   teamSize?: string
   * }} dtoIn - Team update data
   * @returns {Promise<Team>} Updated team
   * @throws {Error} If team is full or not found
   */
  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("TeamUpdateDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new Errors.Update.InvalidDtoIn();
    }

    // Get the existing team
    const team = await this.dao.get({ awid, id: dtoIn.id });

    if (!team) {
      throw new Errors.Update.TeamNotFound();
    }

    const userInAnotherTeam = await this.dao.findByPlayerInTournament({
      awid,
      tournamentId: dtoIn.tournamentId,
      playerId: dtoIn.players.id,
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
        ),
      ]);
      return;
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
      throw new Errors.Update.TeamIsFull();
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

  /**
   * Removes a player from a team.
   *
   * @param {string} awid - Application workspace ID
   * @param {{teamId: string, playerId: string}} dtoIn - Data to remove player
   * @returns {Promise<Team>} Updated team
   */
  async removePlayer(awid, dtoIn) {
    const validationResult = this.validator.validate("TeamRemovePlayerDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new Errors.RemovePlayer.InvalidDtoIn();
    }

    const team = await this.dao.get({ awid, id: dtoIn.teamId });
    if (!team) {
      throw new Errors.RemovePlayer.TeamNotFound();
    }

    const updatedPlayers = team.players.filter((playerId) => playerId !== dtoIn.playerId);

    const updatedTeam = await this.dao.update(
      { awid, id: dtoIn.teamId },
      {
        players: updatedPlayers,
      },
    );

    return updatedTeam;
  }

  async create(awid, dtoIn) {
    const validationResult = this.validator.validate("TeamCreateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Create.InvalidDtoIn();
    }
  }
}

module.exports = new TeamAbl();
