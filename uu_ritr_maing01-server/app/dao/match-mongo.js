"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class MatchMongo extends UuObjectDao {

  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
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
