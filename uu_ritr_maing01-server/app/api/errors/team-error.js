"use strict";

const RitrMainUseCaseError = require("./ritr-main-use-case-error.js");
const TEAM_ERROR_PREFIX = `${RitrMainUseCaseError.ERROR_PREFIX}team/`;

const Create = {
  UC_CODE: `${TEAM_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

};

const Update = {
  UC_CODE: `${TEAM_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

};

const Get = {
  UC_CODE: `${TEAM_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

};

const List = {
  UC_CODE: `${TEAM_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

};

const Remove = {
  UC_CODE: `${TEAM_ERROR_PREFIX}remove/`,

};

module.exports = {
  Remove,
  List,
  Get,
  Update,
  Create
};
