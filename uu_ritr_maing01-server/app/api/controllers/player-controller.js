"use strict";
const PlayerAbl = require("../../abl/player-abl.js");

class PlayerController {
  get(ucEnv) {
    return PlayerAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  update(ucEnv) {
    return PlayerAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return PlayerAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  updatePlayerStats(ucEnv) {
    return PlayerAbl.updatePlayerStats(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  updateMatchStats(ucEnv) {
    return PlayerAbl.updateMatchStats(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  updateFlappyBirdScore(ucEnv) {
    return PlayerAbl.updateFlappyBirdScore(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  incrementTournamentsPlayed(ucEnv) {
    return PlayerAbl.incrementTournamentsPlayed(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  addCredits(ucEnv) {
    return PlayerAbl.addCredits(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  removeCredits(ucEnv) {
    return PlayerAbl.removeCredits(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new PlayerController();
