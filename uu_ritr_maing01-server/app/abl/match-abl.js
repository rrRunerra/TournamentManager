"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/match-error.js");

const WARNINGS = {};

/**
 * @typedef {Object} Participant
 * @property {string} id - Team ID
 * @property {string|null} resultText - Score text
 * @property {boolean} isWinner - Whether this participant won
 * @property {string|null} status - Match status (e.g., "PLAYED", "NO_SHOW")
 * @property {string} name - Team name
 */

/**
 * @typedef {Object} Match
 * @property {string} awid - Application workspace ID
 * @property {number} matchId - Match identifier
 * @property {string} name - Match name (e.g., "Upper Round 1 - Match 3")
 * @property {number|null} nextMatchId - ID of the next match for winner
 * @property {number|null} nextLooserMatchId - ID of the next match for loser (double elimination)
 * @property {string} tournamentRoundText - Round number as string
 * @property {string|null} startTime - Match start time
 * @property {string} state - Match state (e.g., "SCHEDULED")
 * @property {Participant[]} participants - Array of match participants
 * @property {string} tournamentId - Tournament ID
 * @property {string} [bracket] - Bracket type ("upper" or "lower") for double elimination
 * @property {{cts: string, mts: string, rev: number}} sys - System metadata
 * @property {string} id - MongoDB document ID
 */

/**
 * Application Business Logic for Match operations.
 * Handles match updates, score tracking, and bracket progression.
 */
class MatchAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("match");
  }

  /**
   * Updates a match score and propagates winner/loser to next matches.
   *
   * @param {string} awid - Application workspace ID
   * @param {{
   *   matchId: number,
   *   tournamentId: string,
   *   participants: {
   *     id: string,
   *     resultText: string,
   *     status: string|null,
   *     isWinner: boolean,
   *     name: string
   *   }[]
   * }} dtoIn - Match update data
   * @returns {Promise<void>}
   * @throws {Errors.Update.InvalidDtoIn} If dtoIn is invalid
   * @throws {Errors.Update.MatchNotFound} If match not found
   */
  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("MatchUpdateDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new Errors.Update.InvalidDtoIn();
    }

    const match = await this.dao.get({ awid, matchId: dtoIn.matchId, tournamentId: dtoIn.tournamentId });
    if (!match) {
      throw new Errors.Update.MatchNotFound();
    }

    match.participants = dtoIn.participants;
    await this.dao.update(match);

    // Propagate winner and loser
    const winner = dtoIn.participants.find((p) => p.isWinner);
    const loser = dtoIn.participants.find((p) => !p.isWinner && p.id);

    if (winner && match.nextMatchId) {
      try {
        const nextMatch = await this.dao.getNextMatch({
          awid,
          matchId: match.nextMatchId,
          tournamentId: dtoIn.tournamentId,
        });
        if (nextMatch) {
          const isAlreadyIn = nextMatch.participants.some((p) => p.id === winner.id);
          if (!isAlreadyIn) {
            if (nextMatch.participants.length < 2) {
              nextMatch.participants.push({
                id: winner.id,
                resultText: null,
                isWinner: false,
                status: null,
                name: winner.name,
              });
            }
            await this.dao.update(nextMatch);
          }
        }
      } catch (e) {
        console.error("Error propagating winner:", e);
      }
    }

    if (loser && match.nextLooserMatchId) {
      try {
        const nextLooserMatch = await this.dao.getNextLoserMatch({
          awid,
          matchId: match.nextLooserMatchId,
          tournamentId: dtoIn.tournamentId,
        });
        if (nextLooserMatch) {
          const isAlreadyIn = nextLooserMatch.participants.some((p) => p.id === loser.id);
          if (!isAlreadyIn) {
            if (nextLooserMatch.participants.length < 2) {
              nextLooserMatch.participants.push({
                id: loser.id,
                resultText: null,
                isWinner: false,
                status: null,
                name: loser.name,
              });
              await this.dao.update(nextLooserMatch);
            }
          }
        }
      } catch (e) {
        console.error("Error propagating loser:", e);
      }
    }
  }

  /**
   * Lists all matches for a tournament.
   *
   * @param {string} awid - Application workspace ID
   * @param {{tournamentId: string}} dtoIn - Tournament filter
   * @returns {Promise<Match[]>} Array of matches
   * @throws {Errors.List.InvalidDtoIn} If dtoIn is invalid
   */
  async list(awid, dtoIn) {
    const validationResult = this.validator.validate("MatchListDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new Errors.List.InvalidDtoIn();
    }

    if (!dtoIn.tournamentId) {
      throw new Errors.List.TournamentIdMissing();
    }

    const out = await this.dao.getAll({ awid, tournamentId: dtoIn.tournamentId });
    return out.itemList;
  }

  /**
   * Creates a new match.
   *
   * @param {string} awid - Application workspace ID
   * @param {Object} dtoIn - Match creation data
   * @returns {Promise<Match>} Created match
   * @throws {Errors.Create.InvalidDtoIn} If dtoIn is invalid
   */
  async create(awid, dtoIn) {
    const validationResult = this.validator.validate("MatchCreateDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new Errors.Create.InvalidDtoIn();
    }

    return await this.dao.create({ awid, ...dtoIn });
  }

  /**
   * Adds a bet to a match.
   *
   * @param {string} awid - Application workspace ID
   * @param {Object} dtoIn - Bet data
   * @returns {Promise<Match>} Updated match
   * @throws {Errors.AddBet.InvalidDtoIn} If dtoIn is invalid
   * @throws {Errors.AddBet.MatchNotFound} If match not found
   */
  async addBet(awid, dtoIn) {
    const validationResult = this.validator.validate("MatchAddBetDtoInType", dtoIn);
    if (!validationResult.isValid()) {
      throw new Errors.AddBet.InvalidDtoIn();
    }

    const match = await this.dao.get({ awid, matchId: dtoIn.matchId, tournamentId: dtoIn.tournamentId });
    if (!match) {
      throw new Errors.AddBet.MatchNotFound();
    }

    if (!match.bets) {
      match.bets = [];
    }

    match.bets.push({
      userId: dtoIn.userId,
      teamId: dtoIn.teamId,
      bet: dtoIn.bet,
      betAmount: dtoIn.betAmount,
      timestamp: new Date().toISOString(),
    });

    return await this.dao.update(match);
  }
}

module.exports = new MatchAbl();
