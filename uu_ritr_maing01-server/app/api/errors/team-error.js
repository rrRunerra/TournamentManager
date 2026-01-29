"use strict";

const RitrMainUseCaseError = require("./ritr-main-use-case-error.js");
const TEAM_ERROR_PREFIX = `${RitrMainUseCaseError.ERROR_PREFIX}team/`;

const Create = {
  UC_CODE: `${TEAM_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Update = {
  UC_CODE: `${TEAM_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TeamNotFound: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}teamNotFound`;
      this.message = "Team not found.";
    }
  },

  TeamIsFull: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}teamIsFull`;
      this.message = "Team is full.";
    }
  },
};

const Get = {
  UC_CODE: `${TEAM_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const List = {
  UC_CODE: `${TEAM_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Remove = {
  UC_CODE: `${TEAM_ERROR_PREFIX}remove/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const RemovePlayer = {
  UC_CODE: `${TEAM_ERROR_PREFIX}removePlayer/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemovePlayer.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TeamNotFound: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemovePlayer.UC_CODE}teamNotFound`;
      this.message = "Team not found.";
    }
  },
};

module.exports = {
  RemovePlayer,
  Remove,
  List,
  Get,
  Update,
  Create,
  AuthenticationRequired: RitrMainUseCaseError.AuthenticationRequired,
};
