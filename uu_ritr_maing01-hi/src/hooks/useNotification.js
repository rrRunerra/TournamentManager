import React, { createContext, useContext } from "react";
import "../styles/bricks/components/notifications/notificationContainer.css";
import { NotificationContext } from "../context/NotificationContext";

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
