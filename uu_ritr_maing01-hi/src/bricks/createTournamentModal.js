import { useState } from "react";

export default function CreateModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamSize, setTeamSize] = useState("4");

  if (!isOpen) return null;

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

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {

				onSave({ name, description, startDate, endDate, teamSize })
				onClose()
			}
			  
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
