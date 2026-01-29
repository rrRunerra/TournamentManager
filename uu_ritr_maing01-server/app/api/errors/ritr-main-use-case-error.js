"use strict";
const { UseCaseError } = require("uu_appg01_server").AppServer;

class RitrMainUseCaseError extends UseCaseError {
  static get ERROR_PREFIX() {
    return "uu-ritr-main/";
  }

  constructor(dtoOut, paramMap = {}, cause = null, status = 400) {
    if (paramMap instanceof Error) {
      cause = paramMap;
      paramMap = {};
    }
    super({ dtoOut, paramMap, status }, cause);
  }
}

RitrMainUseCaseError.AuthenticationRequired = class extends RitrMainUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${RitrMainUseCaseError.ERROR_PREFIX}authenticatedRequired`;
    this.message = "User is not authenticated.";
    this.status = 401;
  }
};

module.exports = RitrMainUseCaseError;
