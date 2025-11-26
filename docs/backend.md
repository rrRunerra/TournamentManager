# Backend Documentation

## Overview

The backend is a Node.js application following a three-tier architecture:
1. **API Layer** - Controllers and validation
2. **Business Logic Layer (ABL)** - Core business logic
3. **Data Access Layer (DAO)** - Database operations

## Directory Structure

```
app/
├── abl/                    # Application Business Logic
│   ├── tournament-abl.js
│   ├── match-abl.js
│   ├── team-abl.js
│   ├── player-abl.js
│   └── ritr-main-abl.js
├── api/                    # API Layer
│   ├── controllers/        # Request handlers
│   ├── errors/             # Error definitions
│   └── validation_types/   # Input validation schemas
├── dao/                    # Data Access Objects
│   ├── tournament-dao.js
│   ├── match-dao.js
│   ├── team-dao.js
│   ├── player-dao.js
│   └── ritr-main-dao.js
└── config/                 # Configuration files
```

## Architecture Pattern

### Request Flow

```
HTTP Request
    ↓
Controller (validation)
    ↓
ABL (business logic)
    ↓
DAO (database operations)
    ↓
MongoDB
    ↓
Response
```

## API Endpoints

### Tournament Endpoints

#### POST /tournament/create
Create a new tournament.

**Request Body:**
```javascript
{
  name: string,
  description: string,
  startDate: Date,
  endDate: Date,
  teamSize: number,
  teams: string[],        // Array of team names
  owner: string,          // Owner ID
  bracketType: "single" | "double",
  status: "upcoming"
}
```

**Response:**
```javascript
{
  id: string,
  name: string,
  description: string,
  startDate: Date,
  endDate: Date,
  teamSize: number,
  teams: string[],        // Array of team IDs
  owner: string,
  bracketType: string,
  status: string
}
```

#### GET /tournament/list
Get all tournaments.

**Response:**
```javascript
{
  itemList: Tournament[]
}
```

#### GET /tournament/get
Get tournament details.

**Request:**
```javascript
{
  id: string
}
```

**Response:**
```javascript
{
  id: string,
  name: string,
  description: string,
  startDate: Date,
  endDate: Date,
  teamSize: number,
  teams: [{
    id: string,
    name: string,
    players: string[]
  }],
  owner: string,
  bracketType: string,
  status: string
}
```

#### POST /tournament/update
Update tournament (including status changes).

**Request:**
```javascript
{
  id: string,
  status?: "upcoming" | "ongoing" | "finished"
}
```

**Note:** Changing status to "ongoing" triggers bracket generation.

#### POST /tournament/delete
Delete tournament and all associated data.

**Request:**
```javascript
{
  id: string
}
```

### Match Endpoints

#### GET /match/getAll
Get all matches for a tournament.

**Request:**
```javascript
{
  tournamentId: string
}
```

**Response:**
```javascript
{
  itemList: Match[]
}
```

**Match Structure:**
```javascript
{
  id: number,
  matchId: number,
  name: string,
  nextMatchId: number | null,
  nextLooserMatchId: number | null,  // For double elimination
  tournamentRoundText: string,
  startTime: Date | null,
  state: "SCHEDULED" | "WALK_OVER" | "PLAYED",
  participants: [{
    id: string,
    name: string,
    resultText: string | null,
    isWinner: boolean,
    status: "PLAYED" | "NO_SHOW" | "WALK_OVER" | "NO_PARTY" | null
  }],
  tournamentId: string,
  bracket?: "upper" | "lower"  // For double elimination
}
```

#### POST /match/updateScore
Update match score and winner.

**Request:**
```javascript
{
  matchId: number,
  tournamentId: string,
  participants: [{
    id: string,
    name: string,
    resultText: string,
    isWinner: boolean,
    status: string | null
  }]
}
```

### Team Endpoints

#### POST /team/create
Create a team.

**Request:**
```javascript
{
  name: string,
  players: string[],
  tournamentId: string
}
```

#### POST /team/remove
Remove a team from tournament.

**Request:**
```javascript
{
  teamId: string,
  tournamentId: string
}
```

#### POST /team/join
Add player to team.

**Request:**
```javascript
{
  playerId: string,
  teamId: string
}
```

### Player Endpoints

#### POST /player/create
Create or login a player.

**Request:**
```javascript
{
  name: string,
  password: string
}
```

**Response:**
```javascript
{
  id: string,
  uuIdentity: string,
  name: string,
  role: "teacher" | "student"
}
```

#### GET /player/get
Get player information.

**Request:**
```javascript
{
  id: string
}
```

## Business Logic (ABL)

### TournamentAbl

**Key Methods:**

#### `create(awid, dtoIn)`
Creates tournament and teams.

**Process:**
1. Validate input
2. Generate tournament ID
3. Create team objects with IDs
4. Save teams to database
5. Create tournament with team ID references
6. Return tournament

#### `update(awid, dtoIn)`
Updates tournament, handles status changes.

**Process:**
1. Validate input
2. Get tournament from database
3. If status changes to "ongoing":
   - Validate minimum 2 teams
   - Fetch team details
   - Generate bracket (single or double)
   - Create all match records
4. Update tournament
5. Return updated tournament

#### `delete(awid, dtoIn)`
Deletes tournament and cascades to teams and matches.

**Process:**
1. Get tournament
2. Delete all teams
3. Delete all matches
4. Delete tournament
5. Return result

