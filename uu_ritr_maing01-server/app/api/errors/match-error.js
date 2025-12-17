"use strict";

const RitrMainUseCaseError = require("./ritr-main-use-case-error.js");
const MATCH_ERROR_PREFIX = `${RitrMainUseCaseError.ERROR_PREFIX}match/`;

const Create = {
  UC_CODE: `${MATCH_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const List = {
  UC_CODE: `${MATCH_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TournamentIdMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}tournamentIdMissing`;
      this.message = "Tournament ID is required.";
    }
  },
};

const Update = {
  UC_CODE: `${MATCH_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  MatchNotFound: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}matchNotFound`;
      this.message = "Match not found.";
    }
  },
};

module.exports = {
  Update,
  List,
  Create,
  AddBet: {
    UC_CODE: `${MATCH_ERROR_PREFIX}addBet/`,

    InvalidDtoIn: class extends RitrMainUseCaseError {
      constructor() {
        super(...arguments);
        this.code = `${MATCH_ERROR_PREFIX}addBet/invalidDtoIn`;
        this.message = "DtoIn is not valid.";
      }
    },

    MatchNotFound: class extends RitrMainUseCaseError {
      constructor() {
        super(...arguments);
        this.code = `${MATCH_ERROR_PREFIX}addBet/matchNotFound`;
        this.message = "Match not found.";
      }
    },
  },
};
