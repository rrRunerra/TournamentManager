import { useState } from "react";
import Input from "../ui/Input.js";
import { Button } from "../ui/Button.js";

function Lobby({ onJoinRoom }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const handleJoin = () => {
    if (!name.trim() || !room.trim()) {
      alert("Please enter your name and room code");
      return;
    }
    onJoinRoom(room.toUpperCase(), name.trim());
  };

  return (
    <div className="lobby">
      <div className="lobby-header">
        <span className="lobby-emoji">🃏</span>
        <h1>Poker Room Multiplayer</h1>
        <span className="lobby-emoji">🃏</span>
      </div>
      <h2>Join or Create a Poker Room</h2>
      <p className="lobby-description">Enter a room code to join. If the room doesn't exist, one will be created.</p>

      <div className="lobby-form">
        <Input type="text" placeholder="Your Name" value={name} onChange={setName} noMargin />
        <Input
          type="text"
          placeholder="Room Code (e.g., ABC123)"
          value={room}
          onChange={(val) => setRoom(val.toUpperCase())}
          noMargin
        />
        <Button onClick={handleJoin} type="primary-fill">
          Join or Create Room
        </Button>
      </div>
    </div>
  );
}

export default Lobby;
