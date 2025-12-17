import { useState } from "react";

export default function useUser() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("player")));

  return [user, setUser];
}
