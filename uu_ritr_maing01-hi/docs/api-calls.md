# Frontend API Calls Documentation

This document lists all API calls made from the frontend application, including where they are used and the exact arguments passed.

---

## Player Endpoints

### `PlayerCreate`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `player/create` |

| File | Arguments |
|------|-----------|
| `routes/login.js:72` | `{ name: username, password: password }` |

---

### `getPlayer`
| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **Endpoint** | `player/get` |

| File | Arguments |
|------|-----------|
| `routes/profile.js:39` | `{ id }` |
| `bricks/brackets/MatchDetailPopup.js:41` | `{ id: playerId }` |
| `bricks/brackets/MatchDetailPopup.js:49` | `{ id: playerId }` |
| `bricks/createTournamentModal.js:29` | `{ id: user.id }` *(commented out)* |

---

### `updatePlayerStats`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `player/updateStats` |

| File | Arguments |
|------|-----------|
| `bricks/brackets/MatchDetailPopup.js:174` | `{ tournamentId: match.tournamentId, finalsFirstPlaceParticipantId: winner.id, finalsSecondPlaceParticipantId: loser.id, finalsThirdPlaceParticipantId: null, finalsFourthPlaceParticipantId: null }` |
| `bricks/brackets/MatchDetailPopup.js:185` | `{ tournamentId: match.tournamentId, finalsFirstPlaceParticipantId: null, finalsSecondPlaceParticipantId: null, finalsThirdPlaceParticipantId: winner.id, finalsFourthPlaceParticipantId: loser.id }` |
| `bricks/brackets/MatchDetailPopup.js:198` | `{ tournamentId: match.tournamentId, finalsFirstPlaceParticipantId: winner.id, finalsSecondPlaceParticipantId: loser.id, finalsThirdPlaceParticipantId: null, finalsFourthPlaceParticipantId: null }` |

---

### `updateMatchStats`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `player/updateMatchStats` |

| File | Arguments |
|------|-----------|
| `bricks/brackets/MatchDetailPopup.js:152` | `{ participantId: winnerParticipant.id, won: true }` |
| `bricks/brackets/MatchDetailPopup.js:161` | `{ participantId: loserParticipant.id, won: false }` |

---

### `updateFlappyBirdScore`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `player/updateFlappyBirdScore` |

| File | Arguments |
|------|-----------|
| `bricks/flappy-bird.js:41` | `{ playerId: user.id, score: score }` |

---

### `incrementTournamentsPlayed`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `player/incrementTournamentsPlayed` |

| File | Arguments |
|------|-----------|
| `bricks/OngoingOwnerControls.js:30` | `{ tournamentId: id }` |

---

## Tournament Endpoints

### `listTournaments`
| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **Endpoint** | `tournament/list` |

| File | Arguments |
|------|-----------|
| `routes/history.js:46` | `{ page, pageSize: 12, status: "finished", year?, month?, search? }` |
| `routes/tournament.js:42` | `{ page, pageSize: 12, status: "upcoming" }` |

---

### `listTournamentsByUser`
| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **Endpoint** | `tournament/listByUser` |

| File | Arguments |
|------|-----------|
| `routes/profile.js:45` | `{ userId: id }` |

---

### `getTournament`
| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **Endpoint** | `tournament/get` |

| File | Arguments |
|------|-----------|
| `routes/tournament-detail.js:32` | `{ id }` |
| `routes/tournament-detail.js:96` | `{ id }` |
| `bricks/OngoingOwnerControls.js:31` | `{ id }` |
| `bricks/ownerControls.js:31` | `{ id }` |
| `bricks/ownerControls.js:97` | `{ id }` |

---

### `createTournament`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `tournament/create` |

| File | Arguments |
|------|-----------|
| `routes/tournament.js:13` | `{ name, description, startDate, endDate, teamSize, status, teams, owner, bracketType }` |

---

### `deleteTournament`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `tournament/delete` |

| File | Arguments |
|------|-----------|
| `bricks/OngoingOwnerControls.js:55` | `{ id }` |
| `bricks/ownerControls.js:59` | `{ id }` |

---

### `updateTournament`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `tournament/update` |

| File | Arguments |
|------|-----------|
| `bricks/OngoingOwnerControls.js:29` | `{ id, status: "finished" }` |
| `bricks/ownerControls.js:30` | `{ id, status: "ongoing" }` |

---

## Team Endpoints

### `joinTeam`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `team/update` |

| File | Arguments |
|------|-----------|
| `routes/tournament-detail.js:95` | `{ tournamentId, id: teamId, players: { id: userId }, teamSize: info.teamSize }` |

---

### `removeTeam`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `team/remove` |

| File | Arguments |
|------|-----------|
| `bricks/ownerControls.js:96` | `{ tournamentId: id, teamId: team.id }` |

---

## Match Endpoints

### `getMatches`
| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **Endpoint** | `match/list` |

| File | Arguments |
|------|-----------|
| `routes/tournament-detail.js:44` | `{ tournamentId: id }` |

---

### `updateMatchScore`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Endpoint** | `match/update` |

| File | Arguments |
|------|-----------|
| `bricks/brackets/MatchDetailPopup.js:124` | `{ matchId: match.id, tournamentId: match.tournamentId, participants: [{ ...match.participants[0], resultText: score1, status: status1, isWinner: boolean }, { ...match.participants[1], resultText: score2, status: status2, isWinner: boolean }] }` |

---

## System Endpoints

### `initAndGetWorkspace`
| Property | Value |
|----------|-------|
| **HTTP Method** | POST + GET |
| **Endpoint** | `sys/uuAppWorkspace/init` + `sys/uuAppWorkspace/get` |

| File | Arguments |
|------|-----------|
| `routes/init-app-workspace.js:34` | `values` (form values) |

---

## Summary by File

### Routes

| File | Calls |
|------|-------|
| `login.js` | `PlayerCreate` |
| `profile.js` | `getPlayer`, `listTournamentsByUser` |
| `history.js` | `listTournaments` |
| `tournament.js` | `createTournament`, `listTournaments` |
| `tournament-detail.js` | `getTournament`, `getMatches`, `joinTeam` |
| `init-app-workspace.js` | `initAndGetWorkspace` |

### Bricks

| File | Calls |
|------|-------|
| `flappy-bird.js` | `updateFlappyBirdScore` |
| `createTournamentModal.js` | `getPlayer` *(commented)* |
| `OngoingOwnerControls.js` | `updateTournament`, `incrementTournamentsPlayed`, `getTournament`, `deleteTournament` |
| `ownerControls.js` | `updateTournament`, `getTournament`, `deleteTournament`, `removeTeam` |
| `brackets/MatchDetailPopup.js` | `getPlayer`, `updateMatchScore`, `updateMatchStats`, `updatePlayerStats` |

---

## Statistics

| Metric | Count |
|--------|-------|
| **Total API Functions** | 17 |
| **Total Call Sites** | 28 |
| **GET Requests** | 8 |
| **POST Requests** | 9 |
