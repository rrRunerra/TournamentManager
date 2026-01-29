"use strict";

const RitrMainUseCaseError = require("./ritr-main-use-case-error.js");
const PLAYER_ERROR_PREFIX = `${RitrMainUseCaseError.ERROR_PREFIX}player/`;

const Create = {
  UC_CODE: `${PLAYER_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  NameMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}nameMissing`;
      this.message = "Name is missing.";
    }
  },

  PasswordMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}passwordMissing`;
      this.message = "Password is missing.";
    }
  },

  InvalidCredentials: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidCredentials`;
      this.message = "Invalid credentials.";
    }
  },

  UserNotFound: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}userNotFound`;
      this.message = "User not found.";
    }
  },
};

const Update = {
  UC_CODE: `${PLAYER_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Get = {
  UC_CODE: `${PLAYER_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  PlayerNotFound: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}playerNotFound`;
      this.message = "Player not found.";
    }
  },
};

const UpdateStats = {
  UC_CODE: `${PLAYER_ERROR_PREFIX}updateStats/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateStats.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const UpdateMatchStats = {
  UC_CODE: `${PLAYER_ERROR_PREFIX}updateMatchStats/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateMatchStats.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const UpdateFlappyBirdScore = {
  UC_CODE: `${PLAYER_ERROR_PREFIX}updateFlappyBirdScore/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateFlappyBirdScore.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  PlayerNotFound: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateFlappyBirdScore.UC_CODE}playerNotFound`;
      this.message = "Player not found.";
    }
  },
};

const IncrementTournamentsPlayed = {
  UC_CODE: `${PLAYER_ERROR_PREFIX}incrementTournamentsPlayed/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${IncrementTournamentsPlayed.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const BuyProfilePic = {
  UC_CODE: `${PLAYER_ERROR_PREFIX}buyProfilePic/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${BuyProfilePic.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  PlayerNotFound: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${BuyProfilePic.UC_CODE}playerNotFound`;
      this.message = "Player not found.";
    }
  },

  InsufficientCredits: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${BuyProfilePic.UC_CODE}insufficientCredits`;
      this.message = "Insufficient credits.";
    }
  },
};

const List = {
  UC_CODE: `${PLAYER_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

module.exports = {
  BuyProfilePic,
  IncrementTournamentsPlayed,
  UpdateFlappyBirdScore,
  UpdateMatchStats,
  UpdateStats,
  Get,
  Update,
  Create,
  List,
  AuthenticationRequired: RitrMainUseCaseError.AuthenticationRequired,
};
