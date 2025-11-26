# API Reference

## Base URL

```
http://localhost:8080/api
```

## Authentication

All requests require a player session. The player ID is stored in localStorage after login.

## Endpoints

### Tournaments

#### Create Tournament
```http
POST /tournament/create
```

**Request Body:**
```json
{
  "name": "Summer Championship",
  "description": "Annual summer tournament",
  "startDate": "2024-07-01T10:00:00Z",
  "endDate": "2024-07-15T18:00:00Z",
  "teamSize": 2,
  "teams": ["Team Alpha", "Team Beta", "Team Gamma"],
  "owner": "player123",
  "bracketType": "single",
  "status": "upcoming"
}
```

**Response:**
```json
{
  "id": "abc123",
  "name": "Summer Championship",
  "teams": ["team1", "team2", "team3"],
  ...
}
```

#### List Tournaments
```http
GET /tournament/list
```

**Response:**
```json
{
  "itemList": [
    {
      "id": "abc123",
      "name": "Summer Championship",
      "status": "upcoming",
      ...
    }
  ]
}
```

#### Get Tournament
```http
GET /tournament/get?id=abc123
```

**Response:**
```json
{
  "id": "abc123",
  "name": "Summer Championship",
  "teams": [
    {
      "id": "team1",
      "name": "Team Alpha",
      "players": ["player1", "player2"]
    }
  ],
  ...
}
```

#### Update Tournament
```http
POST /tournament/update
```

**Request Body:**
```json
{
  "id": "abc123",
  "status": "ongoing"
}
```

**Note:** Setting status to "ongoing" triggers bracket generation.

#### Delete Tournament
```http
POST /tournament/delete
```

**Request Body:**
```json
{
  "id": "abc123"
}
```

### Matches

#### Get All Matches
```http
GET /match/getAll?tournamentId=abc123
```

**Response:**
```json
{
  "itemList": [
    {
      "id": "match1",
      "matchId": 12345,
      "name": "Round 1 - Match 1",
      "nextMatchId": 67890,
      "participants": [
        {
          "id": "team1",
          "name": "Team Alpha",
          "resultText": "3",
          "isWinner": true,
          "status": "PLAYED"
        },
        {
          "id": "team2",
          "name": "Team Beta",
          "resultText": "1",
          "isWinner": false,
          "status": "PLAYED"
        }
      ],
      "state": "PLAYED",
      "tournamentId": "abc123"
    }
  ]
}
```

#### Update Match Score
```http
POST /match/updateScore
```

**Request Body:**
```json
{
  "matchId": 12345,
  "tournamentId": "abc123",
  "participants": [
    {
      "id": "team1",
      "name": "Team Alpha",
      "resultText": "3",
      "isWinner": true,
      "status": "PLAYED"
    },
    {
      "id": "team2",
      "name": "Team Beta",
      "resultText": "1",
      "isWinner": false,
      "status": "PLAYED"
    }
  ]
}
```

### Teams

#### Create Team
```http
POST /team/create
```

**Request Body:**
```json
{
  "name": "Team Delta",
  "players": [],
  "tournamentId": "abc123"
}
```

#### Remove Team
```http
POST /team/remove
```

**Request Body:**
```json
{
  "teamId": "team1",
  "tournamentId": "abc123"
}
```

#### Join Team
```http
POST /team/join
```

**Request Body:**
```json
{
  "playerId": "player123",
  "teamId": "team1"
}
```

### Players

#### Create/Login Player
```http
POST /player/create
```

**Request Body:**
```json
{
  "name": "john_doe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "id": "player123",
  "uuIdentity": "uuid-here",
  "name": "john_doe",
  "role": "student"
}
```

#### Get Player
```http
GET /player/get?id=player123
```

**Response:**
```json
{
  "id": "player123",
  "name": "john_doe",
  "role": "teacher",
  "uuIdentity": "uuid-here"
}
```

## Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Server Error

## Data Types

### Tournament Status
- `upcoming` - Not started
- `ongoing` - In progress
- `finished` - Completed

### Bracket Type
- `single` - Single elimination
- `double` - Double elimination

### Match State
- `SCHEDULED` - Not played
- `WALK_OVER` - Bye/walkover
- `PLAYED` - Completed

### Participant Status
- `PLAYED` - Normal completion
- `NO_SHOW` - Didn't show up
- `WALK_OVER` - Automatic win
- `NO_PARTY` - No opponent
- `null` - Not set

### Player Role
- `teacher` - Can create tournaments
- `student` - Can join teams

## Error Responses

```json
{
  "error": "InvalidDtoIn",
  "message": "Invalid input data"
}
```

Common errors:
- `InvalidDtoIn` - Validation failed
- `TournamentNotFound` - Tournament doesn't exist
- `NotEnoughTeams` - Minimum 2 teams required
- `NameMissing` - Required field missing
