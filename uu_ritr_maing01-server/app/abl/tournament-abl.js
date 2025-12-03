"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/tournament-error.js");
const generateSingleBracket = require("./brackets/generate-single-bracket.js");
const generateDoubleBracket = require("./brackets/generate-double-bracket.js");
const generateRoundRobin = require("./brackets/generate-round-robin.js");

const WARNINGS = {};

class TournamentAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("tournament");
  }

  async delete(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentDeleteDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }

    const tournament = await this.dao.get(awid, dtoIn.id);
    if (!tournament) {
      // If tournament doesn't exist, we can just return or throw. 
      // Returning null or similar to indicate it's already gone or not found.
      // But for now, let's proceed to try to remove it (maybe it was partially deleted?)
      // Actually, if we want to delete teams, we need the tournament object.
      // If it's not found, we can't delete teams, so we might as well just try to delete the tournament ID (idempotent)
    }

    if (tournament) {
      if (tournament.teams) {
        const teamdb = DaoFactory.getDao("team");
        for (const teamId of tournament.teams) {
          try {
            await teamdb.remove({ awid, id: teamId });
          } catch (e) {
            console.error(`Failed to delete team ${teamId}`, e);
          }
        }
      }

      // Delete matches
      const matchdb = DaoFactory.getDao("match");
      try {
        const matches = await matchdb.getAll(awid, dtoIn.id);
        const matchList = matches.itemList || matches;
        for (const match of matchList) {
          await matchdb.remove({ awid, id: match.id });
        }
      } catch (e) {
        console.error(`Failed to delete matches for tournament ${dtoIn.id}`, e);
      }
    }

    //dtoIn.id
    const out = await this.dao.remove({ awid, id: dtoIn.id });
    return out;
  }

  async list(awid, dtoIn = {}) {
    const limit = parseInt(dtoIn.limit) || 1000;
    const skip = parseInt(dtoIn.skip) || 0;


    let allTournaments = await this.dao.list(awid);
    let itemList = allTournaments.itemList || allTournaments;

    // Sort by startDate to ensure stable pagination (newest first)
    itemList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // Filter by status if provided
    if (dtoIn.status) {
      const statuses = Array.isArray(dtoIn.status) ? dtoIn.status : [dtoIn.status];
      itemList = itemList.filter(t => statuses.includes(t.status));
    }

    // Filter by Year and Month (based on endDate as per frontend logic)
    if (dtoIn.year) {
      itemList = itemList.filter(t => new Date(t.endDate).getFullYear() === parseInt(dtoIn.year));
    }
    if (dtoIn.month) {
      itemList = itemList.filter(t => new Date(t.endDate).getMonth() + 1 === parseInt(dtoIn.month));
    }

    // Filter by Name (Search)
    if (dtoIn.search) {
      const query = dtoIn.search.toLowerCase();
      itemList = itemList.filter(t => t.name.toLowerCase().includes(query));
    }

    // Apply pagination
    const paginatedItems = itemList.slice(skip, skip + limit);
    const hasMore = skip + limit < itemList?.length;

    return {
      itemList: paginatedItems,
      total: itemList.length,
      hasMore
    };
  }

  async listByUser(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentListByUserDtoInType", dtoIn);
    console.log(dtoIn)
    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }

    const limit = dtoIn.limit || 3;
    const userId = dtoIn.userId;

    // 1. Fetch finished tournaments
    // Ideally we would filter by status "finished" in the DB query
    // But since we need to filter by team players which is inside an array of IDs, 
    // and we need to resolve teams to check players... this is heavy.
    // However, the user request snippet showed fetching "finished" tournaments.
    // Let's optimize by fetching only finished tournaments first.

    // NOTE: In a real large-scale app, we should have a reverse index or a "userTournaments" collection.
    // For now, we follow the logic: fetch finished -> resolve teams -> filter by user.

    let allTournaments = await this.dao.list(awid); // This fetches all. We should probably filter by status if DAO supports it, but DAO list usually just returns all or paginated.
    // The existing list method does in-memory filtering. Let's do the same but try to be efficient.

    let itemList = allTournaments.itemList || allTournaments;

    // Filter for finished only
    itemList = itemList.filter(t => t.status === "finished");

    // Sort by endDate descending (newest first)
    itemList.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

    const userTournaments = [];
    const teamdb = DaoFactory.getDao("team");

    // We iterate and resolve teams until we find enough tournaments or run out.
    // This is better than resolving ALL tournaments' teams.

    for (const tournament of itemList) {
      if (userTournaments.length >= limit) break;

      if (tournament.teams) {
        // We need to check if ANY of the teams contains the user.
        // We can resolve teams one by one or all at once for this tournament.
        // Let's resolve all for this tournament to check.
        const teams = await Promise.all(
          tournament.teams.map(teamId => teamdb.get(awid, teamId))
        );

        const isUserInTournament = teams.some(team => team && team.players && team.players.includes(userId));

        if (isUserInTournament) {
          // We don't need to return full team details for this list, usually just the tournament info is enough.
          // But if the frontend expects the same structure as `get` or `list`, we might want to keep it simple.
          // The snippet just used `userTournaments` to `setLastTournaments`.
          // Let's return the tournament object.
          userTournaments.push(tournament);
        }
      }
    }

    return {
      itemList: userTournaments,
      total: userTournaments.length
    };
  }

  async get(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentGetDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error("InvalidDtoIn");
    }

    const teamdb = DaoFactory.getDao("team");
    const data = await this.dao.get(awid, dtoIn.id);

    // Resolve team details
    const teams = await Promise.all(
      data.teams.map(async (team) => {
        const t = await teamdb.findOne({ awid, id: team });
        return {
          name: t?.name,
          id: t?.id,
          players: t?.players
        };
      }),
    );

    data.teams = teams;

    return data;
  }

  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentUpdateDtoInType", dtoIn)
    if (!validationResult.isValid()) throw new Error("InvalidDtoIn")

    const tournament = await this.dao.get(awid, dtoIn.id)
    if (!tournament) throw new Error("TournamentNotFound")


    if (dtoIn?.status) {
      tournament.status = dtoIn.status

      //  bracketType 'double' 'single'
      if (dtoIn.status === "ongoing") {
        const teams = tournament.teams || []
        if (teams.length < 2) throw new Error("NotEnoughTeams")

        const teamdb = DaoFactory.getDao("team");
        const t = await Promise.all(
          teams.map(team => teamdb.get(awid, team))
        )
        //signle
        if (tournament.bracketType == 'single') {
          const a = await generateSingleBracket(t)

          const matchdb = DaoFactory.getDao("match")

          for (const match of a) {
            await matchdb.create({
              awid,
              matchId: match.id, // Use MongoDB's _id field
              name: match.name,
              nextMatchId: match.nextMatchId,
              nextLooserMatchId: match.nextLooserMatchId,
              tournamentRoundText: match.tournamentRoundText,
              startTime: match.startTime,
              state: match.state,
              participants: match.participants,
              tournamentId: tournament.id,
            })
          }

        }


        if (tournament.bracketType == 'double') {
          const a = await generateDoubleBracket(t)
          const upper = a.upper
          const lower = a.lower

          const matchdb = DaoFactory.getDao("match")


          for (const match of upper) {
            await matchdb.create({
              awid,
              matchId: match.id, // Use MongoDB's _id field
              name: match.name,
              nextMatchId: match.nextMatchId,
              nextLooserMatchId: match.nextLooserMatchId,
              tournamentRoundText: match.tournamentRoundText,
              startTime: match.startTime,
              state: match.state,
              participants: match.participants,
              tournamentId: tournament.id,
              bracket: "upper",
            })
          }


          for (const match of lower) {
            await matchdb.create({
              awid,
              matchId: match.id, // Use MongoDB's _id field
              name: match.name,
              nextMatchId: match.nextMatchId,
              nextLooserMatchId: match.nextLooserMatchId,
              tournamentRoundText: match.tournamentRoundText,
              startTime: match.startTime,
              state: match.state,
              participants: match.participants,
              tournamentId: tournament.id,
              bracket: "lower",
            })
          }
        }

        if (tournament.bracketType == "robin") {
          const a = await generateRoundRobin(t)
          const matchdb = DaoFactory.getDao("match")

          for (const match of a) {
            await matchdb.create({
              awid,
              matchId: match.id, // Use MongoDB's _id field
              name: match.name,
              nextMatchId: match.nextMatchId,
              nextLooserMatchId: match.nextLooserMatchId,
              tournamentRoundText: match.tournamentRoundText,
              startTime: match.startTime,
              state: match.state,
              participants: match.participants,
              tournamentId: tournament.id,
            })
          }
        }



      }
    }

    const out = await this.dao.update({ awid, tournament })
    return out
  }


  async create(awid, dtoIn) {
    const validationResult = this.validator.validate("TournamentCreateDtoInType", dtoIn);

    if (!validationResult.isValid()) {
      throw new Error(Errors.Create.InvalidDtoIn);
    }
    if (!dtoIn.name) {
      throw new Error(Errors.Create.NameMissing);
    }
    if (!dtoIn.description) {
      throw new Error(Errors.Create.DescriptionMissing);
    }
    if (!dtoIn.startDate) {
      throw new Error(Errors.Create.StartDateMissing);
    }
    if (!dtoIn.endDate) {
      throw new Error(Errors.Create.EndDateMissing);
    }
    if (!dtoIn.status) {
      throw new Error(Errors.Create.StatusMissing);
    }
    if (!dtoIn.teamSize) {
      throw new Error(Errors.Create.TeamSizeMissing);
    }
    if (!dtoIn.teams) {
      throw new Error(Errors.Create.TeamsMissing);
    }
    if (!dtoIn.bracketType) {
      throw new Error(Errors.Create.BracketTypeMissing)
    }

    const tId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const teams = dtoIn.teams.map((team) => {
      return {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name: team,
        players: [],
        tournamentId: tId
      };
    });

    const teamdb = DaoFactory.getDao("team");

    for (const team of teams) {
      await teamdb.create({
        awid,
        ...team,
      });
    }

    dtoIn.teams = teams.map((team) => team.id);
    dtoIn.id = tId;


    const out = await this.dao.create({
      awid,
      ...dtoIn,
    });
    return out;
  }
}

module.exports = new TournamentAbl();

// UNCOMMENT THE LINES BELOW TO GENERATE 27 TEST TOURNAMENTS (RUN ONCE THEN COMMENT OUT AGAIN)

// const { generateTestTournaments } = require("./generate-test-tournaments.js");
// const awid = "22222222222222222222222222222222";
// generateTestTournaments(module.exports, awid).catch(console.error);
