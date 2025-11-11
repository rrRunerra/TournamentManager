"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TeamMongo extends UuObjectDao {

  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
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


  async update(filter, updateObject) {
  return await super.findOneAndUpdate(filter, updateObject, "NONE");
}


  async remove(uuObject) {

    return await super.deleteOne(uuObject);
  }

}

module.exports = TeamMongo;
