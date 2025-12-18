import { Environment } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";

// NOTE During frontend development it's possible to redirect uuApp command calls elsewhere, e.g. to production/staging
// backend, by configuring it in *-hi/env/development.json:
//   "uu5Environment": {
//     c
//   }
//Environment.appBaseUri = "http://localhost:8080/uu-ritr-maing01/22222222222222222222222222222222";

const Calls = {
  async call(method, url, dtoIn, clientOptions) {
    const response = await Plus4U5.Utils.AppClient[method](url, dtoIn, clientOptions);
    return response.data;
  },

  // // example for mock calls
  // loadDemoContent(dtoIn) {
  //   const commandUri = Calls.getCommandUri("loadDemoContent");
  //   return Calls.call("get", commandUri, dtoIn);
  // },

  loadIdentityProfiles() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
    return Calls.call("deleteTournamentget", commandUri);
  },

  initWorkspace(dtoInData) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
    return Calls.call("post", commandUri, dtoInData);
  },

  getWorkspace() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
    return Calls.call("get", commandUri);
  },

  async initAndGetWorkspace(dtoInData) {
    await Calls.initWorkspace(dtoInData);
    return await Calls.getWorkspace();
  },

  getCommandUri(useCase, baseUri = Environment.appBaseUri) {
    return (!baseUri.endsWith("/") ? baseUri + "/" : baseUri) + (useCase.startsWith("/") ? useCase.slice(1) : useCase);
  },

  player: {
    /**
     * Creates a player.
     *
     * @param {{ name: string, password: string }} dtoIn
     * @returns {Promise<{
     *   id: string,
     *   name: string,
     *   school: string,
     *   role: "student" | "teacher",
     *   awid: string
     * }>}
     */
    create(dtoIn) {
      const commandUri = Calls.getCommandUri("player/create");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{id: string, school?: string}} dtoIn
     * @returns {Promise<{
     *   id: string,
     *   name: string,
     *   school: string,
     *   role: "student" | "teacher",
     *   awid: string,
     *   stats: {
     *     finals_firstPlace: number,
     *     finals_secondPlace: number,
     *     finals_thirdPlace: number,
     *     finals_fourthPlace: number,
     *     matchesWon: number,
     *     matchesLost: number,
     *     tournamentsPlayed: number,
     *     flappyBirdHighScore: number
     *   },
     *   sys: {
     *     cts: string,
     *     mts: string,
     *     rev: number
     *   }
     * }>}
     */
    get(dtoIn) {
      const commandUri = Calls.getCommandUri("player/get");
      return Calls.call("get", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   tournamentId: string,
     *   finalsFirstPlaceParticipantId: string | null,
     *   finalsSecondPlaceParticipantId: string | null,
     *   finalsThirdPlaceParticipantId: string | null,
     *   finalsFourthPlaceParticipantId: string | null
     * }} dtoIn
     * @returns {Promise<{success: boolean, message: string}>}
     */
    updateStats(dtoIn) {
      const commandUri = Calls.getCommandUri("player/updateStats");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   participantId: string,
     *   won: boolean,
     *   tournamentId: string
     * }} dtoIn
     * @returns {Promise<{success: boolean, message: string}>}
     */

    updateMatchStat(dtoIn) {
      const commandUri = Calls.getCommandUri("player/updateMatchStats");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   tournamentId: string,
     * }} dtoIn
     * @returns {Promise<{success: boolean, message: string}>}
     */

    incrementTournamentPlayedCount(dtoIn) {
      const commandUri = Calls.getCommandUri("player/incrementTournamentsPlayed");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   playerId: string,
     *   score: number
     * }} dtoIn
     * @returns {Promise<{success: boolean, message: string}>}
     */

    updateFlappyScore(dtoIn) {
      const commandUri = Calls.getCommandUri("player/updateFlappyBirdScore");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   id: string,
     *   amount: number
     * }} dtoIn
     * @returns {Promise<{success: boolean, credits: number}>}
     */
    addCredits(dtoIn) {
      const commandUri = Calls.getCommandUri("player/addCredits");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   id: string,
     *   amount: number
     * }} dtoIn
     * @returns {Promise<{success: boolean, credits: number}>}
     */
    removeCredits(dtoIn) {
      const commandUri = Calls.getCommandUri("player/removeCredits");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   id: string,
     *   profilePicture: string
     * }} dtoIn
     * @returns {Promise<{success: boolean, profilePicture: string}>}
     */
    updateProfilePicture(dtoIn) {
      const commandUri = Calls.getCommandUri("player/updateProfilePicture");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   id: string,
     *   profilePicUrl: string,
     *   price: number
     * }} dtoIn
     * @returns {Promise<{success: boolean, credits: number, ownedProfilePics: string[]}>}
     */
    buyProfilePic(dtoIn) {
      const commandUri = Calls.getCommandUri("player/buyProfilePic");
      return Calls.call("post", commandUri, dtoIn);
    },
  },

  tournament: {
    /**
     *
     * @param {{
     *   page: number,
     *   pageSize: number,
     *   status: "finished" | "ongoing" | "upcoming",
     *   year?: number,
     *   month?: number,
     *   search?: string
     * }} dtoIn
     * @returns {Promise<{
     * itemList: {
     *   awid: string,
     *   name: string,
     *   description: string,
     *   startDate: string,
     *   endDate: string,
     *   teamSize: string,
     *   status: "upcoming" | "ongoing" | "finished",
     *   teams: string[],
     *   owner: string,
     *   bracketType: string,
     *   sys: {cts: string, mts: string, rev: number},
     *   id: string
     * }[],
     * total: number,
     * hasMore: boolean
     * }>}
     */
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("tournament/list");
      return Calls.call("get", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   userId: string,
     *   status: "finished" | "ongoing" | "upcoming",
     *   limit: number,
     * }} dtoIn
     * @returns {Promise<{
     *   itemList: {
     *     awid: string,
     *     name: string,
     *     description: string,
     *     startDate: string,
     *     endDate: string,
     *     teamSize: string,
     *     status: "upcoming" | "ongoing" | "finished",
     *     teams: string[],
     *     owner: string,
     *     bracketType: string,
     *     sys: {cts: string, mts: string, rev: number},
     *     id: string,
     *     teamName: string
     *   }[],
     *   total: number,
     * }>}
     */
    listUserTournaments(dtoIn) {
      const commandUri = Calls.getCommandUri("tournament/listByUser");
      return Calls.call("get", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   id: string
     * }} dtoIn
     * @returns {Promise<{
     *   awid: string,
     *   name: string,
     *   description: string,
     *   startDate: string,
     *   endDate: string,
     *   teamSize: string,
     *   status: "upcoming" | "ongoing" | "finished",
     *   teams: string[],
     *   owner: string,
     *   bracketType: string,
     *   sys: {cts: string, mts: string, rev: number},
     *   id: string
     * }}
     */
    get(dtoIn) {
      const commandUri = Calls.getCommandUri("tournament/get");
      return Calls.call("get", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   name: string,
     *   description: string,
     *   startDate: string,
     *   endDate: string,
     *   teamSize: string,
     *   status: "upcoming",
     *   teams: string[],
     *   owner: string,
     *   bracketType: string
     * }} dtoIn
     * @returns {Promise<{
     *   awid: string,
     *   name: string,
     *   description: string,
     *   startDate: string,
     *   endDate: string,
     *   teamSize: string,
     *   status: "upcoming",
     *   teams: string[],
     *   owner: string,
     *   bracketType: string,
     *   sys: {cts: string, mts: string, rev: number},
     *   id: string
     * }>}
     */

    create(dtoIn) {
      const commandUri = Calls.getCommandUri("tournament/create");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   id: string
     * }} dtoIn
     * @returns {Promise<void>}
     */
    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("tournament/delete");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *   id: string,
     *   status: "upcoming" | "ongoing" | "finished"
     * }} dtoIn
     * @returns {Promise<{
     *  awid: string,
     *  name: string,
     *  description: string,
     *  startDate: string,
     *  endDate: string,
     *  teamSize: string,
     *  status: "upcoming" | "ongoing" | "finished",
     *  teams: string[],
     *  owner: string,
     *  bracketType: string,
     *  sys: {cts: string, mts: string, rev: number},
     *  id: string
     * }>}
     */
    updateStatus(dtoIn) {
      const commandUri = Calls.getCommandUri("tournament/update");
      return Calls.call("post", commandUri, dtoIn);
    },
  },

  team: {
    /**
     *
     * @param {{
     *   tournamentId: string,
     *   id: string,
     *   players: { id: string }[],
     *   teamSize: string
     * }} dtoIn
     * @returns {Promise<{
     *   awid: string,
     *   name: string,
     *   players: string[],
     *   tournamentId: string,
     *   sys: {cts: string, mts: string, rev: number},
     *   id: string
     * }>}
     */
    join(dtoIn) {
      const commandUri = Calls.getCommandUri("team/update");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *  tournamentId: string,
     *  teamId: string
     * }} dtoIn
     * @returns {Promise<void>}
     */
    remove(dtoIn) {
      const commandUri = Calls.getCommandUri("team/remove");
      return Calls.call("post", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *  teamId: string,
     *  playerId: string
     * }} dtoIn
     * @returns {Promise<void>}
     */
    removePlayer(dtoIn) {
      const commandUri = Calls.getCommandUri("team/removePlayer");
      return Calls.call("post", commandUri, dtoIn);
    },
  },

  match: {
    /**
     *
     * @param {{
     *  tournamentId: string
     * }} dtoIn
     * @returns {Promise<{
     *   awid: string,
     *   matchId: number,
     *   name: string,
     *   nextMatchId: number,
     *   nextLooserMatchId: number,
     *   tournamentRoundText: string,
     *   startTime: string,
     *   state: string,
     *   participants: {
     *     id: string,
     *     resultText: string,
     *     isWinner: boolean,
     *     status: string,
     *     name: string
     *   }[],
     *   tournamentId: string,
     *   sys: {cts: string, mts: string, rev: number},
     *   id: string
     * }[]>}
     */

    list(dtoIn) {
      const commandUri = Calls.getCommandUri("match/list");
      return Calls.call("get", commandUri, dtoIn);
    },

    /**
     *
     * @param {{
     *  matchId: string,
     *  tournamentId: string,
     *  participants: {
     *    id: string,
     *    resultText: string,
     *    isWinner: boolean,
     *    status: string,
     *    name: string
     *  }[]
     * }} dtoIn
     * @returns {Promise<void>}
     */
    updateScore(dtoIn) {
      const commandUri = Calls.getCommandUri("match/update");
      return Calls.call("post", commandUri, dtoIn);
    },
  },
};

export default Calls;
