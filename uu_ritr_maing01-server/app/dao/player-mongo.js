"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class PlayerMongo extends UuObjectDao {
  async createSchema() {
    // Primary lookup index
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });

    // Query by name (for login/authentication)
    await super.createIndex({ awid: 1, name: 1 });

    // Query by uuIdentity
    await super.createIndex({ awid: 1, uuIdentity: 1 });
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

  async update(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, id: uuObject.id }, uuObject, "NONE");
  }

  async remove({ awid, id }) {
    return await super.deleteOne({ awid, id });
  }
}

module.exports = PlayerMongo;
