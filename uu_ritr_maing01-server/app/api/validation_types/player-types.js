/* eslint-disable */
const PlayerCreateDtoInType = shape({
    name: uu5String(255).isRequired(),
    password: uu5String(255).isRequired()
})

const PlayerUpdateDtoInType = shape({
    name: uu5String(255),
    school: uu5String(255),
    id: uu5String(255).isRequired(),
    teamId: uu5String(512)
})

const PlayerGetDtoInType = shape({
    id: uu5String(255).isRequired()
})

const PlayerUpdateStatsDtoInType = shape({
    firstPlaceParticipantId: uu5String(255),
    secondPlaceParticipantId: uu5String(255),
    thirdPlaceParticipantId: uu5String(255),
    fourthPlaceParticipantId: uu5String(255),
    tournamentId: uu5String(255).isRequired()
})

// const playerSchema = {
//   id: String,                      
//   name: String,
//   school: String,
//   teamId: ObjectId,                 // reference to Team
// }