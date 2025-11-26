# Frontend Documentation

## Overview

The frontend is a React-based single-page application (SPA) built with modern React hooks and the uu5g05 routing system. It provides a dark-themed, visually appealing interface for tournament management.

## Directory Structure

```
src/
├── bricks/              # Reusable UI components
├── routes/              # Page-level components
├── styles/              # CSS stylesheets
├── config/              # Configuration files
├── lsi/                 # Localization (legacy)
├── core/                # Core utilities
├── assets/              # Static assets
├── calls.js             # API client
└── index.js             # Entry point
```

## Core Components

### API Client (`calls.js`)

Centralized API communication layer that handles all backend requests.

**Key Functions:**
- `createTournament(data)` - Create new tournament
- `listTournaments()` - Get all tournaments
- `getTournament(id)` - Get tournament details
- `updateTournament(id, data)` - Update tournament
- `deleteTournament(id)` - Delete tournament
- `createTeam(data)` - Create team
- `removeTeam(teamId, tournamentId)` - Remove team
- `joinTeam(playerId, teamId)` - Join team
- `getMatches(tournamentId)` - Get tournament matches
- `updateMatchScore(data)` - Update match score
- `getPlayer(playerId)` - Get player info
- `PlayerCreate(data)` - Create/login player

## Bricks (Reusable Components)

### CustomBracket.js

**Purpose:** Renders tournament brackets with tree-based layout algorithm.

**Key Features:**
- Single and double elimination support
- Tree-based positioning for perfect alignment
- SVG connector rendering
- Match detail popup
- Winner progression logic
- Walkover handling
- Confetti animation for winners

**Props:**
- `matches` - Array of match objects
- `bracketType` - 'single' or 'double'
- `isOwner` - Boolean for owner permissions
- `currentUserId` - Current user ID
- `tournamentInfo` - Tournament metadata
- `onMatchUpdate` - Callback for match updates

**Components:**
- `TreeBracketView` - Main bracket renderer with absolute positioning
- `MatchCard` - Individual match display
- `MatchDetailPopup` - Match editing modal
- `Confetti` - Winner celebration effect

**Layout Algorithm:**
```javascript
// Constants
CARD_WIDTH = 250px
CARD_HEIGHT = 140px
GAP_X = 80px
GAP_Y = 20px

// Positioning logic:
1. Group matches by rounds
2. Assign X position based on round index
3. Calculate Y position recursively:
   - Leaf nodes get sequential slots
   - Parent nodes centered between children
4. Render with absolute positioning
5. Draw SVG connectors between matches
```

### createTournamentModal.js

**Purpose:** Modal for creating new tournaments.

**Features:**
- Form validation
- Team management (add/remove)
- Bracket type selection
- Date/time pickers
- Authorization check (teachers only)

**State:**
- Tournament details (name, description, dates, team size)
- Teams array
- Bracket type selection

### DarkVeil.js

**Purpose:** Animated background effect with customizable parameters.

**Props:**
- `speed` - Animation speed
- `hueShift` - Color hue adjustment
- `noiseIntensity` - Visual noise level
- `scanlineFrequency` - Scanline effect
- `warpAmount` - Distortion amount

### navbar.js

**Purpose:** Main navigation bar.

**Navigation Links:**
- Domov (Home)
- Turnaje (Tournaments)
- História (History)
- O nás (About)
- Odhlásiť sa (Logout)

### ownerControls.js

**Purpose:** Tournament owner controls for pre-tournament phase.

**Actions:**
- Start tournament
- Delete tournament
- Manage teams (view/remove)

### OngoingOwnerControls.js

**Purpose:** Tournament owner controls during ongoing tournament.

**Actions:**
- End tournament
- Delete tournament

### OngoingTournamentNav.js

**Purpose:** Navigation tabs for ongoing tournaments.

**Tabs:**
- Aktuálny zápas (Current Match)
- Brackets
- Ovládanie majiteľa (Owner Controls)

### cards.js

**Purpose:** Reusable card components.

**Components:**
- `Card` - Base card container
- `CardHeader` - Card header
- `CardTitle` - Card title
- `CardDescription` - Card description
- `CardContent` - Card content area
- `CardFooter` - Card footer

### flappy-bird.js

**Purpose:** Easter egg mini-game.

**Features:**
- Flappy Bird clone
- Score tracking
- Game over screen