#### `get(awid, dtoIn)`
Gets tournament with populated team details.

**Process:**
1. Validate input
2. Get tournament
3. Fetch team details for each team ID
4. Replace team IDs with team objects
5. Return enriched tournament

#### `list(awid)`
Returns all tournaments.

### MatchAbl

**Key Methods:**

#### `getAll(awid, dtoIn)`
Gets all matches for a tournament.

**Returns:** Array of match objects

#### `updateScore(awid, dtoIn)`
Updates match participants and scores.

**Process:**
1. Validate input
2. Find match by matchId and tournamentId
3. Update participants array
4. Save match
5. Return updated match

### TeamAbl

**Key Methods:**

#### `create(awid, dtoIn)`
Creates a team.

#### `remove(awid, dtoIn)`
Removes team from tournament.

**Process:**
1. Get team
2. Remove team ID from tournament.teams array
3. Delete team record
4. Return result

#### `join(awid, dtoIn)`
Adds player to team.

**Process:**
1. Get team
2. Check if player already in team
3. Add player ID to team.players array
4. Save team
5. Return updated team

### PlayerAbl

**Key Methods:**

#### `create(awid, dtoIn)`
Creates or authenticates player.

**Process:**
1. Hash password
2. Check if player exists
3. If exists: verify password, return player
4. If not: create new player with default role "student"
5. Return player data

#### `get(awid, dtoIn)`
Gets player by ID.

## Data Models

### Tournament
```javascript
{
  id: string,
  name: string,
  description: string,
  startDate: Date,
  endDate: Date,
  teamSize: number,
  teams: string[],        // Team IDs
  owner: string,          // Player ID
  bracketType: "single" | "double",
  status: "upcoming" | "ongoing" | "finished"
}
```

### Team
```javascript
{
  id: string,
  name: string,
  players: string[],      // Player IDs
  tournamentId: string
}
```

### Match
```javascript
{
  id: string,             // MongoDB _id
  matchId: number,        // Bracket match ID
  name: string,
  nextMatchId: number | null,
  nextLooserMatchId: number | null,
  tournamentRoundText: string,
  startTime: Date | null,
  state: string,
  participants: Participant[],
  tournamentId: string,
  bracket?: "upper" | "lower"
}
```

### Participant
```javascript
{
  id: string,             // Team ID
  name: string,           // Team name
  resultText: string | null,  // Score
  isWinner: boolean,
  status: string | null
}
```

### Player
```javascript
{
  id: string,
  uuIdentity: string,
  name: string,
  password: string,       // Hashed
  role: "teacher" | "student"
}
```

## Bracket Generation

### Single Elimination

**Algorithm:** `generateSingleBracket(teams)`

**Process:**
1. Create rounds until one team remains
2. For each round:
   - Pair teams (team[i] vs team[i+1])
   - Create match objects
   - Handle byes (odd number of teams)
3. Connect matches via `nextMatchId`
4. Mark final match with `nextMatchId: null`

**Bye Handling:**
- If only one participant in match:
  - Set `resultText: "WALK_OVER"`
  - Set `isWinner: true`
  - Set `state: "WALK_OVER"`

### Double Elimination

**Algorithm:** `generateDoubleBracket(teams)`

**Structure:**
- Upper Bracket: Standard single elimination
- Lower Bracket: Losers from upper bracket
- Grand Final: Winner of upper vs winner of lower

**Features:**
- `nextLooserMatchId` - Where losers go
- `bracket` field - "upper" or "lower"
- Complex loser routing logic

## Validation

### Validation Types

Located in `api/validation_types/`:
- `tournament-types.js`
- `match-types.js`
- `team-types.js`
- `player-types.js`

**Example:**
```javascript
TournamentCreateDtoInType: {
  name: { type: "string", required: true },
  description: { type: "string", required: true },
  startDate: { type: "date", required: true },
  endDate: { type: "date", required: true },
  teamSize: { type: "number", required: true },
  teams: { type: "array", required: true },
  owner: { type: "string", required: true },
  bracketType: { type: "string", required: true },
  status: { type: "string", required: true }
}
```

## Error Handling

### Error Types

Located in `api/errors/`:
- `tournament-error.js`
- `match-error.js`
- `team-error.js`
- `player-error.js`

**Example Errors:**
```javascript
Create: {
  InvalidDtoIn: "Invalid input data",
  NameMissing: "Tournament name is required",
  DescriptionMissing: "Description is required",
  // ...
}
```

## Database (DAO Layer)

### DAO Pattern

Each entity has a DAO with standard methods:
- `create(data)` - Insert new record
- `get(awid, id)` - Get by ID
- `list(awid)` - Get all records
- `update(data)` - Update record
- `remove(data)` - Delete record
- `findOne(query)` - Find single record by query

### MongoDB Collections

- `tournaments`
- `teams`
- `matches`
- `players`

## Security

### Authentication
- Password hashing (implementation details in PlayerAbl)
- Player ID stored in localStorage on frontend
- Owner verification for tournament operations

### Authorization
- Role-based: "teacher" vs "student"
- Teachers can create tournaments
- Owners can manage their tournaments
- Players can join teams

## Performance Considerations

### Bracket Generation
- Happens once when tournament starts
- All matches created upfront
- O(n log n) complexity for n teams

### Data Fetching
- Team details populated on tournament get
- Match lists filtered by tournament ID
- Cascading deletes for data integrity

## Future Improvements

1. NONE FOR NOW
