"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/tournament-error.js");
const generateSingleBracket = require("./brackets/generate-single-bracket.js");
const generateDoubleBracket = require("./brackets/generate-double-bracket.js");
const generateRoundRobin = require("./brackets/generate-round-robin.js");

const WARNINGS = {};

/**
 * @typedef {"upcoming"|"ongoing"|"finished"} TournamentStatus
 */

/**
 * @typedef {"single"|"double"|"robin"} BracketType
 */

/**
 * @typedef {Object} Tournament
 * @property {string} id - Tournament ID
 * @property {string} awid - Application workspace ID
 * @property {string} name - Tournament name
 * @property {string} description - Tournament description
 * @property {string} startDate - Start date (ISO string)
 * @property {string} endDate - End date (ISO string)
 * @property {string} teamSize - Number of players per team
 * @property {TournamentStatus} status - Tournament status
 * @property {string[]} teams - Array of team IDs
 * @property {string} owner - Owner player ID
 * @property {BracketType} bracketType - Type of bracket
 * @property {{cts: string, mts: string, rev: number}} sys - System metadata
 */

/**
 * @typedef {Object} TournamentListResponse
 * @property {Tournament[]} itemList - Array of tournaments
 * @property {number} total - Total count
 * @property {boolean} hasMore - Whether more items exist
 */

/**
 * Application Business Logic for Tournament operations.
 * Handles tournament creation, listing, updates, and bracket generation.
 */
class TournamentAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("tournament");
  }

  /**
   * Deletes a tournament and all associated teams and matches.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string}} dtoIn - Tournament ID
   * @returns {Promise<void>}
   */
  async delete(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentDeleteDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Delete.InvalidDtoIn();
    }

    const tournament = await this.dao.get({ awid, id: dtoIn.id });
    if (!tournament) {
      // If tournament doesn't exist, we can just return or throw.
      // Returning null or similar to indicate it's already gone or not found.
      // But for now, let's proceed to try to remove it (maybe it was partially deleted?)
      // Actually, if we want to delete teams, we need the tournament object.
      // If it's not found, we can't delete teams, so we might as well just try to delete the tournament ID (idempotent)
    }

    if (tournament) {
      if (tournament.teams) {
        const teamdb = DaoFactory.getDao("team");
        for (const teamId of tournament.teams) {
          try {
            await teamdb.remove({ awid, id: teamId });
          } catch (e) {
            console.error(`Failed to delete team ${teamId}`, e);
          }
        }
      }

      // Delete matches
      const matchdb = DaoFactory.getDao("match");
      try {
        const matches = await matchdb.getAll({ awid, tournamentId: dtoIn.id });
        const matchList = matches.itemList || matches;
        for (const match of matchList) {
          await matchdb.remove({ awid, id: match.id });
        }
      } catch (e) {
        console.error(`Failed to delete matches for tournament ${dtoIn.id}`, e);
      }
    }

    //dtoIn.id
    const out = await this.dao.remove({ awid, id: dtoIn.id });
    return out;
  }

  /**
   * Lists tournaments with optional filtering and pagination.
   *
   * @param {string} awid - Application workspace ID
   * @param {{
   *   limit?: number,
   *   skip?: number,
   *   status?: TournamentStatus|TournamentStatus[],
   *   year?: number,
   *   month?: number,
   *   search?: string
   * }} [dtoIn={}] - Filter options
   * @returns {Promise<TournamentListResponse>}
   */
  async list(awid, dtoIn = {}) {
    const limit = parseInt(dtoIn.limit) || 1000;
    const skip = parseInt(dtoIn.skip) || 0;

    let allTournaments = await this.dao.list({ awid });
    let itemList = allTournaments.itemList || allTournaments;

    // Sort by startDate to ensure stable pagination (newest first)
    itemList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // Filter by status if provided
    if (dtoIn.status) {
      const statuses = Array.isArray(dtoIn.status) ? dtoIn.status : [dtoIn.status];
      itemList = itemList.filter((t) => statuses.includes(t.status));
    }

    // Filter by Year and Month (based on endDate as per frontend logic)
    if (dtoIn.year) {
      itemList = itemList.filter((t) => new Date(t.endDate).getFullYear() === parseInt(dtoIn.year));
    }
    if (dtoIn.month) {
      itemList = itemList.filter((t) => new Date(t.endDate).getMonth() + 1 === parseInt(dtoIn.month));
    }

    // Filter by Name (Search)
    if (dtoIn.search) {
      const query = dtoIn.search.toLowerCase();
      itemList = itemList.filter((t) => t.name.toLowerCase().includes(query));
    }

    // Apply pagination
    const paginatedItems = itemList.slice(skip, skip + limit);
    const hasMore = skip + limit < itemList?.length;

    return {
      itemList: paginatedItems,
      total: itemList.length,
      hasMore,
    };
  }

  /**
   * Lists finished tournaments that a user has participated in.
   *
   * @param {string} awid - Application workspace ID
   * @param {{
   *   userId: string,
   *   limit?: number
   * }} dtoIn - User filter
   * @returns {Promise<{itemList: (Tournament & {teamName: string})[], total: number}>}
   */
  async listByUser(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentListByUserDtoInType", dtoIn);
    console.log(dtoIn);
    if (!validationResult.isValid()) {
      throw new Errors.ListByUser.InvalidDtoIn();
    }

    const limit = dtoIn.limit || 3;
    const userId = dtoIn.userId;

    let allTournaments = await this.dao.list({ awid, status: "finished" });

    let itemList = allTournaments.itemList || allTournaments;

    // Sort by endDate descending (newest first)
    itemList.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

    const userTournaments = [];
    const teamdb = DaoFactory.getDao("team");

    const teamNames = [];

    for (const tournament of itemList) {
      if (userTournaments.length >= limit) break;

      if (tournament.teams) {
        // We need to check if ANY of the teams contains the user.
        const teams = await Promise.all(tournament.teams.map((teamId) => teamdb.get({ awid, id: teamId })));

        const isUserInTournament = teams.some((team) => team && team.players && team.players.includes(userId));

        if (isUserInTournament) {
          tournament.teamName = teams.find((team) => team && team.players && team.players.includes(userId))?.name;
          userTournaments.push(tournament);
        }
      }
    }

    return {
      itemList: userTournaments,
      total: userTournaments.length,
    };
  }

  /**
   * Gets a tournament by ID with resolved team details.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string}} dtoIn - Tournament ID
   * @returns {Promise<Tournament & {teams: {id: string, name: string, players: string[]}[]}>}
   */
  async get(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentGetDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Get.InvalidDtoIn();
    }

    const teamdb = DaoFactory.getDao("team");
    const data = await this.dao.get({ awid, id: dtoIn.id });

    // Resolve team details
    const teams = await Promise.all(
      data.teams.map(async (team) => {
        const t = await teamdb.get({ awid, id: team });
        return {
          name: t?.name,
          id: t?.id,
          players: t?.players,
        };
      }),
    );

    data.teams = teams;

    return data;
  }

  /**
   * Updates a tournament status.
   * When changing to "ongoing", generates brackets based on bracketType.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string, status?: TournamentStatus}} dtoIn - Update data
   * @returns {Promise<Tournament>} Updated tournament
   * @throws {Error} If not enough teams or tournament not found
   */
  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentUpdateDtoInType", dtoIn);
    if (!validationResult.isValid()) throw new Errors.Update.InvalidDtoIn();

    const tournament = await this.dao.get({ awid, id: dtoIn.id });
    if (!tournament) throw new Errors.Update.TournamentNotFound();

    if (dtoIn?.status) {
      tournament.status = dtoIn.status;

      //  bracketType 'double' 'single'
      if (dtoIn.status === "ongoing") {
        const teams = tournament.teams || [];
        if (teams.length < 2) throw new Errors.Update.NotEnoughTeams();

        const teamdb = DaoFactory.getDao("team");
        const t = await Promise.all(teams.map((team) => teamdb.get({ awid, id: team })));
        //signle
        if (tournament.bracketType == "single") {
          const a = await generateSingleBracket(t);

          const matchdb = DaoFactory.getDao("match");

          for (const match of a) {
            await matchdb.create({
              awid,
              matchId: match.id, // Use MongoDB's _id field
              name: match.name,
              nextMatchId: match.nextMatchId,
              nextLooserMatchId: match.nextLooserMatchId,
              tournamentRoundText: match.tournamentRoundText,
              startTime: match.startTime,
              state: match.state,
              participants: match.participants,
              tournamentId: tournament.id,
            });
          }
        }

        if (tournament.bracketType == "double") {
          const a = await generateDoubleBracket(t);
          const upper = a.upper;
          const lower = a.lower;

          const matchdb = DaoFactory.getDao("match");

          for (const match of upper) {
            await matchdb.create({
              awid,
              matchId: match.id, // Use MongoDB's _id field
              name: match.name,
              nextMatchId: match.nextMatchId,
              nextLooserMatchId: match.nextLooserMatchId,
              tournamentRoundText: match.tournamentRoundText,
              startTime: match.startTime,
              state: match.state,
              participants: match.participants,
              tournamentId: tournament.id,
              bracket: "upper",
            });
          }

          for (const match of lower) {
            await matchdb.create({
              awid,
              matchId: match.id, // Use MongoDB's _id field
              name: match.name,
              nextMatchId: match.nextMatchId,
              nextLooserMatchId: match.nextLooserMatchId,
              tournamentRoundText: match.tournamentRoundText,
              startTime: match.startTime,
              state: match.state,
              participants: match.participants,
              tournamentId: tournament.id,
              bracket: "lower",
            });
          }
        }

        if (tournament.bracketType == "robin") {
          const a = await generateRoundRobin(t);
          const matchdb = DaoFactory.getDao("match");

          for (const match of a) {
            await matchdb.create({
              awid,
              matchId: match.id, // Use MongoDB's _id field
              name: match.name,
              nextMatchId: match.nextMatchId,
              nextLooserMatchId: match.nextLooserMatchId,
              tournamentRoundText: match.tournamentRoundText,
              startTime: match.startTime,
              state: match.state,
              participants: match.participants,
              tournamentId: tournament.id,
            });
          }
        }
      }
    }

    const out = await this.dao.update({ awid, tournament });
    return out;
  }

  /**
   * Creates a new tournament with teams.
   *
   * @param {string} awid - Application workspace ID
   * @param {{
   *   name: string,
   *   description: string,
   *   startDate: string,
   *   endDate: string,
   *   teamSize: string,
   *   status: "upcoming",
   *   teams: string[],
   *   owner: string,
   *   bracketType: BracketType
   * }} dtoIn - Tournament creation data
   * @returns {Promise<Tournament>} Created tournament
   */
  async create(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentCreateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Create.InvalidDtoIn();
    }
    if (!dtoIn.name) {
      throw new Errors.Create.NameMissing();
    }
    if (!dtoIn.description) {
      throw new Errors.Create.DescriptionMissing();
    }
    if (!dtoIn.startDate) {
      throw new Errors.Create.StartDateMissing();
    }
    if (!dtoIn.endDate) {
      throw new Errors.Create.EndDateMissing();
    }
    if (!dtoIn.status) {
      throw new Errors.Create.StatusMissing();
    }
    if (!dtoIn.teamSize) {
      throw new Errors.Create.TeamSizeMissing();
    }
    if (!dtoIn.teams) {
      throw new Errors.Create.TeamsMissing();
    }
    if (!dtoIn.bracketType) {
      throw new Errors.Create.BracketTypeMissing();
    }

    const tId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const teams = dtoIn.teams.map((team) => {
      return {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name: team,
        players: [],
        tournamentId: tId,
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

    const out = await this.dao.create({
      awid,
      ...dtoIn,
    });
    return out;
  }
}

module.exports = new TournamentAbl();

// UNCOMMENT THE LINES BELOW TO GENERATE 27 TEST TOURNAMENTS (RUN ONCE THEN COMMENT OUT AGAIN)

// const { generateTestTournaments } = require("./generate-test-tournaments.js");
// const awid = "22222222222222222222222222222222";
// generateTestTournaments(module.exports, awid).catch(console.error);
