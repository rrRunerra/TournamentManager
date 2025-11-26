# Bracket Algorithm Documentation

## Overview

The TournamentManager implements sophisticated bracket generation algorithms for both single and double elimination tournaments. This document explains how the algorithms work and the design decisions behind them.

## Single Elimination Bracket

### Algorithm Overview

The single elimination bracket is generated using a tree-based approach that ensures proper match progression and handles edge cases like byes.

### Generation Process

#### Step 1: Round Creation

```javascript
while (currentTeams.length > 1) {
  // Create matches for current round
  // Pair teams: [0,1], [2,3], [4,5], ...
  // Handle odd numbers with byes
}
```

**Example for 8 teams:**
```
Round 1: 4 matches (8 teams)
Round 2: 2 matches (4 winners)
Round 3: 1 match (2 winners) - FINAL
```

**Example for 6 teams:**
```
Round 1: 3 matches (6 teams)
  - Match 1: Team A vs Team B
  - Match 2: Team C vs Team D
  - Match 3: Team E vs Team F
Round 2: 2 matches (3 winners + 1 bye)
  - Match 4: Winner(1) vs Winner(2)
  - Match 5: Winner(3) vs TBD
Round 3: 1 match (2 winners) - FINAL
```

#### Step 2: Match Object Creation

Each match contains:
```javascript
{
  id: number,                    // Unique match ID
  name: string,                  // "Round X - Match Y" or "Final - Match"
  nextMatchId: number | null,    // Where winner goes
  tournamentRoundText: string,   // Round number
  startTime: null,               // Scheduled start
  state: "SCHEDULED",            // Match state
  participants: [                // Teams in this match
    {
      id: string,                // Team ID
      name: string,              // Team name
      resultText: null,          // Score
      isWinner: false,           // Winner flag
      status: null               // Match status
    }
  ]
}
```

#### Step 3: Bye Handling

When a match has only one participant:
```javascript
if (match.participants.length === 1) {
  match.participants[0].resultText = "WALK_OVER";
  match.participants[0].isWinner = true;
  match.participants[0].status = "WALK_OVER";
  match.state = "WALK_OVER";
}
```

This automatically advances the team to the next round.

#### Step 4: Match Connection

Connects matches via `nextMatchId`:
```javascript
// For each pair of matches in current round
match1.nextMatchId = nextRoundMatch.id;
match2.nextMatchId = nextRoundMatch.id;
```

**Visual Example:**
```
Round 1          Round 2         Final
┌─────┐
│ M1  │──┐
└─────┘  │      ┌─────┐
         ├─────→│ M5  │──┐
┌─────┐  │      └─────┘  │
│ M2  │──┘               │     ┌─────┐
└─────┘                  ├────→│ M7  │
                         │     └─────┘
┌─────┐                  │
│ M3  │──┐               │
└─────┘  │      ┌─────┐  │
         ├─────→│ M6  │──┘
┌─────┐  │      └─────┘
│ M4  │──┘
└─────┘
```

### Frontend Layout Algorithm

The frontend uses a tree-based layout with absolute positioning:

#### Step 1: Group by Rounds

```javascript
const rounds = [
  { id: "1", matches: [...] },
  { id: "2", matches: [...] },
  { id: "3", matches: [...] }
];
```

#### Step 2: Calculate Positions

**Constants:**
```javascript
CARD_WIDTH = 250px
CARD_HEIGHT = 140px
GAP_X = 80px
GAP_Y = 20px
```

**X Position:**
```javascript
x = roundIndex * (CARD_WIDTH + GAP_X)
```

**Y Position (Recursive):**
```javascript
function calculateY(match) {
  const feeders = getMatchesThatFeedInto(match);
  
  if (feeders.length === 0) {
    // Leaf node - assign next available slot
    return currentSlot++ * (CARD_HEIGHT + GAP_Y);
  } else {
    // Parent node - center between children
    const feederYs = feeders.map(f => calculateY(f));
    return (Math.min(...feederYs) + Math.max(...feederYs)) / 2;
  }
}
```

**Example Calculation:**
```
Round 1 (Leaves):
  Match 1: y = 0 * 160 = 0
  Match 2: y = 1 * 160 = 160
  Match 3: y = 2 * 160 = 320
  Match 4: y = 3 * 160 = 480

Round 2 (Parents):
  Match 5: y = (0 + 160) / 2 = 80
  Match 6: y = (320 + 480) / 2 = 400

Round 3 (Final):
  Match 7: y = (80 + 400) / 2 = 240
```

#### Step 3: Render Connectors

SVG paths connect matches:
```javascript
const startX = currentMatch.x + CARD_WIDTH;  // Right edge
const startY = currentMatch.y + CARD_HEIGHT / 2;  // Center
const endX = nextMatch.x;  // Left edge
const endY = nextMatch.y + CARD_HEIGHT / 2;  // Center
const midX = (startX + endX) / 2;  // Midpoint

// Orthogonal path: horizontal → vertical → horizontal
path = `M ${startX} ${startY} 
        L ${midX} ${startY} 
        L ${midX} ${endY} 
        L ${endX} ${endY}`;
```

**Visual:**
```
┌─────┐
│ M1  │────┐
└─────┘    │
           ├──→ ┌─────┐
┌─────┐    │    │ M5  │
│ M2  │────┘    └─────┘
└─────┘
```

### Winner Progression

When a match is completed:

1. Frontend updates match with winner
2. Backend saves match state
3. Frontend `processMatches()` function:
   - Finds matches with winners
   - Locates next match via `nextMatchId`
   - Adds winner to next match participants
   - Handles walkover winners

