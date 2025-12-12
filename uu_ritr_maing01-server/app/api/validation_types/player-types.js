/* eslint-disable */
const PlayerCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
  password: uu5String(255).isRequired(),
});

const PlayerUpdateDtoInType = shape({
  name: uu5String(255),
  school: uu5String(255),
  id: uu5String(255).isRequired(),
  teamId: uu5String(512),
});

const PlayerGetDtoInType = shape({
  id: uu5String(255).isRequired(),
});

const PlayerUpdateStatsDtoInType = shape({
  finalsFirstPlaceParticipantId: uu5String(255),
  finalsSecondPlaceParticipantId: uu5String(255),
  finalsThirdPlaceParticipantId: uu5String(255),
  finalsFourthPlaceParticipantId: uu5String(255),
  tournamentId: uu5String(255).isRequired(),
});

const PlayerUpdateMatchStatsDtoInType = shape({
  participantId: uu5String(255).isRequired(),
  won: boolean().isRequired(),
});

const PlayerUpdateFlappyBirdScoreDtoInType = shape({
  playerId: uu5String(255).isRequired(),
  score: number().isRequired(),
});

const PlayerIncrementTournamentsPlayedDtoInType = shape({
  tournamentId: uu5String(255).isRequired(),
});

const PlayerAddCreditsDtoInType = shape({
  id: uu5String(255).isRequired(),
  amount: number().isRequired(),
});

const PlayerRemoveCreditsDtoInType = shape({
  id: uu5String(255).isRequired(),
  amount: number().isRequired(),
});
