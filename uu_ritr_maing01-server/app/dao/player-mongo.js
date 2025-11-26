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

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async getAll(awid) {
    let filter = {
      awid: awid,
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

module.exports = PlayerMongo;
