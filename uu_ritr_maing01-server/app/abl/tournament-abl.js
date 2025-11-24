"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/tournament-error.js");

const WARNINGS = {};


async function generateSingleBracket(teams) {
  // Helper function to generate unique IDs
  function generateMatchId() {
    return Math.floor(Math.random() * 1000000);
  }

  function generateParticipantId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Validate input
  if (!teams || !Array.isArray(teams) || teams.length < 2) {
    throw new Error('Teams array must contain at least 2 teams');
  }

  // Create matches array
  const matches = [];

  // First, create all matches we'll need
  let currentTeams = [...teams];
  let roundNumber = 1;

  // We'll store matches by round for easier connection
  const rounds = [];

  while (currentTeams.length > 1) {
    const roundMatches = [];
    const nextRoundTeams = [];

    // Create matches for this round
    for (let i = 0; i < currentTeams.length; i += 2) {
      // Check if we have a team for this position
      const team1 = currentTeams[i];
      const team2 = currentTeams[i + 1];

      // Only create a match if we have at least one team
      if (team1 || team2) {
        const isFinalRound = currentTeams.length <= 2;
        const matchName = isFinalRound ?
          "Final - Match" :
          `Round ${roundNumber} - Match ${roundMatches.length + 1}`;

        const match = {
          id: generateMatchId(),
          name: matchName,
          nextMatchId: null, // Will be set later
          tournamentRoundText: roundNumber.toString(),
          startTime: null,
          state: "SCHEDULED",
          participants: []
        };

        // Add participants
        if (team1) {
          match.participants.push({
            id: team1.id || generateParticipantId(),
            resultText: null,
            isWinner: false,
            status: null,
            name: team1.name
          });
        }

        if (team2) {
          match.participants.push({
            id: team2.id || generateParticipantId(),
            resultText: null,
            isWinner: false,
            status: null,
            name: team2.name
          });
        }

        // Handle byes (only one team)
        if (match.participants.length === 1) {
          match.participants[0].resultText = "WALK_OVER";
          match.participants[0].isWinner = true;
          match.participants[0].status = "WALK_OVER";
          match.state = "WALK_OVER";
        }

        roundMatches.push(match);
        matches.push(match);

        // Track that a winner will come from this match
        nextRoundTeams.push({ type: 'winner', matchId: match.id });
      } else if (i < currentTeams.length) {
        // This handles the case where we have an odd number and need to advance a team
        nextRoundTeams.push(currentTeams[i]);
      }
    }

    rounds.push({
      roundNumber,
      matches: roundMatches,
      nextRoundTeams
    });

    // Prepare teams for next round
    currentTeams = nextRoundTeams;
    roundNumber++;
  }

  // Now connect the matches with nextMatchId
  for (let i = 0; i < rounds.length - 1; i++) {
    const currentRound = rounds[i];
    const nextRound = rounds[i + 1];

    // For each winner reference in current round, connect it to the appropriate match in next round
    let nextMatchIndex = 0;

    for (let j = 0; j < currentRound.nextRoundTeams.length; j += 2) {
      if (nextMatchIndex < nextRound.matches.length) {
        const nextMatch = nextRound.matches[nextMatchIndex];

        // Connect the two winners from current round to this next match
        const team1Ref = currentRound.nextRoundTeams[j];
        const team2Ref = currentRound.nextRoundTeams[j + 1];

        if (team1Ref && team1Ref.type === 'winner') {
          const sourceMatch = currentRound.matches.find(m => m.id === team1Ref.matchId);
          if (sourceMatch) {
            sourceMatch.nextMatchId = nextMatch.id;
          }
        }

        if (team2Ref && team2Ref.type === 'winner') {
          const sourceMatch = currentRound.matches.find(m => m.id === team2Ref.matchId);
          if (sourceMatch) {
            sourceMatch.nextMatchId = nextMatch.id;
          }
        }

        nextMatchIndex++;
      }
    }
  }

  // Ensure final match has no nextMatchId
  if (rounds.length > 0) {
    const finalRound = rounds[rounds.length - 1];
    if (finalRound.matches.length > 0) {
      finalRound.matches[0].nextMatchId = null;
    }
  }

  return matches;
}

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

  async list(awid) {
    return this.dao.list(awid);
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


    console.log("Creating tournament with data:", dtoIn);
    const out = await this.dao.create({
      awid,
      ...dtoIn,
    });
    return out;
  }
}

module.exports = new TournamentAbl();
