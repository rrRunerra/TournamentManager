import { useState, useEffect } from "react";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function useUser() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      // Check expiration if needed
      if (decoded && decoded.exp * 1000 > Date.now()) {
        return decoded;
      } else {
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = parseJwt(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return [user, setUser];
}
