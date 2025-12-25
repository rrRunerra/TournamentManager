"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/player-error.js");
const { Edu } = require("../edu.js");

const WARNINGS = {};

const CREDITS = {
  finals_firstPlace: 500,
  finals_secondPlace: 250,
  finals_thirdPlace: 100,
  finals_fourthPlace: 50,
  matchPlayed: 10,
};

/**
 * @typedef {Object} PlayerStats
 * @property {number} finals_firstPlace - Number of first place finishes
 * @property {number} finals_secondPlace - Number of second place finishes
 * @property {number} finals_thirdPlace - Number of third place finishes
 * @property {number} finals_fourthPlace - Number of fourth place finishes
 * @property {number} matchesWon - Total matches won
 * @property {number} matchesLost - Total matches lost
 * @property {number} tournamentsPlayed - Total tournaments participated in
 * @property {number} flappyBirdHighScore - Highest score in Flappy Bird minigame
 */

/**
 * @typedef {Object} Player
 * @property {string} id - Player ID (derived from Edupage user ID)
 * @property {string} name - Player full name
 * @property {string} school - School identifier (e.g., "sps-snina")
 * @property {"student"|"teacher"} role - Player role
 * @property {string} awid - Application workspace ID
 * @property {PlayerStats} stats - Player statistics
 * @property {{cts: string, mts: string, rev: number}} sys - System metadata
 */

/**
 * Application Business Logic for Player operations.
 * Handles player creation via Edupage authentication, stats management,
 * and various game-related score updates.
 */
class PlayerAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("player");
  }

  /**
   * Retrieves a player by ID.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string}} dtoIn - Player ID
   * @returns {Promise<Player>} Player data with stats
   */
  async get(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerGetDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Get.InvalidDtoIn();
    }

    const out = await this.dao.get({ awid, id: dtoIn.id });
    return out;
  }

  /**
   * Updates player information.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string, school?: string}} dtoIn - Update data
   * @returns {Promise<Player>} Updated player
   */
  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerUpdateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Update.InvalidDtoIn();
    }
  }

  /**
   * Creates a new player by authenticating with Edupage.
   * If the player already exists, returns the existing player.
   *
   * @param {string} awid - Application workspace ID
   * @param {{name: string, password: string}} dtoIn - Edupage login credentials
   * @returns {Promise<{id: string, name: string, school: string, role: string}>} Created/existing player
   * @throws {Error} If credentials are invalid or user not found
   */
  async create(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerCreateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Create.InvalidDtoIn();
    }
    if (!dtoIn.name) {
      throw new Errors.Create.NameMissing();
    }
    if (!dtoIn.password) {
      throw new Errors.Create.PasswordMissing();
    }

    const edu = new Edu(dtoIn.name, dtoIn.password);
    const loginResponse = await edu.login();
    const schoolData = await edu.getSchoolData();

    if (!loginResponse.users || loginResponse.users.length == 0) {
      throw new Errors.Create.UserNotFound();
    }

    const user = {
      id: loginResponse.users[0].userid.replace(/\D+/g, ""),
      name: `${loginResponse.users[0].firstname} ${loginResponse.users[0].lastname}`,
      school: loginResponse.users[0].edupage.toLowerCase(),
      role: loginResponse.users[0].userid?.replace(/\d+/g, "")?.trim()?.toLowerCase() ?? "a",
      class: schoolData.class,
      classes: schoolData.classes,
      classRooms: schoolData.classRooms,
    };

    const existing = await this.dao.get({ awid, id: user.id });

    if (existing) {
      user.profilePicture = existing.profilePicture;
    }

    if (!existing) {
      const out = await this.dao.create({
        awid,
        id: user.id,
        name: user.name,
        school: user.school,
        role: user.role,
        class: schoolData.class,
        classes: schoolData.classes,
        stats: {
          finals_firstPlace: 0,
          finals_secondPlace: 0,
          finals_thirdPlace: 0,
          finals_fourthPlace: 0,
          matchesLost: 0,
          tournamentsPlayed: 0,
          flappyBirdHighScore: 0,
        },
        profilePicture: null,
        credits: 1000,
      });
    }

    return user;
  }

  /**
   * Updates finals placement stats for players in the winning/losing teams.
   *
   * @param {string} awid - Application workspace ID
   * @param {{
   *   tournamentId: string,
   *   finalsFirstPlaceParticipantId: string|null,
   *   finalsSecondPlaceParticipantId: string|null,
   *   finalsThirdPlaceParticipantId: string|null,
   *   finalsFourthPlaceParticipantId: string|null
   * }} dtoIn - Finals placement data
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async updatePlayerStats(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerUpdateStatsDtoInType", dtoIn);
    console.log("UPDAING USER");

    if (!validationResult.isValid()) {
      throw new Errors.UpdateStats.InvalidDtoIn();
    }

    console.log(dtoIn);
    //     {
    //   tournamentId: 'rsmqy3e1e0h246boknzjky',
    //   finalsFirstPlaceParticipantId: '8ijppe8mlynf5io5xuqbv',
    //   finalsSecondPlaceParticipantId: 'o835td8d8vim1yggoivvf',
    //   finalsThirdPlaceParticipantId: null,
    //   finalsFourthPlaceParticipantId: null
    // }
    // Get team DAO
    const teamDao = DaoFactory.getDao("team");

    // Helper function to update stats for a team's players
    const updateTeamPlayerStats = async (participantId, statField) => {
      if (!participantId) return;

      const team = await teamDao.get({ awid, id: participantId });
      if (!team || !team.players) return;

      for (const playerId of team.players) {
        // Fetch the full player object
        const playerObj = await this.dao.get({ awid, id: playerId });
        if (!playerObj) continue;

        // Initialize stats if they don't exist
        const currentStats = playerObj.stats || {
          finals_firstPlace: 0,
          finals_secondPlace: 0,
          finals_thirdPlace: 0,
          finals_fourthPlace: 0,
          matchesWon: 0,
          matchesLost: 0,
          tournamentsPlayed: 0,
          flappyBirdHighScore: 0,
        };

        // Update with incremented stat

        await this.dao.update({
          awid,
          id: playerId,
          ...playerObj,
          stats: {
            ...currentStats,
            [statField]: currentStats[statField] + 1,
          },
          credits: playerObj.credits + CREDITS[statField],
        });
        console.log(`Updated ${statField} for player ${playerId}`);
      }
    };

    // Update stats for each placement
    await updateTeamPlayerStats(dtoIn.finalsFirstPlaceParticipantId, "finals_firstPlace");
    await updateTeamPlayerStats(dtoIn.finalsSecondPlaceParticipantId, "finals_secondPlace");
    await updateTeamPlayerStats(dtoIn.finalsThirdPlaceParticipantId, "finals_thirdPlace");
    await updateTeamPlayerStats(dtoIn.finalsFourthPlaceParticipantId, "finals_fourthPlace");

    return { success: true, message: "Player stats updated successfully" };
  }

  /**
   * Updates match win/loss stats for all players in a team.
   *
   * @param {string} awid - Application workspace ID
   * @param {{
   *   participantId: string,
   *   won: boolean
   * }} dtoIn - Match result data
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async updateMatchStats(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerUpdateMatchStatsDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.UpdateMatchStats.InvalidDtoIn();
    }

    // Get team DAO to find all players in the team
    const teamDao = DaoFactory.getDao("team");
    const team = await teamDao.get({ awid, id: dtoIn.participantId });

    if (!team || !team.players) return { success: true, message: "No players found" };

    const statField = dtoIn.won ? "matchesWon" : "matchesLost";

    for (const playerId of team.players) {
      const playerObj = await this.dao.get({ awid, id: playerId });
      if (!playerObj) continue;

      const currentStats = playerObj.stats || {
        finals_firstPlace: 0,
        finals_secondPlace: 0,
        finals_thirdPlace: 0,
        finals_fourthPlace: 0,
        matchesWon: 0,
        matchesLost: 0,
        tournamentsPlayed: 0,
        flappyBirdHighScore: 0,
      };

      await this.dao.update({
        awid,
        id: playerId,
        ...playerObj,
        stats: {
          ...currentStats,
          [statField]: currentStats[statField] + 1,
        },
      });
    }

    return { success: true, message: "Match stats updated successfully" };
  }

  /**
   * Updates the Flappy Bird high score for a player.
   * Only updates if the new score is higher than the current high score.
   *
   * @param {string} awid - Application workspace ID
   * @param {{
   *   playerId: string,
   *   score: number
   * }} dtoIn - Score data
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async updateFlappyBirdScore(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerUpdateFlappyBirdScoreDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.UpdateFlappyBirdScore.InvalidDtoIn();
    }

    const playerObj = await this.dao.get({ awid, id: dtoIn.playerId });
    if (!playerObj) {
      throw new Errors.UpdateFlappyBirdScore.PlayerNotFound();
    }

    const currentStats = playerObj.stats || {
      finals_firstPlace: 0,
      finals_secondPlace: 0,
      finals_thirdPlace: 0,
      finals_fourthPlace: 0,
      matchesWon: 0,
      matchesLost: 0,
      tournamentsPlayed: 0,
      flappyBirdHighScore: 0,
    };

    // Only update if new score is higher
    if (dtoIn.score > currentStats.flappyBirdHighScore) {
      await this.dao.update({
        awid,
        id: dtoIn.playerId,
        ...playerObj,
        stats: {
          ...currentStats,
          flappyBirdHighScore: dtoIn.score,
        },
      });
    }

    return { success: true, message: "Flappy Bird score updated successfully" };
  }

  /**
   * Increments the tournamentsPlayed counter for all players in a tournament.
   * Called when a tournament is finished.
   *
   * @param {string} awid - Application workspace ID
   * @param {{tournamentId: string}} dtoIn - Tournament ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async incrementTournamentsPlayed(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerIncrementTournamentsPlayedDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.IncrementTournamentsPlayed.InvalidDtoIn();
    }

    // Get team DAO to iterate through all teams in tournament
    const teamDao = DaoFactory.getDao("team");
    const tournamentDao = DaoFactory.getDao("tournament");

    const tournament = await tournamentDao.get({ awid, id: dtoIn.tournamentId });
    if (!tournament || !tournament.teams) return { success: true, message: "No teams found" };

    // Increment tournamentsPlayed for all players in all teams
    console.log("Incrementing tournamentsPlayed for all players in all teams");
    for (const teamId of tournament.teams) {
      const team = await teamDao.get({ awid, id: teamId });
      if (!team || !team.players) continue;

      for (const playerId of team.players) {
        const playerObj = await this.dao.get({ awid, id: playerId });
        if (!playerObj) continue;
        console.log("Incrementing tournamentsPlayed for player " + playerId);
        const currentStats = playerObj.stats || {
          finals_firstPlace: 0,
          finals_secondPlace: 0,
          finals_thirdPlace: 0,
          finals_fourthPlace: 0,
          matchesWon: 0,
          matchesLost: 0,
          tournamentsPlayed: 0,
          flappyBirdHighScore: 0,
        };

        await this.dao.update({
          awid,
          id: playerId,
          ...playerObj,
          stats: {
            ...currentStats,
            tournamentsPlayed: currentStats.tournamentsPlayed + 1,
          },
          credits: playerObj.credits + CREDITS.matchPlayed,
        });
      }
    }

    return { success: true, message: "Tournaments played updated successfully" };
  }

  /**
   * Adds credits to a player.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string, amount: number}} dtoIn - Player ID and amount to add
   * @returns {Promise<{success: boolean, credits: number}>}
   */
  async addCredits(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerAddCreditsDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Update.InvalidDtoIn();
    }

    const player = await this.dao.get({ awid, id: dtoIn.id });
    if (!player) {
      throw new Errors.Get.PlayerNotFound();
    }

    const currentCredits = player.credits || 0;
    const newCredits = currentCredits + dtoIn.amount;

    await this.dao.update({
      awid,
      id: dtoIn.id,
      ...player,
      credits: newCredits,
    });

    return { success: true, credits: newCredits };
  }

  /**
   * Removes credits from a player.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string, amount: number}} dtoIn - Player ID and amount to remove
   * @returns {Promise<{success: boolean, credits: number}>}
   */
  async removeCredits(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerRemoveCreditsDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Update.InvalidDtoIn();
    }

    const player = await this.dao.get({ awid, id: dtoIn.id });
    if (!player) {
      throw new Errors.Get.PlayerNotFound();
    }

    const currentCredits = player.credits || 0;
    if (currentCredits < dtoIn.amount) {
      throw new Error("Insufficient credits");
    }

    const newCredits = currentCredits - dtoIn.amount;

    await this.dao.update({
      awid,
      id: dtoIn.id,
      ...player,
      credits: newCredits,
    });

    return { success: true, credits: newCredits };
  }

  /**
   * Updates the profile picture of a player.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string, profilePicture: string}} dtoIn - Player ID and profile picture filename
   * @returns {Promise<{success: boolean, profilePicture: string}>}
   */
  async updateProfilePicture(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerUpdateProfilePictureDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.Update.InvalidDtoIn();
    }

    const player = await this.dao.get({ awid, id: dtoIn.id });
    if (!player) {
      throw new Errors.Get.PlayerNotFound();
    }

    await this.dao.update({
      awid,
      id: dtoIn.id,
      ...player,
      profilePicture: dtoIn.profilePicture,
    });

    return { success: true, profilePicture: dtoIn.profilePicture };
  }

  /**
   * Buys a profile picture for a player.
   *
   * @param {string} awid - Application workspace ID
   * @param {{id: string, profilePicUrl: string, price: number}} dtoIn - Player ID, picture URL and price
   * @returns {Promise<{success: boolean, credits: number, ownedProfilePics: string[]}>}
   */
  async buyProfilePic(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerBuyProfilePicDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Errors.BuyProfilePic.InvalidDtoIn();
    }

    const player = await this.dao.get({ awid, id: dtoIn.id });
    if (!player) {
      throw new Errors.BuyProfilePic.PlayerNotFound();
    }

    if (player.credits < dtoIn.price) {
      throw new Errors.BuyProfilePic.InsufficientCredits();
    }

    const ownedProfilePics = player.ownedProfilePics || [];
    if (!ownedProfilePics.includes(dtoIn.profilePicUrl)) {
      ownedProfilePics.push(dtoIn.profilePicUrl);
    }

    const newCredits = player.credits - dtoIn.price;

    await this.dao.update({
      awid,
      id: dtoIn.id,
      ...player,
      credits: newCredits,
      ownedProfilePics: ownedProfilePics,
    });

    return { success: true, credits: newCredits, ownedProfilePics: ownedProfilePics };
  }
}

module.exports = new PlayerAbl();
