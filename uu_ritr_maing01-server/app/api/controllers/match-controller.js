"use strict";
const MatchAbl = require("../../abl/match-abl.js");

class MatchController {

  list(ucEnv) {
    return MatchAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return MatchAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new MatchController();
