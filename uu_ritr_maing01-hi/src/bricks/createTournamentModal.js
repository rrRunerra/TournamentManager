import { useState, useEffect, useRef } from "react";
import "../styles/bricks/createTournamentModal.css";
import { useNotification } from "./NotificationProvider.js";
import { useLsi, useLanguage } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import Calls from "../calls.js";
import useUser from "../hooks/useUser.js";
import DateTimePicker from "./DateTimePicker.js";

export default function CreateModal({ isOpen, onClose, onSave, owner }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamSize, setTeamSize] = useState("4");
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [bracketType, setBracketType] = useState("single");
  const { showError } = useNotification();
  const lsi = useLsi(importLsi, ["CreateTournament"]);
  const [user, setUser] = useUser();
  const descriptionRef = useRef(null);
  const [lang] = useLanguage();

  // Auto-resize description textarea
  useEffect(() => {
    if (currentStep === 1 && descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [description, currentStep]);

  // Check if user is teacher in db | fix for localstorage bypass
  // useEffect(() => {
  //   if (!isOpen) return;

  //   if (user) {
  //     try {
  //       Calls.player
  //         .get({ id: user.id })
  //         .then((pDb) => {
  //           if (pDb.role.toLowerCase() !== "teacher") {
  //             showError(lsi.errorTitle, lsi.errorUnauthorized);
  //             onClose();
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("Failed to verify user role:", error);
  //         });
  //     } catch (error) {
  //       console.error("Failed to parse user from localStorage:", error);
  //     }
  //   }
  // }, [isOpen, lsi, showError, onClose, user]);

  // Reset state when modal is closed or opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      // Optional: Reset other fields if needed when reopening,
      // but usually keeping draft state is fine until save.
      // If complete reset is desired on open, do it here.
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addTeam = () => {
    if (!teamName.trim()) return;
    setTeams([...teams, teamName.trim()]);
    setTeamName("");
  };

  const removeTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    // Validation for current step
    if (currentStep === 1) {
      if (!name.trim()) {
        showError(lsi.errorTitle, lsi.errorName);
        return;
      }
      if (!description.trim()) {
        showError(lsi.errorTitle, lsi.errorDescription);
        return;
      }
    } else if (currentStep === 2) {
      if (!startDate) {
        showError(lsi.errorTitle, lsi.errorStartDate);
        return;
      }
      if (!endDate) {
        showError(lsi.errorTitle, lsi.errorEndDate);
        return;
      }
      if (startDate > endDate) {
        showError(lsi.errorTitle, lsi.errorInvalidDate);
        return;
      }
    } else if (currentStep === 3) {
      if (!teamSize) {
        showError(lsi.errorTitle, lsi.errorTeamSize);
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSave = () => {
    // Final Step Validation (Step 4)
    if (teams.length < 3) {
      showError(lsi.errorTitle, lsi.errorTeams);
      return;
    }
    if (bracketType === "robin" && teams.length % 2 === 1) {
      showError(lsi.errorTitle, lsi.errorRobin);
      return;
    }
    if (bracketType === "double" && teams.length % 4 !== 0) {
      showError(lsi.errorTitle, lsi.errorDouble);
      return;
    }

    onSave({ name, description, startDate, endDate, teamSize, teams, owner, bracketType });
    handleClose();
  };

  const handleClose = () => {
    onClose();
    // Reset form state
    setCurrentStep(1);
    setTeams([]);
    setTeamName("");
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setTeamSize("4");
    setBracketType("single");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <label>{lsi.name}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
              autoFocus
            />

            <label>{lsi.description}</label>
            <textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              required
              style={{ overflow: "hidden" }}
            />
          </>
        );
      case 2:
        return (
          <>
            <DateTimePicker label={lsi.startDate} value={startDate} onChange={setStartDate} locale={lang} />

            <DateTimePicker
              label={lsi.endDate}
              value={endDate}
              onChange={setEndDate}
              locale={lang}
              direction="up"
            />
          </>
        );
      case 3:
        return (
          <>
            <label>{lsi.bracketType}</label>
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
          </>
        );
      case 4:
        return (
          <>
            <label>{lsi.teams}</label>
            <div className="team-input-container">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder={lsi.teamPlaceholder}
                className="team-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTeam();
                }}
              />
              <button className="btn" onClick={addTeam}>
                {lsi.add}
              </button>
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-header">
          {lsi.header} - {lsi.step || "Step"} {currentStep}/4
        </h3>

        <div className="modal-body">{renderStepContent()}</div>

        <div className="modal-actions">
          {currentStep > 1 && (
            <button onClick={handleBack} className="btn-secondary">
              {lsi.back || "Back"}
            </button>
          )}

          <button onClick={handleClose} className="btn-secondary">
            {lsi.cancel}
          </button>

          {currentStep < 4 ? (
            <button onClick={handleNext} className="btn-primary">
              {lsi.next || "Next"}
            </button>
          ) : (
            <button onClick={handleFinalSave} className="btn-primary">
              {lsi.save}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
