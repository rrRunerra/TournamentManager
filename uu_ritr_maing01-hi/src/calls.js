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

  PlayerCreate(dtoIn) {
    const commandUri = Calls.getCommandUri("player/create");
    return Calls.call("post", commandUri, dtoIn);
  },

  PlayerUpdate(dtoIn) {
    const commandUri = Calls.getCommandUri("player/update");
    return Calls.call("post", commandUri, dtoIn);
  },

  listTournaments(dtoIn) {
    const commandUri = Calls.getCommandUri("tournament/list");
    return Calls.call("get", commandUri, dtoIn);
  },

  getTournament(dtoIn) {
    const commandUri = Calls.getCommandUri("tournament/get");
    return Calls.call("get", commandUri, dtoIn);
  },

  createTournament(dtoIn) {
    const commandUri = Calls.getCommandUri("tournament/create");
    return Calls.call("post", commandUri, dtoIn);
  },

  deleteTournament(dtoIn) {
    const commandUri = Calls.getCommandUri("tournament/delete");
    return Calls.call("post", commandUri, dtoIn);
  },
  updateTournament(dtoIn) {
    const commandUri = Calls.getCommandUri("tournament/update");
    return Calls.call("post", commandUri, dtoIn);
  },

  joinTeam(dtoIn) {
    const commandUri = Calls.getCommandUri("team/update");
    return Calls.call("post", commandUri, dtoIn);
  },

  removeTeam(dtoIn) {
    const commandUri = Calls.getCommandUri("team/remove");
    return Calls.call("post", commandUri, dtoIn);
  },

  getMatches(dtoIn) {
    const commandUri = Calls.getCommandUri("match/list");
    return Calls.call("get", commandUri, dtoIn);
  },

  updateMatchScore(dtoIn) {
    const commandUri = Calls.getCommandUri("match/update");
    return Calls.call("post", commandUri, dtoIn);
  },

  getPlayer(dtoIn) {
    const commandUri = Calls.getCommandUri("player/get");
    return Calls.call("get", commandUri, dtoIn);
  }





};

export default Calls;
