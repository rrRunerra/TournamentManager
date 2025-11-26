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

  async get(awid, id, tournamentId) {
    let filter = {
      awid: awid,
      matchId: id,
      tournamentId: tournamentId
    };
    return await super.findOne(filter);
  }

  async getAll(awid, id) {
    let filter = {
      awid: awid,
      tournamentId: id
    };
    return await super.find(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async remove(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.deleteOne(filter);
  }


}

module.exports = MatchMongo;
