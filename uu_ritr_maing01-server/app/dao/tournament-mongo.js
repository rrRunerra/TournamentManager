"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TournamentMongo extends UuObjectDao {

  async createSchema() {
    // Primary lookup index
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });

    // Query by status (filter upcoming/ongoing/finished)
    await super.createIndex({ awid: 1, status: 1 });

    // Query by owner
    await super.createIndex({ awid: 1, owner: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async list(awid) {
    let filter = {
      awid: awid,
    };
    return await super.find(filter)
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.tournament.id,
    };

    return await super.findOneAndUpdate(filter, uuObject.tournament, "NONE");
  }

  async remove(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.deleteOne(filter);
  }

}

module.exports = TournamentMongo;
