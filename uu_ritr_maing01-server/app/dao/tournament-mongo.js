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

  async get({ awid, id }) {
    return await super.findOne({ awid, id });
  }

  async list({ awid, status }) {
    const filter = { awid };
    if (status) {
      filter.status = status;
    }
    return await super.find(filter);
  }

  async update({ awid, tournament }) {
    return await super.findOneAndUpdate({ awid, id: tournament.id }, tournament, "NONE");
  }

  async remove({ awid, id }) {
    return await super.deleteOne({ awid, id });
  }
}

module.exports = TournamentMongo;
