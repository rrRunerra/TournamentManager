"use strict";

const RitrMainUseCaseError = require("./ritr-main-use-case-error.js");
const MATCH_ERROR_PREFIX = `${RitrMainUseCaseError.ERROR_PREFIX}match/`;

const Create = {
  UC_CODE: `${MATCH_ERROR_PREFIX}create/`,

};

const List = {
  UC_CODE: `${MATCH_ERROR_PREFIX}list/`,

};

const Update = {
  UC_CODE: `${MATCH_ERROR_PREFIX}update/`,

};

module.exports = {
  Update,
  List,
  Create
};
