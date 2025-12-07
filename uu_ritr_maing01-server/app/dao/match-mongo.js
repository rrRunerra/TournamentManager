"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class MatchMongo extends UuObjectDao {
  async createSchema() {
    // Primary lookup index
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });

    // Query by tournament (most common query - getAll)
    await super.createIndex({ awid: 1, tournamentId: 1 });

    // Query by matchId and tournamentId (get specific match)
    await super.createIndex({ awid: 1, matchId: 1, tournamentId: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get({ awid, matchId, tournamentId }) {
    return await super.findOne({ awid, matchId, tournamentId });
  }

  async getNextMatch({ awid, matchId, tournamentId }) {
    return await super.findOne({ awid, matchId, tournamentId });
  }

  async getNextLoserMatch({ awid, matchId, tournamentId }) {
    return await super.findOne({ awid, matchId, tournamentId });
  }

  async getAll({ awid, tournamentId }) {
    return await super.find({ awid, tournamentId });
  }

  async update(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, id: uuObject.id }, uuObject, "NONE");
  }

  async remove({ awid, id }) {
    return await super.deleteOne({ awid, id });
  }
}

module.exports = MatchMongo;
