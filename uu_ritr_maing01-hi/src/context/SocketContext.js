import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:8082"); // backend path - upon prod and deployment, replace with actual path
export const SocketContext = createContext(socket);
