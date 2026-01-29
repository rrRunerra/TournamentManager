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
