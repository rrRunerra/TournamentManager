# Database Indexes Documentation

## Overview

Database indexes have been added to all DAO files to optimize query performance. Each collection has compound indexes based on common query patterns.

## Indexes by Collection

### Match Collection (`match-mongo.js`)

**Indexes:**
1. `{ awid: 1, id: 1 }` - **Unique** - Primary lookup by ID
2. `{ awid: 1, tournamentId: 1 }` - Query all matches for a tournament (most common)
3. `{ awid: 1, matchId: 1, tournamentId: 1 }` - Get specific match by matchId

**Query Optimization:**
- `getAll(tournamentId)` - Uses index #2
- `get(matchId, tournamentId)` - Uses index #3
- Primary lookups - Uses index #1

### Tournament Collection (`tournament-mongo.js`)

**Indexes:**
1. `{ awid: 1, id: 1 }` - **Unique** - Primary lookup by ID
2. `{ awid: 1, status: 1 }` - Filter by status (upcoming/ongoing/finished)
3. `{ awid: 1, owner: 1 }` - Query tournaments by owner

**Query Optimization:**
- `list()` with status filter - Uses index #2
- Owner's tournaments - Uses index #3
- Primary lookups - Uses index #1

### Team Collection (`team-mongo.js`)

**Indexes:**
1. `{ awid: 1, id: 1 }` - **Unique** - Primary lookup by ID
2. `{ awid: 1, tournamentId: 1 }` - Query teams by tournament

**Query Optimization:**
- Get all teams for tournament - Uses index #2
- Primary lookups - Uses index #1

### Player Collection (`player-mongo.js`)

**Indexes:**
1. `{ awid: 1, id: 1 }` - **Unique** - Primary lookup by ID
2. `{ awid: 1, name: 1 }` - Login/authentication by username
3. `{ awid: 1, uuIdentity: 1 }` - Query by identity

**Query Optimization:**
- Login by username - Uses index #2
- Identity lookups - Uses index #3
- Primary lookups - Uses index #1

## Performance Impact

### Before Indexes
- Collection scans for most queries
- O(n) time complexity for filters
- Slow performance with large datasets

### After Indexes
- Index seeks for all queries
- O(log n) time complexity
- Fast performance regardless of dataset size

## Index Strategy

### Compound Indexes
All indexes include `awid` as the first field because:
1. Every query filters by `awid` (workspace isolation)
2. Compound indexes can be used for prefix queries
3. Optimal for multi-tenant architecture

### Index Order
Fields are ordered by:
1. **Equality** - Fields with exact matches (awid, id)
2. **Sort** - Fields used for sorting
3. **Range** - Fields with range queries

## Maintenance

### Index Creation
Indexes are created automatically when `createSchema()` is called during application initialization.

### Monitoring
Monitor index usage with MongoDB commands:
```javascript
db.collection.getIndexes()
db.collection.stats()
```

### Rebuilding
If needed, rebuild indexes:
```javascript
db.collection.reIndex()
```

## Best Practices

1. **Avoid Over-Indexing** - Each index has memory overhead
2. **Monitor Performance** - Use explain() to verify index usage
3. **Update Indexes** - Add new indexes as query patterns evolve
4. **Remove Unused** - Drop indexes that aren't being used

## Query Examples

### Optimized Queries

**Get all matches for tournament:**
```javascript
// Uses: { awid: 1, tournamentId: 1 }
db.matches.find({ awid: "workspace1", tournamentId: "abc123" })
```

**Get tournament by status:**
```javascript
// Uses: { awid: 1, status: 1 }
db.tournaments.find({ awid: "workspace1", status: "ongoing" })
```

**Login by username:**
```javascript
// Uses: { awid: 1, name: 1 }
db.players.findOne({ awid: "workspace1", name: "john_doe" })
```

## Future Optimizations

1. NONE FOR NOW

