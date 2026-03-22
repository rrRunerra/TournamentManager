"use strict";
const jwt = require("jsonwebtoken");
const env = require("../../env/development.json");

const JWT_SECRET = env.JWT_SECRET || "uMatchup3456^#$@W%@$^&@#*";

class AuthHelper {
  /**
   * Verifies the provided JWT token.
   * @param {string} token - The JWT token to verify.
   * @returns {Object} The decoded token payload.
   * @throws {Error} If the token is invalid or missing.
   */

  static verifyToken(token) {
    if (!token) {
      throw new Error("Authentication token is required.");
    }

    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      throw new Error("Invalid or expired authentication token.");
    }
  }
}

module.exports = AuthHelper;

/*  https://mermaid.ai/live/

graph TD
    A[Request arrives with Token] --> B{Is Token there?}
    B -- No --> C[<b>Error:</b> Token required]
    B -- Yes --> D{Is Token valid?}
    D -- No --> E[<b>Error:</b> Invalid or Expired]
    D -- Yes --> F[<b>Success:</b> User is verified]

    style F fill:#00ff0055,stroke:#333
    style C fill:#ff000033,stroke:#333
    style E fill:#ff000033,stroke:#333


*/
