import { useState } from "react";
import "../styles/createTournamentModal.css";
import { useNotification } from "./NotificationProvider.js";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";

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
  const { showError } = useNotification();
  const lsi = useLsi(importLsi, ["CreateTournament"]);

  if (!isOpen) return null;

  const addTeam = () => {
    if (!teamName.trim()) return;
    setTeams([...teams, teamName.trim()]);
    setTeamName("");
  };

  const removeTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
  };


  // localstorage bypass check
  // const user = JSON.parse(localStorage.getItem("player"));
  // new Promise((resolve, reject) => {
  //   const pDb = Calls.getPlayer({ id: user.id });
  //   resolve(pDb)
  // }).then((pDb) => {
  //   if (pDb.role.toLowerCase() !== "teacher") {
  //     alert("You are not authorized to create a tournament");
  //     onClose();
  //   }
  // })



  return (
    <div
      className="modal-overlay"
    >
      <div
        className="modal-content"
      >
        <h3 className="modal-header">{lsi.header}</h3>

        <label>{lsi.name}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          required
        />

        <label>{lsi.description}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
          required
        />

        <label>{lsi.startDate}</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-control"
        />

        <label>{lsi.endDate}</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-control"
        />

        <label >{lsi.bracketType}</label>
        <select
          id="bracketType"
          value={bracketType}
          onChange={(e) => setBracketType(e.target.value)}
          className="form-control"
        >
          <option value="single">{lsi.singleElimination}</option>
          <option value="double">{lsi.doubleElimination}</option>
          <option value="robin">{lsi.roundRobin}</option>
        </select>


        <label>{lsi.teamSize}</label>
        <input
          type="number"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          className="form-control"
          min="1"
          required
        />

        <label>{lsi.teams}</label>
        <div className="team-input-container">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder={lsi.teamPlaceholder}
            className="team-input"
          />
          <button className="btn" onClick={addTeam}>{lsi.add}</button>
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
          <button onClick={onClose}>{lsi.cancel}</button>
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

              if (bracketType == "robin" && (teams.length % 2 == 1)) newErrors.robin = true

              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);

                // Show each error in a separate notification
                if (newErrors.name) showError(lsi.errorTitle, lsi.errorName);
                if (newErrors.description) showError(lsi.errorTitle, lsi.errorDescription);
                if (newErrors.startDate) showError(lsi.errorTitle, lsi.errorStartDate);
                if (newErrors.endDate) showError(lsi.errorTitle, lsi.errorEndDate);
                if (newErrors.teamSize) showError(lsi.errorTitle, lsi.errorTeamSize);
                if (newErrors.teams) showError(lsi.errorTitle, lsi.errorTeams);
                if (newErrors.invalidDate) showError(lsi.errorTitle, lsi.errorInvalidDate);
                if (newErrors.robin) showError(lsi.errorTitle, lsi.errorRobin);

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
            {lsi.save}
          </button>
        </div>
      </div>
    </div>
  );
}
