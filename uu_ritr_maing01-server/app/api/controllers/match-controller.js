"use strict";
const MatchAbl = require("../../abl/match-abl.js");

class MatchController {
  update(ucEnv) {
    return MatchAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  list(ucEnv) {
    return MatchAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return MatchAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  setBet(ucEnv) {
    return MatchAbl.addBet(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new MatchController();
