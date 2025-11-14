"use strict";

const RitrMainUseCaseError = require("./ritr-main-use-case-error.js");
const TOURNAMENT_ERROR_PREFIX = `${RitrMainUseCaseError.ERROR_PREFIX}tournament/`;

const Create = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
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
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

};

const Get = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

};

const List = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends RitrMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },


};

const Delete = {
  UC_CODE: `${TOURNAMENT_ERROR_PREFIX}delete/`,

};

module.exports = {
  Delete,
  List,
  Get,
  Update,
  Create
};
