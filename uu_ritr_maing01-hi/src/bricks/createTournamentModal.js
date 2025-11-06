import { useState } from "react";

export default function CreateModal({ isOpen, onClose, onSave, owner }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamSize, setTeamSize] = useState("4");
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const addTeam = () => {
    if (!teamName.trim()) return;
    setTeams([...teams, teamName.trim()]);
    setTeamName("");
  };

  const removeTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "20px",
          width: "400px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ marginBottom: "16px" }}>Create Tournament</h3>

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
          required
        />

        <label>Start Date</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <label>End Date</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <label>Team Size</label>
        <input
          type="number"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
          min="1"
          required
        />

        <label>Teams</label>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            style={{ flex: 1 }}
          />
          <button onClick={addTeam}>Add</button>
        </div>

        <ul style={{ marginBottom: "12px", paddingLeft: "20px" }}>
          {teams.map((team, index) => (
            <li key={index} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{team}</span>
              <button onClick={() => removeTeam(index)} style={{ marginLeft: "8px" }}>
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              const newErrors = {};
              if (!name.trim()) newErrors.name = true;
              if (!description.trim()) newErrors.description = true;
              if (!startDate) newErrors.startDate = true;
              if (!endDate) newErrors.endDate = true;
              if (!teamSize) newErrors.teamSize = true;
              if (teams.length < 2) newErrors.teams = true;

              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                const errorMessages = [];

                if (newErrors.name) errorMessages.push("Name is required.");
                if (newErrors.description) errorMessages.push("Description is required.");
                if (newErrors.startDate) errorMessages.push("Start Date is required.");
                if (newErrors.endDate) errorMessages.push("End Date is required.");
                if (newErrors.teamSize) errorMessages.push("Team Size is required.");
                if (newErrors.teams) errorMessages.push("At least 2 teams are required.");

                alert(errorMessages.join("\n"));
                return;
              }

              onSave({ name, description, startDate, endDate, teamSize, teams, owner });
              onClose();
              setErrors({});
              setTeams([]);
              setTeamName("");
              setName("");
              setDescription("");
              setStartDate("");
              setEndDate("");
              setTeamSize("4");
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
