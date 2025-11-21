import { useState } from "react";
import "../styles/createTournamentModal.css";

export default function CreateModal({ isOpen, onClose, onSave, owner }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamSize, setTeamSize] = useState("4");
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [errors, setErrors] = useState({});
  const [bracketType, setBracketType] = useState("single")

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
      className="modal-overlay"
    >
      <div
        className="modal-content"
      >
        <h3 className="modal-header">Create Tournament</h3>

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
          required
        />

        <label>Start Date</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-control"
        />

        <label>End Date</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-control"
        />

        <label >Bracket Type</label>
        <select
          id="bracketType"
          value={bracketType}
          onChange={(e) => setBracketType(e.target.value)}
          className="form-control"
        >
          <option value="single">Single Elimination</option>
          <option value="double">Double Elimination</option>
        </select>


        <label>Team Size</label>
        <input
          type="number"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          className="form-control"
          min="1"
          required
        />

        <label>Teams</label>
        <div className="team-input-container">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            className="team-input"
          />
          <button onClick={addTeam}>Add</button>
        </div>

        <ul className="teams-list">
          {teams.map((team, index) => (
            <li key={index} className="team-item">
              <span>{team}</span>
              <button onClick={() => removeTeam(index)} className="remove-team-btn">
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              const newErrors = {};
              if (!name.trim()) newErrors.name = true;
              if (!description.trim()) newErrors.description = true;
              if (!startDate) newErrors.startDate = true;
              if (!endDate) newErrors.endDate = true;

              if (startDate > endDate) newErrors.invalidDate = true


              if (!teamSize) newErrors.teamSize = true;
              if (teams.length < 3) newErrors.teams = true;

              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                const errorMessages = [];

                if (newErrors.name) errorMessages.push("Name is required.");
                if (newErrors.description) errorMessages.push("Description is required.");
                if (newErrors.startDate) errorMessages.push("Start Date is required.");
                if (newErrors.endDate) errorMessages.push("End Date is required.");
                if (newErrors.teamSize) errorMessages.push("Team Size is required.");
                if (newErrors.teams) errorMessages.push("At least 3 teams are required.");
                if (newErrors.invalidDate) errorMessages.push("Start date cannot be sooner than end date")

                alert(errorMessages.join("\n"));
                return;
              }

              onSave({ name, description, startDate, endDate, teamSize, teams, owner, bracketType });
              onClose();
              setErrors({});
              setTeams([]);
              setTeamName("");
              setName("");
              setDescription("");
              setStartDate("");
              setEndDate("");
              setTeamSize("4");
              setBracketType("single")
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
