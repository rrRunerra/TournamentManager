"use strict";

const RitrMainUseCaseError = require("./ritr-main-use-case-error.js");
const TOURNAMENT_ERROR_PREFIX = `${RitrMainUseCaseError.ERROR_PREFIX}tournament/`;

const Create = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}create/`,

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

  DescriptionMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}descriptionMissing`;
      this.message = "Description is missing.";
    }
  },

  StartDateMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}startDateMissing`;
      this.message = "Start date is missing.";
    }
  },

  EndDateMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}endDateMissing`;
      this.message = "End date is missing.";
    }
  },

  StatusMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}statusMissing`;
      this.message = "Status is missing.";
    }
  },

  TeamSizeMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}teamSizeMissing`;
      this.message = "Team size is missing.";
    }
  },

  TeamsMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}teamsMissing`;
      this.message = "Teams are missing.";
    }
  },

  BracketTypeMissing: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}bracketTypeMissing`;
      this.message = "Bracket type is missing.";
    }
  },
};

const Update = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TournamentNotFound: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}tournamentNotFound`;
      this.message = "Tournament not found.";
    }
  },

  NotEnoughTeams: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}notEnoughTeams`;
      this.message = "At least 2 teams are required to start a tournament.";
    }
  },
};

const Get = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const List = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const ListByUser = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}listByUser/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ListByUser.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Delete = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}delete/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

module.exports = {
  Delete,
  ListByUser,
  List,
  Get,
  Update,
  Update,
  Create,
  AddBet: {
    UC_CODE: `${TOURNAMENT_ERROR_PREFIX}addBet/`,

    InvalidDtoIn: class extends RitrMainUseCaseError {
      constructor() {
        super(...arguments);
        this.code = `${TOURNAMENT_ERROR_PREFIX}addBet/invalidDtoIn`;
        this.message = "DtoIn is not valid.";
      }
    },

    TournamentNotFound: class extends RitrMainUseCaseError {
      constructor() {
        super(...arguments);
        this.code = `${TOURNAMENT_ERROR_PREFIX}addBet/tournamentNotFound`;
        this.message = "Tournament not found.";
      }
    },
  },
};
