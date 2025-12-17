import React from "react";
import { useRoute } from "uu5g05";
import { Button } from "./atom/Button.js";
import "../styles/bricks/LoginRequired.css";

export default function LoginRequired({ lsi }) {
  const [, setRoute] = useRoute();

  return (
    <div className="background">
      <div className="login-prompt">
        <div className="login-prompt-icon">🔒</div>
        <h2 className="login-prompt-title">{lsi?.loginRequired || "Login Required"}</h2>
        <p className="login-prompt-message">{lsi?.loginMessage || "Please log in to view this page"}</p>
        <Button onClick={() => setRoute("login")} type="primary-fill">
          {lsi?.goToLogin || "Go to Login"}
        </Button>
      </div>
    </div>
  );
}
