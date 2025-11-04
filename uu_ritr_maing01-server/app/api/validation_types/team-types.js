/* eslint-disable */

const TeamCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
    players:
        shape({
            id: uu5String(255).isRequired()

        })
    .isRequired(),
    tournamentId: uu5String(255).isRequired()
})

const TeamUpdateDtoInType = shape({
    id: uu5String(255).isRequired(),
    name: uu5String(255),
    players:
        shape({
            id: uu5String(255)

        }
    ),
    tournamentId: uu5String(255),
    teamSize: uu5String()
})

const TeamGetDtoInType = shape({
    id: uu5String(255).isRequired()
})




// const teamSchema = {
//   _id: ObjectId,
//   name: String,
//   players: [                        // embedded or referenced players
//     {
//       id: String,                  // player id
//       name: String
//     }
//   ],
//   tournamentId: ObjectId,           // reference to Tournament
// }
