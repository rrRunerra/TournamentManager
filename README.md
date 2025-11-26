# TournamentManager - Project Overview

## Introduction

TournamentManager is a full-stack web application for organizing and managing tournaments. It supports both single and double elimination bracket formats, team management, match scoring, and real-time tournament progression.

## Architecture

The project consists of two main parts:

1. **Frontend** (`uu_ritr_maing01-hi`) - React-based SPA
2. **Backend** (`uu_ritr_maing01-server`) - Node.js server with business logic

### Technology Stack

**Frontend:**
- React (with hooks)
- uu5g05 (routing)
- Custom CSS styling
- SVG for bracket connectors

**Backend:**
- Node.js
- Express-like API controllers
- MongoDB (via DAO layer)
- Custom validation system

## Key Features

### Tournament Management
- Create tournaments with customizable settings
- Support for single and double elimination brackets
- Team-based competition (configurable team size)
- Tournament lifecycle: upcoming → ongoing → finished

### Bracket System
- Tree-based layout algorithm for perfect alignment
- Visual bracket display with SVG connectors
- Real-time winner progression
- Walkover handling
- Bye distribution for non-power-of-2 team counts

### User Roles
- **Teachers**: Can create and manage tournaments
- **Students**: Can join teams and view tournaments
- **Owners**: Full control over their tournaments

### Match Management
- Score tracking
- Winner selection
- Match status (PLAYED, NO_SHOW, WALK_OVER, NO_PARTY)
- Real-time bracket updates

## Project Structure

```
TournamentManager/
├── uu_ritr_maing01-hi/          # Frontend
│   └── src/
│       ├── bricks/               # Reusable components
│       ├── routes/               # Page components
│       ├── styles/               # CSS files
│       ├── calls.js              # API client
│       └── config/               # Configuration
│
├── uu_ritr_maing01-server/      # Backend
│   └── app/
│       ├── abl/                  # Business logic
│       ├── api/                  # Controllers & validation
│       ├── dao/                  # Data access layer
│       └── config/               # Server configuration
│
└── docs/                         # Documentation
    ├── README.md                 # This file
    ├── frontend.md               # Frontend documentation
    └── backend.md                # Backend documentation
```

## Getting Started

### Prerequisites
- Node.js 14+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd uu_ritr_maing01-hi
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd uu_ritr_maing01-server
   npm install
   ```

### Running the Application

**Frontend:**
```bash
cd uu_ritr_maing01-hi
npm start
```

**Backend:**
```bash
cd uu_ritr_maing01-server
npm start
```

## Documentation

- [Frontend Documentation](./docs/frontend.md) - Detailed frontend architecture and components
- [Backend Documentation](./docs/backend.md) - API endpoints and business logic
- [Bracket Algorithm](./docs/bracket-algorithm.md) - How the bracket system works

## Localization

The application is currently localized in **Slovak** (SK). All user-facing text has been translated from English to Slovak.

## uuApp
- [uuAppg01Devkit Documentation](https://uuapp.plus4u.net/uu-bookkit-maing01/e884539c8511447a977c7ff070e7f2cf/book)
- [uuSubApp Instance Descriptor](https://uuapp.plus4u.net/uu-bookkit-maing01/289fcd2e11d34f3e9b2184bedb236ded/book/page?code=uuSubAppInstanceDescriptor)
- [uuApp Server Project (NodeJs)](https://uuapp.plus4u.net/uu-bookkit-maing01/2590bf997d264d959b9d6a88ee1d0ff5/book/page?code=getStarted)
- [uuApp Client Project (UU5)](https://uuapp.plus4u.net/uu-bookkit-maing01/ed11ec379073476db0aa295ad6c00178/book/page?code=getStartedHooks)

