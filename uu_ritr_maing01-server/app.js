// IDFK macos crying
// prob error with node version 25

if (typeof localStorage === "undefined" || localStorage === null || typeof localStorage.getItem !== "function") {
  // Simple in-memory mock for localStorage to fix crash on Node.js v25+
  global.localStorage = {
    getItem: function (key) {
      return this[key];
    },
    setItem: function (key, value) {
      this[key] = value;
    },
    removeItem: function (key) {
      delete this[key];
    },
    clear: function () {
      // clear all keys
      for (const key in this) {
        if (this.hasOwnProperty(key) && typeof this[key] !== "function") {
          delete this[key];
        }
      }
    },
  };
}

const appServer = require("uu_appg01_server");
const socketHandlers = require("./app/sockets/socketHandlers");
const { Server } = require("socket.io");

const server = appServer.start();

const io = new Server(8082, {
  cors: {
    origin: "*", // replace with frontend domain in production
    methods: ["GET", "POST"],
  },
});

const socketNamespace = io.of("/socket");

// Socket.IO connection handler
socketNamespace.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);
  socketHandlers(socketNamespace, socket);
});
