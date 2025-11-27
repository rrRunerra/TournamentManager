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
        <h3 className="modal-header">Vytvoriť turnaj</h3>

        <label>Názov</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          required
        />

        <label>Popis</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
          required
        />

        <label>Dátum začiatku</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-control"
        />

        <label>Dátum konca</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-control"
        />

        <label >Typ pavúka</label>
        <select
          id="bracketType"
          value={bracketType}
          onChange={(e) => setBracketType(e.target.value)}
          className="form-control"
        >
          <option value="single">Jednoduchá eliminácia</option>
          <option value="double">Dvojitá eliminácia</option>
          <option value="robin">Každý s každým</option>
        </select>


        <label>Veľkosť tímu</label>
        <input
          type="number"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          className="form-control"
          min="1"
          required
        />

        <label>Tímy</label>
        <div className="team-input-container">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Zadajte názov tímu"
            className="team-input"
          />
          <button className="btn" onClick={addTeam}>Pridať</button>
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
          <button onClick={onClose}>Zrušiť</button>
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
                const errorMessages = [];

                if (newErrors.name) errorMessages.push("Názov je povinný.");
                if (newErrors.description) errorMessages.push("Popis je povinný.");
                if (newErrors.startDate) errorMessages.push("Dátum začiatku je povinný.");
                if (newErrors.endDate) errorMessages.push("Dátum konca je povinný.");
                if (newErrors.teamSize) errorMessages.push("Veľkosť tímu je povinná.");
                if (newErrors.teams) errorMessages.push("Sú vyžadované aspoň 3 tímy.");
                if (newErrors.invalidDate) errorMessages.push("Dátum začiatku nemôže byť neskôr ako dátum konca")
                if (newErrors.robin) errorMessages.push("Každý s každým vyžaduje súčet tímov, ktorý je súčinom dvojice čísel")

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
            Uložiť
          </button>
        </div>
      </div>
    </div>
  );
}
