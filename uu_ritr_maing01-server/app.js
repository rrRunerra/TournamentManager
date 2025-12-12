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

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);
  socketHandlers(io, socket);
});
