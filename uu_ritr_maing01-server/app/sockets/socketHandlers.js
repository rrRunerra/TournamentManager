const {
  createRoom,
  joinRoom,
  startGame,
  getPlayerHand,
  getRoomPlayers,
  roomExists,
  getRoom,
  removePlayer,
  getActivePlayers,
  advanceLoop,
} = require("../game/roomManager");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

module.exports = (io, socket) => {
  socket.on("join_room", async (roomCode, playerName, playerId) => {
    if (!roomExists(roomCode)) {
      await createRoom(roomCode, socket.id, playerName, playerId);
      console.log(`🆕 Room created: ${roomCode} by ${playerName} (ID: ${playerId})`);
    } else {
      const result = await joinRoom(roomCode, socket.id, playerName, playerId);
      if (result.error) {
        socket.emit("join_error", result.error);
        return;
      }
    }

    socket.join(roomCode);
    const players = getRoomPlayers(roomCode);
    io.to(roomCode).emit("room_update", players);
    console.log(`👤 ${playerName} joined room ${roomCode}`);
  });

  socket.on("start_game", async (roomCode) => {
    const success = await startGame(roomCode);
    if (success) {
      const players = getRoomPlayers(roomCode);
      for (const player of players) {
        const hand = getPlayerHand(roomCode, player.id);
        io.to(player.id).emit("deal_hand", hand);
      }

      updateRoom(roomCode);
      sendTurnInfo(roomCode);
      console.log(`🎮 Game started in room ${roomCode}`);
    }
  });

  socket.on("call_bet", (roomCode) => {
    const room = getRoom(roomCode);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player || player.folded || player.hasActed) return;

    const toCall = room.betSize - player.bet;

    if (toCall <= 0) {
      // Enforce: NO CHECKING ALLOWED
      socket.emit("action_error", "You must call at least 2 chips or fold.");
      return;
    }

    if (player.chipBalance < toCall) {
      socket.emit("action_error", "Not enough chips to call.");
      return;
    }

    player.chipBalance -= toCall;
    player.bet += toCall;
    room.pot += toCall;

    player.hasActed = true;
    room.actedPlayerIds.add(player.id);

    io.to(roomCode).emit("update_pot", room.pot);

    if (shouldAdvanceLoop(room)) {
      advanceLoop(room, io, roomCode);
    } else {
      advanceTurn(roomCode);
    }
  });

  socket.on("raise_bet", (roomCode, newBetSize) => {
    const room = getRoom(roomCode);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player || player.folded || player.hasActed) return;

    const currentBet = player.bet;
    const callAmount = Math.max(0, room.betSize - currentBet);
    const raiseAmount = newBetSize - room.betSize;
    const totalContribution = callAmount + raiseAmount;

    if (raiseAmount <= 0 || player.chipBalance < totalContribution) {
      socket.emit("action_error", "Invalid raise or not enough chips.");
      return;
    }

    player.chipBalance -= totalContribution;
    player.bet += totalContribution;
    room.pot += totalContribution;
    room.betSize = newBetSize;

    room.lastAggressorIndex = room.players.findIndex((p) => p.id === socket.id);
    resetHasActed(room);
    player.hasActed = true;
    room.actedPlayerIds.add(player.id);

    io.to(roomCode).emit("update_bet_size", room.betSize);
    io.to(roomCode).emit("update_pot", room.pot);
    io.to(roomCode).emit("room_update", room.players);

    advanceTurn(roomCode);
  });

  socket.on("force_fold_others", async (roomCode, winnerId) => {
    const room = getRoom(roomCode);
    if (!room) return;

    // Prevent race conditions if multiple clients e    console.log(winner);mit this
    if (room.pot === 0) return;

    const winner = room.players.find((p) => p.id === winnerId);
    if (!winner) return;

    // Fold everyone else
    room.players.forEach((p) => {
      if (p.id !== winnerId) {
        p.folded = true;
      }
    });

    // Award pot
    winner.chipBalance += room.pot;
    console.log(room);

    const losers = room.players.filter((p) => p.id !== winnerId);

    losers.map(async (p) => {
      if (p.dbId) {
        const playerDao = DaoFactory.getDao("player");
        const player = await playerDao.get({ awid: "22222222222222222222222222222222", id: p.dbId });
        if (player) {
          const newCredits = (player.credits || 0) - room.pot;
          await playerDao.update({
            awid: "22222222222222222222222222222222",
            id: p.dbId,
            ...player,
            credits: newCredits,
          });
          console.log(`💰 Updated credits for ${p.name}: ${newCredits}`);
        }
      } else {
        console.warn(`⚠️ Loser ${p.name} has no dbId, skipping DB update.`);
      }
    });

    // Update winner's credits in DB
    try {
      if (winner.dbId) {
        const playerDao = DaoFactory.getDao("player");
        const player = await playerDao.get({ awid: "22222222222222222222222222222222", id: winner.dbId });
        if (player) {
          const newCredits = (player.credits || 0) + room.pot;
          await playerDao.update({
            awid: "22222222222222222222222222222222",
            id: winner.dbId,
            ...player,
            credits: newCredits,
          });
          console.log(`💰 Updated credits for ${winner.name}: ${newCredits}`);
        }
      } else {
        console.warn(`⚠️ Winner ${winner.name} has no dbId, skipping DB update.`);
      }
    } catch (e) {
      console.error("Failed to update winner credits in DB", e);
    }

    io.to(roomCode).emit("round_winner", {
      winnerName: winner.name,
      amount: room.pot,
      reason: "Showdown winner!",
    });

    room.pot = 0;
    io.to(roomCode).emit("update_pot", 0);
    io.to(roomCode).emit("room_update", room.players);

    // Start new round after delay
    setTimeout(async () => {
      const success = await startGame(roomCode);
      if (success) {
        const players = getRoomPlayers(roomCode);
        for (const p of players) {
          const hand = getPlayerHand(roomCode, p.id);
          io.to(p.id).emit("deal_hand", hand);
        }
        // Clear community cards on clients for new round:
        io.to(roomCode).emit("update_community_cards", []);

        updateRoom(roomCode);
        sendTurnInfo(roomCode);
        console.log(`🔄 New round started in room ${roomCode}`);
      }
    }, 3000);
  });

  socket.on("fold", async (roomCode) => {
    const room = getRoom(roomCode);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player || player.folded) return;

    player.folded = true;
    player.hasActed = true;
    room.actedPlayerIds.add(player.id);

    io.to(roomCode).emit("player_folded", { name: player.name });

    const remaining = getActivePlayers(room);

    if (remaining.length === 1) {
      const winner = remaining[0];
      winner.chipBalance += room.pot;

      io.to(roomCode).emit("round_winner", {
        winnerName: winner.name,
        amount: room.pot,
        reason: "All other players folded.",
      });

      room.pot = 0;
      io.to(roomCode).emit("update_pot", 0);
      io.to(roomCode).emit("room_update", room.players);

      // Start new round after delay
      setTimeout(async () => {
        const success = await startGame(roomCode);
        if (success) {
          const players = getRoomPlayers(roomCode);
          for (const p of players) {
            const hand = getPlayerHand(roomCode, p.id);
            io.to(p.id).emit("deal_hand", hand);
          }
          // Clear community cards on clients for new round:
          io.to(roomCode).emit("update_community_cards", []);

          updateRoom(roomCode);
          sendTurnInfo(roomCode);
          console.log(`🔄 New round started in room ${roomCode}`);
        }
      }, 3000);

      return;
    }

    // Continue normal turn flow if more than 1 player left
    if (shouldAdvanceLoop(room)) {
      advanceLoop(room, io, roomCode);
    } else {
      advanceTurn(roomCode);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
    removePlayer(socket.id, io);
  });

  function advanceTurn(roomCode) {
    const room = getRoom(roomCode);
    if (!room) return;

    const totalPlayers = room.players.length;
    let nextIndex = room.currentTurnIndex;
    let attempts = 0;

    do {
      nextIndex = (nextIndex + 1) % totalPlayers;
      attempts++;
    } while ((room.players[nextIndex].folded || room.players[nextIndex].chipBalance === 0) && attempts < totalPlayers);

    room.currentTurnIndex = nextIndex;

    const activePlayers = getActivePlayers(room);
    const allMatched = activePlayers.every((p) => p.bet === room.betSize);
    const isBackToAggressor = nextIndex === room.lastAggressorIndex;
    const everyoneElseActed = activePlayers.every(
      (p) => p.hasActed || p.id === room.players[room.lastAggressorIndex].id,
    );

    if (allMatched && everyoneElseActed && isBackToAggressor) {
      sendTurnInfo(roomCode);
      setTimeout(() => advanceLoop(room, io, roomCode), 300);
    } else {
      sendTurnInfo(roomCode);
    }

    io.to(roomCode).emit("room_update", room.players);
  }

  function shouldAdvanceLoop(room) {
    const activePlayers = getActivePlayers(room);
    const allMatched = activePlayers.every((p) => p.bet === room.betSize);
    const isBackToAggressor = room.currentTurnIndex === room.lastAggressorIndex;
    const aggressorHasActed = room.players[room.lastAggressorIndex]?.hasActed;

    return allMatched && isBackToAggressor && aggressorHasActed;
  }

  function resetHasActed(room) {
    room.players.forEach((p) => (p.hasActed = false));
  }

  function sendTurnInfo(roomCode) {
    const room = getRoom(roomCode);
    if (!room) return;

    const current = room.players[room.currentTurnIndex];
    io.to(roomCode).emit("current_turn", {
      playerId: current.id,
      playerName: current.name,
    });
    io.to(current.id).emit("your_turn");
  }

  function updateRoom(roomCode) {
    const room = getRoom(roomCode);
    if (!room) return;

    io.to(roomCode).emit("new_loop", room.loopNum);
    io.to(roomCode).emit("game_started");
    io.to(roomCode).emit("room_update", room.players);
    io.to(roomCode).emit("update_pot", room.pot);
    io.to(roomCode).emit("update_bet_size", room.betSize);
  }
};