```javascript
sortedMatches.forEach(match => {
  const winner = match.participants.find(p => p.isWinner);
  
  if (winner && match.nextMatchId) {
    const nextMatch = matchMap.get(match.nextMatchId);
    const emptySlot = nextMatch.participants.findIndex(
      p => !p.name || p.name === "TBD"
    );
    
    if (emptySlot !== -1) {
      nextMatch.participants[emptySlot] = {
        ...winner,
        resultText: null,
        isWinner: false
      };
    }
  }
});
```

## Double Elimination Bracket

### Structure

Double elimination consists of three parts:
1. **Upper Bracket** - Standard single elimination
2. **Lower Bracket** - Losers from upper bracket
3. **Grand Final** - Winner of upper vs winner of lower

### Key Differences

**Match Object:**
```javascript
{
  // ... standard fields ...
  nextLooserMatchId: number | null,  // Where loser goes
  bracket: "upper" | "lower"         // Which bracket
}
```

### Loser Routing

**Upper Bracket:**
- Winners advance to next upper match
- Losers drop to lower bracket

**Lower Bracket:**
- Winners advance to next lower match
- Losers are eliminated

**Example Flow:**
```
Upper R1: A vs B → Winner to Upper R2, Loser to Lower R1
Upper R2: W(AB) vs C → Winner to Upper Final, Loser to Lower R2
Lower R1: L(AB) vs BYE → Winner to Lower R2
Lower R2: W(Lower R1) vs L(Upper R2) → Winner to Lower Final
```

### Alternating Rounds

The lower bracket alternates between:
1. **Feed Rounds** - Receive losers from upper bracket
2. **Merge Rounds** - Consolidate lower bracket winners

This prevents matches from having more than 2 inputs.

## Edge Cases

### Odd Number of Teams

**Problem:** 5 teams creates unbalanced bracket

**Solution:** Byes in first round
```
Round 1:
  Match 1: Team A vs Team B
  Match 2: Team C vs Team D
  Match 3: Team E vs BYE (walkover)

Round 2:
  Match 4: Winner(1) vs Winner(2)
  Match 5: Winner(3) vs TBD

Round 3:
  Final: Winner(4) vs Winner(5)
```

### Non-Power-of-2 Teams

**Problem:** 6 teams doesn't fit clean bracket

**Solution:** Strategic bye placement
```
Round 1: 3 matches (6 teams)
Round 2: 2 matches (3 winners)
  - One team gets implicit bye
Round 3: Final (2 winners)
```

### Walkover Handling

**Automatic Winner:**
- If match has one participant with WALK_OVER status
- Automatically set as winner
- Progress to next round immediately

**Frontend Logic:**
```javascript
if (match.state === 'WALK_OVER') {
  const validParticipants = match.participants.filter(
    p => p.id && p.name && p.name !== "TBD" && 
         p.resultText !== "WALK_OVER"
  );
  
  if (validParticipants.length === 1) {
    validParticipants[0].isWinner = true;
  }
}
```

## Performance Analysis

### Time Complexity

**Bracket Generation:**
- Single Elimination: O(n) where n = number of teams
- Double Elimination: O(n log n)

**Layout Calculation:**
- Tree traversal: O(m) where m = number of matches
- Position calculation: O(m)
- Total: O(m) = O(n log n) for single elimination

**Rendering:**
- Match rendering: O(m)
- Connector rendering: O(m)
- Total: O(m)

### Space Complexity

**Backend:**
- Matches stored: O(n log n) for single elimination
- Memory per match: ~500 bytes
- 64 teams = ~320 matches = ~160KB

**Frontend:**
- Position map: O(m)
- SVG paths: O(m)
- Total: O(m)

## Visual Examples

### 8-Team Single Elimination

```
Round 1          Round 2         Final
┌─────┐
│ 1v2 │──┐
└─────┘  │      ┌─────┐
         ├─────→│ W1v2│──┐
┌─────┐  │      └─────┘  │
│ 3v4 │──┘               │     ┌─────┐
└─────┘                  ├────→│FINAL│
                         │     └─────┘
┌─────┐                  │
│ 5v6 │──┐               │
└─────┘  │      ┌─────┐  │
         ├─────→│ W5v6│──┘
┌─────┐  │      └─────┘
│ 7v8 │──┘
└─────┘
```

### 4-Team Double Elimination

```
UPPER BRACKET:
┌─────┐
│ 1v2 │──┐
└─────┘  │      ┌─────┐
         ├─────→│ UF  │──┐
┌─────┐  │      └─────┘  │
│ 3v4 │──┘               │
└─────┘                  │
    │                    │
    └──→ LOSERS          │     ┌─────┐
                         ├────→│ GF  │
LOWER BRACKET:           │     └─────┘
┌─────┐                  │
│L1v2 │──┐               │
└─────┘  │      ┌─────┐  │
         ├─────→│ LF  │──┘
┌─────┐  │      └─────┘
│L3v4 │──┘
└─────┘
```

## Testing Scenarios

### Recommended Test Cases

1. **Power of 2:** 2, 4, 8, 16, 32 teams
2. **Non-power of 2:** 3, 5, 6, 7, 10 teams
3. **Edge cases:** 2 teams (minimum), 64 teams (large)
4. **Walkover scenarios:** Odd teams, team withdrawals
5. **Double elimination:** All of above for both brackets

## Future Enhancements

1. **Seeding:** Allow tournament organizers to seed teams
2. **Swiss System:** Alternative to elimination
3. **Group Stage:** Preliminary rounds before elimination
4. **Consolation Bracket:** 3rd place playoff
5. **Optimized Bye Distribution:** Better balance for irregular team counts
6. **Dynamic Bracket:** Add/remove teams after creation
7. **Bracket Reset:** Grand final bracket reset option
