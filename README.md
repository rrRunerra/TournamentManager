<p align="center">
  <h1 align="center">🏆 TournamentManager</h1>
  <p align="center">
    <strong>A comprehensive tournament management system with casino minigames</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  </p>
</p>

---

## 📋 Overview

TournamentManager is a full-stack web application designed for organizing and managing competitive tournaments. It features a powerful bracket system, team management, real-time match scoring, and a casino entertainment section with multiple minigames. Built with React and Node.js, it provides a seamless experience for tournament organizers, players, and spectators.

---

## ✨ Features

### 🏅 Tournament Management

- **Create & Manage Tournaments** - Set up tournaments with customizable settings
- **Bracket Formats** - Support for both single and double elimination brackets
- **Team-Based Competition** - Configurable team sizes for flexible competition formats
- **Tournament Lifecycle** - Track tournaments through all stages: `Upcoming → Ongoing → Finished`
- **Bye Distribution** - Automatic handling for non-power-of-2 team counts
- **Walkover Handling** - Manage no-show situations gracefully

### 🎯 Bracket System

- **Visual Bracket Display** - Tree-based layout algorithm for perfect alignment with SVG connectors
- **Real-Time Winner Progression** - Automatic bracket updates as matches complete
- **Interactive Match Popups** - View match details, players, and scores

### 👥 User Management

- **Role-Based Access Control**
  - **Teachers** - Create and manage tournaments
  - **Students** - Join teams and view tournaments
  - **Owners** - Full control over their tournaments
- **User Profiles** - Customizable avatars and personal statistics
- **Authentication** - Secure login system with Edupage integration

### 📊 Match & Score Tracking

- **Score Management** - Track individual match scores
- **Match Statuses** - `PLAYED`, `NO_SHOW`, `WALK_OVER`, `NO_PARTY`
- **Real-Time Updates** - Live bracket updates for all viewers

### 📈 Player Statistics

- **Tournament Stats** - Track finals placements (1st, 2nd, 3rd, 4th place finishes)
- **Match Statistics** - Wins, losses, and overall tournament participation
- **Game High Scores** - Persistent high score tracking for minigames

### 🎰 Casino & Minigames

A complete entertainment section with virtual credits:

| Game                         | Description                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------- |
| 🎰 **Slot Machine**          | Classic slot machine with multiple symbols and payout multipliers                 |
| 🎡 **Roulette**              | European roulette with full betting table, chip selection, and big win animations |
| 🃏 **Poker (Texas Hold'em)** | Multiplayer poker with lobby system and real-time gameplay                        |
| 🐦 **Flappy Bird**           | Classic side-scrolling minigame with high score tracking                          |

- **Virtual Credits** - Earn, spend, and track credits across games
- **In-Game Shop** - Purchase cosmetic items like profile pictures

### 🎨 UI Components Library

A rich collection of reusable components:

- **Buttons** - Multiple variants and colors
- **Cards** - Tournament and navbar card types
- **Notifications** - Success, error, warning, and info alerts
- **Confirmation Dialogs** - Modal confirmation prompts
- **Input Components** - Text inputs, select dropdowns, multi-select
- **Pagination** - Navigate through large data sets
- **Date/Time Picker** - Tournament scheduling

### 🌍 Internationalization

Full multi-language support with **9 languages**:
| Language | Code |
|----------|------|
| 🇬🇧 English | `en` |
| 🇸🇰 Slovak | `sk` |
| 🇨🇿 Czech | `cz` |
| 🇩🇪 German | `de` |
| 🇭🇺 Hungarian | `hu` |
| 🇯🇵 Japanese | `ja` |
| 🇵🇱 Polish | `pl` |
| 🇷🇺 Russian | `ru` |
| 🇨🇳 Chinese | `zh` |

---

## 🏗️ Architecture

The project follows a clean client-server architecture:

```
TournamentManager/
├── uu_ritr_maing01-hi/          # 🎨 Frontend (React SPA)
│   └── src/
│       ├── bricks/               # Reusable UI components
│       │   ├── components/       # Core component library
│       │   │   ├── brackets/     # Bracket visualization
│       │   │   ├── poker/        # Poker game components
│       │   │   ├── ui/           # UI primitives (Button, Card, Input...)
│       │   │   └── notifications/# Toast notifications
│       │   └── shop/             # Virtual shop system
│       ├── routes/               # Page components
│       ├── styles/               # CSS stylesheets
│       ├── lsi/                  # Language translations
│       ├── hooks/                # Custom React hooks
│       └── calls.js              # API client
│
├── uu_ritr_maing01-server/      # ⚙️ Backend (Node.js)
│   └── app/
│       ├── abl/                  # Business logic layer
│       │   ├── tournament-abl.js
│       │   ├── match-abl.js
│       │   ├── player-abl.js
│       │   └── team-abl.js
│       ├── api/                  # Controllers & validation
│       │   ├── controllers/
│       │   ├── errors/           # Custom error classes
│       │   └── validation_types/ # Input validation schemas
│       ├── dao/                  # Data access layer
│       └── config/               # Server configuration
│
└── docker-compose.yml            # 🐳 Docker orchestration
```

### Technology Stack

| Layer          | Technologies                                      |
| -------------- | ------------------------------------------------- |
| **Frontend**   | React, uu5g05 (routing), Custom CSS, SVG graphics |
| **Backend**    | Node.js, Express-like controllers, MongoDB        |
| **Deployment** | Docker, Docker Compose                            |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 14+
- MongoDB
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/TournamentManager.git
   cd TournamentManager
   ```

2. **Install frontend dependencies**

   ```bash
   cd uu_ritr_maing01-hi
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../uu_ritr_maing01-server
   npm install
   ```

### Running the Application

#### Development Mode

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

#### Docker Deployment

```bash
docker-compose up -d
```

---

## 📖 Documentation

| Document                                         | Description                          |
| ------------------------------------------------ | ------------------------------------ |
| [Frontend Docs](./docs/frontend.md)              | Frontend architecture and components |
| [Backend Docs](./docs/backend.md)                | API endpoints and business logic     |
| [Bracket Algorithm](./docs/bracket-algorithm.md) | How the bracket system works         |

---

## 🎮 Application Pages

| Page                  | Description                                             |
| --------------------- | ------------------------------------------------------- |
| **Home**              | Landing page with welcome message and navigation        |
| **Tournaments**       | Browse and join available tournaments                   |
| **Tournament Detail** | View bracket, matches, and tournament info              |
| **History**           | View past tournament results                            |
| **Profile**           | User statistics, achievements, and avatar customization |
| **Casino**            | Minigames section (Roulette, Slots, Poker, Flappy Bird) |
| **About**             | Information about the application                       |

---

## 🔗 Resources

- [uuAppg01Devkit Documentation](https://uuapp.plus4u.net/uu-bookkit-maing01/e884539c8511447a977c7ff070e7f2cf/book)
- [uuSubApp Instance Descriptor](https://uuapp.plus4u.net/uu-bookkit-maing01/289fcd2e11d34f3e9b2184bedb236ded/book/page?code=uuSubAppInstanceDescriptor)
- [uuApp Server Project (NodeJs)](https://uuapp.plus4u.net/uu-bookkit-maing01/2590bf997d264d959b9d6a88ee1d0ff5/book/page?code=getStarted)
- [uuApp Client Project (UU5)](https://uuapp.plus4u.net/uu-bookkit-maing01/ed11ec379073476db0aa295ad6c00178/book/page?code=getStartedHooks)

---

## 📄 License

This project is part of the uuApp ecosystem.

---

<p align="center">
  Made with ❤️ for tournament enthusiasts
</p>
