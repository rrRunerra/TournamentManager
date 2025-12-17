/* eslint-disable */

const MatchUpdateDtoInType = shape({
  matchId: integer().isRequired(),
  tournamentId: uu5String(255).isRequired(),
  participants: array(
    shape({
      id: uu5String(255).isRequired(),
      resultText: uu5String(255),
      status: uu5String(50),
      isWinner: boolean().isRequired(),
      name: uu5String(255).isRequired(),
    }),
  ).isRequired(),
});

const MatchListDtoInType = shape({
  tournamentId: uu5String(255).isRequired(),
});

const MatchCreateDtoInType = shape({
  matchId: integer().isRequired(),
  tournamentId: uu5String(255).isRequired(),
  name: uu5String(255).isRequired(),
  nextMatchId: integer(),
  nextLooserMatchId: integer(),
  tournamentRoundText: uu5String(50),
  startTime: uu5String(255),
  state: uu5String(50),
  participants: array(),
  bracket: uu5String(50),
});
const MatchAddBetDtoInType = shape({
  matchId: integer().isRequired(),
  tournamentId: uu5String(255).isRequired(),
  userId: uu5String(255).isRequired(),
  teamId: uu5String(255).isRequired(),
  bet: oneOf(["win", "lose"]).isRequired(),
  betAmount: integer().isRequired(),
});