### welcome-row.js

**Purpose:** Welcome banner component.

## Routes (Pages)

### home.js

**Purpose:** Landing page.

**Features:**
- Hero section with title
- Call-to-action buttons
- DarkVeil background effect

**Content:**
- "Vitajte v MatchUP"
- Navigation to tournaments and about page

### login.js

**Purpose:** User authentication.

**Features:**
- Username/password input
- Player creation/login
- Error handling
- DarkVeil background

**Flow:**
1. User enters credentials
2. Call `PlayerCreate` API
3. Store player data in localStorage
4. Redirect to tournaments

### tournament.js

**Purpose:** Tournament list page.

**Features:**
- Display ongoing and upcoming tournaments
- Filter by status
- Create tournament button (teachers only)
- Tournament cards with details

**Data Displayed:**
- Tournament name
- Date range
- Team count
- Status

### tournament-detail.js

**Purpose:** Individual tournament view.

**Features:**
- Tournament information
- Team list with join functionality
- Bracket display (for ongoing/finished)
- Owner controls
- Match management

**Views:**
- **Pre-tournament:** Team list, join buttons, owner controls
- **Ongoing:** Bracket view, current match, owner controls
- **Finished:** Final bracket view

### history.js

**Purpose:** Finished tournaments archive.

**Features:**
- Filter by year
- Filter by month
- Search by name
- Tournament cards
- Reset filters

**UI Elements:**
- Fixed search button
- Slide-out filter panel
- Tournament grid

### about.js

**Purpose:** About page with team information.

**Sections:**
- Team members with roles
- Motivation cards
- Contact CTA

### control-panel.js

**Purpose:** Admin control panel (legacy).

**Features:**
- Authorization check
- Business territory connection check

### init-app-workspace.js

**Purpose:** Application initialization (legacy).

**Features:**
- Workspace setup
- Authorization verification

## State Management

The application uses React hooks for state management:

- `useState` - Local component state
- `useEffect` - Side effects and data fetching
- `useMemo` - Computed values and memoization
- `useCallback` - Memoized callbacks
- `useRoute` - Routing (from uu5g05)

## Styling

### CSS Architecture

Each component has a corresponding CSS file in `src/styles/`:

- `customBracket.css` - Bracket styling
- `tournament.css` - Tournament list
- `tournamentDetail.css` - Tournament details
- `login.css` - Login page
- `home.css` - Home page
- `navbar.css` - Navigation
- `history.css` - History page
- `createTournamentModal.css` - Modal styling

### Design System

**Colors:**
- Primary: `#ff8e53` (orange)
- Background: `#0d0d0d` (dark)
- Cards: `#1a1a1a`
- Borders: `#444`
- Text: `#fff`, `#d0d0d0`

**Typography:**
- Font: 'Space Grotesk', sans-serif
- Sizes: 0.8rem - 1.5rem

**Layout:**
- Flexbox for most layouts
- Absolute positioning for brackets
- Fixed positioning for navigation

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Call (calls.js)
    ↓
Backend API
    ↓
Response
    ↓
State Update (useState)
    ↓
Re-render
```

## Key Algorithms

### Match Progression

```javascript
processMatches(matches) {
  1. Create match map
  2. Sort by round
  3. For each match with winner:
     - Find next match
     - Add winner to next match participants
  4. Handle walkovers:
     - Auto-assign winner if only one participant
     - Progress to next round
  5. Return updated matches
}
```

### Tree Layout Calculation

```javascript
calculateLayout(rounds) {
  1. Assign X positions by round
  2. Find root matches (finals)
  3. Recursively calculate Y positions:
     - Leaf: assign next slot
     - Parent: average of children
  4. Return position map
}
```

## Authentication

**Storage:** localStorage
**Key:** "player"
**Data Structure:**
```javascript
{
  id: string,
  uuIdentity: string,
  name: string,
  role: "teacher" | "student"
}
```

## Error Handling

- API errors displayed via `alert()`
- Console errors for debugging
- Graceful fallbacks for missing data
- Loading states for async operations

## Performance Optimizations

- `useMemo` for expensive calculations
- `useCallback` for event handlers
- Lazy loading (potential improvement)
- Memoized bracket layout
- SVG for efficient connector rendering

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals

## Future Improvements

1. NONE FOR NOW
