"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TeamMongo extends UuObjectDao {
  async createSchema() {
    // Primary lookup index
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });

    // Query by tournament
    await super.createIndex({ awid: 1, tournamentId: 1 });

    // Query by player in tournament
    await super.createIndex({ awid: 1, tournamentId: 1, players: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get({ awid, id }) {
    return await super.findOne({ awid, id });
  }

  async getAll({ awid }) {
    return await super.find({ awid });
  }

  async findByPlayerInTournament({ awid, tournamentId, playerId }) {
    return await super.findOne({ awid, tournamentId, players: playerId });
  }

  async update({ awid, id }, updateObject) {
    return await super.findOneAndUpdate({ awid, id }, updateObject, "NONE");
  }

  async remove({ awid, id }) {
    return await super.deleteOne({ awid, id });
  }
}

module.exports = TeamMongo;
