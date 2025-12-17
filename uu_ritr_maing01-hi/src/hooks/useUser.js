import { useState, useEffect } from "react";

export default function useUser() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("player")));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("player")));
  }, [localStorage.getItem("player")]);

  return [user, setUser];
}
