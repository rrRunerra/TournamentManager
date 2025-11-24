"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/player-error.js");
const { Edu } = require("../edu.js")

const WARNINGS = {

};

class PlayerAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("player");
  }

  async get(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerGetDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }
  }

  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerUpdateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }
  }

  async create(awid, dtoIn) {
    const validationResult = this.validator.validate("PlayerCreateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error(Errors.Create.InvalidDtoIn);
    }
    if (!dtoIn.name) {
      throw new Error(Errors.Create.NameMissing);
    }
    if (!dtoIn.password) {
      throw new Error(Errors.Create.PasswordMissing);
    }

    const edu = new Edu(dtoIn.name, dtoIn.password);
    const loginResponse = await edu.login();
    console.log(loginResponse.users[0])
    //     Login Response: {
    //   "users": [
    //     {
    //       "userid": "Student408089",
    //       "typ": "Student",
    //       "edupage": "sps-snina",
    //       "edumeno": ",
    //       "eduheslo": "",
    //       "firstname": ",
    //       "lastname": ",
    //       "esid": "730f0185fca5c5852d19923be345f518",
    //       "appdata": {
    //         "loggedUser": "Student408089",
    //         "loggedChild": 408089,
    //         "loggedUserName": ",
    //         "lang": "sk",
    //         "gender": "M",
    //         "edupage": "sps-snina",
    //         "school_type": "2",
    //         "timezonediff": 0,
    //         "school_country": "sk",
    //         "schoolyear_turnover": "09-01",
    //         "firstDayOfWeek": 1,
    //         "sort_name_col": "LSF",
    //         "selectedYear": 2025,
    //         "autoYear": 2025,
    //         "year_turnover": "2025-09-01",
    //         "vyucovacieDni": [
    //           false,
    //           true,
    //           true,
    //           true,
    //           true,
    //           true,
    //           false
    //         ],
    //         "server": "edupage6",
    //         "syncIntervalMultiplier": 1,
    //         "ascspl": null,
    //         "jePro": false,
    //         "isRestrictedEdupage": false,
    //         "jeZUS": false,
    //         "rtl": false,
    //         "rtlAvailable": false,
    //         "uidsgn": "786c870f85053f4577b879e3d4e32e6232b7122e58e74b8a17692b4f4dcacb0b",
    //         "webpageadmin": false,
    //         "edurequestProps": {
    //           "edupage": "sps-snina",
    //           "lang": "sk",
    //           "school_name": "Stredná priemyselná škola, Partizánska 1059, Snina",
    //           "school_country": "sk",
    //           "school_state": "",
    //           "schoolyear_turnover": "09-01",
    //           "year_auto": 2025,
    //           "year_auto_date": "2025-11-24",
    //           "custom_turnover": [],
    //           "firstDayOfWeek": 1,
    //           "weekendDays": [
    //             0,
    //             6
    //           ],
    //           "timezone": "Europe/Bratislava",
    //           "sort_name_col": "LSF",
    //           "dtFormats": {
    //             "date": "dd.mm.yy",
    //             "time": "24"
    //           },
    //           "jsmodulemode": "bundled",
    //           "loggedUser": "Student408089",
    //           "loggedUserRights": [],
    //           "isAsc": true
    //         },
    //         "gsechash": "161d7c95",
    //         "email": "s",
    //         "isOrbit": false,
    //         "userrights": [],
    //         "isAdult": true
    //       },
    //       "portal_userid": "10581959",
    //       "portal_email": null,
    //       "need2fa": null,
    //       "forceActivate2fa": false
    //     }
    //   ],
    //   "needEdupage": false,
    //   "errmsg": "",
    //   "edid": "V5EDUaxfTUjtjLgaYn0jFt4rmijmD40x779af02514"
    // }



    if (!loginResponse.users || loginResponse.users.length == 0) {
      throw new Error(Errors.Create.UserNotFound);
    }

    const user = {
      id: loginResponse.users[0].userid.replace(/\D+/g, ""),
      name: `${loginResponse.users[0].firstname} ${loginResponse.users[0].lastname}`,
      school: loginResponse.users[0].edupage.toLowerCase(),
      role: loginResponse.users[0].userid?.replace(/\d+/g, "")?.trim()?.toLowerCase() ?? "a"
    }

    const existing = await this.dao.get(awid, user.id)

    if (!existing) {
      const out = await this.dao.create({
        awid,
        id: user.id,
        name: user.name,
        school: user.school,
        role: user.role
      })
    }

    return user

  }

}

module.exports = new PlayerAbl();
