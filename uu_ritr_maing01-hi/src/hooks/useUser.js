import { useEffect, useState } from "react";

export default function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("player"));
        setUser(user);
    }, [localStorage.getItem("player")]);

    return [user, setUser];
}